import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { spaceService } from "../../shared/services/spaceService";
import { useAuth } from "../../hooks/useAuth";
import { Sparkles } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const handleStartGuestTrial = async () => {
    if (user) {
      navigate("/dashboard");
      return;
    }
    try {
      setIsCreating(true);
      const newSpace = await spaceService.createSpace();
      navigate(`/spaces/${newSpace._id}`);
    } catch (error) {
      console.error("Failed to start guest trial:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="px-4 sm:px-6 py-6 sm:py-10 md:py-16 flex flex-col justify-center items-center w-full max-w-7xl mx-auto overflow-hidden"
      id="hero"
    >
      <motion.div
        className="flex flex-col items-center text-center max-w-4xl w-full gap-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Top Tagline Badge */}
        <motion.div
          variants={item}
          className="text-primary-500 dark:text-primary-300 font-semibold"
        >
          <span>Next-Gen AI Learning Workspace</span>
        </motion.div>

        {/* Creative Main Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-text leading-[1.15]"
          variants={item}
        >
          Turn Any Material Into <br className="hidden sm:block" />
          <span className="text-primary-500 dark:text-primary-400">
            Mastery in Minutes.
          </span>
        </motion.h1>

        {/* Creative Subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl font-normal leading-relaxed"
          variants={item}
        >
          Upload your PDFs, slides, or notes. Thinkly instantly transforms your
          study materials into interactive learning paths, active-recall
          flashcards, and 24/7 AI tutoring.
        </motion.p>

        {/* Action Buttons & Social Proof Row */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-6 mt-4 w-full flex-wrap"
          variants={item}
        >
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Button
              size="lg"
              onClick={handleStartGuestTrial}
              loading={isCreating}
              disabled={isCreating}
              className="btn-3d-primary font-bold px-6 py-3 rounded-full text-base shadow-lg"
            >
              {user ? "Go to Dashboard" : "Try Now (No Sign-in)"}
            </Button>
            {!user && (
              <Button
                size="lg"
                variant="neutral"
                className="glass-panel hover:bg-white/20 dark:hover:bg-slate-800/40 font-semibold rounded-full px-6 py-3 border border-text/10"
              >
                <Link
                  to="/auth/register"
                  className="w-full h-full flex items-center justify-center gap-2 text-text font-medium"
                >
                  Sign Up Free
                </Link>
              </Button>
            )}
          </div>
        </motion.div>

        {/* 3 Rotated & Perspective Portrait Cards */}
        <motion.div
          className="flex flex-row justify-center items-center -space-x-10 sm:-space-x-14 md:space-x-0 md:grid md:grid-cols-3 gap-0 md:gap-6 mt-10 md:mt-12 w-full max-w-[340px] sm:max-w-[440px] md:max-w-5xl mx-auto px-4"
          variants={item}
        >
          {/* Card 1: Deep Royal Blue (Left Flourish Card - student-2.png) */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -12 }}
            whileInView={{ opacity: 1, y: 0, rotate: -10 }}
            whileHover={{ rotate: 0, scale: 1.1, zIndex: 30, y: -8 }}
            transition={{ duration: 0.3 }}
            className="relative w-[115px] sm:w-[155px] md:w-full aspect-[3/4] max-h-[220px] sm:max-h-[280px] md:max-h-none rounded-2xl md:rounded-3xl p-2.5 sm:p-3 md:p-4 bg-gradient-to-b from-blue-700 via-indigo-600 to-blue-800 shadow-xl md:shadow-2xl overflow-hidden flex flex-col justify-end items-center border-2 border-white/30 transform -rotate-10 md:-rotate-6 z-10 origin-bottom-right transition-all duration-300 flex-shrink-0"
          >
            {/* Phone Silhouette Frame inside */}
            <div className="absolute inset-x-3 md:inset-x-5 top-3 md:top-5 bottom-2 md:bottom-3 border-2 border-white/30 rounded-[1.2rem] md:rounded-[2.2rem] pointer-events-none" />
            <img
              src="/student-2.png"
              alt="Student preparing for exam"
              className="relative z-10 w-full h-full object-contain max-h-[88%] drop-shadow-2xl translate-y-2 md:translate-y-11 scale-125"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80";
              }}
            />
          </motion.div>

          {/* Card 2: Signature Primary Blue (Center Card - student2.png) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: -6 }}
            whileHover={{ scale: 1.1, zIndex: 30, y: -16 }}
            transition={{ duration: 0.3 }}
            className="relative w-[130px] sm:w-[175px] md:w-full aspect-[3/4] max-h-[245px] sm:max-h-[305px] md:max-h-none rounded-2xl md:rounded-3xl p-2.5 sm:p-3 md:p-4 bg-gradient-to-b from-primary-500 via-blue-500 to-primary-600 shadow-2xl overflow-hidden flex flex-col justify-end items-center border-2 border-white/30 z-20 md:-translate-y-4 scale-105 md:scale-100 transition-all duration-300 flex-shrink-0"
          >
            {/* Phone Silhouette Frame inside */}
            <div className="absolute inset-x-3 md:inset-x-5 top-3 md:top-5 bottom-2 md:bottom-3 border-2 border-white/30 rounded-[1.2rem] md:rounded-[2.2rem] pointer-events-none" />
            <img
              src="/student2.png"
              alt="Student with study materials"
              className="relative z-10 w-full h-full object-contain max-h-[88%] drop-shadow-2xl translate-y-2 md:translate-y-3 scale-130"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80";
              }}
            />
          </motion.div>

          {/* Card 3: Bright Sky Primary Blue (Right Flourish Card - student-3.png) */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 12 }}
            whileInView={{ opacity: 1, y: 0, rotate: 10 }}
            whileHover={{ rotate: 0, scale: 1.1, zIndex: 30, y: -8 }}
            transition={{ duration: 0.3 }}
            className="relative w-[115px] sm:w-[155px] md:w-full aspect-[3/4] max-h-[220px] sm:max-h-[280px] md:max-h-none rounded-2xl md:rounded-3xl p-2.5 sm:p-3 md:p-4 bg-gradient-to-b from-primary-400 via-sky-400 to-blue-500 shadow-xl md:shadow-2xl overflow-hidden flex flex-col justify-end items-center border-2 border-white/30 transform rotate-10 md:rotate-6 z-10 origin-bottom-left transition-all duration-300 flex-shrink-0"
          >
            {/* Phone Silhouette Frame inside */}
            <div className="absolute inset-x-3 md:inset-x-5 top-3 md:top-5 bottom-2 md:bottom-3 border-2 border-white/30 rounded-[1.2rem] md:rounded-[2.2rem] pointer-events-none" />
            <img
              src="/student-3.png"
              alt="Student celebrating learning progress"
              className="relative z-10 w-full h-full object-contain max-h-[88%] drop-shadow-2xl translate-y-2 md:translate-y-11 scale-135"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80";
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
