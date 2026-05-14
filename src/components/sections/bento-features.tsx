"use client";

import { motion } from "motion/react";
import { Card, CardContent } from '@/components/ui/card'
import type { FeatureItem } from './service-features'

interface BentoFeaturesProps {
    readonly features: readonly FeatureItem[];
}

export function BentoFeatures({ features }: BentoFeaturesProps) {
    // We expect at least 5 features. If more, we'll map what we can or just use the first 5 for the bento grid.
    const f1 = features[0];
    const Icon1 = f1?.icon;
    const f2 = features[1];
    const Icon2 = f2?.icon;
    const f3 = features[2];
    const Icon3 = f3?.icon;
    const f4 = features[3];
    const f5 = features[4];

    const Icon4 = f4?.icon;
    const Icon5 = f5?.icon;
    const f6 = features[5];
    const Icon6 = f6?.icon;

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="relative z-10 grid grid-cols-6 gap-4">
                    
                    {/* Card 1: 100% SVG */}
                    {f1 && (
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 bg-white border-[#e8e5db] shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="relative m-auto size-fit pt-6 px-6 pb-8 flex flex-col justify-center items-center">
                                <div className="relative flex h-32 w-full max-w-[220px] items-center justify-center overflow-hidden">
                                    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-6 -bottom-6">
                                        {Icon1 && <Icon1 className="size-32 text-zinc-100" strokeWidth={1} />}
                                    </motion.div>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                                            {Icon1 && <Icon1 className="size-6 text-[#2A6FDB] mb-2" strokeWidth={2} />}
                                        </motion.div>
                                        <span className="block text-4xl md:text-5xl font-display text-[#2A6FDB]">{f1.stat || "100%"}</span>
                                    </div>
                                </div>
                                <h2 className="mt-4 text-center text-xl font-bold text-[#161616]">{f1.title}</h2>
                                <p className="text-sm text-[#444] text-center mt-2 px-4">{f1.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Card 2: Abstract SVG */}
                    {f2 && (
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 bg-white border-[#e8e5db] shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6 h-full flex flex-col">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-[#e8e5db] before:absolute before:-inset-2 before:rounded-full before:border before:border-[#e8e5db] items-center justify-center overflow-hidden">
                                    <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute">
                                        {Icon2 && <Icon2 className="size-48 text-zinc-100" strokeWidth={1} />}
                                    </motion.div>
                                    <div className="relative z-10 flex items-center justify-center">
                                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                                            {Icon2 && <Icon2 className="size-10 text-[#2A6FDB]" strokeWidth={1.5} />}
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="relative z-10 mt-auto space-y-2 text-center pt-8">
                                    <h2 className="text-lg font-bold text-[#161616]">{f2.title}</h2>
                                    <p className="text-sm text-[#444] leading-relaxed">{f2.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Card 3: Sparkline SVG */}
                    {f3 && (
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 bg-white border-[#e8e5db] shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6 h-full flex flex-col">
                                <div className="pt-6 lg:px-6 relative flex items-center justify-center h-[123px] overflow-hidden">
                                    <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-10">
                                        {Icon3 && <Icon3 className="size-40 text-zinc-100" strokeWidth={1} />}
                                    </motion.div>
                                    <motion.div animate={{ x: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -right-10">
                                        {Icon3 && <Icon3 className="size-40 text-zinc-100" strokeWidth={1} />}
                                    </motion.div>
                                    <div className="relative z-10 flex items-center justify-center">
                                        <motion.div animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                                            {Icon3 && <Icon3 className="size-12 text-[#2A6FDB]" strokeWidth={1.5} />}
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="relative z-10 mt-auto space-y-2 text-center pt-8">
                                    <h2 className="text-lg font-bold text-[#161616]">{f3.title}</h2>
                                    <p className="text-sm text-[#444] leading-relaxed">{f3.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Card 4: Horizontal with Icon */}
                    {f4 && (
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 bg-white border-[#e8e5db] shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="grid pt-6 sm:grid-cols-2 h-full">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6 pb-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border border-[#e8e5db] before:absolute before:-inset-2 before:rounded-full before:border before:border-[#e8e5db] items-center justify-center">
                                        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                                            {Icon4 && <Icon4 className="size-5 text-[#2A6FDB]" strokeWidth={1.5} />}
                                        </motion.div>
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-bold text-[#161616]">{f4.title}</h2>
                                        <p className="text-sm text-[#444] leading-relaxed">{f4.description}</p>
                                    </div>
                                </div>
                                <div className="relative -mb-6 -mr-6 mt-6 h-full min-h-[150px] border-l border-t border-[#e8e5db] p-6 py-6 sm:ml-6 bg-[#f5f3ea]/50 flex items-center justify-center overflow-hidden">
                                    <div className="absolute left-3 top-2 flex gap-1">
                                        <span className="block size-2 rounded-full border border-[#e8e5db] bg-white"></span>
                                        <span className="block size-2 rounded-full border border-[#e8e5db] bg-white"></span>
                                        <span className="block size-2 rounded-full border border-[#e8e5db] bg-white"></span>
                                    </div>
                                    <div className="w-full h-full border border-[#e8e5db] bg-white rounded-md shadow-sm mt-4 p-4 flex flex-col gap-2 opacity-50">
                                        <motion.div 
                                            initial={{ width: "0%" }} 
                                            animate={{ width: "100%" }} 
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }} 
                                            className="h-2 bg-[#2A6FDB]/20 rounded"
                                        />
                                        <motion.div 
                                            initial={{ width: "0%" }} 
                                            animate={{ width: "75%" }} 
                                            transition={{ duration: 2, delay: 0.2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }} 
                                            className="h-2 bg-zinc-200 rounded"
                                        />
                                        <motion.div 
                                            initial={{ width: "0%" }} 
                                            animate={{ width: "85%" }} 
                                            transition={{ duration: 2, delay: 0.4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }} 
                                            className="h-2 bg-zinc-200 rounded"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Card 5: Users/Collaboration */}
                    {f5 && (
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 bg-white border-[#e8e5db] shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6 pb-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border border-[#e8e5db] before:absolute before:-inset-2 before:rounded-full before:border before:border-[#e8e5db] items-center justify-center">
                                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                                            {Icon5 && <Icon5 className="size-5 text-[#2A6FDB]" strokeWidth={1.5} />}
                                        </motion.div>
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-bold text-[#161616]">{f5.title}</h2>
                                        <p className="text-sm text-[#444] leading-relaxed">{f5.description}</p>
                                    </div>
                                </div>
                                <div className="relative -mb-6 -mr-6 mt-6 h-full min-h-[150px] border-l border-t border-[#e8e5db] p-6 py-6 sm:ml-6 bg-[#f5f3ea]/50 flex items-center justify-center overflow-hidden">
                                    <motion.div animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute">
                                        {Icon5 && <Icon5 className="size-48 text-zinc-100" strokeWidth={1} />}
                                    </motion.div>
                                    <div className="relative z-10 flex aspect-square size-24 rounded-full border border-blue-100 bg-white items-center justify-center shadow-sm">
                                        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 rounded-full border border-blue-300" />
                                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                                            {Icon5 && <Icon5 className="size-10 text-[#2A6FDB]" strokeWidth={1.5} />}
                                        </motion.div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Card 6 (Optional): If there's a 6th feature, we render it full width at the bottom */}
                    {f6 && (
                        <Card className="relative col-span-full overflow-hidden bg-white border-[#e8e5db] shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                                <div className="relative flex aspect-square size-14 rounded-full bg-[#f5f3ea] border border-[#e8e5db] items-center justify-center shrink-0">
                                    <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                                        {Icon6 && <Icon6 className="size-6 text-[#2A6FDB]" strokeWidth={1.5} />}
                                    </motion.div>
                                </div>
                                <div className="space-y-1 text-center md:text-left">
                                    <h2 className="text-xl font-bold text-[#161616]">{f6.title}</h2>
                                    <p className="text-sm text-[#444] leading-relaxed max-w-3xl">{f6.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </section>
    )
}
