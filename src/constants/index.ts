import type { TNavLink, TTeamMember } from "../types";

import { dhanushImg, hariharasudhanImg } from "../assets";

export const navLinks: TNavLink[] = [
  { id: "home", title: "Home" },
  { id: "about", title: "About" },
  { id: "services", title: "Services" },
  { id: "industries", title: "Industries" },
  { id: "pricing", title: "Pricing" },
  { id: "work", title: "Our Work" },
  { id: "contact", title: "Contact" },
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

export { teamMembers };
