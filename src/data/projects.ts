/**
 * Previous work recovered from the user's original portfolio source.
 * Project notes reflect the described contribution, not ownership of whole products.
 */
export type ProjectCategory = "Mobile" | "Web & Freelance";

export type Project = {
  id: string;
  title: string;
  type: string;
  category: ProjectCategory;
  description: string;
  myRole: string;
  highlights: string[];
  technologies: string[];
  status: string;
  link?: string;
  image?: string;
};

export const moreProjects: Project[] = [
  {
    id: "instant-messaging",
    title: "Instant Messaging Mobile App",
    type: "MOBILE APPLICATION",
    category: "Mobile",
    description: "Worked on a React Native chat app with sign-in flows, messaging screens and API connections.",
    myRole: "Frontend development",
    highlights: ["Built and refined authentication and chat interfaces.", "Connected frontend screens with APIs and helped test app flows."],
    technologies: ["React Native", "REST API", "Mobile UI"],
    status: "Private / internal",
  },
  {
    id: "tea-membership",
    title: "Tea Brand Membership App",
    type: "MOBILE APPLICATION",
    category: "Mobile",
    description: "Supported the mobile experience for a tea brand's membership and customer engagement app.",
    myRole: "Mobile UI contribution",
    highlights: ["Worked on membership-related mobile screens.", "Focused on clean UI and usability across common mobile layouts."],
    technologies: ["React Native", "Mobile UI", "Responsive Design"],
    status: "Private project",
  },
  {
    id: "conference-stripe",
    title: "Conference Website & Stripe",
    type: "FREELANCE · WEBSITE",
    category: "Web & Freelance",
    description: "Revamped and maintained a conference website in Wix and helped set up and test its Stripe checkout flow.",
    myRole: "Freelance web development",
    highlights: ["Improved website layout, content and mobile responsiveness.", "Assisted with Stripe checkout configuration and payment-flow testing."],
    technologies: ["Wix", "Responsive UI", "Stripe"],
    status: "Public website",
    link: "https://www.isarconference.com/",
    image: "./assets/project-1.png",
  },
  {
    id: "web3-payment",
    title: "Digital Payment Platform Website",
    type: "TEAM PROJECT · WEB3",
    category: "Web & Freelance",
    description: "Collaborated with a Web3 team to turn frontend designs into polished pages and interactive website features.",
    myRole: "Frontend UI/UX collaboration",
    highlights: ["Worked from UI/UX references to build and improve frontend layouts.", "Added interactive elements and supported remote team feedback."],
    technologies: ["Frontend", "UI/UX", "Web3"],
    status: "Public website",
    link: "https://www.myubipay.com/",
    image: "./assets/project-4.png",
  },
  {
    id: "durian-capital", title: "Durian Capital", type: "WEBSITE · WORDPRESS", category: "Web & Freelance",
    description: "A business website showcasing durian investment services, included in my earlier web development portfolio.",
    myRole: "Website contribution", highlights: ["A WordPress and PHP website from my earlier portfolio."],
    technologies: ["WordPress", "PHP"], status: "Public website", link: "https://duriancapital.com.my", image: "./assets/project-2.png",
  },
  {
    id: "az-lab", title: "AZ Lab Business Website", type: "INTERNSHIP · WEBSITE", category: "Web & Freelance",
    description: "Rebuilt the company's Wix website with a design that was approved and adopted, then supported post-launch updates.",
    myRole: "Web design intern", highlights: ["Rebuilt the company website in Wix.", "Supported content updates and ongoing maintenance."],
    technologies: ["Wix", "Web Design"], status: "Public website", link: "https://azlab1301.wixsite.com/my-site", image: "./assets/project-3.png",
  },
  {
    id: "sneaker-store", title: "Sneaker Store", type: "COLLEGE · MINI PROJECT", category: "Web & Freelance",
    description: "An e-commerce storefront mini-project exploring product presentation, page structure and styling.",
    myRole: "Student project", highlights: ["Built an HTML and CSS storefront as a college mini-project."],
    technologies: ["HTML", "CSS"], status: "Public website", link: "https://relaxed-cuchufli-975b56.netlify.app/", image: "./assets/project-5.png",
  },
];
