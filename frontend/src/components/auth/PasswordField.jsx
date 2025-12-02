import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordField = ({ label, placeholder, showForgotLink = false, value, onChange }) => {
    const [show, setShow] = useState(false);
    
    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">{label}</label>
                {showForgotLink && (
                    <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                    </a>
                )}
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type={show ? "text" : "password"}
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 text-slate-900 transition-shadow"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    {show ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default PasswordField;
