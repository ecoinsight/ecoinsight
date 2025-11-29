import React from 'react';
import { Leaf, Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    const features = [
        {
            icon: Globe,
            title: "Global Impact",
            description: "Tracking sustainability metrics across 50+ communities worldwide."
        },
        {
            icon: Users,
            title: "Community Driven",
            description: "Empowering local residents to take charge of their environmental footprint."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-primary/20"
                >
                    <Leaf size={40} className="text-white" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                        Building a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-secondary-dark">Greener Future</span>
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
                        EcoInsights provides real-time analytics and actionable insights to help communities reduce their environmental impact.
                    </p>
                </motion.div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (index * 0.1) }}
                        className="glass-panel p-8 text-center hover:bg-white/80 transition-colors"
                    >
                        <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-dark border border-neutral-100">
                            <feature.icon size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                        <p className="text-neutral-500">{feature.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Mission Statement */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="glass-panel p-8 md:p-12 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Our Mission</h2>
                    <div className="space-y-4 text-neutral-600 leading-relaxed">
                        <p>
                            At EcoInsights, we believe that data is the key to unlocking sustainable change. By making environmental metrics visible, accessible, and understandable, we empower individuals and organizations to make better decisions for our planet.
                        </p>
                        <p>
                            Our platform connects waste management, energy consumption, and carbon emission data into a single, unified dashboard. This holistic view allows for better resource allocation and targeted interventions where they matter most.
                        </p>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Footer */}
            <div className="text-center text-neutral-400 text-sm pt-8 border-t border-neutral-200">
                <p>&copy; EcoInsights Platform. All rights reserved.</p>
            </div>
        </div>
    );
};

export default About;
