import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const itemLeft = {
  hidden: { opacity: 0, x: -40, y: 20 },
  show: { 
    opacity: 1, 
    x: 0, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    } 
  }
};

const itemRight = {
  hidden: { opacity: 0, x: 40, y: 20 },
  show: { 
    opacity: 1, 
    x: 0,
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    } 
  }
};

const steps = [
  {
    number: 1,
    title: "Upload Your Notes",
    description: "Easily upload your notes, textbooks, or lecture transcripts in various formats.",
    align: "left"
  },
  {
    number: 2,
    title: "Thinkly Transforms",
    description: "Our AI algorithms analyze your materials and generate summaries, quizzes, and flashcards.",
    align: "right"
  },
  {
    number: 3,
    title: "You Study Smarter",
    description: "Use Thinkly's tools to study efficiently, track your progress, and achieve your learning goals.",
    align: "left"
  }
];

const HowItWorksSection = () => {
  return (
    <motion.section 
      className="px-10 py-20 bg-bg-secondary" 
      id="how-it-works"
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
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.5,
              delay: 0.1
            } 
          }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary-500 tracking-tight">
            How It Works in 3 Simple Steps
          </h2>
        </motion.div>
        <motion.div 
          className="relative pt-8 isolate"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px 0px -100px 0px" }}
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-neutral-300"
          />
          <div className="flex flex-col gap-16">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-8 w-full"
                //@ts-expect-error
                variants={step.align === 'left' ? itemLeft : itemRight}
              >
                {step.align === 'left' ? (
                  <>
                    <div className="w-1/2 flex justify-end">
                      <div className="text-right pr-8">
                        <h3 className="text-2xl font-bold text-text">
                          {step.number}. {step.title}
                        </h3>
                        <p className="text-text-secondary mt-2">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <motion.div 
                      className="flex-shrink-0 size-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-2xl font-bold shadow-md z-10"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {step.number}
                    </motion.div>
                    <div className="w-1/2"></div>
                  </>
                ) : (
                  <>
                    <div className="w-1/2"></div>
                    <motion.div 
                      className="flex-shrink-0 size-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-2xl font-bold shadow-md z-10"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {step.number}
                    </motion.div>
                    <div className="w-1/2">
                      <div className="pl-8">
                        <h3 className="text-2xl font-bold text-text">
                          {step.number}. {step.title}
                        </h3>
                        <p className="text-text-secondary mt-2">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;
