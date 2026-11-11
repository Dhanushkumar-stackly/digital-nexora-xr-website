import type { TNavLink, TTeamMember } from "../types";

import { dhanushImg, hariharasudhanImg } from "../assets";

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
