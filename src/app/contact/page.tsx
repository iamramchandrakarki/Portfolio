import { SignalHeading } from "@/components/SignalHeading";
import type { Metadata } from "next";
import Image from "next/image";
import portrait from "../../../public/portraits/ramchandra-workspace-wide.webp";
import { identity } from "@/data/portfolio";
export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() {
  return <>
    <SignalHeading>contact</SignalHeading>
    <div className="contact-grid">
      <figure className="contact-portrait"><Image src={portrait} alt="Ramchandra working at a laptop beside a window" sizes="100vw" priority /></figure>
      <section className="contact-content" aria-labelledby="hello-heading"><h2 className="section-label" id="hello-heading">say hello</h2>
        <p>Have a product to build, a role to discuss, or something interesting to share? I’d like to hear from you.</p>
        <a className="email-link" href={`mailto:${identity.email}`}>{identity.email}</a>
        <ul className="contact-links"><li><a href={identity.github} target="_blank" rel="noreferrer">GitHub ↗</a></li><li><a href={identity.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></li></ul>
        <p className="contact-location">{identity.location}<br />UTC +05:45</p>
      </section>
    </div>
  </>;
}
