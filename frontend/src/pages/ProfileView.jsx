import React, { useState, useEffect } from "react";
import { 
    User, MapPin, Star, Mail, Phone, Camera, Save, X, Plus,
    Clock, Briefcase, Award, Languages, CheckCircle, Calendar,
    Zap, Shield, Trash2
} from "lucide-react";

const ProfileSection = ({ profile: initialProfile, setProfile: updateProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(initialProfile);
    const [newSkill, setNewSkill] = useState("");
    const [newLanguage, setNewLanguage] = useState("");

    // Update local state when initialProfile changes
    useEffect(() => {
        if (initialProfile) {
            setProfile(initialProfile);
        }
    }, [initialProfile]);

    // Mock portfolio images
    const portfolio = [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
    ];

    const handleSave = (e) => {
        e.preventDefault();
        setIsEditing(false);
        updateProfile(profile);
        console.log("Saved:", profile);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfile(initialProfile);
    };

    // Skills handlers
    const addSkill = () => {
        if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
            setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });
    };

    // Languages handlers
    const addLanguage = () => {
        if (newLanguage.trim() && !profile.languages.includes(newLanguage.trim())) {
            setProfile({ ...profile, languages: [...profile.languages, newLanguage.trim()] });
            setNewLanguage("");
        }
    };

    const removeLanguage = (langToRemove) => {
        setProfile({ ...profile, languages: profile.languages.filter(l => l !== langToRemove) });
    };

    // Certifications handlers
    const addCertification = () => {
        setProfile({
            ...profile,
            certifications: [...profile.certifications, { name: "", issuer: "", year: "" }]
        });
    };

    const updateCertification = (index, field, value) => {
        const updated = [...profile.certifications];
        updated[index] = { ...updated[index], [field]: value };
        setProfile({ ...profile, certifications: updated });
    };

    const removeCertification = (index) => {
        setProfile({
            ...profile,
            certifications: profile.certifications.filter((_, i) => i !== index)
        });
    };

    // Working hours handlers
    const updateWorkingHours = (day, field, value) => {
        const currentDayHours = profile.workingHours?.[day] || { open: "09:00", close: "18:00", isOpen: false };
        setProfile({
            ...profile,
            workingHours: {
                ...profile.workingHours,
                [day]: { ...currentDayHours, [field]: value }
            }
        });
    };

    const formatTime = (time24) => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = {
        monday: 'Monday',
        tuesday: 'Tuesday', 
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
    };

    // Guard: Don't render if profile is not loaded
    if (!profile) {
        return (
            <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
                <p className="text-slate-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header / Main Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="px-6 pb-6">
                    <div className="flex justify-between items-end -mt-12 mb-6">
                        <div className="relative">
                            <img
                                src={profile.avatar}
                                alt="Profile"
                                className="w-24 h-24 rounded-xl border-4 border-white bg-white shadow-sm"
                            />
                            <button className="absolute bottom-0 right-0 bg-slate-800 text-white p-1.5 rounded-full hover:bg-slate-700 border-2 border-white">
                                <Camera className="w-3 h-3" />
                            </button>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Save
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                name: e.target.value,
                                            })
                                        }
                                        className="block w-full text-2xl font-bold border-b border-slate-200 focus:border-indigo-500 focus:outline-none pb-1"
                                    />
                                    <input
                                        type="text"
                                        value={profile.title}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                title: e.target.value,
                                            })
                                        }
                                        className="block w-full text-slate-500 border-b border-slate-200 focus:border-indigo-500 focus:outline-none pb-1"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold text-slate-800">
                                        {profile.name}
                                    </h1>
                                    <p className="text-slate-500 font-medium">
                                        {profile.title}
                                    </p>
                                </>
                            )}

                            <div className="flex items-center gap-2 mt-2 text-sm text-yellow-600 font-medium bg-yellow-50 inline-block px-2 py-1 rounded-md">
                                <Star className="w-4 h-4 fill-current" />
                                {profile.rating} ({profile.reviews} Reviews)
                            </div>
                            {profile.verified && (
                                <span className="inline-flex items-center gap-1 mt-2 ml-2 text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                                    <CheckCircle className="w-4 h-4" />
                                    Verified Provider
                                </span>
                            )}
                        </div>

                        {/* Bio Section */}
                        <div>
                            <h3 className="font-bold text-slate-800 mb-2">
                                About Me
                            </h3>
                            {isEditing ? (
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            bio: e.target.value,
                                        })
                                    }
                                    rows="4"
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-slate-600"
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed">
                                    {profile.bio}
                                </p>
                            )}
                        </div>

                        {/* Contact Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <Mail className="w-4 h-4" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                email: e.target.value,
                                            })
                                        }
                                        className="flex-1 border-b border-slate-200 focus:border-indigo-500 outline-none py-1"
                                    />
                                ) : (
                                    <span>{profile.email}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <Phone className="w-4 h-4" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="flex-1 border-b border-slate-200 focus:border-indigo-500 outline-none py-1"
                                    />
                                ) : (
                                    <span>{profile.phone}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.location}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                location: e.target.value,
                                            })
                                        }
                                        className="flex-1 border-b border-slate-200 focus:border-indigo-500 outline-none py-1"
                                    />
                                ) : (
                                    <span>{profile.location}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <span>Member since {profile.memberSince}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-2">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{profile.completedJobs}</p>
                    <p className="text-xs text-slate-500">Jobs Completed</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-2">
                        <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{profile.experience}</p>
                    <p className="text-xs text-slate-500">Experience</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mx-auto mb-2">
                        <Zap className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{profile.responseTime}</p>
                    <p className="text-xs text-slate-500">Avg Response</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-2">
                        <Star className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{profile.rating}</p>
                    <p className="text-xs text-slate-500">Rating</p>
                </div>
            </div>

            {/* Skills & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-slate-500" />
                        Skills & Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills?.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-full font-medium flex items-center gap-1"
                            >
                                {skill}
                                {isEditing && (
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="ml-1 text-indigo-400 hover:text-red-500"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>
                    {isEditing && (
                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                placeholder="Add a skill..."
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            />
                            <button
                                onClick={addSkill}
                                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Languages */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Languages className="w-4 h-4 text-slate-500" />
                        Languages Spoken
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.languages?.map((language, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full font-medium flex items-center gap-1"
                            >
                                {language}
                                {isEditing && (
                                    <button
                                        onClick={() => removeLanguage(language)}
                                        className="ml-1 text-slate-400 hover:text-red-500"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>
                    {isEditing && (
                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={newLanguage}
                                onChange={(e) => setNewLanguage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                                placeholder="Add a language..."
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            />
                            <button
                                onClick={addLanguage}
                                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Certifications & Working Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certifications */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-slate-500" />
                            Certifications
                        </h3>
                        {isEditing && (
                            <button
                                onClick={addCertification}
                                className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        )}
                    </div>
                    <div className="space-y-3">
                        {profile.certifications?.map((cert, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                {isEditing ? (
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={cert.name}
                                            onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                            placeholder="Certification name"
                                            className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:border-indigo-500 outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={cert.issuer}
                                                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                                placeholder="Issuer"
                                                className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm focus:border-indigo-500 outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={cert.year}
                                                onChange={(e) => updateCertification(index, 'year', e.target.value)}
                                                placeholder="Year"
                                                className="w-20 px-2 py-1 border border-slate-200 rounded text-sm focus:border-indigo-500 outline-none"
                                            />
                                            <button
                                                onClick={() => removeCertification(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="font-medium text-slate-800">{cert.name}</p>
                                        <p className="text-sm text-slate-500">{cert.issuer} • {cert.year}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        Working Hours
                    </h3>
                    <div className="space-y-2">
                        {days.map((day) => (
                            <div key={day} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="font-medium text-slate-700 w-24">{dayLabels[day]}</span>
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={profile.workingHours?.[day]?.isOpen ?? false}
                                                onChange={(e) => updateWorkingHours(day, 'isOpen', e.target.checked)}
                                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                            />
                                            <span className="text-xs text-slate-500">Open</span>
                                        </label>
                                        {profile.workingHours?.[day]?.isOpen && (
                                            <>
                                                <input
                                                    type="time"
                                                    value={profile.workingHours?.[day]?.open || "09:00"}
                                                    onChange={(e) => updateWorkingHours(day, 'open', e.target.value)}
                                                    className="px-2 py-1 border border-slate-200 rounded text-xs focus:border-indigo-500 outline-none"
                                                />
                                                <span className="text-slate-400">-</span>
                                                <input
                                                    type="time"
                                                    value={profile.workingHours?.[day]?.close || "18:00"}
                                                    onChange={(e) => updateWorkingHours(day, 'close', e.target.value)}
                                                    className="px-2 py-1 border border-slate-200 rounded text-xs focus:border-indigo-500 outline-none"
                                                />
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <span className={`text-sm ${profile.workingHours?.[day]?.isOpen ? 'text-slate-600' : 'text-red-500'}`}>
                                        {profile.workingHours?.[day]?.isOpen 
                                            ? `${formatTime(profile.workingHours[day].open)} - ${formatTime(profile.workingHours[day].close)}`
                                            : 'Closed'
                                        }
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Portfolio Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Recent Work</h3>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                        Add Photos
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {portfolio.map((src, index) => (
                        <div
                            key={index}
                            className="aspect-video bg-slate-100 rounded-lg overflow-hidden relative group"
                        >
                            {/* Using a placeholder div for demo purposes */}
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                Work Sample {index + 1}
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <button className="p-2 bg-white rounded-full text-slate-800 hover:text-indigo-600">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
