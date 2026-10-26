export type GalleryImage = { src: string; alt: string };

export const galleryCollections: { id: string; label: string; title: string; summary: string; images: GalleryImage[]; youtubeId?: string }[] = [
  {
    id: "family",
    label: "משפחה",
    title: "סיפור של בית",
    summary: "האחים, התינוק החדש, הצחוק שלפני ארוחת שבת - מי שיושב סביב השולחן שלכם, בתמונות שתרצו לתלות על הקיר.",
    images: [
      { src: "/images/mirit/mirit-03.jpg", alt: "הורים וילדים הולכים יחד יד ביד ליד בקתת עץ" },
      { src: "/images/mirit/mirit-08.jpg", alt: "שני ילדים מתחבקים על הכביש, אחת עם כובע ג'ינס ועל סקייטבורד" },
      { src: "/images/mirit/mirit-01.jpg", alt: "ארבעה אחים הולכים יד ביד בשביל עפר ליד סוס" },
      { src: "/images/mirit/mirit-05.jpg", alt: "שתי אחיות מתחבקות ליד חבילות קש, הגדולה מנשקת את הקטנה" },
      { src: "/images/collage/collage-07.jpg", alt: "ילד צוחק יושב על המדרכה ליד אוטובוס צעצוע אדום" },
    ],
  },
  {
    id: "chalake",
    label: "חלאקה",
    title: "התספורת הראשונה",
    summary: "שלוש שנים של תלתלים, רגע אחד של מספריים. ההתרגשות, החיוך הנבוך, והמבט הראשון במראה.",
    images: [
      { src: "/images/collage/collage-20.jpg", alt: "ילדה בקפוצ'ון מרססת על קיר גרפיטי" },
      { src: "/images/mirit/mirit-07.jpg", alt: "ילדה מחייכת בשמלה לבנה מחבקת תפוחים ורימון" },
      { src: "/images/collage/collage-19.jpg", alt: "ילד במשקפי שמש יושב על ספסל עץ ליד אוטובוס צעצוע" },
      { src: "/images/collage/collage-10.jpg", alt: "ילד עם אוזניות וסקייטבורד צוחק מול קיר גרפיטי" },
    ],
  },
  {
    id: "bat-mitzvah",
    label: "בת מצווה",
    title: "היא כבר גדולה",
    summary: "בגיל הזה כל אחת רוצה להיראות כמו עצמה, רק בגרסה הכי בטוחה. בטבע, בסטודיו או בעיר.",
    images: [
      { src: "/images/mirit/mirit-05.jpg", alt: "שתי אחיות מתחבקות ליד חבילות קש, הגדולה מנשקת את הקטנה" },
    ],
    youtubeId: "bG3QSC4DuMc",
  },
];
