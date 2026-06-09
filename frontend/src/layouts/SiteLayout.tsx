// Paso 6: Layout del sitio - Professional ConsciusCMS Version
// File: src/layouts/SiteLayout.tsx
import ProfessionalHeader from "../components/ProfessionalHeader";
import ProfessionalFooter from "../components/ProfessionalFooter";


export default function SiteLayout({ header, footer, children }: any) {
return (
<>
<ProfessionalHeader {...header} />
<main className="o-stack">{children}</main>
<ProfessionalFooter {...footer} />
</>
);
}