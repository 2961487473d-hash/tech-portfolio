'use client'

import { useState, useCallback, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Hero } from "@/components/hero";
import { Leva } from "leva";
import { IntroAnimation, AnimationPhase, ANIMATION_CONFIG } from "@/components/intro-animation";
import { ClickSpark } from "@/components/click-spark";

// 动态导入 GL 组件
const GL = dynamic(() => import("@/components/gl").then((mod) => mod.GL), {
  ssr: false,
  loading: () => null,
});

// 内容展现阶段类型
type ContentRevealStage = 'hidden' | 'particles' | 'hero' | 'about' | 'works' | 'articles' | 'footer' | 'complete';

export default function Home() {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("booting");
  const [contentStage, setContentStage] = useState<ContentRevealStage>('hidden');
  const [particlesReady, setParticlesReady] = useState(false);
  const [hovering, setHovering] = useState(false);

  // 粒子系统准备就绪
  useEffect(() => {
    if (contentStage !== 'hidden') {
      const timer = requestAnimationFrame(() => {
        setParticlesReady(true);
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [contentStage]);

  // 处理动画阶段变化
  const handlePhaseChange = useCallback((phase: AnimationPhase) => {
    setAnimationPhase(phase);
    
    // 根据动画阶段触发内容展现
    switch (phase) {
      case "particles-start":
        // Logo到位，立即启动粒子
        setContentStage('particles');
        break;
      case "content-reveal":
        // 开始分层级展现内容
        setTimeout(() => setContentStage('hero'), 0);
        setTimeout(() => setContentStage('about'), ANIMATION_CONFIG.contentStaggerDelay);
        setTimeout(() => setContentStage('works'), ANIMATION_CONFIG.contentStaggerDelay * 2);
        setTimeout(() => setContentStage('articles'), ANIMATION_CONFIG.contentStaggerDelay * 3);
        setTimeout(() => setContentStage('footer'), ANIMATION_CONFIG.contentStaggerDelay * 4);
        setTimeout(() => setContentStage('complete'), ANIMATION_CONFIG.contentStaggerDelay * 5);
        break;
      case "complete":
        setContentStage('complete');
        break;
    }
  }, []);

  // 计算各组件的可见性和动画状态
  const contentVisibility = useMemo(() => ({
    particles: contentStage !== 'hidden',
    hero: ['hero', 'about', 'works', 'articles', 'footer', 'complete'].includes(contentStage),
    about: ['about', 'works', 'articles', 'footer', 'complete'].includes(contentStage),
    works: ['works', 'articles', 'footer', 'complete'].includes(contentStage),
    articles: ['articles', 'footer', 'complete'].includes(contentStage),
    footer: ['footer', 'complete'].includes(contentStage),
  }), [contentStage]);

  // 计算各组件的动画延迟
  const getStaggerDelay = (index: number) => ({
    transitionDelay: `${index * ANIMATION_CONFIG.contentStaggerDelay}ms`,
  });

  return (
    <ClickSpark sparkColor="#22c55e" sparkCount={12} sparkSize={3}>
      <IntroAnimation onPhaseChange={handlePhaseChange} />
      
      {/* 全局粒子背景 - 覆盖整个页面 */}
      {particlesReady && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <GL hovering={hovering} />
        </div>
      )}
      
      {/* 主内容区域 */}
      <div className="relative z-10">
        {/* Hero 区域 */}
        <div 
          className={`transition-all duration-700 ease-out will-change-transform ${
            contentVisibility.hero 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={getStaggerDelay(0)}
        >
          <Hero onHoverChange={setHovering} />
          <Leva hidden />
        </div>

        {/* About 区域 */}
        <section 
          id="about" 
          className={`min-h-screen py-24 px-6 transition-all duration-700 ease-out will-change-transform ${
            contentVisibility.about 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={getStaggerDelay(1)}
        >
          <div className="container max-w-5xl mx-auto">
            <div className="mb-16">
              <p className="font-mono text-primary text-sm mb-4 tracking-wider">// 关于我</p>
              <h2 className="text-4xl md:text-5xl font-sentient mb-6">
                构建智能，<br />
                <i className="font-light">一次一个模型</i>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="bg-[#111] border border-border p-8 relative overflow-hidden group hover:border-primary/30 transition-colors duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="font-mono text-lg text-foreground/90 mb-3">我是谁</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed font-mono">
                    我是一名热衷于探索机器学习和深度学习边界的 AI 工程师。从自然语言处理到计算机视觉，我构建能够学习、适应和演进的智能系统。
                  </p>
                </div>

                <div className="bg-[#111] border border-border p-8 relative overflow-hidden group hover:border-primary/30 transition-colors duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="font-mono text-lg text-foreground/90 mb-3">我的使命</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed font-mono">
                    让 AI 技术民主化，使智能系统触手可及。我相信构建的解决方案不仅要性能优异，还要在人们的生活中创造有意义的影响。
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-mono text-sm text-primary mb-6">// 核心技能</h3>

                {[
                  { label: "机器学习", level: 95 },
                  { label: "深度学习", level: 90 },
                  { label: "NLP 与大语言模型", level: 92 },
                  { label: "计算机视觉", level: 85 },
                  { label: "MLOps 与部署", level: 88 },
                ].map((skill) => (
                  <div key={skill.label} className="group">
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-sm text-foreground/80">{skill.label}</span>
                      <span className="font-mono text-xs text-primary">{skill.level}%</span>
                    </div>
                    <div className="h-[2px] bg-border overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-10 grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0a0a] border border-border p-6 text-center hover:border-primary/40 transition-colors">
                    <div className="text-3xl font-sentient text-primary mb-2">5+</div>
                    <div className="font-mono text-xs text-foreground/50">年经验</div>
                  </div>
                  <div className="bg-[#0a0a0a] border border-border p-6 text-center hover:border-primary/40 transition-colors">
                    <div className="text-3xl font-sentient text-primary mb-2">50+</div>
                    <div className="font-mono text-xs text-foreground/50">AI 项目</div>
                  </div>
                  <div className="bg-[#0a0a0a] border border-border p-6 text-center hover:border-primary/40 transition-colors">
                    <div className="text-3xl font-sentient text-primary mb-2">20+</div>
                    <div className="font-mono text-xs text-foreground/50">模型部署</div>
                  </div>
                  <div className="bg-[#0a0a0a] border border-border p-6 text-center hover:border-primary/40 transition-colors">
                    <div className="text-3xl font-sentient text-primary mb-2">∞</div>
                    <div className="font-mono text-xs text-foreground/50">好奇心</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Works 区域 */}
        <section 
          id="works" 
          className={`min-h-screen py-24 px-6 transition-all duration-700 ease-out will-change-transform ${
            contentVisibility.works 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={getStaggerDelay(2)}
        >
          <div className="container max-w-6xl mx-auto">
            <div className="mb-16">
              <p className="font-mono text-primary text-sm mb-4 tracking-wider">// 我的作品</p>
              <h2 className="text-4xl md:text-5xl font-sentient mb-6">
                精选 <i className="font-light">项目</i>
              </h2>
              <p className="font-mono text-sm text-foreground/50 max-w-xl">
                精心挑选的 AI 项目集合，展示我在人工智能不同领域的专业能力
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "NeuralChat Pro",
                  desc: "高级对话 AI 系统，支持多轮上下文感知和实时响应生成",
                  tags: ["大语言模型", "NLP", "RAG"],
                  status: "生产环境",
                  color: "#22c55e",
                },
                {
                  title: "VisionForge",
                  desc: "实时目标检测和图像分类流水线，针对边缘部署优化",
                  tags: ["计算机视觉", "PyTorch", "ONNX"],
                  status: "活跃开发",
                  color: "#3b82f6",
                },
                {
                  title: "DataPulse",
                  desc: "自动化 ML 流水线，用于预测分析和自动特征工程",
                  tags: ["MLOps", "AutoML", "Kubernetes"],
                  status: "生产环境",
                  color: "#f59e0b",
                },
                {
                  title: "SynthVoice",
                  desc: "文本转语音合成模型，支持情感感知的语音克隆功能",
                  tags: ["TTS", "深度学习", "音频"],
                  status: "研究阶段",
                  color: "#ec4899",
                },
                {
                  title: "AgentFlow",
                  desc: "多智能体强化学习框架，用于复杂决策任务",
                  tags: ["强化学习", "多智能体", "仿真"],
                  status: "开发中",
                  color: "#8b5cf6",
                },
                {
                  title: "CodeMind",
                  desc: "AI 驱动的代码生成和审查助手，面向软件开发团队",
                  tags: ["代码大模型", "开发工具", "API"],
                  status: "测试版",
                  color: "#06b6d4",
                },
              ].map((project) => (
                <div
                  key={project.title}
                  className="group bg-[#111] border border-border p-6 hover:border-border/80 transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 w-full h-[1px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
                      opacity: 0.6,
                    }}
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center text-lg font-sentient"
                      style={{ background: `${project.color}15`, color: project.color }}
                    >
                      {project.title[0]}
                    </div>
                    <span
                      className="font-mono text-[10px] px-2 py-1 rounded"
                      style={{ background: `${project.color}15`, color: project.color }}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3 className="font-mono text-base text-foreground/90 mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-foreground/50 text-xs leading-relaxed mb-4 font-mono">
                    {project.desc}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-1 bg-white/5 text-foreground/40 border border-border/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-mono text-[11px] text-primary">查看项目 →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Articles 区域 */}
        <section 
          id="articles" 
          className={`min-h-screen py-24 px-6 transition-all duration-700 ease-out will-change-transform ${
            contentVisibility.articles 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={getStaggerDelay(3)}
        >
          <div className="container max-w-4xl mx-auto">
            <div className="mb-16">
              <p className="font-mono text-primary text-sm mb-4 tracking-wider">// 技术文章</p>
              <h2 className="text-4xl md:text-5xl font-sentient mb-6">
                技术 <i className="font-light">写作</i>
              </h2>
              <p className="font-mono text-sm text-foreground/50 max-w-xl">
                深入探索 AI 研究、实践教程，以及对人工智能未来的思考
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "构建生产级 LLM 应用：完整指南",
                  excerpt: "从模型选择到部署，学习如何构建能够处理数百万请求的可扩展 LLM 应用...",
                  date: "2026.03.15",
                  readTime: "12 分钟阅读",
                  category: "大语言模型",
                  featured: true,
                },
                {
                  title: "多模态 AI 的崛起：超越文本和图像",
                  excerpt: "探索现代 AI 系统如何学习理解和生成跨多种模态的内容...",
                  date: "2026.02.28",
                  readTime: "8 分钟阅读",
                  category: "研究",
                  featured: false,
                },
                {
                  title: "微调 vs RAG：何时使用哪种方法",
                  excerpt: "两种强大的大语言模型定制技术的实用比较，帮助你选择最适合的方案...",
                  date: "2026.02.10",
                  readTime: "10 分钟阅读",
                  category: "教程",
                  featured: false,
                },
                {
                  title: "MLOps 最佳实践：从实验到生产",
                  excerpt: "大规模管理完整机器学习生命周期的关键策略和工具...",
                  date: "2026.01.22",
                  readTime: "15 分钟阅读",
                  category: "工程实践",
                  featured: false,
                },
                {
                  title: "理解 Transformer 模型中的注意力机制",
                  excerpt: "直观地解释注意力机制在底层是如何工作的...",
                  date: "2026.01.05",
                  readTime: "9 分钟阅读",
                  category: "深度解析",
                  featured: false,
                },
              ].map((article) => (
                <article
                  key={article.title}
                  className={`group bg-[#111] border ${
                    article.featured ? 'border-primary/30' : 'border-border'
                  } p-6 md:p-8 hover:border-border/80 transition-all duration-300 cursor-pointer relative`}
                >
                  {article.featured && (
                    <div className="absolute -top-3 left-6">
                      <span className="font-mono text-[10px] px-3 py-1 bg-primary text-black font-bold">
                        精选
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3 mt-1">
                    <span className="font-mono text-[11px] text-primary border border-primary/30 px-2 py-0.5">
                      {article.category}
                    </span>
                    <span className="font-mono text-[11px] text-foreground/30">{article.date}</span>
                  </div>

                  <h3 className="font-mono text-lg md:text-xl text-foreground/90 mb-3 group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-foreground/50 text-sm leading-relaxed mb-4 font-mono">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/20">
                    <span className="font-mono text-[11px] text-foreground/40">{article.readTime}</span>
                    <span className="font-mono text-[11px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      阅读更多 →
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button className="font-mono text-sm text-foreground/50 hover:text-primary transition-colors border border-border/30 px-8 py-3 hover:border-primary/40">
                [加载更多文章]
              </button>
            </div>
          </div>
        </section>

        {/* Footer 区域 */}
        <footer 
          className={`py-12 px-6 border-t border-border/20 transition-all duration-700 ease-out will-change-transform ${
            contentVisibility.footer 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={getStaggerDelay(4)}
        >
          <div className="container max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-foreground/30">
                  {"// DJW.terminal v2.0.26"}
                </span>
                <span className="text-primary text-xs">●</span>
                <span className="font-mono text-xs text-foreground/30">
                  系统在线
                </span>
              </div>

              <div className="font-mono text-xs text-foreground/25">
                © 2026 DJW.terminal — 用 AI 与热情打造
              </div>

              <div className="flex items-center gap-6">
                {["GitHub", "Twitter", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="font-mono text-xs text-foreground/40 hover:text-primary transition-colors"
                  >
                    [{social}]
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ClickSpark>
  );
}
