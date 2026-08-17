"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  as?: React.ElementType;
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
  className?: string;
};

/**
 * Fades/slides children in once they enter the viewport, via a single
 * IntersectionObserver per instance. Toggles the `.reveal` CSS class defined
 * in globals.css (data-visible attribute drives the transition), so there is
 * no animation library in play — just CSS transitions + this observer.
 */
export function Reveal({
  as: Component = "div",
  children,
  delay = 0,
  distance = 24,
  direction = "up",
  once = true,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Component
      ref={ref}
      data-visible={visible}
      data-direction={direction}
      className={`reveal ${className}`}
      style={{
        ["--reveal-delay" as string]: `${delay}ms`,
        ["--reveal-distance" as string]: `${distance}px`,
      }}
    >
      {children}
    </Component>
  );
}
