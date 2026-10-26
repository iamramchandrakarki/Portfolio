import { SignalHeading } from "@/components/SignalHeading";
import Link from "next/link";
import { identity } from "@/data/portfolio";

export default function HomePage() {
  return (
    <div className="home-page">
      <SignalHeading className="identity-heading">{identity.name}</SignalHeading>
      <div className="home-grid">
        <div className="home-col-left">
          <section aria-labelledby="tldr-heading">
            <h2 id="tldr-heading" className="section-label">tldr</h2>
            <p>{identity.intro}</p>
          </section>
        </div>
        <section className="home-col-staggered" aria-labelledby="today-heading">
          <h2 id="today-heading" className="section-label">today</h2>
          <p>I’m building <Link href="/work/pesha">Pesha</Link>, my own job discovery product, and working across its frontend and backend. I also built <Link href="/work/drivesro">Drivesro</Link> independently for a client, from the learning interface to the systems behind it.</p>
          <p>My work spans product development, APIs, databases, and getting websites live.</p>
        </section>
        <section className="home-col-staggered" aria-labelledby="background-heading">
          <h2 id="background-heading" className="section-label">background</h2>
          <p>Based in Pokhara, Nepal. I study Computer Engineering at Gandaki College of Engineering and Science, and learn by building things people can use.</p>
          <p>I work with Next.js, React, TypeScript, Node.js, Go, and PostgreSQL. <Link href="/about">A little more about me.</Link></p>
        </section>
      </div>
    </div>
  );
}
