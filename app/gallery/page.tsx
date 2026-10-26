import type { Metadata } from "next";
import { GalleryPage } from "@/components/gallery-page";

export const metadata: Metadata = {
  title: "גלריית העבודות — MB Photographer",
  description: "הגלריה המלאה: צילומי משפחה, חלאקה ובת מצווה.",
};

export default function Page() {
  return <GalleryPage />;
}
