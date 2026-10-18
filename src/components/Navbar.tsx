import { useState } from "react";
import { Icon } from "./Icons";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <a className="brand" href="#top" aria-label="Ze Quan Tan, back to top">ZQ<span className="brand-period">.</span><span className="brand-label">PORTFOLIO</span></a>
        <nav className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          <a className="mobile-resume-link" href="./Tan_Ze_Quan_Resume.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Resume ↗</a>
        </nav>
        <a className="nav-resume" href="./Tan_Ze_Quan_Resume.pdf" target="_blank" rel="noopener noreferrer">My Resume <Icon name="external" size={15}/></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}><Icon name={menuOpen ? "close" : "menu"} size={23}/></button>
      </div>
    </header>
  );
}
