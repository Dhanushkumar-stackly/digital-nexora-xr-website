import { motion } from "framer-motion";

interface Props {
  Component: React.ElementType;
  idName: string;
}

const SectionWrapper = (
  Component: Props["Component"],
  idName: Props["idName"]
) =>
  function HOC() {
    return (
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="site-section"
        id={idName}
      >
        <div className="site-container">
          <Component />
        </div>
      </motion.section>
    );
  };

export default SectionWrapper;
