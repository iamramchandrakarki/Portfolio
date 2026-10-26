import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { activePage, internalRoute, pageWipeDirection, NAV_ITEMS, SCENES, sceneLuminance } from "../src/lib/stage";
import { SIGNAL_EDGES, signalBandFrames, signalChannelFrames } from "../src/lib/signal";
import { identity, projects } from "../src/data/portfolio";

assert.equal(activePage("/"), 0);
assert.equal(activePage("/about"), 1);
assert.equal(activePage("/work/drivesro"), 2);
assert.equal(activePage("/contact"), 3);
assert.equal(activePage("/workshop"), 0);
assert.equal(NAV_ITEMS.length, 4);
assert.equal(pageWipeDirection("/about", "/work"), "down");
assert.equal(pageWipeDirection("/work", "/about"), "up");
assert.equal(pageWipeDirection("/contact", "/"), "up");
assert.equal(pageWipeDirection("/", "/contact"), "down");
assert.equal(pageWipeDirection("/work/pesha", "/about"), "up");
assert.equal(internalRoute("/about", "https://portfolio.test/"), "/about");
assert.equal(internalRoute("/work/pesha?view=detail#overview", "https://portfolio.test/work"), "/work/pesha?view=detail#overview");
assert.equal(internalRoute("#main-content", "https://portfolio.test/work"), null);
assert.equal(internalRoute("/work?filter=all", "https://portfolio.test/work"), null);
assert.equal(internalRoute("https://github.com/iamramchandrakarki", "https://portfolio.test/"), null);
assert.equal(internalRoute("mailto:hello@example.com", "https://portfolio.test/"), null);
assert.equal(new Set(projects.map(project => project.slug)).size, projects.length);
assert.equal(projects.find(project => project.slug === "pesha")!.images.length, 1, "Pesha should show a single screenshot");
assert.match(identity.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
for (const project of projects) {
  assert.equal(new URL(project.url).protocol, "https:");
  assert.ok(project.overview.length && project.contribution && project.stack.length);
  for (const image of project.images) {
    assert.ok(existsSync(`public${image.src}`), `Missing image ${image.src}`);
    assert.ok(image.alt && image.caption);
  }
}
for (let scene = 0; scene < SCENES.length; scene++) {
  for (const time of [0, 1, 1000]) {
    for (let x = 0; x <= 1; x += .1) {
      for (let y = 0; y <= 1; y += .1) {
        const luminance = sceneLuminance(x, y, time, scene);
        assert.ok(Number.isFinite(luminance) && luminance >= 0 && luminance <= 1);
      }
    }
  }
}
// The cloud field must evolve over time and retain both quiet and bright regions.
const cloudSamples = Array.from({ length: 121 }, (_, i) => ({ x: (i % 11) / 10, y: Math.floor(i / 11) / 10 }));
const clouds = cloudSamples.map(({ x, y }) => sceneLuminance(x, y, 0, 0));
assert.ok(Math.max(...clouds) - Math.min(...clouds) > .5);
assert.ok(cloudSamples.some(({ x, y }) => Math.abs(sceneLuminance(x, y, 0, 0) - sceneLuminance(x, y, 20, 0)) > .1));
for (const { x, y } of cloudSamples) {
  assert.ok(Math.abs(sceneLuminance(x, y, 0, 0) - sceneLuminance(x, y, .1, 0)) < .03);
}
// Neighboring samples must blend without visible seams.
for (let column = 1; column < 24; column++) {
  const x = column / 24;
  assert.ok(Math.abs(sceneLuminance(x - .0001, .65, 0, 0) - sceneLuminance(x + .0001, .65, 0, 0)) < .01);
}
// Each transmission replaces the title with contiguous bands, then resolves without a leftover ghost.
assert.equal(SIGNAL_EDGES[0], 0);
assert.equal(SIGNAL_EDGES.at(-1), 1);
for (let band = 0; band < SIGNAL_EDGES.length - 1; band++) {
  assert.ok(SIGNAL_EDGES[band + 1] > SIGNAL_EDGES[band]);
  const frames = signalBandFrames(band);
  assert.equal(frames.at(-1)!.opacity, 0);
  for (const sequence of [frames, ...[0, 1, 2].map(channel => signalChannelFrames(band, channel))]) {
    for (let i = 1; i < sequence.length; i++) assert.ok(sequence[i].offset! > sequence[i - 1].offset!);
    assert.equal(sequence.at(-1)!.transform, "translateX(0px)");
  }
  assert.notEqual(signalChannelFrames(band, 0)[0].transform, signalChannelFrames(band, 2)[0].transform);
}
const css = readFileSync("src/app/globals.css", "utf8");
function luminance(hex: string) {
  const c = hex.slice(1).match(/../g)!.map(value => {
    const n = parseInt(value, 16) / 255;
    return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
  });
  return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
}
function token(name: string) {
  return css.match(new RegExp(`${name}:\\s*(#[a-f0-9]{6})`))![1];
}
for (const name of ["--text-primary", "--text-secondary", "--text-muted", "--accent-blue"]) {
  const ratio = (luminance(token(name)) + .05) / (luminance(token("--bg-canvas")) + .05);
  assert.ok(ratio >= 4.5, `${name} contrast ${ratio} is below AA`);
}
console.log("Navigation, project data, screenshot assets, all background scenes, and text contrast passed.");
