import { bi } from '../data/referenceContent';
import type { CaseStudy, Copy, Language } from '../data/referenceContent';
import { caseDetails } from '../data/caseStudyDetails';

export default function ProjectCaseStudy({ project, language }: { project: CaseStudy; language: Language }) {
  const t = (copy: Copy) => copy[language];
  const detail = caseDetails[project.id];
  return <div className="project-details">
    {detail && <section><h4>01 / {t(bi('项目概览', 'Project overview'))}</h4><p>{t(project.description)}</p></section>}
    {detail && <section><h4>02 / {t(bi('面临的问题', 'The problem'))}</h4><p>{t(detail.problem)}</p></section>}
    <section><h4>{detail && '03 / '}{t(bi('我的角色', 'My role'))}</h4><p>{t(project.role)}</p></section>
    <section><h4>{detail && '04 / '}{t(bi('我负责的内容', 'What I built'))}</h4><ul>{project.responsibilities.map((point, i) => <li key={i}>{t(point)}</li>)}</ul></section>
    {detail && <>
      <section><h4>05 / {t(bi('技术栈', 'Tech stack'))}</h4><p>{project.tags.join(' · ')}</p></section>
      <section><h4>06 / {t(bi('主要功能', 'Key features'))}</h4><ul>{detail.features.map((point, i) => <li key={i}>{t(point)}</li>)}</ul></section>
      <section><h4>07 / {t(bi('技术挑战与关注点', 'Technical challenges'))}</h4><p>{t(detail.challenge)}</p></section>
      <section><h4>08 / {t(bi('经验与学习', 'What I learned'))}</h4><p>{t(detail.learning)}</p></section>
      <section className="case-screenshot"><h4>09 / {t(bi('截图与演示', 'Screenshots & demo'))}</h4><a href={project.image} target="_blank" rel="noopener noreferrer">{t(bi('打开完整截图', 'Open full screenshot'))}<span aria-hidden="true"> ↗</span></a><p>{project.url ? t(bi('网站链接位于项目操作区，线上内容可能与截图不同。', 'Use the website link below; the live site may differ from this supplied screenshot.')) : t(bi('项目卡片展示了提供的界面截图。此项目不提供公开演示或源码。', 'The project card shows the supplied interface screenshot. No public demo or source code is available for this project.'))}</p></section>
    </>}
    <section><h4>{t(bi('成果 / 影响', 'Outcome / impact'))}</h4><p>{t(project.outcome)}</p></section>
    <p className="project-footer">{t(project.footer)}</p>
  </div>;
}
