"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

interface Props {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

const container: Variants = {
  hidden: { opacity: 0, y: -6 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 160,
      damping: 22,
      mass: 0.8,
      when: "beforeChildren",
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: -6 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 24,
      mass: 0.75,
    },
  },
};

const LandContents = ({ children, header, footer }: Props) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col min-h-screen"
    >
      <motion.div variants={item}>{header}</motion.div>

      <motion.main variants={item} className="w-full max-w-7xl mx-auto flex-1">
        {children}
      </motion.main>

      <motion.div variants={item}>{footer}</motion.div>
    </motion.div>
  );
};

export default LandContents;
