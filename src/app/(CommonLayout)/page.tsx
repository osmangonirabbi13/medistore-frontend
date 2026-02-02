import FeaturedProducts from "@/components/layouts/home/FeaturedProducts";
import HeroCarousel from "@/components/layouts/home/HeroCarousel";
import NewsletterSection from "@/components/layouts/home/NewsletterSubscribe";
import OurBrands from "@/components/layouts/home/OurBrands";
import Testimonials from "@/components/layouts/home/Testimonials";

export default function Home() {
  return (
    <div >
      <HeroCarousel/>
      <FeaturedProducts/>
      <OurBrands/>
      <Testimonials/>
      <NewsletterSection/>
    </div>
  );
}
