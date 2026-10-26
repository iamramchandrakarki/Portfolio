import { SignalHeading } from "@/components/SignalHeading";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/portfolio";
import { ProjectGallery } from "@/components/ProjectGallery";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(project => project.slug === slug);
  return { title: project?.title ?? "Project not found", description: project?.description };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex(project => project.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const next = projects[(index + 1) % projects.length];
  return <article className="case-study">
    <Link href="/work" className="back-link">← back</Link>
    <SignalHeading>{project.title}</SignalHeading>
    <div className="case-intro">
      <dl className="project-facts">
        <div><dt>role</dt><dd>{project.role}</dd></div>
        <div><dt>project</dt><dd>{project.context}</dd></div>
        <div><dt>status</dt><dd>{project.status}</dd></div>
        <div><dt>built with</dt><dd>{project.stack.join(" · ")}</dd></div>
        <div><dt>visit</dt><dd><a href={project.url} target="_blank" rel="noreferrer">{new URL(project.url).hostname.replace("www.", "")} ↗</a></dd></div>
        <div><dt>my part</dt><dd>{project.contribution}</dd></div>
      </dl>
      <section className="case-overview" aria-labelledby="overview-heading"><h2 className="section-label" id="overview-heading">overview</h2>{project.overview.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>
    </div>
    <ProjectGallery images={project.images} imageIndex={0} />
    <section className="case-section" aria-labelledby="experience-heading"><h2 className="section-label" id="experience-heading">the experience</h2><div className="three-columns">{project.features.map(feature => <div key={feature.title}><h3>{feature.title}</h3><p>{feature.body}</p></div>)}</div></section>
    {project.images[1] && <ProjectGallery images={project.images} imageIndex={1} />}
    <section className="case-section" aria-labelledby="underneath-heading"><h2 className="section-label" id="underneath-heading">under the hood</h2><div className="architecture-flow">{project.architecture.map((layer, i) => <div key={layer.title}><span className="architecture-connector" aria-hidden="true">{i === 0 ? "○" : "↓"}</span><h3>{layer.title}</h3><p>{layer.body}</p></div>)}</div></section>
    <section className="case-section" aria-labelledby="decisions-heading"><h2 className="section-label" id="decisions-heading">engineering decisions</h2><div className="decision-grid">{project.decisions.map(decision => <div key={decision.title}><h3>{decision.title}</h3><p>{decision.body}</p></div>)}</div></section>
    <div className="case-ending"><a href={project.url} target="_blank" rel="noreferrer">explore the live website ↗</a><Link href={`/work/${next.slug}`}>next project: {next.title} →</Link></div>
  </article>;
}
