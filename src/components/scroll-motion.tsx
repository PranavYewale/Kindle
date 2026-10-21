import { useEffect } from "react";

/** Native scroll motion: no scroll interception or React renders per frame. */
export function useScrollMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};
    const setup = () => {
      dispose();
      if (preference.matches) return;
      const root = document.documentElement;
      const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .scroll-title"));
      reveals.forEach((element) => {
        const siblings = Array.from(element.parentElement?.children ?? []).filter((child) => child.matches(".reveal"));
        element.style.setProperty("--reveal-delay", `${Math.max(0, siblings.indexOf(element)) % 4 * 90}ms`);
      });
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
      reveals.forEach((element) => observer.observe(element));
      const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-scene]"));
      const drifts = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-drift]"));
      const timeline = document.querySelector<HTMLElement>(".scroll-timeline");
      let frame = 0;
      let positions: { element: HTMLElement; top: number; height: number; kind: string }[] = [];
      const measure = () => {
        positions = [...scenes, ...drifts, ...(timeline ? [timeline] : [])].map((element) => {
          const rect = element.getBoundingClientRect();
          return { element, top: rect.top + window.scrollY, height: rect.height, kind: element.hasAttribute("data-scroll-scene") ? "scene" : element.hasAttribute("data-scroll-drift") ? "drift" : "timeline" };
        });
      };
      const update = () => {
        frame = 0;
        const y = window.scrollY;
        const height = window.innerHeight;
        const maxScroll = root.scrollHeight - height;
        root.style.setProperty("--page-progress", `${maxScroll > 0 ? y / maxScroll : 0}`);
        positions.forEach(({ element, top, height: elementHeight, kind }) => {
          if (top > y + height + 150 || top + elementHeight < y - 150) return;
          const progress = Math.min(1, Math.max(0, (y + height - top) / (height * 0.85)));
          if (kind === "scene") element.style.setProperty("--scene-progress", `${progress}`);
          if (kind === "drift") element.style.setProperty("--scroll-drift", `${(progress - 0.5) * 100}px`);
          if (kind === "timeline") element.style.setProperty("--timeline-progress", `${Math.min(1, Math.max(0, (y + height * 0.7 - top) / elementHeight))}`);
        });
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
      const resize = () => { measure(); schedule(); };
      measure();
      update();
      root.dataset["scrollMotion"] = "on";
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", resize);
      const sizeObserver = new ResizeObserver(resize);
      sizeObserver.observe(document.body);
      dispose = () => {
        observer.disconnect();
        sizeObserver.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", resize);
        delete root.dataset["scrollMotion"];
        root.style.removeProperty("--page-progress");
      };
    };
    setup();
    preference.addEventListener("change", setup);
    return () => { dispose(); preference.removeEventListener("change", setup); };
  }, []);
}

export function ScrollHeading({ children, className = "" }: { children: string; className?: string }) {
  return (
    <h2 className={`scroll-title ${className}`} aria-label={children}>
      {children.split(" ").map((word, index) => (
        <span className="word-mask" aria-hidden="true" key={`${index}-${word}`}>
          <span className={`word-rise word-step-${index % 6}`}>{word}</span>{" "}
        </span>
      ))}
    </h2>
  );
}