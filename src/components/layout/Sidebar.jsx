import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Recycle, Factory, Zap, Droplets, Info, Menu, X, Grid } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Overview' },
        { path: '/waste', icon: Recycle, label: 'Waste Recycling' },
        { path: '/emissions', icon: Factory, label: 'Carbon Emissions' },
        { path: '/energy', icon: Zap, label: 'Energy' },
        { path: '/water', icon: Droplets, label: 'Water' },
        { path: '/grid', icon: Grid, label: 'Living Grid' },
        { path: '/about', icon: Info, label: 'About' },
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg text-neutral-900 shadow-lg border border-neutral-200"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <motion.aside
                initial={{ width: 240 }}
                animate={{ width: isOpen ? 240 : 80 }}
                className={clsx(
                    "fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-xl border-r border-neutral-200 z-40 transition-all duration-300 hidden lg:flex flex-col shadow-xl shadow-neutral-200/50",
                    !isOpen && "items-center"
                )}
            >
                <div className="p-6 flex items-center justify-center h-20 border-b border-neutral-200">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                            <Recycle className="text-white w-5 h-5" />
                        </div>
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-xl bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent"
                            >
                                EcoInsights
                            </motion.span>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group font-medium",
                                    isActive
                                        ? "bg-primary/10 text-primary-dark shadow-sm"
                                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                                )
                            }
                        >
                            <item.icon size={22} className="min-w-[22px]" />
                            {isOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-neutral-200">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-center p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                        {isOpen ? "Collapse" : <Menu size={20} />}
                    </button>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
