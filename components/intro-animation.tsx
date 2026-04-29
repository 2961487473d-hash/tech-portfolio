"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Logo } from "./logo";

interface IntroAnimationProps {
  onPhaseChange?: (phase: AnimationPhase) => void;
}

export type AnimationPhase = 
  | "booting" 
  | "logo-scale" 
  | "logo-transition" 
  | "particles-start" 
  | "content-reveal" 
  | "complete";

// 动画时间配置（毫秒）
const ANIMATION_CONFIG = {
  bootSequenceDuration: 1500,    // 启动序列总时长
  logoScaleDuration: 1200,       // Logo放大展示时长
  logoTransitionDuration: 1200,  // Logo移动到导航栏时长
  particlesFadeInDuration: 400,  // 粒子淡入时长
  contentStaggerDelay: 100,      // 内容层级间隔
  contentRevealDuration: 600,    // 内容展现时长
};

export function IntroAnimation({ onPhaseChange }: IntroAnimationProps) {
  const [phase, setPhase] = useState<AnimationPhase>("booting");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0, scale: 1, opacity: 1 });
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const animationFrameRef = useRef<number>(0);
  const phaseStartTimeRef = useRef<number>(0);

  const bootSequence = [
    { text: "正在初始化 DJW.TERMINAL v2.0.26...", delay: 100 },
    { text: "[OK] 加载核心模块", delay: 180 },
    { text: "[OK] 建立神经连接", delay: 150 },
    { text: "[OK] 校准 AI 系统", delay: 170 },
    { text: "[OK] 挂载可视化引擎", delay: 140 },
    { text: "[OK] 初始化 WebGL 上下文", delay: 190 },
    { text: "[OK] 加载粒子系统", delay: 160 },
    { text: "[OK] 建立安全连接", delay: 170 },
    { text: "系统就绪。", delay: 250 },
  ];

  // 通知父组件阶段变化
  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  // Phase 1: 启动序列动画
  useEffect(() => {
    if (phase !== "booting") return;
    
    let currentIndex = 0;
    const lines: string[] = [];
    const startTime = performance.now();

    const addLine = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      
      if (currentIndex < bootSequence.length) {
        const expectedTime = bootSequence.slice(0, currentIndex + 1)
          .reduce((sum, item) => sum + item.delay, 0);
        
        if (elapsed >= expectedTime) {
          lines.push(bootSequence[currentIndex].text);
          setBootLines([...lines]);
          currentIndex++;
        }
        animationFrameRef.current = requestAnimationFrame(addLine);
      } else {
        // 启动序列完成，进入下一阶段
        setTimeout(() => setPhase("logo-scale"), 200);
      }
    };

    animationFrameRef.current = requestAnimationFrame(addLine);
    
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [phase]);

  // Phase 2: Logo 放大展示
  useEffect(() => {
    if (phase !== "logo-scale") return;
    
    phaseStartTimeRef.current = performance.now();
    
    const timer = setTimeout(() => {
      setPhase("logo-transition");
    }, ANIMATION_CONFIG.logoScaleDuration);
    
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 3: Logo 移动到导航栏位置
  useEffect(() => {
    if (phase !== "logo-transition") return;
    
    phaseStartTimeRef.current = performance.now();
    
    const animateLogo = (timestamp: number) => {
      const elapsed = timestamp - phaseStartTimeRef.current;
      const progress = Math.min(elapsed / ANIMATION_CONFIG.logoTransitionDuration, 1);
      
      // ease-out-cubic 缓动
      const eased = 1 - Math.pow(1 - progress, 3);
      
      // Logo 从中心移动到左上角（调整位置避免过度偏移）
      const startX = 0, startY = 0, startScale = 1;
      // 计算到导航栏的相对位置（vw/vh 单位）
      const endX = -35, endY = -35, endScale = 0.42;
      
      // 在动画后半段开始淡出 Logo
      let logoOpacity = 1;
      if (progress > 0.7) {
        logoOpacity = 1 - (progress - 0.7) * 3.33;
        if (logoOpacity < 0) logoOpacity = 0;
      }
      
      setLogoPosition({
        x: startX + (endX - startX) * eased,
        y: startY + (endY - startY) * eased,
        scale: startScale + (endScale - startScale) * eased,
        opacity: logoOpacity,
      });
      
      // 在动画后半段开始淡出遮罩
      if (progress > 0.6) {
        const fadeProgress = (progress - 0.6) * 2.5;
        setOverlayOpacity(1 - fadeProgress);
      }
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateLogo);
      } else {
        // Logo 到位，立即启动粒子
        setOverlayOpacity(0);
        setPhase("particles-start");
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animateLogo);
    
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [phase]);

  // Phase 4: 粒子系统启动
  useEffect(() => {
    if (phase !== "particles-start") return;
    
    // 粒子立即启动，然后进入内容展现阶段
    setTimeout(() => {
      setPhase("content-reveal");
    }, ANIMATION_CONFIG.particlesFadeInDuration);
  }, [phase]);

  // Phase 5: 内容展现
  useEffect(() => {
    if (phase !== "content-reveal") return;
    
    // 内容展现完成后标记动画结束
    const totalRevealTime = ANIMATION_CONFIG.contentRevealDuration + 
                           (ANIMATION_CONFIG.contentStaggerDelay * 3);
    
    setTimeout(() => {
      setPhase("complete");
    }, totalRevealTime);
  }, [phase]);

  // 清理
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  if (phase === "complete") return null;

  const isTransitioning = phase === "logo-transition" || phase === "particles-start" || phase === "content-reveal";

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
        transition: isTransitioning ? 'none' : 'background-color 0.3s ease-out',
      }}
    >
      {/* Boot sequence text */}
      <div
        className={`absolute left-8 top-1/2 -translate-y-1/2 font-mono text-xs md:text-sm space-y-1 transition-all duration-300 ${
          phase === "booting" ? "opacity-100" : "opacity-0 -translate-x-4"
        }`}
      >
        {bootLines.map((line, index) => (
          <div
            key={index}
            className={`${
              line.includes("OK") ? "text-green-500" : line.includes("READY") ? "text-primary" : "text-foreground/60"
            }`}
            style={{
              opacity: 0,
              animation: "fadeInLeft 0.2s ease-out forwards",
              animationDelay: `${index * 0.03}s`,
            }}
          >
            {line.includes("OK") && <span className="inline-block w-4">→</span>}
            {line}
          </div>
        ))}
        {phase === "booting" && (
          <div className="text-primary animate-pulse mt-4">_</div>
        )}
      </div>

      {/* Center Logo */}
      <div
        className={`transition-transform will-change-transform ${
          phase === "booting" ? "opacity-0 scale-50" : ""
        }`}
        style={{
          transform: isTransitioning 
            ? `translate(${logoPosition.x}vw, ${logoPosition.y}vh) scale(${logoPosition.scale})`
            : phase === "booting" ? 'scale(0.5)' : 'scale(1)',
          opacity: isTransitioning ? logoPosition.opacity : phase === "booting" ? 0 : 1,
          transition: isTransitioning ? 'none' : 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Logo
          className={`transition-all duration-700 will-change-transform ${
            phase === "logo-scale" || phase === "booting" 
              ? "w-[280px] md:w-[380px]" 
              : "w-[140px] md:w-[170px]"
          }`}
        />
      </div>

      {/* Progress bar - 仅在 booting 阶段显示 */}
      {phase === "booting" && (
        <>
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-border/30 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200 ease-out"
              style={{ width: `${(bootLines.length / bootSequence.length) * 100}%` }}
            />
          </div>
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 font-mono text-xs text-foreground/40">
            {Math.round((bootLines.length / bootSequence.length) * 100)}%
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export { ANIMATION_CONFIG };
