import React, { useState } from 'react';
import { Recycle, Factory, Zap, Droplets, TrendingUp, Download, FileText, Users, Trees } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, LineChart, Line, Legend } from 'recharts';
import StatCard from '../components/common/StatCard';
import ChartWrapper from '../components/charts/ChartWrapper';
import wasteData from '../data/wasteData.json';
import emissionsData from '../data/emissionsData.json';
import energyData from '../data/energyData.json';
import waterData from '../data/waterData.json';
import { generatePDF, generateCSV } from '../utils/reportGenerator';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md border border-neutral-200 p-3 rounded-lg shadow-xl">
                <p className="text-neutral-500 text-sm mb-1">{label}</p>
                <p className="text-neutral-900 font-bold text-lg">
                    {payload[0].value}
                    <span className="text-neutral-500 text-xs ml-1 font-normal">{payload[0].unit}</span>
                </p>
            </div>
        );
    }
    return null;
};

const Overview = () => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Calculate summary stats
    const totalWaste = wasteData.reduce((acc, curr) => acc + curr.plastic + curr.paper + curr.glass + curr.organic + curr.ewaste, 0);
    const totalEmissions = emissionsData.reduce((acc, curr) => acc + curr.emissions, 0);
    const avgEnergy = Math.round(energyData.weekly.reduce((acc, curr) => acc + curr.usage, 0) / 7);
    const avgWater = Math.round(waterData.reduce((acc, curr) => acc + curr.usage, 0) / waterData.length);

    // Calculate waste composition
    const wasteComposition = [
        { name: 'Plastic', value: wasteData.reduce((acc, curr) => acc + curr.plastic, 0), color: '#0284c7' },
        { name: 'Paper', value: wasteData.reduce((acc, curr) => acc + curr.paper, 0), color: '#fbbf24' },
        { name: 'Glass', value: wasteData.reduce((acc, curr) => acc + curr.glass, 0), color: '#8b5cf6' },
        { name: 'Organic', value: wasteData.reduce((acc, curr) => acc + curr.organic, 0), color: '#16a34a' },
        { name: 'E-Waste', value: wasteData.reduce((acc, curr) => acc + curr.ewaste, 0), color: '#ef4444' },
    ];

    const energySplit = energyData.split.map(item => ({
        ...item,
        color: item.name === 'Renewable' ? '#16a34a' : '#64748b'
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
                    <p className="text-neutral-500">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-white border border-neutral-200 rounded-lg px-4 py-2 text-sm text-neutral-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm">
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                        <option>All Time</option>
                    </select>
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary/20 flex items-center gap-2"
                        >
                            <Download size={16} />
                            Export Report
                        </button>

                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50">
                                <div className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Download As</div>
                                <button
                                    onClick={() => {
                                        generatePDF(wasteData, "Waste Management Report");
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                                >
                                    <FileText size={14} />
                                    PDF Report
                                </button>
                                <button
                                    onClick={() => {
                                        generateCSV(wasteData, "waste_data");
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Recycled"
                    value={`${(totalWaste / 1000).toFixed(1)}k tons`}
                    trend="up"
                    trendValue="12%"
                    icon={Recycle}
                    color="primary"
                    delay={0.1}
                />
                <StatCard
                    title="Carbon Emissions"
                    value={`${totalEmissions} tons`}
                    trend="down"
                    trendValue="5%"
                    icon={Factory}
                    color="orange"
                    delay={0.2}
                />
                <StatCard
                    title="Avg. Energy Usage"
                    value={`${avgEnergy} kWh`}
                    trend="up"
                    trendValue="2%"
                    icon={Zap}
                    color="secondary"
                    delay={0.3}
                />
                <StatCard
                    title="Avg. Water Usage"
                    value={`${avgWater} L`}
                    trend="down"
                    trendValue="8%"
                    icon={Droplets}
                    color="secondary"
                    delay={0.4}
                />
                <StatCard
                    title="Community Participation"
                    value="85%"
                    trend="up"
                    trendValue="5%"
                    icon={Users}
                    color="purple"
                    delay={0.5}
                />
                <StatCard
                    title="Trees Planted"
                    value="1,250"
                    trend="up"
                    trendValue="15%"
                    icon={Trees}
                    color="green"
                    delay={0.6}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapper title="Recycling Trends" subtitle="Monthly waste collection by category" delay={0.5}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={wasteData}>
                            <defs>
                                <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPlastic" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="organic" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorOrganic)" />
                            <Area type="monotone" dataKey="plastic" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorPlastic)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Emissions by Sector" subtitle="Current year carbon footprint distribution" delay={0.6}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={emissionsData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis dataKey="sector" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="emissions" radius={[0, 4, 4, 0]} barSize={32}>
                                {emissionsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0284c7' : '#16a34a'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Waste Composition" subtitle="Breakdown by waste type" delay={0.7}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={wasteComposition}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {wasteComposition.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Energy Sources" subtitle="Renewable vs Non-Renewable" delay={0.8}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={energySplit}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {energySplit.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <div className="lg:col-span-2">
                    <ChartWrapper title="Water Usage Trend" subtitle="Daily water consumption over the last 30 days" delay={0.9}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={waterData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="usage" stroke="#0ea5e9" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                </div>
            </div>
        </div>
    );
};

export default Overview;
