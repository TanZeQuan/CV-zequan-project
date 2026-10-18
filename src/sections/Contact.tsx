import { Icon } from "../components/Icons";
import { useState } from "react";

function CopyEmail() {
  const [status, setStatus] = useState("");
  return <div className="copy-email"><button type="button" onClick={async () => { try { await navigator.clipboard.writeText("tzequan379@gmail.com"); setStatus("Email copied to clipboard."); } catch { setStatus("Email: tzequan379@gmail.com"); } }}>Copy email address <span aria-hidden="true">↗</span></button><span role="status">{status}</span></div>;
}

export default function Contact() {
  return <section id="contact" data-world="6" className="contact-section world-chapter chapter-contact"><div className="container contact-shell"><div><span className="eyebrow">07 — LET'S CONNECT</span><h2>Have something<br/><em>in mind?</em></h2><p>I'm open to discussing software development opportunities, freelance work and interesting projects. Feel free to reach out.</p><a href="mailto:tzequan379@gmail.com" className="button button-light">Get in touch <Icon name="arrow"/></a></div><div className="contact-details"><span>FIND ME HERE</span><a href="mailto:tzequan379@gmail.com"><Icon name="mail"/> tzequan379@gmail.com <Icon name="external" size={16}/></a><a href="https://github.com/TanZeQuan" target="_blank" rel="noopener noreferrer"><Icon name="github"/> github.com/TanZeQuan <Icon name="external" size={16}/></a><a href="tel:+60175013740"><Icon name="phone"/> +60 17-501 3740</a><CopyEmail/><p>Kuala Lumpur, Malaysia</p></div></div></section>;
}
