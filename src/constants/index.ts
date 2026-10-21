import type {
  TNavLink,
  TService,
  TTechnology,
  TExperience,
  TTestimonial,
  TProject,
  TTeamMember,
} from "../types";

import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
  dhanushImg,
  hariharasudhanImg,
} from "../assets";

export const navLinks: TNavLink[] = [
  {
    id: "about",
    title: "Home",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "digitalmarketing",
    title: "Digital Marketing",
  },
  {
    id: "book-project",
    title: "Book the Project",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services: TService[] = [
  {
    title: "Full Stack 3D Web Developer",
    icon: web,
  },
  {
    title: "Marketing Technologist",
    icon: backend,
  },
];

const technologies: TTechnology[] = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

interface IWebsiteType {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  features: string[];
}

const websiteTypes: IWebsiteType[] = [
  {
    title: "E-commerce Website",
    description: "Depends on product count, payment gateway, order dashboard, and delivery system. Final scope and pricing vary based on these factors.",
    icon: web,
    gradient: "from-purple-500 via-pink-500 to-red-500",
    features: [
      "Product count (varies)",
      "Payment gateway integration",
      "Order dashboard / management",
      "Delivery / fulfillment integration",
    ],
  },
  {
    title: "Professional Website",
    description: "Custom design package with a modern UI/UX, animations, and on-page SEO — ideal for premium corporate and portfolio sites.",
    icon: backend,
    gradient: "from-cyan-500 via-blue-500 to-purple-500",
    features: [
      "Custom UI/UX",
      "Animations / Modern layout",
      "Fast hosting setup",
      "On-page SEO",
    ],
  },
  {
    title: "Business Website",
    description: "Complete business solution including services pages, portfolio/gallery, WhatsApp integration and basic SEO.",
    icon: mobile,
    gradient: "from-green-500 via-teal-500 to-cyan-500",
    features: [
      "All basic pages (Home, About, Contact)",
      "Services page",
      "Gallery / Portfolio",
      "WhatsApp integration",
      "Basic SEO",
    ],
  },
  {
    title: "Basic Website",
    description: "Included: Home, About, Contact and basic mobile responsive layout — a simple, fast informational site.",
    icon: creator,
    gradient: "from-orange-500 via-yellow-500 to-pink-500",
    features: ["Home page", "About page", "Contact page", "Basic mobile responsive"],
  },
];

const testimonials: TTestimonial[] = [];

const experiences: TExperience[] = [
  {
    title: "Prompt Engineer & AI Developer",
    companyName: "DNX - Digital Nexoraxr WebTech",
    icon: starbucks,
    iconBg: "#383E56",
    date: "2023 - Present",
    points: [
      "Developing and optimizing AI prompts for various applications including chatbots, content generation, and automation systems.",
      "Building full-stack AI-powered web applications using React, TypeScript, Node.js, and modern AI frameworks.",
      "Implementing computer vision solutions for real-time detection and analysis using OpenCV and TensorFlow.",
      "Creating immersive 3D web experiences using Three.js and React Three Fiber for portfolio and commercial projects.",
      "Leading digital marketing initiatives with AI-driven strategies for SEO, content optimization, and analytics.",
    ],
  },
  {
    title: "Full Stack Developer",
    companyName: "Web Development Projects",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "2022 - 2023",
    points: [
      "Developed multiple web applications using React, Node.js, and MongoDB with focus on performance and user experience.",
      "Implemented responsive designs and ensured cross-browser compatibility using Tailwind CSS and modern CSS techniques.",
      "Integrated IoT solutions with web platforms for real-time data monitoring and control systems.",
      "Collaborated with clients to understand requirements and deliver custom solutions for various industries.",
      "Managed end-to-end project lifecycle from planning and development to deployment and maintenance.",
    ],
  },
  {
    title: "Computer Vision Specialist",
    companyName: "AI & ML Projects",
    icon: shopify,
    iconBg: "#383E56",
    date: "2022 - 2023",
    points: [
      "Developed real-time face mask detection system using deep learning and computer vision techniques.",
      "Implemented IoT-enabled agricultural solutions using DenseNet-201 for disease detection in crops.",
      "Worked with CNN architectures and transfer learning for various image classification tasks.",
      "Optimized model performance for real-time inference on edge devices and cloud platforms.",
      "Documented technical implementations and created comprehensive project reports.",
    ],
  },
  {
    title: "3D Animation & Web Designer",
    companyName: "Creative Projects",
    icon: meta,
    iconBg: "#E6DEDD",
    date: "2021 - 2022",
    points: [
      "Created immersive 3D portfolio websites showcasing media and animation work using Three.js.",
      "Designed and developed interactive 3D models with smooth animations and engaging visual storytelling.",
      "Implemented advanced animation techniques using Framer Motion for enhanced user engagement.",
      "Collaborated with creative teams to bring artistic visions to life through web technologies.",
      "Built responsive and accessible web interfaces following modern design principles.",
    ],
  },
];

// Extended project categories
interface IProjectCategory {
  category: string;
  projects: TProject[];
}

const allProjects: IProjectCategory[] = [
  {
    category: "E-commerce Website",
    projects: [
      {
        name: "Fashion E-Store Platform",
        description: "Complete online fashion store with AI-powered recommendations, virtual try-on, real-time inventory, secure payments, and personalized shopping experience.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "stripe", color: "green-text-gradient" }, { name: "ai", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Electronics Marketplace",
        description: "Multi-vendor electronics marketplace with product comparison, reviews, warranty tracking, and integrated shipping solutions.",
        tags: [{ name: "nextjs", color: "blue-text-gradient" }, { name: "postgresql", color: "green-text-gradient" }, { name: "redis", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Grocery Delivery App",
        description: "Online grocery platform with real-time delivery tracking, scheduled orders, subscription boxes, and contactless payment options.",
        tags: [{ name: "react-native", color: "blue-text-gradient" }, { name: "nodejs", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Jewelry Online Store",
        description: "Premium jewelry e-commerce with 360° product views, customization options, certificate verification, and secure high-value transactions.",
        tags: [{ name: "vue", color: "blue-text-gradient" }, { name: "laravel", color: "green-text-gradient" }, { name: "mysql", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Book Store Platform",
        description: "Digital and physical book marketplace with e-reader integration, author profiles, book clubs, and personalized recommendations.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "graphql", color: "green-text-gradient" }, { name: "firebase", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Organic Food Market",
        description: "Farm-to-table organic food marketplace connecting local farmers with consumers, featuring freshness tracking and subscription plans.",
        tags: [{ name: "angular", color: "blue-text-gradient" }, { name: "express", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Sports Equipment Store",
        description: "Comprehensive sports gear e-commerce with size guides, equipment recommendations, team bulk orders, and athlete endorsements.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "shopify", color: "green-text-gradient" }, { name: "tailwind", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Handmade Crafts Marketplace",
        description: "Artisan marketplace for handmade crafts with maker stories, custom orders, and direct artist communication.",
        tags: [{ name: "nextjs", color: "blue-text-gradient" }, { name: "stripe", color: "green-text-gradient" }, { name: "postgresql", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Pet Supplies E-Store",
        description: "Pet care products marketplace with vet recommendations, auto-delivery subscriptions, and pet profile management.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "nodejs", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Furniture Online Store",
        description: "Modern furniture e-commerce with AR room visualization, custom measurements, and white-glove delivery options.",
        tags: [{ name: "threejs", color: "blue-text-gradient" }, { name: "react", color: "green-text-gradient" }, { name: "aws", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Beauty Products Store",
        description: "Cosmetics and skincare marketplace with virtual makeup try-on, skin analysis, and personalized beauty routines.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "tensorflow", color: "green-text-gradient" }, { name: "firebase", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Automotive Parts Platform",
        description: "Car parts e-commerce with VIN-based compatibility checking, installation guides, and mechanic network integration.",
        tags: [{ name: "vue", color: "blue-text-gradient" }, { name: "nodejs", color: "green-text-gradient" }, { name: "mysql", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Kids Toys Store",
        description: "Educational and entertainment toys marketplace with age recommendations, safety certifications, and gift registries.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "express", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
    ],
  },
  {
    category: "Professional Website",
    projects: [
      {
        name: "Law Firm Portfolio",
        description: "Professional legal services website with case studies, attorney profiles, client testimonials, consultation booking, and legal resource library.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "cms", color: "green-text-gradient" }, { name: "seo", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Medical Practice Website",
        description: "Healthcare professional site with appointment scheduling, telemedicine integration, patient portal, and health blog.",
        tags: [{ name: "nextjs", color: "blue-text-gradient" }, { name: "hipaa", color: "green-text-gradient" }, { name: "postgresql", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Architecture Firm Showcase",
        description: "Stunning architectural portfolio with 3D project tours, design process documentation, client galleries, and project timeline visualization.",
        tags: [{ name: "threejs", color: "blue-text-gradient" }, { name: "react", color: "green-text-gradient" }, { name: "gsap", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Accounting Services Portal",
        description: "Financial services website with tax calculators, client document upload, secure messaging, and financial planning tools.",
        tags: [{ name: "vue", color: "blue-text-gradient" }, { name: "laravel", color: "green-text-gradient" }, { name: "mysql", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Real Estate Agency Site",
        description: "Property listings platform with virtual tours, mortgage calculators, neighborhood insights, and agent matching system.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "mapbox", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Engineering Consultancy",
        description: "Technical consulting firm website with project portfolio, engineering solutions showcase, team expertise, and ROI calculators.",
        tags: [{ name: "angular", color: "blue-text-gradient" }, { name: "nodejs", color: "green-text-gradient" }, { name: "postgresql", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Marketing Agency Portfolio",
        description: "Creative agency website with case studies, campaign results, client success stories, and interactive brand work showcase.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "framer", color: "green-text-gradient" }, { name: "contentful", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Photography Studio",
        description: "Professional photographer portfolio with high-resolution galleries, booking system, pricing packages, and client proofing area.",
        tags: [{ name: "nextjs", color: "blue-text-gradient" }, { name: "cloudinary", color: "green-text-gradient" }, { name: "stripe", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Financial Advisory Firm",
        description: "Investment advisory website with market insights, portfolio management tools, client login, and financial planning resources.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "django", color: "green-text-gradient" }, { name: "postgresql", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Interior Design Studio",
        description: "Design firm portfolio with before/after galleries, style quizzes, 3D room planners, and design consultation booking.",
        tags: [{ name: "threejs", color: "blue-text-gradient" }, { name: "vue", color: "green-text-gradient" }, { name: "firebase", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "IT Consulting Services",
        description: "Technology consulting website with service offerings, tech stack expertise, client case studies, and free assessment tools.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "nodejs", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Executive Coaching Platform",
        description: "Professional coaching website with program details, success stories, assessment tools, and online coaching portal.",
        tags: [{ name: "nextjs", color: "blue-text-gradient" }, { name: "zoom-api", color: "green-text-gradient" }, { name: "stripe", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Insurance Agency Portal",
        description: "Insurance services website with quote calculators, policy comparisons, claims assistance, and secure client dashboard.",
        tags: [{ name: "angular", color: "blue-text-gradient" }, { name: "express", color: "green-text-gradient" }, { name: "postgresql", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
    ],
  },
  {
    category: "Business Website",
    projects: [
      {
        name: "Restaurant & Catering",
        description: "Full-service restaurant website with online ordering, table reservations, menu management, catering bookings, and loyalty program.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "stripe", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Fitness Center Portal",
        description: "Gym and fitness center website with class schedules, trainer profiles, membership plans, workout tracking, and online classes.",
        tags: [{ name: "vue", color: "blue-text-gradient" }, { name: "laravel", color: "green-text-gradient" }, { name: "mysql", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Hotel & Resort Booking",
        description: "Hospitality website with room booking system, virtual tours, guest reviews, amenities showcase, and event spaces rental.",
        tags: [{ name: "nextjs", color: "blue-text-gradient" }, { name: "booking-engine", color: "green-text-gradient" }, { name: "postgresql", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Auto Repair Shop",
        description: "Automotive service website with appointment booking, service history tracking, maintenance reminders, and transparent pricing.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "nodejs", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Salon & Spa Booking",
        description: "Beauty services website with stylist profiles, service menus, online booking, product sales, and customer reviews.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "calendly", color: "green-text-gradient" }, { name: "stripe", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Dental Clinic Website",
        description: "Dental practice site with appointment scheduling, treatment information, insurance verification, and patient education resources.",
        tags: [{ name: "vue", color: "blue-text-gradient" }, { name: "php", color: "green-text-gradient" }, { name: "mysql", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Event Planning Services",
        description: "Event management company website with portfolio galleries, vendor network, booking system, and event planning tools.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "firebase", color: "green-text-gradient" }, { name: "cloudinary", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Cleaning Services Portal",
        description: "Professional cleaning company website with service packages, instant quotes, booking calendar, and customer management system.",
        tags: [{ name: "nextjs", color: "blue-text-gradient" }, { name: "stripe", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Moving Company Site",
        description: "Relocation services website with moving calculator, packing services, storage options, and real-time shipment tracking.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "nodejs", color: "green-text-gradient" }, { name: "postgresql", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Pet Grooming Services",
        description: "Pet care business website with grooming packages, pet profiles, appointment booking, and grooming tips blog.",
        tags: [{ name: "vue", color: "blue-text-gradient" }, { name: "express", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Landscaping Business",
        description: "Lawn care and landscaping website with service offerings, seasonal packages, project galleries, and maintenance schedules.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "laravel", color: "green-text-gradient" }, { name: "mysql", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Tutoring Center Platform",
        description: "Educational services website with tutor matching, subject offerings, progress tracking, and online learning resources.",
        tags: [{ name: "nextjs", color: "blue-text-gradient" }, { name: "webrtc", color: "green-text-gradient" }, { name: "firebase", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Plumbing Services Site",
        description: "Emergency plumbing business website with 24/7 booking, service area map, pricing transparency, and customer reviews.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "nodejs", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
    ],
  },
  {
    category: "Basic Website",
    projects: [
      {
        name: "Personal Portfolio",
        description: "Modern personal portfolio showcasing skills, projects, resume, and contact information with smooth animations.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "tailwind", color: "green-text-gradient" }, { name: "framer", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Startup Landing Page",
        description: "Sleek startup landing page with product features, pricing plans, testimonials, and email capture for early access.",
        tags: [{ name: "nextjs", color: "blue-text-gradient" }, { name: "tailwind", color: "green-text-gradient" }, { name: "mailchimp", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Blog Website",
        description: "Clean and minimal blog platform with article categories, search functionality, author profiles, and comment system.",
        tags: [{ name: "gatsby", color: "blue-text-gradient" }, { name: "markdown", color: "green-text-gradient" }, { name: "netlify", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Coming Soon Page",
        description: "Attractive coming soon page with countdown timer, email subscription, social media links, and brand introduction.",
        tags: [{ name: "html", color: "blue-text-gradient" }, { name: "css", color: "green-text-gradient" }, { name: "javascript", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Non-Profit Organization",
        description: "Charity website with mission statement, donation options, volunteer signup, impact stories, and event calendar.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "stripe", color: "green-text-gradient" }, { name: "firebase", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Community Forum",
        description: "Discussion board platform with user registration, topic categories, moderation tools, and member profiles.",
        tags: [{ name: "vue", color: "blue-text-gradient" }, { name: "nodejs", color: "green-text-gradient" }, { name: "mongodb", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Event Landing Page",
        description: "Single-event promotional page with schedule, speaker bios, venue information, and registration form.",
        tags: [{ name: "html", color: "blue-text-gradient" }, { name: "bootstrap", color: "green-text-gradient" }, { name: "jquery", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Artist Portfolio",
        description: "Creative portfolio for artists with image galleries, artwork descriptions, exhibition history, and contact form.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "lightbox", color: "green-text-gradient" }, { name: "netlify", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Recipe Blog",
        description: "Food blog with recipe cards, ingredient lists, cooking instructions, photos, and nutritional information.",
        tags: [{ name: "gatsby", color: "blue-text-gradient" }, { name: "contentful", color: "green-text-gradient" }, { name: "graphql", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Podcast Website",
        description: "Podcast showcase with episode player, show notes, guest information, subscription links, and contact form.",
        tags: [{ name: "nextjs", color: "blue-text-gradient" }, { name: "audio-player", color: "green-text-gradient" }, { name: "rss", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
      {
        name: "Travel Blog",
        description: "Travel blogger website with destination guides, travel tips, photo journals, and interactive world map.",
        tags: [{ name: "react", color: "blue-text-gradient" }, { name: "mapbox", color: "green-text-gradient" }, { name: "firebase", color: "pink-text-gradient" }],
        image: tripguide,
        sourceCodeLink: "#",
      },
      {
        name: "Wedding Website",
        description: "Personal wedding site with event details, RSVP system, photo gallery, registry links, and guest messaging.",
        tags: [{ name: "vue", color: "blue-text-gradient" }, { name: "firebase", color: "green-text-gradient" }, { name: "tailwind", color: "pink-text-gradient" }],
        image: carrent,
        sourceCodeLink: "#",
      },
      {
        name: "Author Website",
        description: "Writer's portfolio with book listings, reading samples, author bio, upcoming events, and book purchase links.",
        tags: [{ name: "gatsby", color: "blue-text-gradient" }, { name: "markdown", color: "green-text-gradient" }, { name: "netlify", color: "pink-text-gradient" }],
        image: jobit,
        sourceCodeLink: "#",
      },
    ],
  },
];

const projects: TProject[] = allProjects.flatMap(cat => cat.projects);

const teamMembers: TTeamMember[] = [
  {
    name: "Dhanush Kumar S",
    degree: "B.E, EIE",
    role: "AI Prompt Engineer",
    specialization: "Full Stack 3D Web Developer",
    image: dhanushImg,
  },
  {
    name: "Hariharasudhan M",
    degree: "BBA CA",
    role: "Finance & Marketing Expert",
    specialization: "Logistics & Transport Specialist",
    image: hariharasudhanImg,
  },
];

export { services, technologies, testimonials, experiences, projects, websiteTypes, allProjects, teamMembers };
export type { IWebsiteType, IProjectCategory };
