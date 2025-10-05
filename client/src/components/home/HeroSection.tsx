import { Button } from "../../components/ui/Button";
import {Link} from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="px-10 py-10 flex justify-center items-center bg-gradient-to-b from-bg-secondary to-bg"
      id="hero"
    >
      <motion.div 
        className="flex flex-col md:flex-row items-center max-w-6xl w-full gap-16"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="flex flex-col gap-6 text-left md:w-1/2" variants={item}>
          <motion.h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tighter text-text" variants={item}>
            Study Smarter,<br />
            <span className="text-primary-400"> Not Harder</span>
          </motion.h1>
          <motion.p className="text-lg text-text-secondary" variants={item}>
            Thinkly is your AI study buddy, designed to help you master
            your subjects efficiently and effectively. Transform your
            study habits and achieve academic success with our innovative
            tools.
          </motion.p>
          <motion.div className="flex gap-4 mt-4" variants={item}>
            <Button size="lg">
              <Link to="/auth/register" className="w-full h-full">Get Started Free</Link>
            </Button>
            <Button variant="neutral">Learn More</Button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="md:w-1/2 w-full flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.6 } }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="w-full h-auto aspect-square bg-cover rounded-2xl shadow-2xl bg-center"
            style={{
              backgroundImage: "url('/hero-study.jpg')",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
