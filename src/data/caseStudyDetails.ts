import { bi } from './referenceContent';
import type { Copy } from './referenceContent';

export interface CaseDetail { problem: Copy; challenge: Copy; learning: Copy; features: Copy[]; }
export const featuredIds = ['sales-crm', 'client-portal', 'instant-messaging', 'conference-stripe'];

// Scope comes from the supplied project records. No private implementation is reproduced.
export const caseDetails: Record<string, CaseDetail> = {
  'sales-crm': {
    problem: bi('线索分散在表格中，分配负责人和持续跟进需要一个连接起来的内部流程。', 'Spreadsheet-based leads needed a connected process for ownership, assignments and ongoing sales follow-ups.'),
    challenge: bi('核心技术关注点是导入与同步时的重复处理，以及分配、角色权限和任务状态之间的一致性。', 'The engineering focus was duplicate handling during imports and sync, alongside consistent assignments, role permissions and task tracking.'),
    learning: bi('这段独立开发经历加深了我对前端、认证、数据库与日常业务流程如何协作的理解。', 'This independent build deepened my understanding of how frontend interfaces, authentication and database workflows work together in a business tool.'),
    features: [bi('线索管理、导入与重复处理', 'Lead management, imports and duplicate handling'), bi('Google Sheets 同步与负责人分配', 'Google Sheets synchronization and lead assignment'), bi('基于角色的权限、任务及销售跟进', 'Role-based access, tasks and sales follow-up tracking')],
  },
  'client-portal': {
    problem: bi('团队需要在正式实现之前，将静态设计转为可以评审的响应式交互演示。', 'The team needed to review responsive layouts and intended interactions before moving from static designs into implementation.'),
    challenge: bi('将设计参考转为不同屏幕上清晰可用的布局，同时保持演示交互与设计意图一致。', 'The frontend focus was translating visual references into usable layouts across screen sizes while keeping demo interactions aligned with the design.'),
    learning: bi('这段协作经历加强了我从设计参考实现响应式页面，以及利用交互原型支持团队评审的能力。', 'This collaboration strengthened my experience translating design references into responsive pages and using interactive prototypes to support team review.'),
    features: [bi('响应式 HTML / CSS 演示页面', 'Responsive HTML / CSS demo pages'), bi('JavaScript 前端交互', 'Interactive frontend elements with JavaScript'), bi('界面与流程评审支持', 'UI and flow review support')],
  },
  'instant-messaging': {
    problem: bi('移动应用需要将登录与聊天界面连接到后端 API，并检查主要使用流程。', 'The mobile app needed authentication and messaging interfaces connected to backend APIs, with its main user flows checked.'),
    challenge: bi('关注移动端界面与 API 连接之间的配合，并与团队一起调试使用流程。', 'The implementation focus was connecting mobile interfaces with backend APIs and helping the team debug application flows.'),
    learning: bi('积累了 React Native 界面、API 对接以及与后端团队协作调试的经验。', 'Gained practical experience with React Native interfaces, API integration and collaborative debugging.'),
    features: [bi('登录验证界面', 'Authentication interfaces'), bi('聊天与消息页面', 'Messaging screens'), bi('API 对接与流程测试支持', 'API connections and flow-testing support')],
  },
  'conference-stripe': {
    problem: bi('会议网站需要改善内容、页面布局与移动体验，并支持支付流程的配置和检查。', 'The conference website needed clearer content and layouts, mobile improvements and support configuring and checking its checkout flow.'),
    challenge: bi('在 Wix 网站调整过程中兼顾不同屏幕的呈现，并协助配置及测试 Stripe checkout。', 'The delivery focus was balancing responsive presentation in Wix with Stripe checkout configuration and payment-flow testing support.'),
    learning: bi('积累了客户网站维护、响应式调整及支付流程配置与测试的实际经验。', 'Gained hands-on experience maintaining a client website, refining responsive layouts and supporting checkout setup and testing.'),
    features: [bi('内容与响应式布局更新', 'Content and responsive layout updates'), bi('Stripe checkout 配置与测试支持', 'Stripe checkout configuration and testing support'), bi('按项目需求持续维护', 'Ongoing project-based maintenance')],
  },
};
