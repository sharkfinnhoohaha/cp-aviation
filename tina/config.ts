import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "json",
        ui: {
          router: () => "/",
        },
        fields: [
          // Site Settings
          {
            type: "object",
            name: "siteSettings",
            label: "Site Settings",
            fields: [
              { type: "string", name: "companyName", label: "Company Name" },
              { type: "string", name: "logoText", label: "Logo Text (Short)" },
              { type: "string", name: "contactEmail", label: "Contact Email" },
              { type: "string", name: "phone", label: "Phone Number" },
              { type: "string", name: "location", label: "Location" },
              { type: "string", name: "copyrightYear", label: "Copyright Year" },
              { type: "image", name: "logoImage", label: "Logo Image (optional)" },
              { type: "image", name: "heroImage", label: "Hero Background Image (optional)" },
            ],
          },
          // Hero Section
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Sub-headline", ui: { component: "textarea" } },
              { type: "string", name: "primaryCTAText", label: "Primary CTA Button Text" },
              { type: "string", name: "primaryCTALink", label: "Primary CTA Button Link" },
              { type: "string", name: "secondaryCTAText", label: "Secondary CTA Button Text" },
              { type: "string", name: "secondaryCTALink", label: "Secondary CTA Button Link" },
              { type: "image", name: "backgroundImage", label: "Background Image" },
            ],
          },
          // Specialty Section
          {
            type: "object",
            name: "specialty",
            label: "Specialty Section",
            fields: [
              { type: "string", name: "tagLabel", label: "Tag Label" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "body", label: "Body Text", ui: { component: "textarea" } },
              { type: "image", name: "image", label: "Section Image (optional)" },
            ],
          },
          // Services Section
          {
            type: "object",
            name: "services",
            label: "Services Section",
            fields: [
              { type: "string", name: "sectionTitle", label: "Section Title" },
              {
                type: "object",
                name: "items",
                label: "Services",
                list: true,
                ui: { itemProps: (item: { title?: string }) => ({ label: item?.title }) },
                fields: [
                  { type: "string", name: "title", label: "Service Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon Type",
                    options: ["wings", "instrument", "commercial", "club"],
                  },
                  { type: "image", name: "image", label: "Service Image (optional)" },
                ],
              },
            ],
          },
          // About Section
          {
            type: "object",
            name: "about",
            label: "About Section",
            fields: [
              { type: "string", name: "title", label: "Section Title" },
              { type: "string", name: "paragraph1", label: "First Paragraph", ui: { component: "textarea" } },
              { type: "string", name: "paragraph2", label: "Second Paragraph", ui: { component: "textarea" } },
              { type: "image", name: "image", label: "About Section Image (optional)" },
              {
                type: "object",
                name: "stats",
                label: "Statistics",
                list: true,
                ui: { itemProps: (item: { value?: string }) => ({ label: item?.value }) },
                fields: [
                  { type: "string", name: "value", label: "Stat Value (e.g. 20+)" },
                  { type: "string", name: "label", label: "Stat Label" },
                  { type: "boolean", name: "fullWidth", label: "Full Width" },
                  { type: "string", name: "subtitle", label: "Subtitle (for full-width stats)" },
                  { type: "string", name: "subtitleBody", label: "Subtitle Body (for full-width stats)" },
                ],
              },
            ],
          },
          // Case Study Section
          {
            type: "object",
            name: "caseStudy",
            label: "Case Study Section",
            fields: [
              { type: "string", name: "title", label: "Project Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "highlight", label: "Highlighted Text (e.g. $300M Capital Improvement Program)" },
              { type: "string", name: "interactionHint", label: "Interaction Hint Text" },
            ],
          },
          // Footer Section
          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [
              { type: "string", name: "ctaText", label: "CTA Headline" },
              { type: "string", name: "runwayNumber", label: "Runway Number (decorative)" },
            ],
          },
        ],
      },
      // Fleet collection for managing aircraft
      {
        name: "fleetAircraft",
        label: "Fleet Aircraft",
        path: "content/fleet",
        format: "json",
        fields: [
          { type: "string", name: "registration", label: "Registration (e.g. N12345)" },
          { type: "string", name: "type", label: "Aircraft Type (e.g. Cessna 172S)" },
          { type: "string", name: "year", label: "Year" },
          { type: "string", name: "engine", label: "Engine" },
          { type: "string", name: "horsepower", label: "Horsepower" },
          { type: "string", name: "cruiseSpeed", label: "Cruise Speed (e.g. 122 KTAS)" },
          { type: "string", name: "range", label: "Range (e.g. 640 nm)" },
          { type: "string", name: "category", label: "Category" },
          { type: "string", name: "wetRate", label: "Wet Rate (e.g. $175/hr)" },
          { type: "string", name: "memberRate", label: "Club Member Rate (e.g. $163/hr)" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "image", name: "image", label: "Aircraft Photo" },
          { type: "image", name: "cockpitImage", label: "Cockpit Photo (optional)" },
        ],
      },
    ],
  },
});
