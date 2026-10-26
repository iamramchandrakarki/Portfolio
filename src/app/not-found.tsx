import { SignalHeading } from "@/components/SignalHeading";
import Link from "next/link";
export default function NotFound() {
  return <><SignalHeading>not found</SignalHeading><div className="contact-content"><p>This page isn’t here. You can find my projects in the work index.</p><Link href="/work">back to work →</Link></div></>;
}
