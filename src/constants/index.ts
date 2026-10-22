import type {
  TNavLink,
  TService,
  TTechnology,
  TExperience,
  TTestimonial,
  TTeamMember,
} from "../types";

import {
  backend,
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

export { services, technologies, testimonials, experiences, teamMembers };
