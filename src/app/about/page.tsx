import { SignalHeading } from "@/components/SignalHeading";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import portrait from "../../../public/portraits/ramchandra-contact-monochrome.webp";
import { identity } from "@/data/portfolio";

export const metadata: Metadata = { title: "About" };
export default function AboutPage() {
  return <>
    <SignalHeading>about</SignalHeading>
    <div className="about-grid">
      <section className="about-story" aria-labelledby="how-heading"><h2 className="section-label" id="how-heading">how I work</h2>
        <p>I’m Ramchandra, a full stack developer based in {identity.location}. I build websites from the first interface through the API, database, and deployment.</p>
        <p>I like understanding how the whole product fits together. A small interface decision often has a consequence in the backend, and a good data model can make the experience much simpler.</p>
        <p>I built <Link href="/work/drivesro">Drivesro</Link> independently for a client. I’m also building <Link href="/work/pesha">Pesha</Link>, my own job discovery product, where I work on both the frontend and backend.</p>
      </section>
      <section className="about-skills" aria-labelledby="do-heading"><h2 className="section-label" id="do-heading">what I do</h2>
        <dl className="capabilities"><div><dt>frontend</dt><dd>Responsive interfaces · Component systems · Product interactions</dd></div><div><dt>backend</dt><dd>APIs · Authentication · Application logic · Relational data</dd></div><div><dt>work with</dt><dd>TypeScript · React · Next.js · Node.js · NestJS · Go · Chi · PostgreSQL · Docker</dd></div></dl>
      </section>
      <figure className="about-portrait"><Image src={portrait} alt="Black and white portrait of Ramchandra Karki" sizes="(max-width: 1023px) 94vw, 33vw" priority /></figure>
      <section className="education" aria-labelledby="education-heading"><h2 className="section-label" id="education-heading">education</h2><p>Computer Engineering<br />Gandaki College of Engineering and Science<br />Pokhara, Nepal</p><p className="muted">Learning through coursework, independent projects, and real products.</p></section>
    </div>
    <section className="about-work" aria-labelledby="selected-heading"><h2 className="section-label" id="selected-heading">what I’m building</h2><div className="about-project-links"><Link href="/work/drivesro"><span>drivesro</span><span>client work ↗</span></Link><Link href="/work/pesha"><span>pesha</span><span>my own product ↗</span></Link></div></section>
  </>;
}
