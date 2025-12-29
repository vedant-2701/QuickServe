import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, 
    MapPin, 
    Star, 
    Clock, 
    Filter,
    SlidersHorizontal,
    ChevronDown,
    Shield,
    X,
    Grid,
    List,
    IndianRupee,
    Loader2
} from 'lucide-react';
import useCustomerStore from '../../store/useCustomerStore';

// Generic placeholder avatar using UI Avatars
const getPlaceholderAvatar = (name) => {
    const encodedName = encodeURIComponent(name || 'Provider');
    return `https://ui-avatars.com/api/?name=${encodedName}&background=6366f1&color=fff&size=100`;
};

const BrowseServices = ({ onNavigate, initialFilters = {} }) => {
    const { 
        providers, 
        categories, 
        isLoadingProviders, 
        searchProviders, 
        fetchCategories 
    } = useCustomerStore();

    const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
    const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || 'All');
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [sortBy, setSortBy] = useState('rating');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [city, setCity] = useState('');

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Debounced search function
    const fetchProviders = useCallback(() => {
        const params = {
            category: selectedCategory !== 'All' ? selectedCategory : undefined,
            city: city || undefined,
            search: searchQuery || undefined,
            minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
            maxPrice: priceRange[1] < 2000 ? priceRange[1] : undefined,
            sortBy: sortBy,
            page: 0,
            size: 20
        };
        searchProviders(params);
    }, [selectedCategory, city, searchQuery, priceRange, sortBy]);

    // Fetch providers when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProviders();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [selectedCategory, city, searchQuery, sortBy, priceRange]);

    // Initial fetch
    useEffect(() => {
        fetchProviders();
    }, []);

    // Get category names for display
    const categoryNames = ['All', ...categories.map(c => c.displayName)];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Browse Service Providers</h1>
                <p className="text-slate-500">Find and book trusted professionals in your area</p>
            </div>

            {/* Search and Filters Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by service or provider name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                        >
                            <option value="rating">Highest Rated</option>
                            <option value="reviews">Most Reviews</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition ${
                            showFilters 
                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                        }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        Filters
                    </button>

                    {/* View Mode Toggle */}
                    <div className="flex border border-slate-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-3 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Price Range (₹/hr)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        placeholder="Min"
                                    />
                                    <span className="text-slate-400">-</span>
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000])}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter your city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>

                            {/* Verified Only */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Provider Type
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                                    <span className="text-sm text-slate-600">Verified providers only</span>
                                </label>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All');
                                        setPriceRange([0, 2000]);
                                    }}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categoryNames.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                            selectedCategory === category
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-slate-600">
                    {isLoadingProviders ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Searching...
                        </span>
                    ) : (
                        <>
                            <span className="font-semibold">{providers.length}</span> providers found
                            {selectedCategory !== 'All' && <span> in <span className="font-semibold">{selectedCategory}</span></span>}
                        </>
                    )}
                </p>
            </div>

            {/* Providers Grid/List */}
            {isLoadingProviders ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : providers.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No providers found</h3>
                    <p className="text-slate-500 mb-4">Try adjusting your search or filters</p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                            setPriceRange([0, 2000]);
                            setCity('');
                        }}
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-4'
                }>
                    {providers.map((provider) => (
                        <div
                            key={provider.id}
                            onClick={() => onNavigate && onNavigate('provider', { id: provider.id })}
                            className={`bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer group ${
                                viewMode === 'list' ? 'flex gap-6 p-4' : 'p-6'
                            }`}
                        >
                            {/* Provider Image */}
                            <div className={`relative ${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                                <img
                                    src={provider.avatarUrl || getPlaceholderAvatar(provider.name)}
                                    alt={provider.name}
                                    className={`object-cover rounded-xl ${viewMode === 'list' ? 'w-24 h-24' : 'w-full h-40'}`}
                                />
                                {provider.verified && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> Verified
                                    </div>
                                )}
                            </div>

                            {/* Provider Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">
                                            {provider.name}
                                        </h3>
                                        <p className="text-sm text-indigo-600 font-medium">{provider.primaryService}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-800">₹{provider.hourlyRate || 0}</div>
                                        <div className="text-xs text-slate-500">per hour</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-semibold text-slate-800">{provider.averageRating?.toFixed(1) || 'New'}</span>
                                    </div>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-sm text-slate-500">{provider.totalReviews || 0} reviews</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-sm text-slate-500">{provider.completedJobs || 0} jobs</span>
                                </div>

                                {provider.services && provider.services.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {provider.services.slice(0, 3).map((service, index) => (
                                            <span 
                                                key={index}
                                                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg"
                                            >
                                                {service}
                                            </span>
                                        ))}
                                        {provider.services.length > 3 && (
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-lg">
                                                +{provider.services.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        {provider.experienceYears > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {provider.experienceYears}+ yrs exp
                                            </span>
                                        )}
                                        {provider.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {provider.location}
                                            </span>
                                        )}
                                    </div>
                                    <button className="text-indigo-600 font-semibold text-sm hover:underline">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseServices;
