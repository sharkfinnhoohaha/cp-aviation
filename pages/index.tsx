import Head from 'next/head'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import HoldShortDivider from '../components/HoldShortDivider'
import Specialty from '../components/Specialty'
import Services from '../components/Services'
import About from '../components/About'
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
    primaryCTALink: rawHero.primaryCTALink ?? '',
    secondaryCTAText: rawHero.secondaryCTAText ?? '',
    secondaryCTALink: rawHero.secondaryCTALink ?? '',
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

  return (
    <>
      <Head>
        <title>{`${siteSettings.companyName} | Training Safe Pilots at KSZP Since 1987`}</title>
        <meta name="description" content="CP Aviation is a family-owned flight school at Santa Paula Airport (KSZP). Private, Instrument, Commercial, CFI, tailwheel, and Emergency Maneuver Training since 1987." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        <div className="w-full bg-white flex justify-center items-center py-4 border-t border-gray-100" />
        <CaseStudy caseStudy={caseStudy} />
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
