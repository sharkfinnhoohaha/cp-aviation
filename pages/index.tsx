import Head from 'next/head'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import HoldShortDivider from '../components/HoldShortDivider'
import Specialty from '../components/Specialty'
import Services from '../components/Services'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import RecentSuccess from '../components/RecentSuccess'
import CaseStudy from '../components/CaseStudy'
import Footer from '../components/Footer'
import Cursor from '../components/Cursor'
import ScrollAnimations from '../components/ScrollAnimations'
import homeData from '../content/pages/home.json'

interface HomeProps {
  data: typeof homeData
}

export default function Home({ data }: HomeProps) {
  const page = data

  // Non-null assertions are safe: all sections are always populated in home.json
  const rawSettings = page.siteSettings
  const rawHero = page.hero
  const rawSpecialty = page.specialty
  const rawServices = page.services
  const rawAbout = page.about
  const rawCaseStudy = page.caseStudy
  const rawFooter = page.footer
  const rawTestimonials = page.testimonials
  const rawRecentSuccess = page.recentSuccess

  // Map nullable types to non-nullable component props
  const siteSettings = {
    companyName: rawSettings.companyName ?? '',
    logoText: rawSettings.logoText ?? '',
    contactEmail: rawSettings.contactEmail ?? '',
    phone: rawSettings.phone ?? '',
    location: rawSettings.location ?? '',
    copyrightYear: rawSettings.copyrightYear ?? '',
  }
  const hero = {
    headline: rawHero.headline ?? '',
    subheadline: rawHero.subheadline ?? '',
    primaryCTAText: rawHero.primaryCTAText ?? '',
    primaryCTALink: rawHero.primaryCTALink === '#contact'
      ? `mailto:${rawSettings.contactEmail}`
      : (rawHero.primaryCTALink ?? ''),
    secondaryCTAText: rawHero.secondaryCTAText ?? '',
    secondaryCTALink: rawHero.secondaryCTALink ?? '',
    brochureLink: (rawHero as any).brochureLink ?? undefined,
    brochureText: (rawHero as any).brochureText ?? undefined,
  }
  const specialty = {
    tagLabel: rawSpecialty.tagLabel ?? '',
    title: rawSpecialty.title ?? '',
    body: rawSpecialty.body ?? '',
  }
  const services = {
    sectionTitle: rawServices.sectionTitle ?? '',
    items: (rawServices.items ?? []).map(item => ({
      title: item?.title ?? '',
      description: item?.description ?? '',
      icon: item?.icon ?? 'wings',
    })),
  }
  const about = {
    title: rawAbout.title ?? '',
    paragraph1: rawAbout.paragraph1 ?? '',
    paragraph2: rawAbout.paragraph2 ?? '',
    paragraph3: (rawAbout as any).paragraph3 ?? undefined,
    stats: (rawAbout.stats ?? []).map(stat => ({
      value: stat?.value ?? '',
      label: stat?.label ?? '',
      fullWidth: stat?.fullWidth ?? false,
      subtitle: stat?.subtitle ?? undefined,
      subtitleBody: stat?.subtitleBody ?? undefined,
    })),
  }
  const caseStudy = {
    title: rawCaseStudy.title ?? '',
    description: rawCaseStudy.description ?? '',
    highlight: rawCaseStudy.highlight ?? '',
    interactionHint: rawCaseStudy.interactionHint ?? '',
  }
  const footer = {
    ctaText: rawFooter.ctaText ?? '',
    runwayNumber: rawFooter.runwayNumber ?? '',
  }
  const testimonials = {
    sectionTitle: rawTestimonials.sectionTitle ?? '',
    items: (rawTestimonials.items ?? []).map(item => ({
      quote: item?.quote ?? '',
      author: item?.author ?? '',
      date: item?.date ?? '',
      type: item?.type ?? '',
    })),
  }
  const recentSuccess = {
    sectionTitle: rawRecentSuccess.sectionTitle ?? '',
    categories: (rawRecentSuccess.categories ?? []).map(cat => ({
      name: cat?.name ?? '',
      items: (cat?.items ?? []).map(item => ({
        title: item?.title ?? '',
        date: item?.date ?? '',
        instructor: item?.instructor ?? '',
      })),
    })),
  }

  return (
    <>
      <Head>
        <title>{`${siteSettings.companyName} | Training Safe Pilots at KSZP Since 1987`}</title>
        <meta name="description" content="CP Aviation is a family-owned flight school at Santa Paula Airport (KSZP). Private, Instrument, Commercial, CFI, tailwheel, and Emergency Maneuver Training since 1987." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="CP Aviation | Training Safe Pilots at KSZP Since 1987" />
        <meta property="og:description" content="Family-owned flight school at Santa Paula Airport (KSZP) since 1987. Private, Instrument, Commercial, CFI, tailwheel, and Emergency Maneuver Training." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.cpaviation.com/" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CP Aviation | Training Safe Pilots at KSZP Since 1987" />
        <meta name="twitter:description" content="Family-owned flight school at Santa Paula Airport (KSZP) since 1987." />
        <meta name="twitter:image" content="/og-image.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FlightSchool',
            name: 'CP Aviation',
            description: 'Family-owned flight school at Santa Paula Airport (KSZP) since 1987. Training Safe Pilots.',
            url: 'https://www.cpaviation.com/',
            telephone: '+18055252138',
            email: 'info@cpaviation.com',
            foundingDate: '1987',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '830 E Santa Maria St #301',
              addressLocality: 'Santa Paula',
              addressRegion: 'CA',
              postalCode: '93060',
              addressCountry: 'US',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 34.3472,
              longitude: -119.0568,
            },
            openingHours: 'Mo-Su 07:00-18:00',
            sameAs: ['https://www.facebook.com/CpAviation/'],
          })}}
        />
      </Head>
      <div className="antialiased selection:bg-cpRed selection:text-white font-sans">
        <Cursor />
        <ScrollAnimations />
        <Navigation siteSettings={siteSettings} />
        <Hero hero={hero} />
        <HoldShortDivider />
        <Specialty specialty={specialty} />
        <Services services={services} />
        <About about={about} />
        <Testimonials testimonials={testimonials} />
        <div className="w-full bg-white flex justify-center items-center py-4 border-t border-gray-100" />
        <CaseStudy caseStudy={caseStudy} />
        <RecentSuccess recentSuccess={recentSuccess} />
        <Footer footer={footer} siteSettings={siteSettings} />
      </div>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      data: homeData,
    },
  }
}
