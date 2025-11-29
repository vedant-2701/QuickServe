import React from "react";

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            {/* {trend && <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>} */}
        </div>
        <div className="p-3 bg-indigo-50 rounded-lg">
            <Icon className="w-6 h-6 text-indigo-600" />
        </div>
    </div>
);

export default StatCard;
