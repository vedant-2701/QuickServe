import React from 'react';

const AuthHeader = () => {
    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
            <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white text-2xl font-bold">Q</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">QuickServe</h2>
            <p className="mt-2 text-sm text-slate-500">Local Service Discovery & Booking</p>
        </div>
    );
};

export default AuthHeader;
