/**
 * Real Leo Club of Chautari Pokhara photos, checked into public/images/gallery.
 * Shown ahead of backend gallery photos until the Django gallery endpoint is
 * populated — see the IMAGE PRIORITY note in app/gallery/page.tsx.
 */
export type LocalPhoto = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: string;
};

export const localGalleryPhotos: LocalPhoto[] = [
  {
    id: "local-district-parade",
    src: "/images/gallery/district-parade.jpg",
    alt: "Club members marching with the Leo District 325 J banner",
    caption: "Leo District 325 J parade",
    category: "District Events",
  },
  {
    id: "local-club-activities",
    src: "/images/gallery/club-activities.jpg",
    alt: "Leos at a club session",
    caption: "Club activities",
    category: "Club Activities",
  },
  {
    id: "local-joint-induction",
    src: "/images/gallery/joint-induction-ceremony.jpg",
    alt: "Leos on stage at the Joint Induction & Installation Ceremony",
    caption: "Joint Induction & Installation Ceremony",
    category: "Ceremonies",
  },
  {
    id: "local-district-installation",
    src: "/images/gallery/district-installation-gorkha.jpg",
    alt: "Leos at the district installation ceremony in Gorkha",
    caption: "District Installation, Gorkha",
    category: "Ceremonies",
  },
  {
    id: "local-leo-gathering",
    src: "/images/gallery/leo-gathering.jpg",
    alt: "Leos gathered at a club event",
    caption: "Leo gathering",
    category: "Gatherings",
  },
  {
    id: "local-district-gathering",
    src: "/images/gallery/district-gathering.jpg",
    alt: "Leos at a district gathering",
    caption: "District gathering",
    category: "Gatherings",
  },
  {
    id: "local-installation-handshake",
    src: "/images/gallery/installation-handshake.jpg",
    alt: "A handshake moment at the Joint Induction ceremony",
    caption: "Installation ceremony",
    category: "Ceremonies",
  },
  {
    id: "local-district-address-1",
    src: "/images/gallery/district-address-1.jpg",
    alt: "A Leo addressing the room from the podium",
    caption: "Speaking at the Leo podium",
    category: "Ceremonies",
  },
  {
    id: "local-district-address-2",
    src: "/images/gallery/district-address-2.jpg",
    alt: "A Leo addressing the room from the podium",
    caption: "Speaking at the Leo podium",
    category: "Ceremonies",
  },
];
