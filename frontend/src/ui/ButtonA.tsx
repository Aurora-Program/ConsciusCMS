import React from "react";


type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
as?: "button" | "a";
href?: string;
variant?: "primary" | "ghost";
};


export default function ButtonA({ as = "button", href, variant = "primary", className = "", children, ...rest }: ButtonProps) {
const cls = ["btn", variant === "ghost" ? "btn--ghost" : "" , className].filter(Boolean).join(" ");
if (as === "a") {
return (
<a className={cls} href={href} {...(rest as any)}>
{children}
</a>
);
}
return (
<button className={cls} {...rest}>
{children}
</button>
);
}