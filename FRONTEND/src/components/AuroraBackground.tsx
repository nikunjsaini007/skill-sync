import { useEffect, useRef } from "react";

interface AuroraBackgroundProps {
  className?: string;
}

export default function AuroraBackground({ className = "" }: AuroraBackgroundProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    const onMouse = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 30;
      ty = (e.clientY / window.innerHeight - 0.5) * 30;
    };

    const tick = () => {
      x += (tx - x) * 0.05;
      y += (ty - y) * 0.05;
      layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouse);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden will-change-transform ${className}`}
    >
      <div className="absolute -top-44 -left-44 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.4),transparent_65%)] blur-3xl animate-aurora-1" />
      <div className="absolute top-1/4 -right-48 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.35),transparent_65%)] blur-3xl animate-aurora-2" />
      <div className="absolute bottom-[-8rem] left-1/4 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.26),transparent_60%)] blur-3xl animate-aurora-3" />
      <div
        className="absolute bottom-1/3 right-1/4 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(30,58,138,0.5),transparent_70%)] blur-3xl animate-aurora-1"
        style={{ animationDuration: "26s", animationDelay: "-8s" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,transparent_50%,rgba(4,7,15,0.55)_100%)] aurora-vignette" />
    </div>
  );
}
