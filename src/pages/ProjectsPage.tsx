import React, { useState } from "react";
import { motion } from "framer-motion";
import { allProjects, websiteTypes } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

interface IProjectCard {
  index: number;
  name: string;
  description: string;
  tags: { name: string; color: string }[];
  sourceCodeLink: string;
}

const ProjectCard: React.FC<IProjectCard> = ({
  index,
  name,
  description,
  tags,
}) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.05, 0.75)}
      className="relative group"
    >
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      >
        {/* Project Name */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-white font-bold text-xl leading-tight">
            {name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-white/90 text-sm leading-relaxed mb-4 font-medium">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={`${name}-${tag.name}`}
              className={`text-xs font-semibold ${tag.color} bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm`}
            >
              #{tag.name}
            </span>
          ))}
        </div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 blur-xl" />
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...websiteTypes.map(type => type.title)];

  const filteredProjects = selectedCategory === "All"
    ? allProjects
    : allProjects.filter(cat => cat.category === selectedCategory);

  return (
    <div className="relative z-0 bg-primary min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={textVariant()}
          initial="hidden"
          animate="show"
          className="text-center mb-12"
        >
          <p className="text-secondary text-[18px] uppercase tracking-wider mb-2"
            style={{
              background: "linear-gradient(135deg, #915EFF 0%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Portfolio
          </p>
          <h2 className="text-white font-black text-[50px] sm:text-[60px] md:text-[70px] mb-4"
            style={{ textShadow: "0 0 30px rgba(145, 94, 255, 0.5)" }}
          >
            All Projects.
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto font-medium">
            Explore our extensive portfolio of 50+ projects across different website categories.
            Each project showcases our expertise in modern web technologies and innovative solutions.
          </p>
        </motion.div>

        {/* Website Type Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-white text-2xl font-bold mb-6 text-center">
            Website Solutions We Offer
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {websiteTypes.map((type, index) => (
              <motion.div
                key={type.title}
                variants={fadeIn("up", "spring", index * 0.1, 0.75)}
                initial="hidden"
                animate="show"
                className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-6 border border-white/25 shadow-xl text-center hover:scale-105 transition-transform"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${type.gradient} p-0.5`}>
                  <div className="w-full h-full bg-black/60 rounded-xl flex items-center justify-center">
                    <img src={type.icon} alt={type.title} className="w-10 h-10 object-contain" />
                  </div>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">{type.title}</h4>
                <p className="text-white/70 text-sm font-medium">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 text-white shadow-lg scale-105"
                    : "backdrop-blur-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects by Category */}
        <div className="space-y-16">
          {filteredProjects.map((categoryGroup, catIndex) => (
            <motion.div
              key={categoryGroup.category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="mb-8">
                <h3
                  className="text-4xl font-black mb-3"
                  style={{
                    background: "linear-gradient(135deg, #915EFF 0%, #06b6d4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {categoryGroup.category}
                </h3>
                <div className="h-1 w-32 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-full" />
                <p className="text-white/70 mt-3 text-lg font-medium">
                  {categoryGroup.projects.length} Projects
                </p>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryGroup.projects.map((project, index) => (
                  <ProjectCard
                    key={`${categoryGroup.category}-${project.name}`}
                    index={index}
                    {...project}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
