import React, { useState, useEffect } from 'react';
import { 
    Search, 
    MapPin, 
    Star, 
    Clock, 
    ChevronRight,
    Sparkles,
    Shield,
    ThumbsUp,
    Zap,
    Filter,
    ArrowRight,
    Loader2,
    Wrench,
    Hammer,
    Paintbrush,
    Wind,
    TreeDeciduous,
    Bug,
    Settings,
    Home,
    Square
} from 'lucide-react';
import useCustomerStore from '../../store/useCustomerStore';

// Generic placeholder avatar using UI Avatars
const getPlaceholderAvatar = (name) => {
    const encodedName = encodeURIComponent(name || 'Provider');
    return `https://ui-avatars.com/api/?name=${encodedName}&background=6366f1&color=fff&size=100`;
};

const CustomerHome = ({ onNavigate, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');

    const { 
        categories, 
        providers, 
        isLoadingProviders, 
        fetchCategories, 
        searchProviders 
    } = useCustomerStore();

    useEffect(() => {
        fetchCategories();
        // Fetch top rated providers
        searchProviders({ sortBy: 'rating', limit: 3 });
    }, [fetchCategories, searchProviders]);

    // Map backend icon names to Lucide components and colors
    const categoryIconMap = {
        'wrench': { Icon: Wrench, color: 'bg-blue-100 text-blue-600' },
        'zap': { Icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
        'sparkles': { Icon: Sparkles, color: 'bg-green-100 text-green-600' },
        'hammer': { Icon: Hammer, color: 'bg-orange-100 text-orange-600' },
        'paintbrush': { Icon: Paintbrush, color: 'bg-purple-100 text-purple-600' },
        'wind': { Icon: Wind, color: 'bg-cyan-100 text-cyan-600' },
        'tree-deciduous': { Icon: TreeDeciduous, color: 'bg-emerald-100 text-emerald-600' },
        'bug': { Icon: Bug, color: 'bg-red-100 text-red-600' },
        'settings': { Icon: Settings, color: 'bg-indigo-100 text-indigo-600' },
        'shield': { Icon: Shield, color: 'bg-violet-100 text-violet-600' },
        'home': { Icon: Home, color: 'bg-amber-100 text-amber-600' },
        'square': { Icon: Square, color: 'bg-teal-100 text-teal-600' },
    };

    const getIconForCategory = (iconName) => {
        return categoryIconMap[iconName] || { Icon: Wrench, color: 'bg-slate-100 text-slate-600' };
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch({ query: searchQuery, location });
        }
        if (onNavigate) {
            onNavigate('browse', { query: searchQuery, location });
        }
    };

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <span className="text-indigo-200 text-sm font-medium">Trusted by 50,000+ customers</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Find Trusted Home Service<br />Professionals Near You
                    </h1>
                    <p className="text-indigo-200 text-lg mb-8 max-w-xl">
                        Book verified experts for plumbing, electrical, cleaning, and more. 
                        Quality service at your doorstep.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-2xl shadow-xl">
                        <div className="flex-1 flex items-center gap-3 px-4 py-2">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="What service do you need?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 text-slate-800 placeholder-slate-400 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 border-t md:border-t-0 md:border-l border-slate-200">
                            <MapPin className="w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Your location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="flex-1 text-slate-800 placeholder-slate-400 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Search
                        </button>
                    </form>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-6 mt-8">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-400" />
                            <span className="text-sm">Verified Professionals</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThumbsUp className="w-5 h-5 text-blue-400" />
                            <span className="text-sm">Satisfaction Guaranteed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm">Quick Response</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Services */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Popular Services</h2>
                        <p className="text-slate-500">Choose from our most requested services</p>
                    </div>
                    <button 
                        onClick={() => onNavigate && onNavigate('browse')}
                        className="text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        View All <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.slice(0, 8).map((category) => {
                        const { Icon, color } = getIconForCategory(category.icon);
                        return (
                            <button
                                key={category.value}
                                onClick={() => onNavigate && onNavigate('browse', { category: category.value })}
                                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group text-left"
                            >
                                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-slate-800 mb-1">{category.displayName}</h3>
                                <p className="text-sm text-slate-500">{category.providerCount || 0} providers</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Featured Providers */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Top Rated Providers</h2>
                        <p className="text-slate-500">Highly recommended by customers</p>
                    </div>
                    <button 
                        onClick={() => onNavigate && onNavigate('browse')}
                        className="text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        View All <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoadingProviders ? (
                        <div className="col-span-3 flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                        </div>
                    ) : providers.length > 0 ? (
                        providers.slice(0, 3).map((provider) => (
                            <div
                                key={provider.id}
                                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group"
                                onClick={() => onNavigate && onNavigate('provider', { id: provider.id })}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="relative">
                                        <img
                                            src={provider.avatarUrl || getPlaceholderAvatar(provider.name)}
                                            alt={provider.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        {provider.verified && (
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                <Shield className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">{provider.name}</h3>
                                        <p className="text-sm text-slate-500">{provider.primaryService}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-semibold text-slate-800">{provider.averageRating?.toFixed(1) || 'New'}</span>
                                            </div>
                                            <span className="text-slate-400">•</span>
                                            <span className="text-sm text-slate-500">{provider.totalReviews || 0} reviews</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <MapPin className="w-4 h-4" />
                                        {provider.location || 'Location not set'}
                                    </div>
                                    <div className="font-bold text-indigo-600">
                                        ₹{provider.hourlyRate || 0}/hr
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-8 text-slate-500">
                            No providers available yet
                        </div>
                    )}
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 md:p-12">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">How It Works</h2>
                    <p className="text-slate-500">Book a service in 3 easy steps</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: 1, title: 'Search & Compare', desc: 'Find verified professionals in your area and compare prices.', icon: Search },
                        { step: 2, title: 'Book Instantly', desc: 'Choose a convenient time slot and book your service online.', icon: Clock },
                        { step: 3, title: 'Get It Done', desc: 'Professional arrives at your doorstep and completes the job.', icon: ThumbsUp },
                    ].map((item) => (
                        <div key={item.step} className="text-center">
                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <item.icon className="w-7 h-7" />
                            </div>
                            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                                Step {item.step}
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                            <p className="text-slate-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
                <p className="text-indigo-200 mb-6 max-w-xl mx-auto">
                    Join thousands of happy customers who trust QuickServe for their home service needs.
                </p>
                <button 
                    onClick={() => onNavigate && onNavigate('browse')}
                    className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition inline-flex items-center gap-2"
                >
                    Browse Services <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default CustomerHome;
