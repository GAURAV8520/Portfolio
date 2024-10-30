"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavItem {
  name: string;
  link: string;
  icon?: JSX.Element;
}

interface FloatingNavProps {
  navItems: NavItem[];
  className?: string;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  navItems,
  className,
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Using null coalescing to handle potential undefined values
    const previousScroll = scrollYProgress.getPrevious() ?? 0;
    const currentScroll = current ?? 0;
    const direction = currentScroll - previousScroll;

    if (currentScroll < 0.05) {
      setVisible(false);
    } else {
      setVisible(direction < 0);
    }
  });

  const motionVariants = {
    initial: {
      opacity: 1,
      y: -100,
    },
    animate: (isVisible: boolean) => ({
      y: isVisible ? 0 : -100,
      opacity: isVisible ? 1 : 0,
    }),
    transition: {
      duration: 0.2,
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={motionVariants.initial}
        animate={motionVariants.animate(visible)}
        transition={motionVariants.transition}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent",
          "rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",
          "z-[5000] px-10 py-5 items-center justify-center space-x-4",
          "border-white/[0.2] bg-black-100",
          className
        )}
      >
        {navItems.map((navItem: NavItem, idx: number) => (
          <Link
            key={`nav-item-${idx}`}
            href={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1",
              "text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            {navItem.icon && (
              <span className="block sm:hidden">{navItem.icon}</span>
            )}
            <span className="text-sm cursor-pointer">{navItem.name}</span>
          </Link>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};