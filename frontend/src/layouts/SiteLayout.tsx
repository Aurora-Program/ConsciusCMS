// Paso 6: Layout del sitio
// File: src/layouts/SiteLayout.tsx
import React from "react";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";


export default function SiteLayout({ header, footer, children }: any) {
return (
<>
<Header {...header} />
<main className="o-stack">{children}</main>
<Footer {...footer} />
</>
);
}