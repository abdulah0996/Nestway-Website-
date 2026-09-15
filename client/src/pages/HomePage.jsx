import { ConsultationCta } from '../components/public/ConsultationCta.jsx';
import { useBlogs } from '../hooks/queries/useBlogs.js';
import { useCountries } from '../hooks/queries/useCountries.js';
import { useFaqs } from '../hooks/queries/useFaqs.js';
import { useOffices } from '../hooks/queries/useOffices.js';
import { useServices } from '../hooks/queries/useServices.js';
import { useTestimonials } from '../hooks/queries/useTestimonials.js';
import { useUniversities } from '../hooks/queries/useUniversities.js';
import { useSeo } from '../hooks/useSeo.js';
import { AboutAgencySection } from './home/AboutAgencySection.jsx';
import { BlogPreviewSection } from './home/BlogPreviewSection.jsx';
import { DestinationsSection } from './home/DestinationsSection.jsx';
import { HeroSection } from './home/HeroSection.jsx';
import { HomeFaqSection } from './home/HomeFaqSection.jsx';
import { OfficesSection } from './home/OfficesSection.jsx';
import { PathwayFinder } from './home/PathwayFinder.jsx';
import { ServicesShowcase } from './home/ServicesShowcase.jsx';
import { SuccessStories } from './home/SuccessStories.jsx';
import { TestimonialsSection } from './home/TestimonialsSection.jsx';
import { TrainingSection } from './home/TrainingSection.jsx';
import { TrustSection } from './home/TrustSection.jsx';
import { UniversityPartnersSection } from './home/UniversityPartnersSection.jsx';

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nestway Immigration',
  url: 'https://nestwayimmigration.com/',
  email: 'info@nestwayimmigration.com',
  telephone: '+92 321 1533111',
  areaServed: ['Australia', 'United Kingdom', 'Canada', 'United States', 'New Zealand', 'Malaysia', 'Europe'],
};

export function HomePage() {
  const countriesQuery = useCountries();
  const servicesQuery = useServices();
  const universitiesQuery = useUniversities();
  const testimonialsQuery = useTestimonials();
  const faqQuery = useFaqs();
  const blogsQuery = useBlogs();
  const officesQuery = useOffices();

  useSeo({
    title: 'Global immigration and education guidance',
    description: 'Nestway provides professional study visa, skilled migration, visit visa, business immigration and international education guidance across global destinations.',
    canonical: 'https://nestwayimmigration.com/',
    structuredData: homeStructuredData,
  });

  return <>
    <HeroSection />
    <DestinationsSection apiCountries={countriesQuery.data || []} />
    <ServicesShowcase apiServices={servicesQuery.data || []} />
    <TrustSection />
    <PathwayFinder />
    <SuccessStories />
    <OfficesSection apiOffices={officesQuery.data || []} hasError={officesQuery.isError} isLoading={officesQuery.isPending} />
    <AboutAgencySection />
    <UniversityPartnersSection query={universitiesQuery} />
    <TrainingSection />
    <TestimonialsSection query={testimonialsQuery} />
    <HomeFaqSection query={faqQuery} />
    <BlogPreviewSection query={blogsQuery} />
    <ConsultationCta eyebrow="Your journey starts here" title="Let’s turn possibility into a clear plan." description="Book a focused consultation and leave with next steps shaped around your goals, profile and destination." />
  </>;
}
