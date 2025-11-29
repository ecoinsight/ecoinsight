import React, { useState } from 'react';
import { Zap, Battery, Sun, Moon, Download, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import StatCard from '../components/common/StatCard';
import ChartWrapper from '../components/charts/ChartWrapper';
import energyData from '../data/energyData.json';
import { generatePDF, generateCSV } from '../utils/reportGenerator';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md border border-neutral-200 p-3 rounded-lg shadow-xl">
                <p className="text-neutral-500 text-sm mb-1">{label || payload[0].name}</p>
                <p className="text-neutral-900 font-bold text-lg">
                    {payload[0].value}
                    <span className="text-neutral-500 text-xs ml-1 font-normal">{label ? 'kWh' : '%'}</span>
                </p>
            </div>
        );
    }
    return null;
};

const Energy = () => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    const totalWeekly = energyData.weekly.reduce((acc, curr) => acc + curr.usage, 0);
    const renewablePct = energyData.split.find(i => i.name === 'Renewable').value;

    const COLORS = ['#16a34a', '#64748b'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Energy Consumption</h1>
                    <p className="text-neutral-500">Monitor power usage and renewable adoption.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg p-1 shadow-sm">
                        <button className="px-3 py-1.5 rounded-md bg-primary/10 text-primary-dark text-sm font-medium">Weekly</button>
                        <button className="px-3 py-1.5 rounded-md text-neutral-500 hover:text-neutral-900 text-sm font-medium transition-colors">Monthly</button>
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
                                        generatePDF(energyData, "Energy Report");
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                                >
                                    <FileText size={14} />
                                    PDF Report
                                </button>
                                <button
                                    onClick={() => {
                                        generateCSV(energyData, "energy_data");
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Weekly Usage"
                    value={`${totalWeekly} kWh`}
                    trend="down"
                    trendValue="3.2%"
                    icon={Zap}
                    color="secondary"
                    delay={0.1}
                />
                <StatCard
                    title="Renewable Share"
                    value={`${renewablePct}%`}
                    trend="up"
                    trendValue="5% vs target"
                    icon={Sun}
                    color="primary"
                    delay={0.2}
                />
                <StatCard
                    title="Grid Efficiency"
                    value="94%"
                    trend="up"
                    trendValue="Stable"
                    icon={Battery}
                    color="secondary"
                    delay={0.3}
                />
                <StatCard
                    title="Est. Cost Savings"
                    value="$1,200"
                    trend="up"
                    trendValue="8%"
                    icon={Zap}
                    color="green"
                    delay={0.4}
                />
                <StatCard
                    title="Carbon Intensity"
                    value="180g"
                    trend="down"
                    trendValue="12%"
                    icon={Zap}
                    color="orange"
                    delay={0.5}
                />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartWrapper title="Energy Source Split" subtitle="Renewable vs Non-Renewable distribution" delay={0.4}>
                    <div className="h-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={energyData.split}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {energyData.split.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-neutral-900">{renewablePct}%</span>
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Renewable</span>
                        </div>
                    </div>
                </ChartWrapper>

                <div className="lg:col-span-2">
                    <ChartWrapper title="Peak vs Off-Peak Usage" subtitle="Hourly consumption distribution" delay={0.6}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { time: '00:00', usage: 20 }, { time: '04:00', usage: 15 },
                                { time: '08:00', usage: 45 }, { time: '12:00', usage: 60 },
                                { time: '16:00', usage: 55 }, { time: '20:00', usage: 80 },
                                { time: '23:59', usage: 30 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="usage" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUsage)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <ChartWrapper title="Weekly Consumption" subtitle="Daily power usage in kWh" delay={0.5}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={energyData.weekly} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
                                {energyData.weekly.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#0284c7" fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartWrapper>
            </div>

            {/* Efficiency Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 flex items-start gap-4">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                        <Sun size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">Peak Hours Alert</h3>
                        <p className="text-neutral-500 text-sm">Energy usage is highest between 6PM - 9PM. Consider shifting heavy appliance usage to off-peak hours.</p>
                    </div>
                </div>
                <div className="glass-panel p-6 flex items-start gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                        <Moon size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">Night Mode Savings</h3>
                        <p className="text-neutral-500 text-sm">Community street lights reduced power consumption by 12% last night using smart sensors.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Energy;
