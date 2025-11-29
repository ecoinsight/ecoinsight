import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import WarningBanner from '../common/WarningBanner';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background text-white flex">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:pl-[240px] transition-all duration-300">
                <WarningBanner />
                <TopBar />
                <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
