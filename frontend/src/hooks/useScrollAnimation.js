import { useEffect, useRef } from 'react';

/**
 * Custom hook for triggering animations when elements scroll into view
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection Observer threshold (0-1), default 0.1
 * @param {string} options.animationClass - CSS animation class to add, default 'animate-fadeInUp'
 * @param {boolean} options.repeat - Whether animation repeats, default false
 * @returns {Object} - { ref: element reference to attach to DOM }
 */
export const useScrollAnimation = ({
  threshold = 0.1,
  animationClass = 'animate-fadeInUp',
  repeat = false,
} = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add animation class when element enters viewport
          entry.target.classList.add(animationClass);

          // Stop observing if not repeat mode
          if (!repeat) {
            observer.unobserve(entry.target);
          } else {
            // Optional: remove class when leaving viewport for repeat effect
            entry.target.classList.remove(animationClass);
          }
        } else if (repeat) {
          // Remove animation when leaving viewport (for repeat mode)
          entry.target.classList.remove(animationClass);
        }
      },
      {
        threshold: threshold,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before fully visible
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, animationClass, repeat]);

  return { ref };
};

/**
 * Custom hook for staggered animations on multiple elements
 * @param {Object} options - Configuration options
 * @param {number} options.staggerDelay - Delay between items in ms, default 100
 * @param {string} options.animationClass - CSS animation class, default 'animate-fadeInUp'
 * @returns {Object} - { ref: container reference, getItemRef: function for individual items }
 */
export const useStaggeredAnimation = ({
  staggerDelay = 100,
  animationClass = 'animate-fadeInUp',
} = {}) => {
  const ref = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate items with stagger effect
          itemRefs.current.forEach((item, index) => {
            if (item) {
              setTimeout(() => {
                item.classList.add(animationClass);
              }, index * staggerDelay);
            }
          });

          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animationClass, staggerDelay]);

  const getItemRef = (index) => (el) => {
    if (el) {
      itemRefs.current[index] = el;
    }
  };

  return { ref, getItemRef };
};
