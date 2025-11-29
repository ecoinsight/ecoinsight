import React, { useState } from 'react';
import { Droplets, CloudRain, AlertCircle, CheckCircle2, Download, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import StatCard from '../components/common/StatCard';
import ChartWrapper from '../components/charts/ChartWrapper';
import waterData from '../data/waterData.json';
import { generatePDF, generateCSV } from '../utils/reportGenerator';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md border border-neutral-200 p-3 rounded-lg shadow-xl">
                <p className="text-neutral-500 text-sm mb-1">Day {label}</p>
                <p className="text-neutral-900 font-bold text-lg">
                    {payload[0].value}
                    <span className="text-neutral-500 text-xs ml-1 font-normal">Liters</span>
                </p>
            </div>
        );
    }
    return null;
};

const Water = () => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    const totalUsage = waterData.reduce((acc, curr) => acc + curr.usage, 0);
    const avgDaily = Math.round(totalUsage / waterData.length);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Water Consumption</h1>
                    <p className="text-neutral-500">Daily usage tracking and conservation metrics.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-500">Status:</span>
                        <span className="flex items-center gap-1 text-green-700 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">
                            <CheckCircle2 size={14} /> Normal
                        </span>
                    </div>
                    <div className="relative">
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
                                        generatePDF(waterData, "Water Usage Report");
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                                >
                                    <FileText size={14} />
                                    PDF Report
                                </button>
                                <button
                                    onClick={() => {
                                        generateCSV(waterData, "water_data");
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

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Monthly Usage"
                    value={`${(totalUsage / 1000).toFixed(1)}k L`}
                    trend="down"
                    trendValue="1.5%"
                    icon={Droplets}
                    color="secondary"
                    delay={0.1}
                />
                <StatCard
                    title="Avg. Daily Usage"
                    value={`${avgDaily} L`}
                    trend="up"
                    trendValue="2 L"
                    icon={CloudRain}
                    color="secondary"
                    delay={0.2}
                />
                <StatCard
                    title="Conservation Score"
                    value="8.5/10"
                    trend="up"
                    trendValue="Excellent"
                    icon={CheckCircle2}
                    color="primary"
                    delay={0.3}
                />
            </div>

            {/* Main Chart */}
            <div className="grid grid-cols-1 gap-6">
                <ChartWrapper title="Daily Water Usage" subtitle="30-day consumption trend (Liters)" delay={0.4}>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={waterData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} interval={2} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceLine y={130} label="Target" stroke="#16a34a" strokeDasharray="3 3" />
                                <Area type="monotone" dataKey="usage" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorWater)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </ChartWrapper>
            </div>

            {/* Water Saving Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-neutral-900">
                        <Droplets size={100} />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Leak Detection</h3>
                    <p className="text-neutral-500 text-sm mb-4">Smart sensors have detected 0 leaks in the community pipeline this week.</p>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-full"></div>
                    </div>
                </div>

                <div className="glass-panel p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-neutral-900">
                        <CloudRain size={100} />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Rainwater Harvesting</h3>
                    <p className="text-neutral-500 text-sm mb-4">Community tanks are 85% full due to recent rainfall.</p>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[85%]"></div>
                    </div>
                </div>

                <div className="glass-panel p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-neutral-900">
                        <AlertCircle size={100} />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Usage Alert</h3>
                    <p className="text-neutral-500 text-sm mb-4">Block A exceeded daily average by 15% yesterday.</p>
                    <button className="text-sm text-primary-dark hover:text-primary font-medium transition-colors">
                        View Report &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Water;
