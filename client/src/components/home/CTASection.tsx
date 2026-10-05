import { Button } from "../../components/ui/Button";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <motion.section 
      className="px-10 py-20" 
      id="cta"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1]
        } 
      }}
      viewport={{ once: true, margin: "-80px 0px -100px 0px" }}
    >
      <motion.div 
        className="max-w-4xl mx-auto text-center glass-panel rounded-2xl p-12 shadow-2xl"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ 
          opacity: 1, 
          scale: 1,
          transition: { 
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
          } 
        }}
        whileHover={{
          scale: 1.01,
          transition: { 
            type: "spring",
            stiffness: 300,
            damping: 10
          } 
        }}
        viewport={{ once: true }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.5,
              delay: 0.1
            } 
          }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-text tracking-tight">
            Ready to Transform Your Study Habits?
          </h2>
          <motion.p 
            className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: 0.2,
                duration: 0.5
              } 
            }}
            viewport={{ once: true }}
          >
            Join hundreds of students who are learning smarter, not harder.
            Get started with Thinkly for free today!
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              delay: 0.3,
              duration: 0.5
            } 
          }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.02,
            transition: { 
              type: "spring",
              stiffness: 400,
              damping: 10
            } 
          }}
        >
          <Button 
            className="mt-8 min-w-[84px] max-w-[480px] h-14 px-8 btn-3d-primary text-white text-lg font-bold leading-normal tracking-wide transition-all duration-300 mx-auto transform hover:-translate-y-1"
            size="lg"
          >
            Sign Up for Free
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default CTASection;
