import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, CheckCircle2, Download, FileText } from 'lucide-react';
import clsx from 'clsx';
import gridData from '../data/gridData.json';

import { useSearch } from '../hooks/useSearch';
import { generatePDF, generateCSV } from '../utils/reportGenerator';

const CommunityGrid = () => {
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const { searchQuery } = useSearch();

    const filteredData = gridData.filter(block =>
        block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'critical': return 'bg-red-500';
            case 'warning': return 'bg-yellow-500';
            case 'optimal': return 'bg-green-500';
            default: return 'bg-slate-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'critical': return 'text-red-600';
            case 'warning': return 'text-yellow-600';
            case 'optimal': return 'text-green-600';
            default: return 'text-slate-600';
        }
    };

    return (
        <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">The Living Grid</h1>
                    <p className="text-neutral-500">Real-time community energy heatmap.</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-neutral-600">Optimal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                        <span className="text-neutral-600">Warning</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-neutral-600">Critical</span>
                    </div>
                    <div className="relative ml-4">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary/20 flex items-center gap-2"
                        >
                            <Download size={16} />
                            Export
                        </button>

                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50">
                                <div className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Download As</div>
                                <button
                                    onClick={() => {
                                        generatePDF(gridData, "Grid Status Report");
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                                >
                                    <FileText size={14} />
                                    PDF Report
                                </button>
                                <button
                                    onClick={() => {
                                        generateCSV(gridData, "grid_data");
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                                >
                                    <FileText size={14} />
                                    CSV Data
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-8 min-h-0">
                {/* Grid Visualization */}
                <div className="flex-1 glass-panel p-8 flex items-center justify-center relative overflow-hidden">
                    <div className="grid grid-cols-6 gap-4 w-full max-w-2xl aspect-square">
                        {filteredData.map((block) => (
                            <motion.button
                                key={block.id}
                                layoutId={block.id}
                                onClick={() => setSelectedBlock(block)}
                                whileHover={{ scale: 1.1, zIndex: 10 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    boxShadow: selectedBlock?.id === block.id ? "0 0 0 4px rgba(59, 130, 246, 0.5)" : "none"
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: block.row * 0.05 + block.col * 0.05
                                }}
                                className={clsx(
                                    "rounded-xl relative group cursor-pointer transition-colors duration-300",
                                    getStatusColor(block.status),
                                    "hover:shadow-xl"
                                )}
                            >
                                {/* Breathing Animation Layer */}
                                <motion.div
                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: (block.row + block.col) * 0.1
                                    }}
                                    className="absolute inset-0 bg-white/20 rounded-xl"
                                />

                                <span className="relative z-10 text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    {block.usage}%
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Details Panel */}
                <div className="w-96 glass-panel p-6 flex flex-col">
                    <h2 className="text-xl font-bold text-neutral-900 mb-6">Block Details</h2>

                    <AnimatePresence mode="wait">
                        {selectedBlock ? (
                            <motion.div
                                key={selectedBlock.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-neutral-900">{selectedBlock.name}</h3>
                                    <span className={clsx("px-3 py-1 rounded-full text-sm font-medium bg-white border", getStatusText(selectedBlock.status))}>
                                        {selectedBlock.status.charAt(0).toUpperCase() + selectedBlock.status.slice(1)}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <Zap size={20} />
                                            </div>
                                            <span className="text-neutral-500 font-medium">Energy Load</span>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-3xl font-bold text-neutral-900">{selectedBlock.usage}%</span>
                                            <span className="text-sm text-neutral-400 mb-1">of capacity</span>
                                        </div>
                                        <div className="w-full bg-neutral-100 h-2 rounded-full mt-3 overflow-hidden">
                                            <div
                                                className={clsx("h-full rounded-full transition-all duration-500", getStatusColor(selectedBlock.status))}
                                                style={{ width: `${selectedBlock.usage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
                                        <h4 className="font-medium text-neutral-900 mb-3">Recommendations</h4>
                                        <ul className="space-y-2 text-sm text-neutral-600">
                                            {selectedBlock.status === 'critical' && (
                                                <li className="flex items-start gap-2">
                                                    <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                                    <span>Immediate load shedding recommended for non-essential services.</span>
                                                </li>
                                            )}
                                            {selectedBlock.status === 'warning' && (
                                                <li className="flex items-start gap-2">
                                                    <AlertTriangle size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                                                    <span>Monitor HVAC usage during peak hours (2PM - 5PM).</span>
                                                </li>
                                            )}
                                            {selectedBlock.status === 'optimal' && (
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                                    <span>System operating within normal parameters. No action needed.</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400"
                            >
                                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                    <Zap size={32} className="text-neutral-300" />
                                </div>
                                <p>Select a block from the grid to view real-time telemetry and status reports.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CommunityGrid;
