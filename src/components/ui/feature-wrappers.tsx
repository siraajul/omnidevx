"use client";
import { BentoFeatures } from "./bento-features";
import { MOBILE_FEATURES, WEB_FEATURES, AI_FEATURES, DEVOPS_FEATURES, GENAI_FEATURES } from "./service-features";

export const MobileFeatures = () => <BentoFeatures features={MOBILE_FEATURES} />;
export const WebFeatures = () => <BentoFeatures features={WEB_FEATURES} />;
export const AiFeatures = () => <BentoFeatures features={AI_FEATURES} />;
export const DevOpsFeatures = () => <BentoFeatures features={DEVOPS_FEATURES} />;
export const GenAiFeatures = () => <BentoFeatures features={GENAI_FEATURES} />;
