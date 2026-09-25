import React from "react";
import { LazyImage } from "../../components/ui/LazyImage";
import LoginForm from "../../components/auth/LoginForm";
import { AnimatePresence, motion } from "framer-motion";

const Login = () => {
  const variants = {
    initial: {
      opacity: 0,
      y: 30,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="w-full h-screen min-h-[500px] p-8 md:p-2 flex items-stretch">
      <div className="hidden w-1/3 md:flex justify-center h-full bg-gradient-to-b from-primary-500 to-primary-600 rounded-lg items-stretch relative">
        <img
          src="/thinkly-light.png"
          alt="Thinkly"
          className="w-24 absolute top-2 left-0 p-2"
        />
        <AnimatePresence>
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-[280px] flex flex-col items-center text-center absolute top-22 left-1/2 transform -translate-x-1/2 -translate-y-0"
          >
            <h1 className="text-white text-4xl font-bold">
              No More Abstract Notes
            </h1>
            <p className="text-white text-sm">
              Assimilate your Class Notes better in minutes and ask anything about
              them
            </p>
          </motion.div>
        </AnimatePresence>
        <LazyImage
          src="/student.png"
          alt="Student"
          className="w-full h-full object-cover"
        />
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
