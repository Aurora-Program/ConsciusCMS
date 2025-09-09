import React from "react";


type CardProps = { title?: string; children?: React.ReactNode; footer?: React.ReactNode };
export default function Card({ title, children, footer }: CardProps) {
return (
<article className="card">
{title && <h3 className="card__title">{title}</h3>}
<div className="card__body">{children}</div>
{footer && <div className="card__footer">{footer}</div>}
</article>
);
}