import React from "react";


type Link = { label: string; href: string };
export default function FooterA({ columns, legal }: { columns: { title: string; links: Link[] }[]; legal?: string }) {
return (
<footer className="footer">
<div className="o-container footer__grid">
{columns?.map((col) => (
<section key={col.title} className="footer__col">
<h4>{col.title}</h4>
<ul>
{col.links?.map((l) => (
<li key={l.href}><a href={l.href}>{l.label}</a></li>
))}
</ul>
</section>
))}
</div>
<div className="o-container footer__legal">{legal}</div>
</footer>
);
}