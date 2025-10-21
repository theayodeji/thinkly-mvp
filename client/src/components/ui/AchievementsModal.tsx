import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from "@headlessui/react";
import StreakSection from "./StreakSection";
import { motion } from "framer-motion";
import AchievementBadges from "./AchievementBadges";
import { useAuth } from "../../hooks/useAuth";

export const AchievementsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {

  const {user} = useAuth()

  return (
    <Dialog onClose={onClose} open={isOpen} className="relative z-50">
      <DialogPanel className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogBackdrop
          className="fixed inset-0 bg-black/30 transition-all duration-300 transition-discrete"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white dark:bg-bg-secondary p-4 rounded-md shadow-lg drop-shadow-xl w-[95%] max-w-[500px] z-100"
        >
          <DialogTitle className="text-2xl font-bold mb-4">Streaks & <span className="text-primary-400">Achievements</span></DialogTitle>
          <StreakSection streak={user?.streaks?.current || 0} longest={user?.streaks?.longest || 0} />
          <AchievementBadges />
        </motion.div>
      </DialogPanel>
    </Dialog>
  );
};
