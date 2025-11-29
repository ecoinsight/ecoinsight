import React from 'react';
import { motion } from 'framer-motion';

const ChartWrapper = ({ title, subtitle, children, delay = 0.2 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay }}
            className="glass-panel p-6 h-full flex flex-col"
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
                {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
            </div>
            <div className="flex-1 min-h-[300px] w-full">
                {children}
            </div>
        </motion.div>
    );
};

export default ChartWrapper;
