import React, { useState } from 'react';
import { Factory, Cloud, ArrowDown, AlertTriangle, Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LineChart, Line } from 'recharts';
import StatCard from '../components/common/StatCard';
import ChartWrapper from '../components/charts/ChartWrapper';
import emissionsData from '../data/emissionsData.json';
import { generatePDF, generateCSV } from '../utils/reportGenerator';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md border border-neutral-200 p-3 rounded-lg shadow-xl">
                <p className="text-neutral-500 text-sm mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-neutral-900 font-medium text-sm">
                        {entry.name}: {entry.value} tons CO2
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Emissions = () => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    const totalEmissions = emissionsData.reduce((acc, curr) => acc + curr.emissions, 0);
    const maxSector = emissionsData.reduce((prev, current) => (prev.emissions > current.emissions) ? prev : current);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Carbon Emissions</h1>
                    <p className="text-neutral-500">Track and analyze community carbon footprint.</p>
                </div>
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
                                    generatePDF(emissionsData, "Emissions Report");
                                    setShowExportMenu(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                            >
                                <FileText size={14} />
                                PDF Report
                            </button>
                            <button
                                onClick={() => {
                                    generateCSV(emissionsData, "emissions_data");
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

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Total Emissions"
                    value={`${totalEmissions} tons`}
                    trend="down"
                    trendValue="8% vs last year"
                    icon={Cloud}
                    color="orange"
                    delay={0.1}
                />
                <StatCard
                    title="Highest Sector"
                    value={maxSector.sector}
                    trend="up"
                    trendValue={`${maxSector.emissions} tons`}
                    icon={Factory}
                    color="red"
                    delay={0.2}
                />
                <StatCard
                    title="Offset Target"
                    value="85%"
                    trend="up"
                    trendValue="On Track"
                    icon={ArrowDown}
                    color="primary"
                    delay={0.3}
                />
                <StatCard
                    title="Carbon Credits"
                    value="450"
                    trend="up"
                    trendValue="15%"
                    icon={Cloud}
                    color="green"
                    delay={0.4}
                />
                <StatCard
                    title="Avg AQI"
                    value="42"
                    trend="down"
                    trendValue="Good"
                    icon={Cloud}
                    color="blue"
                    delay={0.5}
                />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartWrapper title="Monthly Emissions Trend" subtitle="Carbon footprint over the last 12 months" delay={0.6}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { month: 'Jan', emissions: 120 },
                                { month: 'Feb', emissions: 115 },
                                { month: 'Mar', emissions: 130 },
                                { month: 'Apr', emissions: 125 },
                                { month: 'May', emissions: 140 },
                                { month: 'Jun', emissions: 135 },
                                { month: 'Jul', emissions: 145 },
                                { month: 'Aug', emissions: 150 },
                                { month: 'Sep', emissions: 142 },
                                { month: 'Oct', emissions: 138 },
                                { month: 'Nov', emissions: 132 },
                                { month: 'Dec', emissions: 128 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="emissions" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                </div>

                <ChartWrapper title="Sector Breakdown" subtitle="Emissions by source category" delay={0.4}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={emissionsData} layout="vertical" margin={{ left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis dataKey="sector" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={70} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="emissions" radius={[0, 4, 4, 0]} barSize={24}>
                                {emissionsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f97316' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartWrapper>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapper title="Year over Year Comparison" subtitle="Current vs Previous year emissions" delay={0.5}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={emissionsData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="sector" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 500]} tick={false} axisLine={false} />
                            <Radar name="Current Year" dataKey="emissions" stroke="#f97316" strokeWidth={2} fill="#f97316" fillOpacity={0.3} />
                            <Radar name="Previous Year" dataKey="previous" stroke="#94a3b8" strokeWidth={2} fill="#94a3b8" fillOpacity={0.1} />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                </ChartWrapper>
            </div>

            {/* Alerts Section */}
            <div className="glass-panel p-6">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-yellow-600" />
                    <h3 className="text-lg font-semibold text-neutral-900">Critical Alerts</h3>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-700 font-medium">Transport sector exceeds monthly target by 15%</span>
                        </div>
                        <button className="text-sm text-red-600 hover:text-red-800 font-medium">View Details</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-yellow-700 font-medium">Industrial emissions approaching quarterly limit</span>
                        </div>
                        <button className="text-sm text-yellow-600 hover:text-yellow-800 font-medium">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Emissions;
