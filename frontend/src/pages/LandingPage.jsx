import React, { useState, useEffect } from 'react';
import {
    Zap,
    Shield,
    Clock,
    Star,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    ChevronRight,
    CheckCircle,
    Users,
    Briefcase,
    ArrowRight,
    Menu,
    X,
    Wrench,
    Sparkles,
    Plug,
    Paintbrush,
    Home,
    Leaf,
    Play,
    Quote,
    Send,
    Heart
} from 'lucide-react';

const LandingPage = ({ onSelectRole }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const services = [
        { icon: Wrench, name: 'Plumbing', color: 'from-blue-500 to-blue-600', desc: 'Expert plumbing solutions' },
        { icon: Plug, name: 'Electrical', color: 'from-yellow-500 to-orange-500', desc: 'Safe electrical repairs' },
        { icon: Sparkles, name: 'Cleaning', color: 'from-cyan-500 to-teal-500', desc: 'Professional cleaning' },
        { icon: Paintbrush, name: 'Painting', color: 'from-purple-500 to-pink-500', desc: 'Quality paint jobs' },
        { icon: Home, name: 'Carpentry', color: 'from-amber-500 to-orange-600', desc: 'Custom woodwork' },
        { icon: Leaf, name: 'Landscaping', color: 'from-green-500 to-emerald-600', desc: 'Garden & outdoor' },
    ];

    const features = [
        { icon: Shield, title: 'Verified Professionals', desc: 'All service providers are background-checked and verified for your safety.' },
        { icon: Clock, title: 'Quick Response', desc: 'Get connected with nearby professionals within minutes, not hours.' },
        { icon: Star, title: 'Quality Guaranteed', desc: 'Satisfaction guaranteed with our quality assurance and review system.' },
        { icon: MapPin, title: 'Local Experts', desc: 'Find trusted professionals right in your neighborhood.' },
    ];

    const stats = [
        { value: '50K+', label: 'Happy Customers' },
        { value: '10K+', label: 'Service Providers' },
        { value: '100+', label: 'Cities Covered' },
        { value: '4.8', label: 'Average Rating' },
    ];

    const testimonials = [
        {
            name: 'Priya Sharma',
            role: 'Homeowner, Mumbai',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
            text: 'QuickServe made finding a reliable electrician so easy! The service was prompt and professional. Highly recommended!',
            rating: 5
        },
        {
            name: 'Rahul Verma',
            role: 'Business Owner, Delhi',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            text: 'As a service provider, QuickServe has helped me grow my business significantly. The platform is user-friendly and the support team is excellent.',
            rating: 5
        },
        {
            name: 'Anita Patel',
            role: 'Apartment Manager, Pune',
            image: 'https://randomuser.me/api/portraits/women/68.jpg',
            text: 'We use QuickServe for all our maintenance needs. The quality of professionals and the booking process is seamless.',
            rating: 5
        },
    ];

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-2xl font-bold ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                                Quick<span className="text-indigo-500">Serve</span>
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {['Home', 'Services', 'About', 'Contact'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className={`font-medium transition-colors hover:text-indigo-500 ${
                                        isScrolled ? 'text-slate-700' : 'text-white/90 hover:text-white'
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <button
                                onClick={() => onSelectRole('customer')}
                                className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                                    isScrolled 
                                        ? 'text-indigo-600 hover:bg-indigo-50' 
                                        : 'text-white hover:bg-white/10'
                                }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => onSelectRole('provider')}
                                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                            >
                                Join as Provider
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-lg ${isScrolled ? 'text-slate-900' : 'text-white'}`}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 shadow-xl">
                        <div className="px-4 py-6 space-y-4">
                            {['Home', 'Services', 'About', 'Contact'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="block w-full text-left px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-lg"
                                >
                                    {item}
                                </button>
                            ))}
                            <div className="pt-4 border-t border-slate-100 space-y-3">
                                <button
                                    onClick={() => onSelectRole('customer')}
                                    className="w-full px-4 py-3 text-indigo-600 font-semibold border-2 border-indigo-600 rounded-xl hover:bg-indigo-50"
                                >
                                    Login as Customer
                                </button>
                                <button
                                    onClick={() => onSelectRole('provider')}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl"
                                >
                                    Join as Provider
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-indigo-200 text-sm font-medium mb-6 border border-white/10">
                                <Sparkles className="w-4 h-4" />
                                Trusted by 50,000+ customers
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                                Find Local
                                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Service Experts
                                </span>
                                In Minutes
                            </h1>
                            
                            <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
                                Connect with verified professionals for all your home service needs. 
                                From plumbing to painting, we've got you covered with quality service guaranteed.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                                <button
                                    onClick={() => onSelectRole('customer')}
                                    className="group px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <Users className="w-5 h-5" />
                                    Book a Service
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => onSelectRole('provider')}
                                    className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg border-2 border-white/20 hover:border-white/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <Briefcase className="w-5 h-5" />
                                    Become a Provider
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex items-center gap-6 justify-center lg:justify-start">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <img
                                            key={i}
                                            src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`}
                                            alt="User"
                                            className="w-10 h-10 rounded-full border-2 border-white"
                                        />
                                    ))}
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-300">4.8/5 from 10,000+ reviews</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Service Cards */}
                        <div className="hidden lg:block relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                            <div className="relative grid grid-cols-2 gap-4">
                                {services.slice(0, 4).map((service, index) => (
                                    <div
                                        key={service.name}
                                        className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all hover:-translate-y-2 cursor-pointer ${
                                            index === 1 ? 'mt-8' : ''
                                        } ${index === 2 ? '-mt-4' : ''}`}
                                    >
                                        <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                                            <service.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-white font-semibold text-lg">{service.name}</h3>
                                        <p className="text-slate-400 text-sm mt-1">{service.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                        <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative -mt-20 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-slate-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
                            Our Services
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            What We Offer
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            From quick fixes to major renovations, our verified professionals are ready to help with all your home service needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={service.name}
                                className="group bg-white rounded-2xl p-8 shadow-lg shadow-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-slate-100"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <service.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                                <p className="text-slate-600 mb-4">{service.desc}</p>
                                <button className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                                    Learn More <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
                                Why Choose Us
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                The Smarter Way to Find
                                <span className="block text-indigo-600">Home Services</span>
                            </h2>
                            <p className="text-slate-600 mb-8">
                                We've simplified the process of finding reliable home service professionals. 
                                With our platform, you get quality, convenience, and peace of mind.
                            </p>

                            <div className="space-y-6">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                            <feature.icon className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                                            <p className="text-slate-600 text-sm">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl transform rotate-3"></div>
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                                        <CheckCircle className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Booking Confirmed!</h4>
                                        <p className="text-slate-500 text-sm">Your service is scheduled</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Provider" className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-semibold text-slate-900">Rajesh Kumar</p>
                                                <p className="text-xs text-slate-500">Expert Plumber</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="font-semibold">4.9</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-indigo-50 rounded-xl text-center">
                                            <p className="text-xs text-slate-500">Date</p>
                                            <p className="font-semibold text-indigo-600">Today, 3 PM</p>
                                        </div>
                                        <div className="p-3 bg-purple-50 rounded-xl text-center">
                                            <p className="text-xs text-slate-500">Duration</p>
                                            <p className="font-semibold text-purple-600">~2 Hours</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="about" className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 relative overflow-hidden">
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-white/10 text-indigo-300 rounded-full text-sm font-semibold mb-4 border border-white/10">
                            Testimonials
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            What Our Users Say
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Join thousands of satisfied customers and service providers who trust QuickServe.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12">
                            <Quote className="absolute top-6 left-6 w-12 h-12 text-indigo-400/30" />
                            
                            <div className="relative">
                                <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
                                    "{testimonials[activeTestimonial].text}"
                                </p>
                                
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={testimonials[activeTestimonial].image}
                                            alt={testimonials[activeTestimonial].name}
                                            className="w-14 h-14 rounded-full border-2 border-white/20"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-white">{testimonials[activeTestimonial].name}</h4>
                                            <p className="text-slate-400 text-sm">{testimonials[activeTestimonial].role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Dots */}
                            <div className="flex justify-center gap-2 mt-8">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTestimonial(index)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                                            index === activeTestimonial 
                                                ? 'bg-white w-8' 
                                                : 'bg-white/30 hover:bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                        
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
                                Whether you need a service or want to offer your skills, QuickServe is the platform for you.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => onSelectRole('customer')}
                                    className="group px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <Users className="w-5 h-5" />
                                    I Need a Service
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => onSelectRole('provider')}
                                    className="group px-8 py-4 bg-transparent text-white rounded-2xl font-bold text-lg border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <Briefcase className="w-5 h-5" />
                                    I'm a Service Provider
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
                                Get in Touch
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Have Questions?
                                <span className="block text-indigo-600">We're Here to Help</span>
                            </h2>
                            <p className="text-slate-600 mb-8">
                                Our support team is available 24/7 to assist you with any queries about our services, 
                                becoming a provider, or anything else.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Call Us</p>
                                        <p className="font-semibold text-slate-900">+91 1800-123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Email Us</p>
                                        <p className="font-semibold text-slate-900">support@quickserve.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Visit Us</p>
                                        <p className="font-semibold text-slate-900">Pune, Maharashtra, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Send us a Message</h3>
                            <form className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
                                        placeholder="Tell us more..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">
                                    Quick<span className="text-indigo-400">Serve</span>
                                </span>
                            </div>
                            <p className="text-slate-400 mb-6">
                                Connecting you with trusted local service professionals for all your home needs.
                            </p>
                            <div className="flex gap-4">
                                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
                            <ul className="space-y-3">
                                {['About Us', 'Our Services', 'How It Works', 'Pricing', 'Contact'].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="font-semibold text-lg mb-6">Services</h4>
                            <ul className="space-y-3">
                                {['Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Carpentry', 'HVAC'].map((service) => (
                                    <li key={service}>
                                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                            {service}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="font-semibold text-lg mb-6">Stay Updated</h4>
                            <p className="text-slate-400 mb-4">
                                Subscribe to our newsletter for updates and exclusive offers.
                            </p>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 text-sm">
                            © 2025 QuickServe. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                        </div>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in India
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
