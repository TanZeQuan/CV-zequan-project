import { Icon } from "../components/Icons";
import type { Project } from "../data/projects";




export function ArchiveCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card" data-category={project.category} aria-labelledby={`project-${project.id}`}>
      {project.image && <a className="archive-image" href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`}><img src={project.image} alt={`${project.title} screenshot from the earlier portfolio`} loading="lazy" width="1000" height="560"/></a>}
      <div className="project-top">
        <span className="project-number">{String(index + 3).padStart(2, "0")}</span>
        <span className="project-type">{project.type}</span>
      </div>
      <h4 id={`project-${project.id}`}>{project.title}</h4>
      <p>{project.description}</p>
      <p className="project-role"><span>MY PART</span> {project.myRole}</p>
      <details className="project-notes">
        <summary>What I worked on <span aria-hidden="true">+</span></summary>
        <ul>{project.highlights.map(item => <li key={item}>{item}</li>)}</ul>
      </details>
      <div className="project-bottom">
        <div className="tag-row small">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
        {project.link ? (
          <a className="project-link" href={project.link} target="_blank" rel="noopener noreferrer" title={`Visit ${project.title}`} aria-label={`Visit public site for ${project.title}`}><Icon name="external" size={18}/></a>
        ) : <span className="private-label">{project.status}</span>}
      </div>
    </article>
  );
}
