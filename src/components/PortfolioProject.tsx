import { bi } from '../data/referenceContent';
import type { CaseStudy, Copy, Language } from '../data/referenceContent';
import ProjectCaseStudy from './ProjectCaseStudy';

export default function PortfolioProject({project,index,language,featured=false}:{project:CaseStudy;index:number;language:Language;featured?:boolean}) {
  const t=(copy:Copy)=>copy[language];
  return <article className={`project-card ${featured?'project-featured':'project-compact'}`} id={`project-${project.id}`}>
    <div className="project-cover"><img src={project.image} alt={t(project.imageAlt!)} width="1000" height="562" loading="lazy"/><span className="project-number">{String(index+1).padStart(2,'0')}</span><div className="project-scroll-line" aria-hidden="true"/></div>
    <div className="project-body">
      <p className="project-kind">{t(project.status)}</p><h3>{t(project.title)}</h3><p className="project-description">{t(project.description)}</p>
      <p className="project-role"><span>{t(bi('角色','Role'))}</span>{t(project.role)}</p>
      <div className="chips">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
      <details className="case-disclosure"><summary aria-label={`${t(bi('查看详情','View details'))}: ${t(project.title)}`}>{t(bi('查看详情','View details'))}<span aria-hidden="true">↗</span></summary><ProjectCaseStudy project={project} language={language}/></details>
      {project.url&&<a className="project-visit" href={project.url} target="_blank" rel="noopener noreferrer">{t(bi('打开网站','Visit website'))}<span aria-hidden="true"> ↗</span></a>}
    </div>
  </article>;
}
