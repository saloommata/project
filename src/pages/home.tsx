import Hero from '../components/sections/hero';
import About from '../components/sections/about';
import MenuSection from '../components/sections/menusection';
import TestimonialsSection from '../components/sections/testimonialssection';
import ContactSection from '../components/sections/contactsection';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <MenuSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
