import { Mail } from "lucide-react";
import { A11yMenu, SkipLinks } from "@/components/a11y-controls";
import { AccessibilityStatement, PrivacyPolicy } from "@/components/legal-content";
import { LegalDialog } from "@/components/legal-dialog";

export { SkipLinks };

// `home` is true on the landing page, where section links are in-page anchors
export function SiteHeader({ home }: { home: boolean }) {
  const base = home ? "" : "/";
  return (
    <header className="site-header relative z-20 border-b border-[var(--line)] bg-[var(--cream)] text-[var(--ink)]">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 sm:px-10 lg:px-16">
        <a href={home ? "#top" : "/"} className="brand-logo brand-logo-header" aria-label="MB Photographer - דף הבית"><img src="/images/logo-light.png" alt="MB Photographer" /></a>
        <nav className="header-nav hidden items-center gap-7 text-sm lg:flex" aria-label="ניווט ראשי">
          <a href="/gallery" aria-current={home ? undefined : "page"}>עבודות</a><a href={`${base}#sessions`}>סוגי צילום</a><a href={`${base}#about`}>אודות</a><a href={`${base}#testimonials`}>המלצות</a><a href={`${base}#pricing`}>מחירון</a><a href={`${base}#contact`}>יצירת קשר</a>
        </nav>
        <a href="tel:+972548520516" className="header-cta">לתיאום צילום: מירית <span dir="ltr">054-8520516</span></a>
      </div>
    </header>
  );
}

export function SiteFooter({ home }: { home: boolean }) {
  return (
    <>
    <a href="mailto:miritb054@gmail.com" className="mail-fab" aria-label="שליחת מייל למירית"><Mail size={24} strokeWidth={1.6} aria-hidden="true" /></a>
    <footer className="site-footer">
      <div className="footer-inner mx-auto max-w-[1500px] px-5 sm:px-10 lg:px-16">
        <a href={home ? "#top" : "/"} className="brand-logo brand-logo-footer" aria-label={home ? "MB Photographer - חזרה לראש העמוד" : "MB Photographer - לדף הבית"}><img src="/images/logo-light.png" alt="MB Photographer" /></a>
        <div className="footer-legal">
          <A11yMenu />
          <span aria-hidden="true">|</span>
          <LegalDialog label="הצהרת נגישות" title="הצהרת נגישות"><AccessibilityStatement /></LegalDialog>
          <span aria-hidden="true">|</span>
          <LegalDialog label="מדיניות פרטיות" title="מדיניות פרטיות"><PrivacyPolicy /></LegalDialog>
        </div>
        <p className="footer-rights">
          <span>© 2026 MB Photographer. כל הזכויות שמורות</span>
          <span aria-hidden="true">|</span>
          <span className="footer-credit">
            עיצוב ובנייה -
            <a href="https://ajenda-studio.ajendastudio.workers.dev" target="_blank" rel="noopener" className="studio-mark" dir="ltr" aria-label="AJenda Studio - עיצוב ובניית אתרים"><span className="br">{"{"}</span>AJ<span className="br">{"}"}</span>enda</a>
          </span>
        </p>
      </div>
    </footer>
    </>
  );
}
