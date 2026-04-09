import Hero from "./components/Hero";
import WhyChooseUs from "./components/WhyChooseUs";
import QuickStats from "./components/QuickStats";
import Header from "./globalComponents/Header";
import FeaturedToursWithPayment from "./components/FeaturedToursWithPayment";

export default function HomePage() {

  return (
    <div>
     <Header/>
      <Hero />
      <FeaturedToursWithPayment/>
      <WhyChooseUs />
      <QuickStats />
    </div>
  );
}
