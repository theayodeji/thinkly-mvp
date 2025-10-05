import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah K.",
    role: "University Student",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwLJ-BDo59qcT0-r0OXwT3IZQiKWHTyFj_ju04tR7fWPgsfBrIaNQu58x5P27cEFpjEp_Pr87iy0lG9n0IbCfXGIA6IN4z7pnwnLh6QERVgLqgB8EolyFRXvxGf7dnf_KXUTXfNDjKJhLey9_Qj6RkJ4gl090VOksqKN5bIoMQUifFy6euqfy-oUWboB3LxuDx_gXzcfweEi9xsqXH5m4lY-URvHjumqzKrff-fmbM_vxNGfQeE_1pLdCHiKpqV8BEuztzi6eJV1I",
    content: "Thinkly has revolutionized my study routine. The summarizer helps me grasp key concepts quickly, and the quiz generator is perfect for self-testing."
  },
  {
    name: "David L.",
    role: "College Student",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsiQEJqIyCYvHwmr24KwXblFufNtTKOD3Z-WzGKNOsUiEnR-vV1jAtwRQpBZWKS_RTIakvtEbZgc4vznFIsc3bYNx3cGHjRvsywdkWTK-6mKuNGqfAua6W3J_kLGUGP73jpLNqQmS8P2WTqiM4eLIaSPcm5d9ggt13IDDhb3F7xY_R9qK9tp36tyI2stct46L7poksJ-8FjNWI4Zvkk9c_5apkIZSaVduhq6LmDQziinjW0hw-562iBLZSrdfI9T9VJLnDo63R-0s",
    content: "I love the flashcards feature! It's so much more engaging than traditional methods, and I've seen a significant improvement in my retention."
  },
  {
    name: "Emily R.",
    role: "High School Student",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx0D_Y4r7KrCy4GSgk0PPts9B0TNQGvR1K3r9U2BnSbrtiOGOtugGvuysw9ySY4Jcfk5RXxOFBwOQACGBkYr570jI6AW0Ai8-oZtmcpvZFuRSkKt0QsP1pKV7_WTdDhyyQ1ewteJPivd5Owgjkg-FC7FAUDZMwnz7KHLUG10lUZ-BD-fKZEZKi7D0UYQU809Z1w9x1td2Myfc0l_yuXwWTJYW28Sit3O0pFNm4D-CC0iMcKK4C_KMf3qBA447vmxkOeDeSl5_o5og",
    content: "The Pomodoro timer keeps me focused, and the Q&A chat is a lifesaver when I'm stuck on a problem. Thinkly is a game-changer!"
  }
];

const TestimonialsSection = () => {
  return (
    <motion.section 
      className="px-10 py-20 bg-bg-secondary" 
      id="testimonials"
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
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
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
          <h2 className="text-4xl md:text-5xl font-bold text-primary-400 tracking-tight">
            What Our Students Say
          </h2>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
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
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col gap-6 rounded-2xl bg-bg border border-border p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
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
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    delay: 0.2,
                    duration: 0.5
                  } 
                }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="size-16 rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${testimonial.image}')`,
                  }}
                  initial={{ scale: 0.9 }}
                  whileInView={{ 
                    scale: 1,
                    transition: { 
                      type: "spring",
                      stiffness: 200,
                      damping: 10
                    } 
                  }}
                  viewport={{ once: true }}
                />
                <div>
                  <p className="font-bold text-text">{testimonial.name}</p>
                  <p className="text-sm text-text-secondary">{testimonial.role}</p>
                </div>
              </motion.div>
              <motion.p 
                className="text-text-secondary"
                initial={{ opacity: 0 }}
                whileInView={{ 
                  opacity: 1,
                  transition: { 
                    delay: 0.3,
                    duration: 0.5
                  } 
                }}
                viewport={{ once: true }}
              >
                "{testimonial.content}"
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
