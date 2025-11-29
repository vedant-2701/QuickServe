import React from "react";
import { Bell, Menu } from "lucide-react";

const Header = ({ activeTab, setIsMobileMenuOpen }) => {
    return (
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button
                    className="lg:hidden text-slate-500 hover:text-slate-800"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold text-slate-800 capitalize lg:hidden">
                    {activeTab}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                </div>
                <button className="relative text-slate-400 hover:text-slate-600 transition">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
