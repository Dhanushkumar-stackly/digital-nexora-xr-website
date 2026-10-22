import React from "react";
import { motion } from "framer-motion";
import { teamMembers } from "../../constants";
import { SectionWrapper } from "../../hoc";
import { fadeIn, textVariant } from "../../utils/motion";
import type { TTeamMember } from "../../types";

interface ITeamMemberCard {
  member: TTeamMember;
  index: number;
}

const TeamMemberCard: React.FC<ITeamMemberCard> = ({ member, index }) => {
  return (
    <motion.article
      variants={fadeIn("up", "spring", index * 0.3, 0.75)}
      className="agency-team-card"
    >
      <div className="agency-team-photo">
        <img src={member.image} alt={member.name} loading="lazy" />
        <span className="agency-team-index">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="agency-team-body">
        <div className="agency-team-heading">
          <h3>{member.name}</h3>
          <span className="agency-team-degree">{member.degree}</span>
        </div>
        <p className="agency-team-role">{member.role}</p>
        <p className="agency-team-spec">{member.specialization}</p>
      </div>
    </motion.article>
  );
};

const AboutUs = () => {
  return (
    <div className="agency-about">
      <motion.div variants={textVariant()} className="agency-about-header">
        <p className="agency-about-eyebrow">Meet the team</p>
        <h2 className="agency-about-title">
          About <span className="agency-word-last">us</span>
        </h2>
        <p className="agency-about-lead">
          We build full-stack 3D websites and transform them into powerful
          digital marketing platforms.
        </p>
      </motion.div>

      <div className="agency-team-grid">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={member.name} member={member} index={index} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(AboutUs, "about");
