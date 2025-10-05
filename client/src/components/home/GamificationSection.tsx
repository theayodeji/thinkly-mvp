import { MedalIcon, Trophy, TrendingUpIcon } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: <MedalIcon className="w-12 h-12" />,
    title: "Medals Earned",
    value: "15"
  },
  {
    icon: <Trophy className="w-12 h-12" />,
    title: "Rewards Collected",
    value: "7"
  },
  {
    icon: <TrendingUpIcon className="w-12 h-12" />,
    title: "Progress Tracked",
    value: "90%"
  }
];

const GamificationSection = () => {
  return (
    <motion.section 
      className="px-10 py-20 bg-bg" 
      id="gamification"
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
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
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
          <h2 className="text-4xl md:text-5xl font-bold text-primary-400 tracking-tight mb-4">
            Make Learning Fun
          </h2>
          <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto mb-12">
            Earn medals, collect rewards, and track your progress. Our
            gamified experience keeps you motivated and engaged.
          </p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px 0px -100px 0px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2
              }
            }
          }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className={`flex flex-col items-center gap-4 rounded-2xl p-8 ${
                index % 2 === 0 
                  ? 'bg-gradient-to-br from-secondary-400 to-secondary-500'
                  : 'bg-gradient-to-br from-primary-400 to-primary-500'
              } text-white shadow-lg`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { 
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1]
                } 
              }}
              whileHover={{ 
                y: -5,
                transition: { 
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                } 
              }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                whileInView={{ 
                  scale: 1, 
                  rotate: 0,
                  transition: { 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 10
                  } 
                }}
                viewport={{ once: true }}
              >
                {stat.icon}
              </motion.div>
              <p className="text-2xl font-bold">{stat.title}</p>
              <p className="text-5xl font-black">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default GamificationSection;
