import React from "react";
import Button from "@/ui/Button";


type NavItem = { label: string; href: string };
export default function Header({ logo, nav, cta }: { logo: {src: string; alt: string}; nav: NavItem[]; cta?: {label:string; href:string} }) {
return (
<header className="header">
<div className="o-container header__inner">
<a className="header__logo" href="/"><img src={logo?.src} alt={logo?.alt} /></a>
<nav className="header__nav" aria-label="Principal">
<ul>
{nav?.map((item) => (
<li key={item.href}><a href={item.href}>{item.label}</a></li>
))}
</ul>
</nav>
{cta && <Button as="a" href={cta.href}>{cta.label}</Button>}
</div>
</header>
);
}