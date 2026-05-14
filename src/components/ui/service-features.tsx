"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Users, Smartphone, Brain, Server, Code, Lock, Gauge, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

interface ServiceFeaturesProps {
  readonly features: readonly FeatureItem[];
}

export function ServiceFeatures({ features }: ServiceFeaturesProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="relative overflow-hidden bg-white border-zinc-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  {feature.stat ? (
                    <div className="flex flex-col items-center mb-4">
                      <span className="text-5xl font-bold text-blue-600">{feature.stat}</span>
                      {feature.statLabel && (
                        <span className="text-sm text-zinc-500 mt-1">{feature.statLabel}</span>
                      )}
                    </div>
                  ) : (
                    <div className="relative flex aspect-square size-12 rounded-full border border-zinc-200 mb-4 items-center justify-center">
                      <Icon className="size-5 text-blue-600" strokeWidth={1.5} />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Pre-built feature sets for each service page
export const MOBILE_FEATURES: FeatureItem[] = [
  { icon: Lock, title: "Fully Secure", description: "End-to-end encryption, biometric auth, and OWASP-compliant security hardening for every build.", stat: "100%", statLabel: "Secure" },
  { icon: Layers, title: "100% Customizable", description: "Every pixel, animation, and interaction tailored to your brand — no cookie-cutter templates.", stat: "100%", statLabel: "Customizable" },
  { icon: Zap, title: "Native Performance", description: "60fps animations, instant load times, and optimized memory usage across iOS and Android." },
  { icon: Smartphone, title: "Cross-Platform", description: "Single codebase targeting iOS, Android, and web — reducing development cost by up to 40%." },
  { icon: Users, title: "User-Centric UX", description: "Research-driven design with A/B testing and analytics baked in from day one." },
  { icon: Shield, title: "App Store Ready", description: "We handle all compliance, review guidelines, and submission for both Apple and Google Play." },
];

export const WEB_FEATURES: FeatureItem[] = [
  { icon: Zap, title: "Blazing Fast", description: "Sub-second load times with edge caching, code splitting, and optimized asset delivery.", stat: "<1s", statLabel: "Load Time" },
  { icon: Code, title: "Modern Stack", description: "React, Next.js, Astro, and TypeScript — battle-tested frameworks for production-grade apps." },
  { icon: Shield, title: "SEO Optimized", description: "Server-rendered pages, structured data, and semantic HTML for maximum search visibility." },
  { icon: Gauge, title: "99.9% Uptime", description: "Deployed on edge networks with automated failover and real-time monitoring.", stat: "99.9%", statLabel: "Uptime" },
  { icon: Layers, title: "Scalable Architecture", description: "Microservices, serverless functions, and auto-scaling that grows with your traffic." },
  { icon: Lock, title: "Enterprise Security", description: "SOC 2 compliant patterns, CSRF/XSS protection, and role-based access control." },
];

export const AI_FEATURES: FeatureItem[] = [
  { icon: Brain, title: "Custom AI Models", description: "Fine-tuned LLMs, computer vision, and NLP models trained on your proprietary data." },
  { icon: Zap, title: "Rapid Prototyping", description: "From concept to working AI prototype in 2-4 weeks with iterative feedback loops.", stat: "2-4", statLabel: "Weeks to MVP" },
  { icon: Shield, title: "Data Privacy First", description: "On-prem deployment options, data anonymization, and GDPR-compliant pipelines." },
  { icon: Server, title: "Production-Grade RAG", description: "Retrieval-augmented generation with vector databases for accurate, hallucination-free responses." },
  { icon: Gauge, title: "Real-Time Inference", description: "Optimized model serving with <100ms latency for production workloads." },
  { icon: Layers, title: "Seamless Integration", description: "Drop-in AI APIs that plug into your existing tech stack without re-architecture." },
];

export const DEVOPS_FEATURES: FeatureItem[] = [
  { icon: Server, title: "Infrastructure as Code", description: "Terraform, Pulumi, and CloudFormation for reproducible, version-controlled infrastructure." },
  { icon: Shield, title: "Automated Testing", description: "CI/CD pipelines with unit, integration, E2E, and performance tests on every commit." },
  { icon: Gauge, title: "24/7 Monitoring", description: "Datadog, Sentry, and PagerDuty integration for instant incident detection and response.", stat: "24/7", statLabel: "Monitoring" },
  { icon: Zap, title: "Zero-Downtime Deploys", description: "Blue-green and canary deployments ensuring your users never experience service interruption." },
  { icon: Lock, title: "Security Scanning", description: "Automated vulnerability scanning, dependency audits, and container image hardening." },
  { icon: Layers, title: "Multi-Cloud Ready", description: "AWS, GCP, and Azure expertise — avoid vendor lock-in with cloud-agnostic architecture." },
];

export const GENAI_FEATURES: FeatureItem[] = [
  { icon: Brain, title: "LLM Integration", description: "OpenAI, Anthropic, and open-source model integration with intelligent routing and fallbacks." },
  { icon: Layers, title: "RAG Pipelines", description: "Enterprise knowledge bases with vector search, semantic chunking, and citation tracking." },
  { icon: Zap, title: "AI Agents", description: "Autonomous multi-step agents that plan, execute, and iterate on complex business workflows." },
  { icon: Shield, title: "Guardrails Built-In", description: "Content filtering, output validation, and cost controls to keep AI safe and predictable." },
  { icon: Code, title: "Prompt Engineering", description: "Systematic prompt design, evaluation frameworks, and A/B testing for optimal model output." },
  { icon: Gauge, title: "Cost Optimization", description: "Smart model routing, caching, and batch processing to reduce inference costs by up to 70%.", stat: "70%", statLabel: "Cost Savings" },
];
