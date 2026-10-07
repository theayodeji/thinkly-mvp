import { motion } from "framer-motion";
import {
  UploadCloud,
  Sparkles,
  GraduationCap,
  FileText,
  Brain,
  CheckCircle2,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.1,
    },
  },
};

const itemLeft = {
  hidden: { opacity: 0, x: -30, y: 20 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const itemRight = {
  hidden: { opacity: 0, x: 30, y: 20 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const steps = [
  {
    number: 1,
    title: "Upload Your Study Material",
    description:
      "Upload your lecture slides, PDFs, textbooks, or notes in seconds. Thinkly instantly organizes and prepares your materials.",
    icon: UploadCloud,
    illustration: FileText,
    align: "right", // Step 1 text on right
  },
  {
    number: 2,
    title: "AI Generates Smart Paths & Flashcards",
    description:
      "Our AI analyzes your content to build structured learning roadmaps, active-recall flashcards, and comprehensive study notes.",
    icon: Sparkles,
    illustration: Brain,
    align: "left", // Step 2 text on left
  },
  {
    number: 3,
    title: "Study & Master Any Subject",
    description:
      "Chat with your 24/7 AI tutor, quiz yourself with smart flashcards, and track your retention effortlessly until test day.",
    icon: GraduationCap,
    illustration: CheckCircle2,
    align: "right", // Step 3 text on right
  },
];

const HowItWorksSection = () => {
  return (
    <motion.section
      className="px-4 sm:px-6 py-8 sm:py-12 md:py-24 max-w-6xl mx-auto w-full overflow-hidden"
      id="how-it-works"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1] as const,
        },
      }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Left-Aligned Header matching reference sample */}
      <div className="mb-6 sm:mb-10 md:mb-14 text-left">
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary-500 tracking-tight">
          How it All Works
        </h2>
      </div>

      {/* Main Timeline Wrapper */}
      <motion.div
        className="relative isolate pt-2 sm:pt-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* Center Vertical Divider Line (Desktop: centered, Mobile: left-aligned at line) */}
        <div
          aria-hidden="true"
          className="absolute left-6 md:left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary-400 via-primary-300 to-primary-100 dark:from-primary-600 dark:via-primary-800 dark:to-slate-800"
        />

        <div className="flex flex-col gap-10 sm:gap-14 md:gap-24">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const IllustrationComponent = step.illustration;
            const isTextOnRight = step.align === "right";

            return (
              <motion.div
                key={index}
                className="relative flex flex-col md:flex-row items-start md:items-center w-full group"
                variants={isTextOnRight ? itemRight : itemLeft}
              >
                {/* Desktop Left Slot */}
                <div className="hidden md:flex md:w-1/2 justify-end pr-12 items-center">
                  {!isTextOnRight ? (
                    /* Step 2 Text Block on Left (with Icon on top of text) */
                    <div className="flex flex-col items-end text-right max-w-md">
                      <div className="p-3.5 rounded-2xl bg-primary-100/70 dark:bg-primary-950/50 text-primary-500 mb-4 shadow-sm inline-flex items-center justify-center">
                        <IconComponent className="w-8 h-8 stroke-[1.6]" />
                      </div>
                      <h3 className="text-2xl font-bold text-text mb-2">
                        {step.title}
                      </h3>
                      <p className="text-text-secondary text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ) : (
                    /* Step 1 & 3 Large Graphic Illustration on Left */
                    <div className="p-7 rounded-3xl bg-primary-50/60 dark:bg-primary-950/30 border-2 border-primary-200/50 dark:border-primary-800/40 text-primary-400 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <IllustrationComponent className="w-16 h-16 stroke-[1.25]" />
                    </div>
                  )}
                </div>

                {/* Center Number Badge */}
                <motion.div
                  className="absolute left-6 md:left-1/2 -translate-x-1/2 flex-shrink-0 w-11 h-11 rounded-full bg-primary-500 text-white flex items-center justify-center text-lg font-bold shadow-md z-10 ring-4 ring-bg"
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {step.number}
                </motion.div>

                {/* Desktop Right Slot / Mobile Content */}
                <div className="pl-16 md:pl-12 md:w-1/2 flex justify-start items-center">
                  {isTextOnRight ? (
                    /* Step 1 & 3 Text Block on Right (with Icon on top of text) */
                    <div className="flex flex-col items-start text-left max-w-md">
                      <div className="p-3.5 rounded-2xl bg-primary-100/70 dark:bg-primary-950/50 text-primary-500 mb-4 shadow-sm inline-flex items-center justify-center">
                        <IconComponent className="w-8 h-8 stroke-[1.6]" />
                      </div>
                      <h3 className="text-2xl font-bold text-text mb-2">
                        {step.title}
                      </h3>
                      <p className="text-text-secondary text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ) : (
                    /* Step 2 Right Slot: Desktop Illustration / Mobile Content */
                    <div className="w-full flex flex-col md:flex-row items-start md:items-center">
                      <div className="hidden md:block p-7 rounded-3xl bg-primary-50/60 dark:bg-primary-950/30 text-primary-400 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <IllustrationComponent className="w-16 h-16 stroke-[1.25]" />
                      </div>
                      {/* Mobile Content Display for Step 2 */}
                      <div className="block md:hidden flex flex-col items-start text-left max-w-md">
                        <div className="p-3.5 rounded-2xl bg-primary-100/70 dark:bg-primary-950/50 text-primary-500 mb-4 shadow-sm inline-flex items-center justify-center">
                          <IconComponent className="w-8 h-8 stroke-[1.6]" />
                        </div>
                        <h3 className="text-2xl font-bold text-text mb-2">
                          {step.title}
                        </h3>
                        <p className="text-text-secondary text-base leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HowItWorksSection;
