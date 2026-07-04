import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "glass";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={`btn btn--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </motion.button>
  );
}
