import { motion } from "framer-motion";
import features from "./FeaturesSection";
import stats from "./GamificationSection";

const MainContent = () => {
  // Single shared animation config
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" }
  };

  return (
    <>
      {/* Features */}
      <motion.section {...fadeIn} className="px-10 py-20 bg-bg">
        <div className="max-w-6xl mx-auto">
          {/* Features content */}
        </div>
      </motion.section>

      {/* How it Works + Gamification combined */}
      <motion.section {...fadeIn} className="px-10 py-20 bg-bg">
        {/* Combined content */}
      </motion.section>

      {/* CTA */}
      <motion.section {...fadeIn} className="px-10 py-20">
        {/* CTA content */}
      </motion.section>
    </>
  );
};

export default MainContent;