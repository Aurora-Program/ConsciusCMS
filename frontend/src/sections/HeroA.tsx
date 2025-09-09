// File: src/sections/Hero.tsx
import React from "react";
import Button from "../ui/ButtonA";


type Action = { label: string; href: string };
export default function HeroA({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: Action[] }) {
return (
<section className="hero">
<div className="o-container o-stack">
<h1 className="hero__title">{title}</h1>
{subtitle && <p className="hero__subtitle">{subtitle}</p>}
{actions && actions.length > 0 && (
<div className="hero__actions">
{actions.map((a) => (
<Button key={a.href} as="a" href={a.href}>{a.label}</Button>
))}
</div>
)}
</div>
</section>
);
}


