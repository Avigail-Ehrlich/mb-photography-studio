"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { SiteFooter, SiteHeader, SkipLinks } from "@/components/site-chrome";
import { SessionsShowcase } from "@/components/sessions-showcase";
import { CheckedImage, isImageBlocked } from "@/components/checked-image";
import { Lightbox } from "@/components/lightbox";
import { galleryCollections, type GalleryImage } from "@/lib/gallery-data";

const sessions = [
  { number: "01", id: "family", title: "משפחה", text: "שעה של ביחד, בלי לחץ ובלי פוזות מאולצות. הכוונה עדינה כשצריך, ומקום לכל מה שקורה באמת." },
  { number: "02", id: "chalake", title: "חלאקה", text: "אוטוטו ונגזזת הרעמה, רגעים אחרונים לפני שהוא גדול" },
  { number: "03", id: "bat-mitzvah", title: "בת מצווה", text: "חוויה שמעלה שלב, מילדות קלילה וכיפית לבגרות ורצינות, אנחנו על התפר" },
];

type Shape = "portrait" | "landscape";

// Photos of the inspiration strip (the marquee rows and the lightbox); the hero, about and session photos are left out so nothing repeats on the home page
const collagePhotoTiles: (GalleryImage & { shape: Shape })[] = [
  { src: "/images/collage/collage-17.jpg", alt: "ילדה בשמלה צהובה שוכבת על ספסל אבן ומחייכת", shape: "landscape" },
  { src: "/images/collage/collage-05.jpg", alt: "ילד מתולתל עם כיפה יושב על קיר אבן ומחזיק ספר תורה קטן", shape: "portrait" },
  { src: "/images/mirit/mirit-05.jpg", alt: "שתי אחיות מתחבקות ליד חבילות קש, הגדולה מנשקת את הקטנה", shape: "landscape" },
  { src: "/images/collage/collage-13.jpg", alt: "שתי אחיות בכובעים בין חבילות קש", shape: "landscape" },
  { src: "/images/collage/collage-10.jpg", alt: "ילד עם אוזניות וסקייטבורד צוחק מול קיר גרפיטי", shape: "portrait" },
  { src: "/images/mirit/mirit-03.jpg", alt: "הורים וילדים הולכים יחד יד ביד ליד בקתת עץ", shape: "landscape" },
  { src: "/images/collage/collage-07.jpg", alt: "ילד צוחק יושב על המדרכה ליד אוטובוס צעצוע אדום", shape: "landscape" },
  { src: "/images/collage/collage-11.jpg", alt: "ילד בכובע בוקרים נשען על גזע עץ", shape: "portrait" },
  { src: "/images/mirit/mirit-06.jpg", alt: "שלושה אחים בבגדים לבנים שוכבים יחד על הדשא ומביטים למעלה", shape: "landscape" },
  { src: "/images/collage/collage-19.jpg", alt: "ילד במשקפי שמש יושב על ספסל עץ ליד אוטובוס צעצוע", shape: "landscape" },
  { src: "/images/collage/collage-12.jpg", alt: "ילד בכובע וחולצה משובצת צועד בשביל", shape: "landscape" },
  { src: "/images/collage/collage-20.jpg", alt: "ילדה בקפוצ'ון מרססת על קיר גרפיטי", shape: "landscape" },
];

const HERO_SRC = "/images/mirit/mirit-01.jpg";
const ABOUT_SRC = "/images/mirit/mirit-04.jpg";
// Safe replacements for the two CSS background photos (must match the .is-filtered rules in globals.css)
const BACKGROUND_FALLBACKS: Record<string, string> = {
  [HERO_SRC]: "/images/collage/collage-19.jpg",
  [ABOUT_SRC]: "/images/collage/collage-07.jpg",
};

// Images that pass the common Israeli content filters (checked by the photographer on a filtered line).
// Any image the viewer's filter blocks is swapped in place for one of these; repeats are fine for now.
const FILTER_SAFE_IMAGES: { src: string; shape: Shape }[] = [
  { src: "/images/collage/collage-07.jpg", shape: "landscape" },
  { src: "/images/collage/collage-10.jpg", shape: "portrait" },
  { src: "/images/collage/collage-19.jpg", shape: "landscape" },
];
const safeImageAlt = (src: string) => collagePhotoTiles.find((tile) => tile.src === src)?.alt ?? "";
const collageShapes = collagePhotoTiles.map((tile) => tile.shape);

// Placeholder quotes: replace with real testimonials before going live.
const testimonials = [
  { quote: "הגענו לחוצים, עם שלושה ילדים ותינוק. יצאנו עם תמונות שבהן כולנו נראים בדיוק כמו שאנחנו - רק יפים יותר.", author: "[שם הלקוחה]", type: "צילום משפחה" },
  { quote: "בחלאקה היה רעש, אורחים והתרגשות. מירית הייתה שם בשקט ותפסה כל רגע, גם את אלה שבכלל לא ראינו.", author: "[שם הלקוחה]", type: "חלאקה" },
  { quote: "הבת שלי לא אוהבת להצטלם. אחרי עשר דקות היא כבר צחקה, והתמונות יצאו הכי היא שיש.", author: "[שם הלקוחה]", type: "בת מצווה" },
];

const pricingPlans = [
  {
    name: "חבילת מיני",
    price: "לפי שיחה",
    description: "קצר וממוקד: חבילה קטנה לילד אחד או למשפחה קטנה.",
    features: ["צילום קצר", "אלבום דיגיטלי להורדה"],
  },
  {
    name: "חבילה בסיסית",
    price: "לפי שיחה",
    description: "הבחירה של רוב המשפחות: זמן להתחמם, לשחק ולתת לתמונות הטובות לקרות.",
    features: ["צילום משפחה או ילדים", "25 תמונות להורדה"],
    featured: true,
  },
  {
    name: "חבילת פרימיום",
    price: "לפי שיחה",
    description: "ליווי מלא ותוצר שנשאר איתכם: מההכנות ועד הרגע שכולם מחכים לו.",
    features: ["הגדלה במתנה", "4 תמונות נוספות אחרי התספורת"],
  },
];

export default function Home() {
  const [lightbox, setLightbox] = useState<{ images: GalleryImage[]; index: number } | null>(null);
  const [blockedImages, setBlockedImages] = useState<ReadonlySet<string>>(() => new Set());
  // Background photos (hero, about) that have been checked and may be shown
  const [readyBackgrounds, setReadyBackgrounds] = useState<ReadonlySet<string>>(() => new Set());
  const markBlocked = useCallback((src: string) => setBlockedImages((current) => current.has(src) ? current : new Set(current).add(src)), []);
  const isBlocked = (src: string) => blockedImages.has(src);
  const availableSafe = FILTER_SAFE_IMAGES.filter((image) => !blockedImages.has(image.src));
  // Blocked images are swapped in place for a safe image of the same shape, rotating through them
  const replaceBlocked = (images: GalleryImage[], shapes?: Shape[]) => {
    const used: Record<string, number> = {};
    return images.map((image, slot): GalleryImage => {
      if (!isBlocked(image.src)) return image;
      const shape = shapes?.[slot];
      const sameShape = availableSafe.filter((safe) => safe.shape === shape);
      const candidates = sameShape.length > 0 ? sameShape : availableSafe;
      if (candidates.length === 0) return image;
      const turn = used[shape ?? "any"] = (used[shape ?? "any"] ?? 0) + 1;
      const src = candidates[turn % candidates.length].src;
      return { src, alt: safeImageAlt(src) };
    });
  };

  const collagePhotos = replaceBlocked(collagePhotoTiles, collageShapes);
  // The first photo of each collection leads its session block
  const sessionList = sessions.map((session) => ({ ...session, photo: replaceBlocked(galleryCollections.find((collection) => collection.id === session.id)?.images ?? [])[0] }));
  const marqueeSlots = collagePhotos.map((photo, slot) => ({ photo, slot }));
  const marqueeRows = [marqueeSlots.filter((_, i) => i % 2 === 0), marqueeSlots.filter((_, i) => i % 2 === 1)];

  useEffect(() => {
    let cancelled = false;
    for (const src of [HERO_SRC, ABOUT_SRC]) {
      (async () => {
        if (await isImageBlocked(src)) {
          if (cancelled) return;
          markBlocked(src);
          // Load the replacement before revealing, so it fades in whole
          await isImageBlocked(BACKGROUND_FALLBACKS[src]);
        }
        if (!cancelled) setReadyBackgrounds((current) => new Set(current).add(src));
      })();
    }
    return () => { cancelled = true; };
  }, [markBlocked]);

  const closeLightbox = () => setLightbox(null);
  const moveLightbox = (step: number) =>
    setLightbox((current) => current === null ? null : { ...current, index: (current.index + step + current.images.length) % current.images.length });

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <main dir="rtl" className="overflow-x-clip bg-[var(--cream)] text-[var(--ink)]">
      <SkipLinks />
      <SiteHeader home />

      <section id="top" className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <p className="eyebrow mb-7">צילום משפחה · חלאקה · בת מצווה</p>
            <h1 className="display-title">הרגעים הקטנים<br />הם הסיפור.</h1>
            <p className="hero-lead mt-7 max-w-lg text-[1.05rem] leading-8 sm:text-lg">צילום טבעי ורגוע, באור רך ובקצב של הילדים - תמונות שיישארו הרבה אחרי שהתפאורה כבר לא תהיה רלוונטית...</p>
            <a href="/gallery" className="hero-link mt-10 inline-flex items-center gap-3">לצפייה בעבודות <ArrowLeft size={17} strokeWidth={1.5} aria-hidden="true" /></a>
          </div>
          <div className="hero-media">
            <div className={`hero-photo ${isBlocked(HERO_SRC) ? "is-filtered" : ""} ${readyBackgrounds.has(HERO_SRC) ? "is-ready" : ""}`} role="img" aria-label="ארבעה אחים הולכים יד ביד בשביל עפר ליד סוס" />
          </div>
        </div>
      </section>

      <section id="about" className="reveal-section about-section text-white">
        <div className="about-card mx-auto grid lg:grid-cols-2">
          <div className="about-photo relative min-h-[340px] lg:min-h-[540px]">
            <div className={`about-photo-image ${isBlocked(ABOUT_SRC) ? "is-filtered" : ""} ${readyBackgrounds.has(ABOUT_SRC) ? "is-ready" : ""}`} role="img" aria-label="תמונת מצלמת צילום משפחה" />
          </div>
          <div className="reveal-copy flex items-center px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
            <div className="max-w-xl">
              <img src="/images/logo-light.png" alt="MB Photographer" className="about-logo" />
              <p className="eyebrow mt-6 text-[var(--honey-light)]">נעים להכיר</p>
              <h2 className="section-title mt-5 text-white">שלום, אני מירית.</h2>
              <div className="mt-6 space-y-4 text-[.95rem] leading-7 text-white/70">
                <p>צלמת ילדים ומשפחה, עם אהבה גדולה לצילום ולתקשורת עם ילדים. אני מצלמת ומסריטה משפחות, חלאקות ובת מצוות, ומלווה אתכם מהרגע הראשון של שיחת ההכרות ועד התוצר המושלם אצלכם בבית: תמונות ואלבום שלא מפסיקים לדפדף בו.</p>
                <p>הילדים שלכם הם ההנאה שלי! אני יוצרת רגעים מיוחדים איתם ותופסת אותם ברגע הכי משוחרר והכי טוב, כדי שתקבלו את המזכרת המושלמת והמקצועית ביותר.</p>
              </div>
              <a href="#contact" className="dark-link mt-8 inline-flex items-center gap-3">בואו נכיר <ArrowLeft size={17} strokeWidth={1.5} /></a>
            </div>
          </div>
        </div>
      </section>

      <section id="inspiration" className="reveal-section collage-section">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-10 lg:px-16">
          <div className="mb-12 text-center">
            <p className="section-kicker">השראה</p>
            <h2 className="section-title mt-4">לתפוס את הרגע</h2>
          </div>
          <div className="marquee-wrap">
          <div className="marquee" role="group" aria-label="תמונות מהצילומים">
            {[marqueeRows[0], marqueeRows[1]].map((row, rowIndex) => (
              <div key={rowIndex} className={`marquee-row ${rowIndex === 1 ? "marquee-reverse" : ""}`}>
                <div className="marquee-track">
                  {[0, 1].map((copy) => (
                    <div key={copy} className="marquee-set" aria-hidden={copy === 1 ? true : undefined}>
                      {row.map(({ photo, slot }) => (
                        <button key={`${slot}-${copy}`} type="button" className="marquee-tile" tabIndex={copy === 1 ? -1 : undefined} onClick={() => setLightbox({ images: collagePhotos, index: slot })} aria-label={copy === 1 ? undefined : `הגדלת התמונה: ${photo.alt}`}>
                          <CheckedImage key={photo.src} src={photo.src} alt={copy === 1 ? "" : photo.alt} onBlocked={markBlocked} />
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <a href="/gallery" className="marquee-orb"><span>לגלריה<br />המלאה</span><ArrowLeft size={20} strokeWidth={1.5} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section id="sessions" className="reveal-section sessions-wrap">
        <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="mb-14 text-center"><p className="section-kicker">סוגי צילום</p><h2 className="section-title mt-4">מה נצלם יחד?</h2></div>
          <SessionsShowcase sessions={sessionList} onBlocked={markBlocked} />
        </div>
      </section>

      {lightbox !== null && (
        <Lightbox images={lightbox.images} index={lightbox.index} onClose={closeLightbox} onMove={moveLightbox} />
      )}

      <section id="testimonials" className="reveal-section testimonials-section">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="mb-12 text-center">
            <p className="section-kicker">מה אומרים</p>
            <h2 className="section-title mt-4">משפחות מספרות</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((item, index) => (
              <figure key={item.type} className="testimonial-card stagger-item" style={{ "--i": index } as CSSProperties}>
                <span className="testimonial-mark" aria-hidden="true">”</span>
                <blockquote>{item.quote}</blockquote>
                <figcaption><strong>{item.author}</strong><span>{item.type}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="reveal-section pricing-section">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-10 lg:px-16 lg:py-36">
          <div className="mb-12 text-center">
            <p className="section-kicker">מחירון</p>
            <h2 className="section-title mt-4">חבילות ברורות, בלי הפתעות</h2>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <article key={plan.name} className={`pricing-card stagger-item ${plan.featured ? "pricing-card-featured" : ""}`} style={{ "--i": index } as CSSProperties}>
                <div className="pricing-topline">
                  <span className="pricing-name">{plan.name}</span>
                  {plan.featured && <span className="pricing-badge">הכי מבוקש</span>}
                </div>

                <div className="pricing-price">{plan.price}</div>
                <p className="pricing-description">{plan.description}</p>

                <ul className="pricing-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <a href="#contact" className="pricing-button">לתיאום צילום</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="reveal-section contact-section">
        <div className="contact-shell mx-auto max-w-[1400px] px-5 py-24 sm:px-10 lg:px-16 lg:py-36">
          <div className="contact-heading">
            <p className="section-kicker">מתחילים מכאן</p>
            <h2 className="contact-title mt-5">יש רגע שאתם רוצים לשמור?</h2>
            <p className="contact-intro mt-6 max-w-2xl text-base leading-8 sm:text-lg">ספרו לי קצת עליכם - מי מצטלם, מה האירוע ומתי. אחזור אליכם עם רעיונות למיקום, לשעה וללבוש, ונבנה יחד צילום שמתאים בדיוק לכם.</p>
          </div>

          <div className="contact-panel stagger-item mt-14">
            <aside className="contact-aside">
              <div>
                <p className="contact-aside-kicker">MB PHOTOGRAPHER</p>
                <h3>בואו נשמור<br />את זה קרוב.</h3>
                <p className="contact-aside-text">כל פנייה מקבלת ממני תשובה אישית - לא הודעה אוטומטית - עם כמה שאלות קצרות שיעזרו לנו לתכנן נכון.</p>
              </div>
              <div className="contact-details">
                {/* Shown only for now: not a mailto link until the site goes live */}
                <span><Mail size={17} strokeWidth={1.5} /><span dir="ltr">miritb054@gmail.com</span></span>
                <a href="tel:+972548520516"><Phone size={17} strokeWidth={1.5} /><span dir="ltr">054-8520516</span></a>
              </div>
            </aside>

            <form className="contact-form">
              <div className="field-row">
                <label><span>שם מלא</span><input type="text" placeholder="איך קוראים לכם?" /></label>
                <label><span>טלפון</span><input type="tel" placeholder="050-0000000" /></label>
              </div>
              <label><span>אימייל</span><input type="email" placeholder="your@email.com" /></label>
              <label><span>כמה מילים</span><textarea rows={4} placeholder="ספרו לי על הרגע שתרצו לשמור..." /></label>
              <button type="submit" className="submit-button">שליחת פנייה <ArrowLeft size={17} strokeWidth={1.5} /></button>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter home />
    </main>
  );
}
