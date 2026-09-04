import { motion } from "framer-motion";

export default function ScrollProgressBar({ progress }) {
  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <motion.div
        className="scroll-progress-fill"
        style={{ scaleX: progress }}
      />
    </div>
  );
}
