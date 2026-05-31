import { useEffect, useState } from "react";

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScroll = window.scrollY;

    function handleScroll() {
      const currentScroll = window.scrollY;

      if (currentScroll < 80) {
        setIsVisible(true);
      } else {
        setIsVisible(currentScroll < lastScroll);
      }

      lastScroll = currentScroll;
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isVisible;
}