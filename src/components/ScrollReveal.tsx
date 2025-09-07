import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  rotationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0,
  baseRotation = 2,
  blurStrength = 8,
  containerClassName = '',
  rotationEnd = 'top center',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    gsap.from(el, {
      opacity: baseOpacity,
      rotationX: baseRotation,
      y: 50,
      filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top bottom-=100',
        toggleActions: 'play none none none',
      }
    });

    return () => {
      const triggers = gsap.getTweensOf(el);
      triggers.forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, blurStrength]);

  return (
    <div ref={containerRef} className={containerClassName}>
      {children}
    </div>
  );
};

export default ScrollReveal;