import { SignalHeading } from "@/components/SignalHeading";
import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/portfolio";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectHeading } from "@/components/ProjectHeading";

export const metadata: Metadata = { title: "Work", description: "Selected full stack projects by Ramchandra Karki: Drivesro and Pesha." };

export default function WorkPage() {
  return <>
    <SignalHeading>work</SignalHeading>
    <div className="work-list">
      {projects.map((project, i) => <article key={project.slug} className="work-project">
        <ProjectHeading title={project.title} description={project.description} slug={project.slug} index={i} />
        <ProjectGallery images={project.images} compact />
        <div className="project-caption"><span>{project.context} <span aria-hidden="true">·</span> {project.status}</span><Link href={`/work/${project.slug}`}>view project <span aria-hidden="true">↗</span></Link></div>
      </article>)}
    </div>
    <p className="work-outro">More experiments and code on <a href="https://github.com/iamramchandrakarki" target="_blank" rel="noreferrer">GitHub</a>.</p>
  </>;
}
