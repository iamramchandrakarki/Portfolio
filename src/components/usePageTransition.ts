"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { internalRoute, pageWipeDirection } from "@/lib/stage";

export function usePageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const transition = useRef<ViewTransition | null>(null);
  const complete = useRef<(() => void) | null>(null);
  const committedPath = useRef(pathname);
  const sequence = useRef(0);

  useLayoutEffect(() => {
    committedPath.current = pathname;
    complete.current?.();
    complete.current = null;
  }, [pathname]);

  const begin = useCallback((destination: string, navigate?: () => void) => {
    const request = ++sequence.current;
    const previousPath = committedPath.current;
    document.documentElement.dataset.wipeDirection = pageWipeDirection(previousPath, new URL(destination, window.location.href).pathname);
    transition.current?.skipTransition();
    document.documentElement.classList.remove("is-route-wiping");
    complete.current?.();
    complete.current = null;
    // shortcut: older browsers navigate directly; add a snapshot fallback if those browsers need the wipe.
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigate?.();
      return;
    }
    transition.current = document.startViewTransition(() => new Promise<void>(resolve => {
      if (request !== sequence.current || (!navigate && committedPath.current !== previousPath)) {
        resolve();
        return;
      }
      complete.current = resolve;
      document.documentElement.classList.add("is-route-wiping");
      navigate?.();
    }));
    // A second navigation can intentionally interrupt snapshot acquisition.
    void transition.current.ready.catch(() => {});
    const cleanup = () => {
      if (request === sequence.current) document.documentElement.classList.remove("is-route-wiping");
    };
    void transition.current.finished.then(cleanup, cleanup);
  }, []);

  const navigate = useCallback((href: string) => begin(href, () => router.push(href)), [begin, router]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const href = internalRoute(link.href, window.location.href);
      if (!href) return;
      event.preventDefault();
      navigate(href);
    };
    const onHistory = () => {
      if (window.location.pathname !== pathname) begin(window.location.pathname);
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onHistory, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onHistory, true);
    };
  }, [begin, navigate, pathname]);

  useEffect(() => () => {
    transition.current?.skipTransition();
    complete.current?.();
  }, []);

  return navigate;
}
