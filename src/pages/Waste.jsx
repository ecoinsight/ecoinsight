import React, { useState } from 'react';
import { Recycle, TrendingUp, ArrowUpRight, ArrowDownRight, Download, FileText } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from 'recharts';
import StatCard from '../components/common/StatCard';
import ChartWrapper from '../components/charts/ChartWrapper';
import wasteData from '../data/wasteData.json';
import { generatePDF, generateCSV } from '../utils/reportGenerator';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md border border-neutral-200 p-3 rounded-lg shadow-xl">
                <p className="text-neutral-500 text-sm mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-neutral-900 font-medium text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.value} tons
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Waste = () => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    const totalRecycled = wasteData.reduce((acc, curr) => acc + curr.plastic + curr.paper + curr.glass + curr.organic + curr.ewaste, 0);
    const lastMonth = wasteData[wasteData.length - 1];
    const lastMonthTotal = lastMonth.plastic + lastMonth.paper + lastMonth.glass + lastMonth.organic + lastMonth.ewaste;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Waste Recycling</h1>
                    <p className="text-neutral-500">Detailed breakdown of community recycling efforts.</p>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="bg-primary/10 text-primary-dark hover:bg-primary/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Download size={18} />
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

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Total Recycled (YTD)"
                    value={`${(totalRecycled / 1000).toFixed(2)}k tons`}
                    trend="up"
                    trendValue="12%"
                    icon={Recycle}
                    color="primary"
                    delay={0.1}
                />
                <StatCard
                    title="Last Month"
                    value={`${lastMonthTotal} tons`}
                    trend="up"
                    trendValue="5%"
                    icon={TrendingUp}
                    color="secondary"
                    delay={0.2}
                />
                <StatCard
                    title="Recycling Rate"
                    value="78%"
                    trend="up"
                    trendValue="3%"
                    icon={ArrowUpRight}
                    color="primary"
                    delay={0.3}
                />
                <StatCard
                    title="Composting Eff."
                    value="92%"
                    trend="up"
                    trendValue="8%"
                    icon={Recycle}
                    color="green"
                    delay={0.4}
                />
                <StatCard
                    title="Landfill Diversion"
                    value="65%"
                    trend="up"
                    trendValue="12%"
                    icon={ArrowDownRight}
                    color="orange"
                    delay={0.5}
                />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartWrapper title="Monthly Trends by Category" subtitle="Comparison of different waste types over time" delay={0.4}>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={wasteData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line type="monotone" dataKey="organic" stroke="#16a34a" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="paper" stroke="#0284c7" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="plastic" stroke="#db2777" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="glass" stroke="#d97706" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartWrapper>
                </div>

                <ChartWrapper title="Waste Source Breakdown" subtitle="Origin of collected waste" delay={0.6}>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Residential', value: 45, color: '#0ea5e9' },
                                        { name: 'Commercial', value: 30, color: '#f59e0b' },
                                        { name: 'Industrial', value: 25, color: '#64748b' },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {[
                                        { name: 'Residential', value: 45, color: '#0ea5e9' },
                                        { name: 'Commercial', value: 30, color: '#f59e0b' },
                                        { name: 'Industrial', value: 25, color: '#64748b' },
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ChartWrapper>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <ChartWrapper title="Composition Analysis" subtitle="Distribution of waste types for the current month" delay={0.5}>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[lastMonth]} layout="vertical" barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="month" hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="organic" fill="#16a34a" stackId="a" radius={[4, 0, 0, 4]} />
                                <Bar dataKey="paper" fill="#0284c7" stackId="a" />
                                <Bar dataKey="plastic" fill="#db2777" stackId="a" />
                                <Bar dataKey="glass" fill="#d97706" stackId="a" />
                                <Bar dataKey="ewaste" fill="#64748b" stackId="a" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                            <span className="text-neutral-500 text-sm">Organic</span>
                            <span className="text-neutral-900 font-bold">{lastMonth.organic}t</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                            <span className="text-neutral-500 text-sm">Paper</span>
                            <span className="text-neutral-900 font-bold">{lastMonth.paper}t</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                            <span className="text-neutral-500 text-sm">Plastic</span>
                            <span className="text-neutral-900 font-bold">{lastMonth.plastic}t</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                            <span className="text-neutral-500 text-sm">Glass</span>
                            <span className="text-neutral-900 font-bold">{lastMonth.glass}t</span>
                        </div>
                    </div>
                </ChartWrapper>
            </div>
        </div>
    );
};

export default Waste;
