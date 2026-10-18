import { useEffect, useRef, useState } from 'react';
import { bi, caseStudies, jobs, skills } from './data/referenceContent';
import type { Copy, Language } from './data/referenceContent';
import { filterCases } from './data/projectFilters';
import PortfolioProject from './components/PortfolioProject';
import { Icon } from './components/Icons';
import { featuredIds } from './data/caseStudyDetails';
import CreativeSculpture from './CreativeSculpture';
import { useCreativeMotion } from './useCreativeMotion';

function Chips({values}:{values:string[]}){
  return <div className="chips">{values.map(value=><span key={value}>{value}</span>)}</div>;
}
const intro=bi('具备 Web 与移动应用开发经验，使用 React、React Native 与 Vue 构建清晰易用的界面，并串接 REST API。近期独立开发销售线索 CRM，也参与客户门户的交互原型，关注界面、数据与实际业务流程之间的连接。','I build clear, usable web and mobile interfaces with React, React Native and Vue, connecting them with REST APIs. More recently, I independently built a Sales Leads CRM and contributed to an interactive Client Portal prototype, connecting interfaces, data and real-world workflows.');

export default function CreativePortfolio({initialLanguage='en'}:{initialLanguage?:Language}={}){
  const [language,setLanguage]=useState<Language>(initialLanguage);
  const [filter,setFilter]=useState('all'),[active,setActive]=useState('top'),[copyStatus,setCopyStatus]=useState('');
  const root=useRef<HTMLDivElement>(null);
  const t=(copy:Copy)=>copy[language];
  const visible=filterCases(filter);
  const featured=visible.filter(project=>featuredIds.includes(project.id));
  const other=visible.filter(project=>!featuredIds.includes(project.id));
  useCreativeMotion(root,filter,language);
  useEffect(()=>{document.documentElement.lang=language==='zh'?'zh-CN':'en';},[language]);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      if(window.scrollY<120){setActive('top');return;}
      for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id);
    },{rootMargin:'-10% 0px -65% 0px'});
    for(const id of ['top','about','work','experience','contact']){const el=document.getElementById(id);if(el)observer.observe(el);}
    const restoreHome=()=>{if(window.scrollY<120)setActive('top');};
    restoreHome();
    window.addEventListener('scroll',restoreHome,{passive:true});
    return()=>{observer.disconnect();window.removeEventListener('scroll',restoreHome);};
  },[]);
  const copyEmail=async()=>{
    try{await navigator.clipboard.writeText('tzequan379@gmail.com');setCopyStatus(t(bi('邮箱已复制。','Email copied.')));}
    catch{setCopyStatus('tzequan379@gmail.com');}
  };
  const links=[['top',bi('首页','Home')],['about',bi('关于','About')],['work',bi('作品','Portfolio')],['experience',bi('经历','Experience')]] as const;
  const groups=[
    {group:'company',id:'company',title:bi('公司与团队项目','Company & team projects')},
    {group:'freelance',id:'freelance',title:bi('自由接案项目','Client collaborations')},
    {group:'learning',id:'learning',title:bi('个人与学习项目','Personal & learning projects')},
  ];
  const faqs=[
    {q:bi('你主要负责哪些开发工作？','What kind of development do you do?'),a:bi('我主要进行 Web 与移动端前端开发，使用 React、React Native、Vue 与 TypeScript，并处理 REST API 串接、响应式页面及业务流程。','I work on web and mobile frontends with React, React Native, Vue and TypeScript, including REST API integration, responsive interfaces and business workflows.')},
    {q:bi('可以查看 CRM 的线上演示或源码吗？','Can I access the CRM demo or source code?'),a:bi('Sales Leads CRM 是内部系统，CRM Client Portal 是团队交互原型。这些项目不提供公开演示或公司源代码；项目卡片中展示的是界面截图及我实际负责的内容。','Sales Leads CRM is an internal system, and the Client Portal is a team prototype. Public demos and company source code are unavailable; the cards show screenshots and my actual contribution.')},
    {q:bi('你有独立开发与团队协作经验吗？','Do you work independently and with teams?'),a:bi('有。我独立完成了销售线索 CRM，也在公司及自由接案项目中与设计师、后端开发者和远程团队协作。','Yes. I built the Sales Leads CRM independently and have collaborated with designers, backend developers and remote teams on company and freelance projects.')},
    {q:bi('如何联系你或获取简历？','How can I contact you or get your resume?'),a:bi('可使用本页的邮件、电话或 GitHub 链接联系我。点击“下载简历”即可获取 PDF 简历。','Use the email, phone or GitHub links on this page. Choose “Download resume” to get my PDF resume.')},
  ];
  return <div className="creative-portfolio" ref={root}>
    <div className="reading-progress" aria-hidden="true"/>
    <a className="skip-link" href="#content">{t(bi('跳到正文','Skip to content'))}</a>
    <div className="page-frame">
      <header className="creative-header">
        <a className="wordmark" href="#top" aria-label="Tan Ze Quan" onClick={()=>setActive('top')}>ZeQuan<span>.dev</span></a>
        <nav aria-label={t(bi('主导航','Main navigation'))}>{links.map(([id,label])=><a href={`#${id}`} key={id} className={active===id?'active':''} aria-current={active===id?'location':undefined}>{t(label)}</a>)}</nav>
        <div className="header-actions"><button type="button" className="language-button" onClick={()=>{setLanguage(v=>v==='zh'?'en':'zh');setCopyStatus('');}} aria-label={language==='zh'?'Switch to English':'切换为中文'}>{language==='zh'?'EN':'中文'}</button><a className="pill-button" href="#contact">{t(bi('聊聊合作','Let’s collaborate'))}</a></div>
      </header>
      <main id="content">
        <section className="creative-hero" id="top" aria-labelledby="hero-title">
          <div className="hero-photo"><img src="./assets/avatar-cutout.webp" alt="Tan Ze Quan" width="1254" height="1254" fetchPriority="high"/></div>
          <div className="hero-copy"><p className="hero-greeting">I am Tan Ze Quan.</p><p className="hero-position">JUNIOR FULL STACK DEVELOPER</p><h1 id="hero-title"><span>FULL STACK</span><span>DEVELOPER<span className="hero-period">.</span></span></h1><p className="hero-subtitle">{t(bi('拥有 Web 与移动应用开发经验，独立构建 React、TypeScript 与 Supabase 销售线索 CRM。','Hands-on web and mobile experience. Independently built a Sales Leads CRM with React, TypeScript and Supabase.'))}</p><div className="hero-actions"><a className="pill-button" href="#work">{t(bi('查看项目','View projects'))}</a><a className="text-link" href="./Tan_Ze_Quan_Resume.pdf" download>{t(bi('下载简历','Download resume'))}</a><a className="text-link" href="#contact">{t(bi('联系我','Contact'))}</a></div><a className="hero-proof" href="#project-sales-crm"><span>{t(bi('独立开发 / 精选案例','INDEPENDENT BUILD / FEATURED CASE'))}</span>Sales Leads CRM <span aria-hidden="true">↗</span></a></div>
          <CreativeSculpture language={language}/>
          <div className="hero-bottom"><span>{t(bi('马来西亚 · 吉隆坡','Kuala Lumpur, Malaysia'))}</span><span>WEB · MOBILE · BUSINESS TOOLS</span><span>PORTFOLIO / 2026</span></div>
          <div className="hero-tech" aria-label={t(bi('主要技术栈','Core toolkit'))}>{['React','TypeScript','React Native','Vue','Supabase'].map((name,i)=><span key={name}><small>{String(i+1).padStart(2,'0')}</small>{name}</span>)}</div>
        </section>

        <section className="light-section about-section" id="about">
          <div className="about-heading"><div><p className="section-pill">{t(bi('关于我','About me'))}</p><h2 className="editorial-heading"><span>{t(bi('清晰的界面，','Clear interfaces.'))}</span> {t(bi('可靠的连接。','Connected systems.'))}<br/><em>{t(bi('把想法变成可以使用的产品。','Ideas made usable.'))}</em></h2><p className="section-intro">{t(intro)}</p></div><div className="about-code-note" aria-hidden="true"><span>DESIGN</span><span>DEVELOP</span><span>CONNECT</span></div></div>
          <div className="bento-highlights">
            <article className="bento-card bento-lilac"><span className="micro-label">EXPERIENCE</span><strong>2023<span> →</span></strong><p>{t(bi('从实习到 Web、移动端与内部工具开发','From a web internship to web, mobile and internal tools'))}</p><span className="bento-foot">WEB & MOBILE DEVELOPMENT</span></article>
            <article className="bento-card bento-ink"><span className="micro-label">SELECTED WORK</span><strong>{caseStudies.length}<span> /</span></strong><p>{t(bi('项目记录，覆盖企业工具、网站与移动应用','project records across business tools, websites and mobile apps'))}</p><span className="bento-foot">BUILD · CONNECT · REFINE</span></article>
            <article className="bento-card bento-peach"><span className="micro-label">MY APPROACH</span><strong>UI <i>&</i> API</strong><p>{t(bi('让界面和数据协作，支持团队的日常工作。','Bringing interfaces and data together to support real teams.'))}</p><span className="bento-foot">REACT · TYPESCRIPT · VUE</span></article>
          </div>
        </section>

        <section className="portfolio-section" id="work" aria-labelledby="portfolio-title">
          <h2 id="portfolio-title" className="portfolio-title">PORTFOLIO</h2>
          <div className="portfolio-controls"><p>{t(bi('实际项目。具体贡献。','Real projects. Specific contributions.'))}</p><div className="project-filters" role="group" aria-label={t(bi('项目类型筛选','Filter project type'))}>{[['all',bi('全部','All')],['web',bi('Web','Web')],['mobile',bi('Mobile','Mobile')]].map(([value,label])=><button type="button" key={value as string} aria-pressed={filter===value} onClick={()=>setFilter(value as string)}>{t(label as Copy)}</button>)}</div></div>
          <p className="sr-only" role="status">{t(bi(`显示 ${visible.length} 个项目`,`Showing ${visible.length} projects`))}</p>
          <div className="featured-heading"><div><p className="section-pill">{t(bi('建议从这里开始','START HERE'))}</p><h3>{t(bi('精选项目','Featured projects'))}</h3></div><p>{t(bi('独立开发 · 团队原型 · 移动应用 · 客户交付','Independent build · Team prototype · Mobile · Client delivery'))}</p></div>
          <div className="featured-showcase"><nav className="featured-index" aria-label={t(bi('精选案例导航','Featured case navigation'))}>{featured.map((project,i)=><a href={`#project-${project.id}`} key={project.id}><span>0{i+1}</span>{t(project.title)}</a>)}</nav>
          <div className="project-grid featured-grid">{featured.map((project,index)=><PortfolioProject key={project.id} project={project} index={index} language={language} featured/>)}</div></div>
          <div className="other-heading"><h3>{t(bi('其他项目','Other projects'))}</h3><p>{t(bi('更多网站、移动界面与学习作品。','More websites, mobile interfaces and learning projects.'))}</p></div>
          {groups.map(({group,id,title})=>{const projects=other.filter(p=>p.group===group);return <div className="project-group" id={id} key={id}>{projects.length>0&&<><h3 className="group-label">{t(title)}<span>{String(projects.length).padStart(2,'0')}</span></h3><div className="project-grid">{projects.map(project=><PortfolioProject key={project.id} project={project} index={caseStudies.indexOf(project)} language={language}/>)}</div></>}</div>;})}
          <p className="project-note">{t(bi('项目说明聚焦我实际负责的内容。内部系统与客户项目不公开源代码或公司资料；部分截图来自早期作品集及提供的参考图，可能与当前线上版本不同。','Project notes focus on my contribution. Internal source code and company data are private. Some screenshots come from the earlier portfolio and supplied reference and may differ from current live websites.'))}</p>
        </section>

        <section className="light-section experience-section" id="experience">
          <p className="section-pill">{t(bi('职业经历','The journey'))}</p><div className="section-heading-row"><h2 className="editorial-heading"><span>{t(bi('在真实团队中构建，','Built with teams.'))}</span><br/>{t(bi('在实际交付中成长。','Refined through delivery.'))}</h2><p>{t(bi('从界面实现到内部工作流，每一段经历都让我更理解产品如何服务于人。','From interface implementation to internal workflows, each role brings me closer to how products serve people.'))}</p></div>
          <div className="career-grid">{jobs.map((job,i)=><article className={`career-card career-${i}`} key={job.company}><p className="career-date">{t(job.date)}</p><span className="career-index">{String(i+1).padStart(2,'0')}</span><h3>{job.company}</h3><p className="career-role">{t(job.role)}</p><ul>{job.points.map((point,j)=><li key={j}>{t(point)}</li>)}</ul></article>)}</div>
          <details className="earlier"><summary>{t(bi('较早的其他工作经历','Earlier work experience'))}</summary><div><h3>{t(bi('仓储包装与行政','Warehouse Packing & Admin'))}</h3><p>Jul–Aug 2024</p><p>{t(bi('协助订单准备、库存整理、发票与运输文件。','Supported order preparation, stock organisation, invoices and shipping documents.'))}</p><h3>{t(bi('投资营销','Investment Marketing'))}</h3><p>Jun 2022–Feb 2023</p><p>{t(bi('支持营销活动、潜在客户开发与客户维护。','Supported marketing campaigns, lead generation and client retention.'))}</p></div></details>
          <div className="education-panel" id="education"><div><span className="micro-label">EDUCATION / 2022–2025</span><h3>{t(bi('资讯科技文凭','Diploma in Information Technology'))}</h3><p>{t(bi('MMU 多媒体大学 · Cyberjaya','Multimedia University (MMU), Cyberjaya'))}</p></div><div><p>{t(bi('我从网页与移动端界面开发开始，逐渐深入 API 串接、数据库与内部工作流。独立开发 Sales Leads CRM 的经历，让我更关注软件如何真正支持团队的日常工作。','I started with web and mobile interfaces, then became more involved in API integration, databases and internal workflows. Building a Sales Leads CRM independently deepened my interest in how software supports real teams.'))}</p><p>{t(bi('我也会在合适的场景使用 AI 编程工具，并亲自审阅、调试与测试生成结果。','I use AI coding tools when useful, then review, debug and test the results myself.'))}</p></div></div>
        </section>

        <section className="light-section skills-section" id="skills"><p className="section-pill">{t(bi('技术能力','The toolkit'))}</p><div className="section-heading-row"><h2 className="editorial-heading">{t(bi('从界面到数据，','From interfaces'))}<br/><span>{t(bi('让技术为体验服务。','to everything behind them.'))}</span></h2><p>{t(bi('用于构建 Web、移动应用与业务工具的技术栈。','The technologies I use for web, mobile and internal business tools.'))}</p></div><div className="toolkit-grid">{skills.map((skill,i)=><article className="toolkit-card" key={skill.title.en}><span className="toolkit-number">{String(i+1).padStart(2,'0')}</span><h3>{t(skill.title)}</h3><Chips values={skill.tags}/></article>)}</div></section>

        <section className="contact-section" id="contact"><p className="section-pill">{t(bi('交流与合作','Let’s connect'))}</p><h2 className="editorial-heading"><span>{t(bi('一个好的项目，','Something worth building'))}</span><br/>{t(bi('从一次对话开始。','starts with a conversation.'))}</h2><div className="contact-layout"><div className="contact-invitation"><img src="./assets/avatar-cutout.webp" alt="Tan Ze Quan" width="64" height="64" loading="lazy"/><h3>LET’S TALK.</h3><p>{t(bi('欢迎交流软件开发机会、自由接案或有意思的项目。','Open to software development opportunities, freelance work and interesting projects.'))}</p><a className="pill-button" href="mailto:tzequan379@gmail.com">{t(bi('发送邮件','Send email'))}</a><button className="copy-button" type="button" onClick={copyEmail}>{t(bi('复制邮箱','Copy email'))}</button><span className="copy-status" role="status">{copyStatus}</span></div><div className="faq-list">{faqs.map((faq,i)=><details key={faq.q.en} open={i===0?true:undefined}><summary>{t(faq.q)}</summary><p>{t(faq.a)}</p></details>)}</div></div></section>
      </main>
      <footer className="creative-footer"><div className="footer-grid"><div><a className="wordmark" href="#top">ZeQuan<span>.dev</span></a><p>{t(bi('连接界面与实际需求。','Interfaces connected to real needs.'))}</p><div className="footer-actions"><a href="https://github.com/TanZeQuan" target="_blank" rel="noopener noreferrer">GitHub</a><a href="./Tan_Ze_Quan_Resume.pdf" download>{t(bi('下载简历','Download resume'))}</a></div></div><div><h3>{t(bi('快速导航','Explore'))}</h3><a href="#about">{t(bi('关于','About'))}</a><a href="#work">{t(bi('项目','Portfolio'))}</a><a href="#experience">{t(bi('经历','Experience'))}</a><a href="#skills">{t(bi('技术','Toolkit'))}</a></div><div><h3>{t(bi('联系信息','Get in touch'))}</h3><a href="mailto:tzequan379@gmail.com">tzequan379@gmail.com</a><a href="tel:+60175013740">+60 17-501 3740</a><p>{t(bi('马来西亚 · 吉隆坡','Kuala Lumpur, Malaysia'))}</p></div></div><p className="footer-signature" aria-hidden="true"><picture><source media="(prefers-reduced-motion: reduce)" srcSet="./assets/footer-water-static.webp"/><img src="./assets/footer-water.gif" alt="" width="1280" height="210" loading="lazy"/></picture></p><div className="footer-bottom"><span>© 2026 Tan Ze Quan. All rights reserved.</span><a className="back-to-top" href="#top" aria-label={t(bi('返回顶部','Back to top'))} title={t(bi('返回顶部','Back to top'))}><Icon name="arrow-up" size={22}/></a></div></footer>
    </div>
  </div>;
}
