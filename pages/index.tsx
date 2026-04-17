import { useTina } from 'tinacms/dist/react'
import { PageDocument, PageQuery, PageQueryVariables } from '../tina/__generated__/types'
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
import path from 'path'
import fs from 'fs'

interface HomeProps {
  data: PageQuery
  variables: PageQueryVariables
  query: string
}

export default function Home(props: HomeProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })

  const page = data.page
  // Non-null assertions are safe: all sections are always populated in home.json
  const rawSettings = page.siteSettings!
  const rawHero = page.hero!
  const rawSpecialty = page.specialty!
  const rawServices = page.services!
  const rawAbout = page.about!
  const rawCaseStudy = page.caseStudy!
  const rawFooter = page.footer!

  // Map nullable TinaCMS generated types to non-nullable component props
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
        <title>{`${siteSettings.companyName} | Learn to Fly at KCMA`}</title>
        <meta name="description" content="A good old-fashioned flight school at Camarillo Airport. One-on-one pilot training and 24/7 aircraft rental since 2009." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="antialiased selection:bg-jacRed selection:text-white font-sans">
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
  const relativePath = 'home.json'
  const filePath = path.join(process.cwd(), 'content', 'pages', relativePath)
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  const data = {
    page: {
      __typename: 'Page' as const,
      id: `content/pages/${relativePath}`,
      _sys: {
        filename: 'home',
        basename: 'home.json',
        hasReferences: false,
        breadcrumbs: ['home'],
        path: `content/pages/${relativePath}`,
        relativePath,
        extension: '.json',
      },
      ...jsonData,
    },
  }

  return {
    props: {
      data,
      query: PageDocument,
      variables: { relativePath },
    },
  }
}
