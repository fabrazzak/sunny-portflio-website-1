import Header from '@/component/Header/Header'
import HeroSection from '@/component/Home/Hero'
import BookingForm from '@/component/Home/BookingForm'
import GoogleReviewsSection from '@/component/Home/GoogleReviewsSection'
import FeaturedNeighbourhoods from '@/component/Home/FeaturedNeighbourhoods'
import FeaturedListings from '@/component/Home/FeaturedListings'
import ClientReviews from '@/component/Home/ClientReviews'
import Footer from '@/component/Footer/Fotter'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">

      {/* ── Nav ── */}
      <Header></Header>

      {/* ── Hero ── */}
      <HeroSection></HeroSection>

      {/* ── Booking Form ── */}
      <BookingForm />

      <GoogleReviewsSection></GoogleReviewsSection>
      <FeaturedNeighbourhoods></FeaturedNeighbourhoods>
      <FeaturedListings></FeaturedListings>
      <ClientReviews></ClientReviews>
      <Footer></Footer>

    </div>
  )
}
