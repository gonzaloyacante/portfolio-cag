import { useEffect, useRef, useState } from 'react';

import { useReducedMotion } from './use-reduced-motion';

export function useCountUp(
  target: number,
  { duration = 1400, suffix = '' } = {}
): [React.RefObject<HTMLDivElement | null>, string] {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  // Always start false on both server and client to avoid a hydration
  // mismatch. The IntersectionObserver effect below flips it to true
  // when the element scrolls into view.
  const [started, setStarted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // No IntersectionObserver → render the final value directly without
    // animation. Defer the state update to a microtask so we don't
    // setState synchronously inside an effect (React 19 lint rule).
    if (typeof IntersectionObserver === 'undefined') {
      queueMicrotask(() => setStarted(true));
      return;
    }
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduced) return;
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration, reduced]);

  const display = started && reduced ? target : count;
  return [ref, `${display}${suffix}`];
}
