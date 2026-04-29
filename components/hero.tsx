"use client";

import Link from "next/link";
import { Pill } from "./pill";
import { Button } from "./ui/button";
import { useState } from "react";

interface HeroProps {
  onHoverChange?: (hovering: boolean) => void;
}

export function Hero({ onHoverChange }: HeroProps) {
  const [hovering, setHovering] = useState(false);

  const handleHoverChange = (isHovering: boolean) => {
    setHovering(isHovering);
    onHoverChange?.(isHovering);
  };

  return (
    <div className="flex flex-col h-svh justify-between relative">
      {/* 内容区域 */}
      <div className="pb-16 mt-auto text-center relative z-10">
        <Pill className="mb-8">AI 工程师</Pill>
        
        {/* 主标题区域 - 三层排版 */}
        <div className="space-y-2 mb-10">
          {/* 第一层：姓名 - 最大最醒目 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sentient font-bold tracking-tight">
            我是戴江伟
          </h1>
          
          {/* 第二层：专业身份 - 斜体强调 */}
          <p className="text-xl sm:text-2xl md:text-3xl font-sentient italic text-foreground/80 tracking-wide">
            A model evaluation expert
          </p>
          
          {/* 第三层：经验 - 等宽字体，带装饰 */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="h-px w-8 bg-foreground/30"></span>
            <span className="font-mono text-sm sm:text-base text-foreground/50 tracking-wider">
              练习时长两年半
            </span>
            <span className="h-px w-8 bg-foreground/30"></span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-14 flex-wrap">
          <Link href="/#works">
            <Button
              onMouseEnter={() => handleHoverChange(true)}
              onMouseLeave={() => handleHoverChange(false)}
            >
              [查看作品]
            </Button>
          </Link>
          <Link href="/#about">
            <Button
              variant="outline"
              className="border-foreground/20 text-foreground/70 hover:border-primary hover:text-primary"
              onMouseEnter={() => handleHoverChange(true)}
              onMouseLeave={() => handleHoverChange(false)}
            >
              [关于我]
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
