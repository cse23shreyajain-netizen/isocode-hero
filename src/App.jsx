
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import blueCar from "./assets/blue-car.png";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const statistics = [
  {
    value: "58%",
    label: "Increase in pick up point use",
    style: "stat-cyan",
  },
  {
    value: "27%",
    label: "Increase in pick up point use",
    style: "stat-navy",
  },
  {
    value: "23%",
    label: "Decrease in customer phone calls",
    style: "stat-blue",
  },
  {
    value: "40%",
    label: "Decrease in customer phone calls",
    style: "stat-purple",
  },
];

function App() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const carRef = useRef(null);
  const gradientRef = useRef(null);
  const cardRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const strip = section?.querySelector(".hero-strip");
    const headline = headlineRef.current;
    const car = carRef.current;
    const gradient = gradientRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!section || !strip || !headline || !car || !gradient) {
      return undefined;
    }

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.set(headline, {
        opacity: 0,
        y: 18,
        clipPath: "inset(0 100% 0 0)",
      });

      gsap.set(gradient, {
        clipPath: "inset(0 100% 0 0)",
      });

      gsap.set(car, { x: 0 });

      // Cards remain hidden until scrolling reveals them.
      gsap.set(cards, {
        autoAlpha: 0,
        y: 14,
      });

      // Initial intro animation for the headline only.
      gsap.timeline({
        defaults: { ease: "power2.out" },
      }).to(headline, {
        opacity: 1,
        y: 0,
        duration: reducedMotion ? 0.01 : 0.7,
      });

      // Keep the car's ending position partly beyond the right edge.
      const getCarTravel = () => {
        const stripWidth = strip.clientWidth;
        const carWidth = car.getBoundingClientRect().width;

        return Math.max(0, stripWidth - carWidth * 0.55);
      };

      // Main scroll-driven timeline.
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=220%",
          scrub: reducedMotion ? false : 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      scrollTimeline.to(
        gradient,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          ease: "none",
        },
        0
      );

      scrollTimeline.to(
        headline,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          ease: "none",
        },
        0
      );

      scrollTimeline.to(
        car,
        {
          x: getCarTravel,
          duration: 1,
          ease: "none",
        },
        0
      );

      // Cards appear sequentially and reverse with scroll.
      cards.forEach((card, index) => {
        scrollTimeline.to(
          card,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.14,
            ease: "power1.out",
          },
          0.12 + index * 0.2
        );
      });

      if (car.complete) {
        ScrollTrigger.refresh();
      } else {
        car.addEventListener("load", () => ScrollTrigger.refresh(), {
          once: true,
        });
      }
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <main>
      <section
        className="animation-section"
        ref={sectionRef}
        aria-label="Scroll-driven car animation"
      >
    <div className="animation-stage container-fluid px-3">
          <div className="stats-row stats-top">
            {statistics.slice(0, 2).map((stat, index) => (
              <article
                className={`stat-card ${stat.style}`}
                key={stat.value}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
              >
                <div className="stat-value">{stat.value}</div>
                <p className="stat-label">{stat.label}</p>
              </article>
            ))}
          </div>

          <div className="hero-strip">
            <div className="hero-gradient" ref={gradientRef} />

            <h1 className="hero-headline" ref={headlineRef}>
              WELCOMEITZFIZZ
            </h1>

            <img
              className="hero-car"
              ref={carRef}
              src={blueCar}
              alt="Blue sports car viewed from above"
              draggable="false"
            />
          </div>

          <div className="stats-row stats-bottom">
            {statistics.slice(2).map((stat, index) => (
              <article
                className={`stat-card ${stat.style}`}
                key={stat.value}
                ref={(element) => {
                  cardRefs.current[index + 2] = element;
                }}
              >
                <div className="stat-value">{stat.value}</div>
                <p className="stat-label">{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
