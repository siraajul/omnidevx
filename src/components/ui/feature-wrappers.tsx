"use client";
import { ServiceFeatures, MOBILE_FEATURES, WEB_FEATURES, AI_FEATURES, DEVOPS_FEATURES, GENAI_FEATURES } from "./service-features";

export const MobileFeatures = () => <ServiceFeatures features={MOBILE_FEATURES} />;
export const WebFeatures = () => <ServiceFeatures features={WEB_FEATURES} />;
export const AiFeatures = () => <ServiceFeatures features={AI_FEATURES} />;
export const DevOpsFeatures = () => <ServiceFeatures features={DEVOPS_FEATURES} />;
export const GenAiFeatures = () => <ServiceFeatures features={GENAI_FEATURES} />;
