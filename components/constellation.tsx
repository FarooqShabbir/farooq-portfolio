"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; label?: string };
type Packet = { a: number; b: number; t: number; speed: number; hops: number; color: string };
type Ring = { x: number; y: number; t: number };

const LABELS = ["api", "postgres", "redis", "llm", "agent", "alb", "s3", "ci", "edge", "queue"];
const SUNSET = "255,122,23";
const COLORS = ["#ff7a17", "#ffc285", "#c4b5fd", "#a0c3ec"];

/**
 * The hero's living infrastructure map: service nodes drift and link up when close,
 * packets of traffic hop between them, the pointer bends the field and lights nearby links,
 * and a click sends a burst of requests out from the nearest service.
 * Pauses offscreen and when the tab is hidden; draws one still frame under reduced motion.
 */
export function Constellation({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim();
    const font = `10px ${mono ? `${mono}, ` : ""}ui-monospace, monospace`;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let rings: Ring[] = [];
    let link = 150;
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let running = false;
    let last = performance.now();
    let spawnClock = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, Math.max(36, (w * h) / 13000)));
      link = w < 640 ? 110 : 160;
      nodes = Array.from({ length: count }, (_, i) => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x,
          y,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          label: i < LABELS.length ? LABELS[i] : undefined,
        };
      });
      packets = [];
    };

    const neighbours = (i: number) => {
      const out: number[] = [];
      const n = nodes[i];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const dx = nodes[j].x - n.x;
        const dy = nodes[j].y - n.y;
        if (dx * dx + dy * dy < link * link) out.push(j);
      }
      return out;
    };

    const spawn = (from?: number, color?: string) => {
      const a = from ?? Math.floor(Math.random() * nodes.length);
      const ns = neighbours(a);
      if (!ns.length) return;
      const b = ns[Math.floor(Math.random() * ns.length)];
      packets.push({
        a,
        b,
        t: 0,
        speed: 0.9 + Math.random() * 0.9,
        hops: 2 + Math.floor(Math.random() * 4),
        color: color ?? COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    };

    const step = (dt: number) => {
      for (const n of nodes) {
        n.x += n.vx * dt * 60;
        n.y += n.vy * dt * 60;
        if (n.x < -20 || n.x > w + 20) n.vx *= -1;
        if (n.y < -20 || n.y > h + 20) n.vy *= -1;
        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 170 * 170 && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = (1 - d / 170) * 1.4;
            n.x += (dx / d) * f;
            n.y += (dy / d) * f;
          }
        }
      }
      spawnClock += dt;
      while (spawnClock > 0.09) {
        spawnClock -= 0.09;
        if (packets.length < 70) spawn();
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += dt * p.speed;
        if (p.t >= 1) {
          if (p.hops > 0) {
            const ns = neighbours(p.b).filter((j) => j !== p.a);
            if (ns.length) {
              p.a = p.b;
              p.b = ns[Math.floor(Math.random() * ns.length)];
              p.t = 0;
              p.hops--;
              continue;
            }
          }
          packets.splice(i, 1);
        }
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        rings[i].t += dt;
        if (rings[i].t > 1.2) rings.splice(i, 1);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // Links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > link * link) continue;
          const k = 1 - Math.sqrt(d2) / link;
          let lit = 0;
          if (mouse.active) {
            const mx = (a.x + b.x) / 2 - mouse.x;
            const my = (a.y + b.y) / 2 - mouse.y;
            lit = Math.max(0, 1 - Math.sqrt(mx * mx + my * my) / 220);
          }
          ctx.strokeStyle = lit > 0.02 ? `rgba(${SUNSET},${(k * 0.55 * lit + k * 0.1).toFixed(3)})` : `rgba(255,255,255,${(k * 0.11).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      // Pointer links
      if (mouse.active) {
        for (const n of nodes) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > 200) continue;
          ctx.strokeStyle = `rgba(${SUNSET},${((1 - d / 200) * 0.5).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }
      // Nodes
      ctx.font = font;
      for (const n of nodes) {
        if (n.label) {
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.18)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "rgba(161,165,171,0.75)";
          ctx.fillText(n.label.toUpperCase(), n.x + 10, n.y + 3.5);
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.35)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // Packets with a short trail
      for (const p of packets) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const tt = Math.max(0, p.t - 0.22);
        const tx = a.x + (b.x - a.x) * tt;
        const ty = a.y + (b.y - a.y) * tt;
        const g = ctx.createLinearGradient(tx, ty, x, y);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, p.color);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      // Click bursts
      for (const r of rings) {
        const k = r.t / 1.2;
        ctx.strokeStyle = `rgba(${SUNSET},${(1 - k) * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 8 + k * 160, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    build();
    if (reduce) {
      // A still map: spread a few packets mid-flight so the frame still reads as live traffic.
      for (let i = 0; i < 30; i++) spawn();
      packets.forEach((p) => (p.t = Math.random()));
      draw();
    }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()));
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    // The hero copy sits above the canvas, so listen on the window and test against the canvas box.
    const inside = (r: DOMRect, x: number, y: number) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = e.pointerType === "mouse" && inside(r, e.clientX, e.clientY);
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!inside(r, e.clientX, e.clientY) || (e.target as Element).closest("a, button, input, textarea")) return;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      rings.push({ x, y, t: 0 });
      let best = 0;
      let bd = Infinity;
      nodes.forEach((n, i) => {
        const d = (n.x - x) ** 2 + (n.y - y) ** 2;
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      for (let i = 0; i < 14; i++) spawn(best, "#ff7a17");
      if (reduce) draw();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("click", onClick);

    let resizeT: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        build();
        if (reduce) draw();
      }, 120);
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`block h-full w-full ${className}`} />;
}
