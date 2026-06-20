import { Gallery } from "@/components/Gallery";
import { MobileGallery } from "@/components/MobileGallery";
import { homeBlocks } from "@/content/home";

export default function HomePage() {
  return (
    <>
      {/* Phones get the swipeable slideshow; md+ keeps the desktop gallery */}
      <div className="md:hidden">
        <MobileGallery blocks={homeBlocks} />
      </div>
      <div className="hidden md:block">
        <Gallery blocks={homeBlocks} />
      </div>
    </>
  );
}
