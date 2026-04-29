"use client";

import React, { useCallback, useEffect, useRef } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkCount?: number;
  sparkSpread?: number;
  sparkLife?: number;
  children: React.ReactNode;
  className?: string;
}

export function ClickSpark({
  sparkColor = "#22c55e",
  sparkSize = 3,
  sparkCount = 12,
  sparkSpread = 30,
  sparkLife = 600,
  children,
  className = "",
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animationRef = useRef<number>(0);
  const sparkIdRef = useRef(0);

  const createSpark = useCallback(
    (x: number, y: number): Spark => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * sparkSpread + 2;
      return {
        id: sparkIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: sparkLife,
        maxLife: sparkLife,
        color: sparkColor,
        size: Math.random() * sparkSize + 1,
      };
    },
    [sparkColor, sparkSize, sparkSpread, sparkLife]
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create sparks
      for (let i = 0; i < sparkCount; i++) {
        sparksRef.current.push(createSpark(x, y));
      }
    },
    [sparkCount, createSpark]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw sparks
      sparksRef.current = sparksRef.current.filter((spark) => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.3; // Gravity
        spark.life -= 16; // ~60fps

        const progress = 1 - spark.life / spark.maxLife;
        const alpha = 1 - progress;
        const size = spark.size * (1 - progress * 0.5);

        if (spark.life <= 0) return false;

        // Draw spark
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = spark.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = spark.color;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Add click listener to document
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationRef.current);
    };
  }, [handleClick]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-[9999] ${className}`}
        style={{ mixBlendMode: "screen" }}
      />
      {children}
    </>
  );
}

export default ClickSpark;
