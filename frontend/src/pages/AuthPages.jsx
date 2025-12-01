import React, { useState } from 'react';
import AuthHeader from '../components/auth/AuthHeader';
import AuthFooter from '../components/auth/AuthFooter';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const AuthPages = ({ onLogin }) => {
    const [view, setView] = useState('login'); // 'login' | 'signup'

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            
            {/* Brand Header */}
            <AuthHeader />

            <div className="sm:mx-auto sm:w-full sm:max-w-[40rem]">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                    
                    {/* View Container */}
                    {view === 'login' ? (
                        <LoginForm onSwitchToSignup={() => setView('signup')} onLogin={onLogin} />
                    ) : (
                        <SignupForm onSwitchToLogin={() => setView('login')} onSignup={onLogin} />
                    )}
                    
                </div>
                
                {/* Footer Info */}
                <AuthFooter />
            </div>
        </div>
    );
};

export default AuthPages;