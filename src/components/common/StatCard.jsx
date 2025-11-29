import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import clsx from 'clsx';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color = "primary", delay = 0 }) => {
    const isPositive = trend === 'up';

    const colorStyles = {
        primary: "bg-primary/10 text-primary-dark",
        secondary: "bg-secondary/10 text-secondary-dark",
        orange: "bg-orange-500/10 text-orange-600",
        red: "bg-red-500/10 text-red-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="glass-panel p-6 card-hover relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-neutral-900">
                <Icon size={64} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={clsx("p-3 rounded-xl", colorStyles[color])}>
                        <Icon size={24} />
                    </div>
                    {trendValue && (
                        <div className={clsx(
                            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg",
                            isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>

                <h3 className="text-neutral-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-neutral-900 tracking-tight">{value}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;
