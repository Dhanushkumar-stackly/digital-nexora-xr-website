import { RefObject, useEffect, useState } from "react";

// True once the element comes within `margin` of the viewport; stays true afterwards.
export const useNearViewport = (ref: RefObject<Element>, margin = "400px") => {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin, near]);

  return near;
};
