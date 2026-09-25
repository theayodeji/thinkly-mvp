import {
  BadgeQuestionMark,
  IdCardIcon,
  NotepadTextDashed,
  MessageSquareText,
  Mic2,
  TimerIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const features = [
  {
    icon: <NotepadTextDashed className="w-12 h-12" />,
    title: "Summarizer",
    description:
      "Get concise summaries of your Spaces and textbooks, focusing on key concepts.",
  },
  {
    icon: <BadgeQuestionMark className="w-12 h-12" />,
    title: "Quiz Generator",
    description:
      "Create custom quizzes based on your study materials to test your knowledge.",
  },
  {
    icon: <IdCardIcon className="w-12 h-12" />,
    title: "Flashcards",
    description:
      "Generate interactive flashcards for effective memorization and review.",
  },
  {
    icon: <Mic2 className="w-12 h-12" />,
    title: "Transcriber",
    description:
      "Convert lectures and discussions into text for easy Space-taking and review.",
  },
  {
    icon: <TimerIcon className="w-12 h-12" />,
    title: "Pomodoro Timer",
    description:
      "Stay focused and productive with our built-in Pomodoro timer.",
  },
  {
    icon: <MessageSquareText className="w-12 h-12" />,
    title: "Q&A Chat",
    description:
      "Get instant answers to your questions and clarify doubts with our AI chat.",
  },
];

const FeaturesSection = () => {
  return (
    <motion.section
      className="px-10 py-20 bg-bg"
      id="features"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text">
            Powerful Tools to <span className="text-primary-400">Boost </span>
            Your Learning
          </h2>
          <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
            Thinkly offers a suite of AI-powered tools to enhance your study
            experience, from summarizing complex topics to generating
            personalized quizzes.
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-bg-secondary p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              variants={item}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <div className="text-primary-400">{feature.icon}</div>
              <h3 className="text-xl font-bold text-text">{feature.title}</h3>
              <p className="text-text-secondary">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
