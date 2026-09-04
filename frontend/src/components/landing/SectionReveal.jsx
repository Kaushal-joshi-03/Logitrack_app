import { motion } from "framer-motion";

const VARIANTS = {
  up: { hidden: { opacity: 0, y: 46 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } },
  left: { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } },
};

export default function SectionReveal({
  as: Tag = motion.div,
  variant = "up",
  delay = 0,
  duration = 0.65,
  amount = 0.2,
  once = true,
  className = "",
  children,
}) {
  const v = VARIANTS[variant] || VARIANTS.up;
  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={v}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}
