export const services = [
  {
    title: "Search Engine Optimisation (SEO)",
    description:
      "Improve your website's search visibility, attract relevant visitors and strengthen your organic presence on search engines.",
  },
  {
    title: "Local SEO",
    description:
      "Help customers discover your business in local search results through Google Business Profile optimisation, local keyword targeting and local visibility improvements.",
  },
  {
    title: "Social Media Marketing",
    description:
      "Build brand awareness, engage your audience and maintain a consistent social media presence through strategic content and account management.",
  },
  {
    title: "Google Ads",
    description:
      "Reach potential customers through targeted Google advertising campaigns. Campaign management is available through a separate quotation.",
  },
  {
    title: "Meta Ads",
    description:
      "Create and manage advertising campaigns across Facebook and Instagram to support brand awareness, enquiries and business growth. Management fees are quoted separately.",
  },
  {
    title: "Website Development",
    description:
      "Build professional, responsive and user-friendly websites that communicate your brand and support your business objectives. Project-based pricing applies.",
  },
];

export const packages = [
  {
    name: "Starter Package",
    price: "₹14,999",
    summary: "For businesses looking to establish a consistent social media presence.",
    features: [
      "8 social media creative posts per month",
      "2 short-form reels per month",
      "Social media account management",
      "Content planning and monthly calendar",
      "Basic profile optimisation",
      "Monthly performance report",
      "Monthly strategy review",
    ],
    cta: "Choose Starter Package",
  },
  {
    name: "Business Growth Package",
    price: "₹24,999",
    summary: "For growing businesses looking to improve visibility and generate more relevant enquiries.",
    features: [
      "12 social media creative posts per month",
      "4 short-form reels per month",
      "Social media account management",
      "Content strategy and monthly calendar",
      "Basic on-page SEO activities",
      "Google Business Profile optimisation",
      "Local SEO activity",
      "Monthly performance report",
      "Monthly strategy and performance review",
    ],
    cta: "Choose Business Package",
  },
  {
    name: "Professional Growth Package",
    price: "₹45,000",
    summary: "For businesses seeking a more comprehensive digital marketing strategy.",
    features: [
      "16 social media creative posts per month",
      "8 short-form reels per month",
      "Social media account management",
      "Advanced content planning and strategy",
      "SEO strategy and agreed monthly optimisation activities",
      "Local SEO management",
      "Google Business Profile management",
      "Competitor and keyword analysis",
      "Monthly analytics and performance reporting",
      "Monthly strategy consultation",
    ],
    cta: "Choose Professional Package",
  },
];

export const packageNotes = [
  "Pricing is monthly.",
  "Advertising budget is not included.",
  "Google Ads and Meta Ads management fees are separate.",
  "Website development is quoted separately.",
  "Photography, professional video shoots, influencer fees and paid third-party tools are excluded unless specified in the proposal.",
  "GST, if applicable, will be charged additionally.",
  "Exact deliverables, platforms, revision limits and timelines will be documented in the client proposal.",
  "Package commencement and renewal terms will be confirmed in the service agreement.",
];

export const additionalServices = [
  {
    title: "Google Ads Management",
    description:
      "Custom campaign planning, setup, optimisation and performance reporting. Management fee quoted separately.",
  },
  {
    title: "Meta Ads Management",
    description:
      "Facebook and Instagram campaign planning, setup, optimisation and reporting. Management fee quoted separately.",
  },
  {
    title: "Website Development",
    description:
      "Business websites, corporate websites, landing pages and custom website solutions. Project-based quotation.",
  },
  {
    title: "SEO Projects",
    description:
      "Custom SEO audits, technical improvements, keyword strategy and ongoing optimisation based on website requirements.",
  },
];

export const processSteps = [
  { title: "Discover", description: "Understand your business, objectives, target audience and market." },
  { title: "Analyse", description: "Study your current digital presence, competitors and growth opportunities." },
  { title: "Strategize", description: "Develop a customised digital marketing strategy based on your goals." },
  { title: "Execute", description: "Implement the planned marketing activities across relevant digital channels." },
  { title: "Optimise", description: "Monitor performance, analyse results and continuously improve the strategy." },
];

export const reasons = [
  {
    icon: "target",
    title: "Customised Strategies",
    description: "Every business has different objectives. We develop strategies based on your requirements.",
  },
  {
    icon: "chart",
    title: "Transparent Reporting",
    description: "Understand your marketing activities and performance through regular reporting.",
  },
  {
    icon: "briefcase",
    title: "Business-Focused Marketing",
    description: "Our approach focuses on relevant visibility, audience engagement and business enquiries.",
  },
  {
    icon: "chat",
    title: "Dedicated Communication",
    description: "Clear communication, regular updates and a structured working process.",
  },
] as const;

export const industries = [
  "Retail & Wholesale",
  "Manufacturing",
  "Real Estate",
  "Interior & Décor",
  "Healthcare",
  "Food & Restaurants",
  "Education",
  "Professional Services",
  "Other Business Categories",
];

export const approach = ["Strategy First", "Data Driven", "Business Focused", "Continuous Optimisation"];

// A string is a paragraph; a string[] is a bulleted list.
export const termsSections: { title: string; blocks: (string | string[])[] }[] = [
  {
    title: "Monthly Service",
    blocks: [
      "HD NEXORA WEBTEC provides digital marketing services on a monthly basis. The selected services, package features and deliverables will be provided as mutually agreed in the client proposal.",
    ],
  },
  {
    title: "Strategy & Growth",
    blocks: [
      "We develop and implement suitable digital marketing strategies based on the client's business, target audience, industry and competitors to improve online visibility, engagement and lead opportunities.",
    ],
  },
  {
    title: "Performance Tracking",
    blocks: [
      "We monitor relevant performance indicators such as reach, website traffic, engagement, enquiries and leads, depending on the selected services. Performance insights are used to review and improve our strategies.",
    ],
  },
  {
    title: "Payment Terms",
    blocks: [
      "First Month:",
      [
        "50% of the agreed monthly package fee must be paid in advance before the commencement of services.",
        "The remaining 50% must be paid at the end of the first service month.",
      ],
      "From the Second Month Onwards:",
      ["The full agreed monthly package fee must be paid in advance for each subsequent month."],
      "Services may be paused if payments are delayed, subject to prior communication with the client.",
    ],
  },
  {
    title: "Monthly Continuation",
    blocks: [
      "Our digital marketing services operate on a month-to-month basis, with no fixed long-term commitment unless separately agreed in writing.",
      "Services will continue based on mutual agreement and timely payment of the applicable monthly fee.",
    ],
  },
  {
    title: "Service Scope & Additional Charges",
    blocks: [
      "Only the services and deliverables included in the selected package or approved proposal are covered by the agreed monthly fee.",
      "The following are charged separately unless explicitly included in a written agreement:",
      [
        "Google Ads and Meta Ads advertising budgets.",
        "Google Ads and Meta Ads campaign management fees.",
        "Website development and maintenance projects.",
        "Professional photography and video production.",
        "Influencer marketing and third-party service charges.",
        "Additional services outside the agreed scope.",
      ],
      "Any additional work or charges will be discussed and approved by the client before commencement.",
    ],
  },
  {
    title: "Client Responsibilities",
    blocks: [
      "The client must provide the necessary business information, content, approvals, access permissions and other materials required to perform the agreed services.",
      "Delays in providing information, access or approvals may affect the planned delivery timelines.",
    ],
  },
  {
    title: "Third-Party Platforms",
    blocks: [
      "Our services may involve third-party platforms such as Google, Meta, Instagram and other digital services.",
      "HD NEXORA WEBTEC does not control changes to their policies, algorithms, account restrictions, platform availability or advertising approval decisions.",
    ],
  },
  {
    title: "Performance & Results",
    blocks: [
      "We do not guarantee specific search rankings, sales figures, leads, conversions or advertising results.",
      "Digital marketing performance depends on several factors, including competition, industry conditions, advertising budgets, audience behaviour and third-party platform changes.",
      "We focus on consistent strategy, transparent reporting and continuous optimisation.",
    ],
  },
  {
    title: "Cancellation & Service Discontinuation",
    blocks: [
      "Either party may request discontinuation of monthly services by providing written notice before the next service month begins.",
      "Fees for services already delivered and any previously approved additional expenses remain payable.",
      "Any pending payments and applicable service commitments must be settled before closure.",
    ],
  },
  {
    title: "Our Commitment",
    blocks: [
      "We believe in consistent strategy, measurable progress, transparent communication and continuous improvement.",
      "Our objective is to help businesses strengthen their digital presence and work towards sustainable growth.",
    ],
  },
];
