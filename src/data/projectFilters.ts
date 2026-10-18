import { caseStudies } from './referenceContent';

export function filterCases(filter: string) {
  const featured = ['sales-crm', 'client-portal'];
  const rank = (id: string) => featured.includes(id) ? featured.indexOf(id) : featured.length;
  const mobile = ['instant-messaging', 'tea-membership'];
  return [...caseStudies]
    .sort((a, b) => rank(a.id) - rank(b.id))
    .filter(project => filter === 'all' || (filter === 'mobile' ? mobile.includes(project.id) : !mobile.includes(project.id)));
}
