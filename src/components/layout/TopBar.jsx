import React, { useState } from 'react';
import { Search, Bell, User, Check, Trash2, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useSearch } from '../../hooks/useSearch';
import { useNotification } from '../../hooks/useNotification';

const TopBar = () => {
    const { searchQuery, setSearchQuery } = useSearch();
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotification();
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() !== '' && location.pathname !== '/grid') {
            navigate('/grid');
        }
    };

    return (
        <header className="h-20 px-8 flex items-center justify-between bg-white/50 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96 hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for metrics, communities..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors relative"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden z-50"
                            >
                                <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                                    <h3 className="font-semibold text-neutral-900">Notifications</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={markAllAsRead}
                                            className="p-1.5 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            title="Mark all as read"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={clearAll}
                                            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Clear all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-neutral-400">
                                            <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                            <p className="text-sm">No notifications</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-neutral-100">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => markAsRead(notification.id)}
                                                    className={`p-4 hover:bg-neutral-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-primary-dark' : 'text-neutral-900'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        <span className="text-xs text-neutral-400 whitespace-nowrap ml-2">{notification.time}</span>
                                                    </div>
                                                    <p className="text-xs text-neutral-500 leading-relaxed">{notification.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-8 w-[1px] bg-neutral-200 mx-2"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-neutral-900">Sandesh Gupta</p>
                        <p className="text-xs text-neutral-500">member</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-2 ring-white shadow-md">
                        <User className="text-white w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
