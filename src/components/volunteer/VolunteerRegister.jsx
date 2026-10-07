"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Mail, Phone, MapPin, Briefcase, ChevronRight,
    Check, ArrowRight, AlertCircle, Globe, Award, Heart,
    ShieldCheck, Star, Users, Flame, ArrowLeft, X, Search as SearchIcon,
    Droplet, Building, CheckSquare, Sparkles
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { useRegisterVolunteerMutation } from "@/utils/slices/authApiSlice"
import { setCredentials } from "@/utils/slices/authSlice"
import { useAppToast } from "@/app/AppToastContext"
import { useLocationData } from "@/utils/hooks/useLocationData"

export default function VolunteerRegister({ darkMode }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const communityParam = searchParams ? searchParams.get("community") : null

    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.auth.userInfo)
    const [registerVolunteer] = useRegisterVolunteerMutation()
    const { showToast } = useAppToast()
    const {
        states,
        cities: citiesCache,
        professions,
        loadingStates,
        loadingCities,
        fetchStates: loadStates,
        fetchCities: loadCities,
        fetchProfessions: loadProfessions
    } = useLocationData()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        state: "",
        city: "",
        pincode: "",
        address: "",
        expertise: "",
        customExpertise: "",
        helpDescription: "",
        community: communityParam || "",
        bloodGroup: "",
        consentGiven: false
    })

    const helpWordCount = formData.helpDescription.trim() ? formData.helpDescription.trim().split(/\s+/).length : 0;

    const [selectedStateCode, setSelectedStateCode] = useState("")
    const [cities, setCities] = useState([])
    const [showCustomExpertise, setShowCustomExpertise] = useState(false)
    const [activeStep, setActiveStep] = useState(1)
    const [openDropdown, setOpenDropdown] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const dropdownRef = useRef(null)

    useEffect(() => {
        loadStates()
        loadProfessions()

        // CASE 1: Pre-fill form if user is logged in
        if (userInfo) {
            setFormData(prev => ({
                ...prev,
                fullName: userInfo.fullName || prev.fullName,
                email: userInfo.email || prev.email,
                phone: userInfo.mobileNo || prev.phone,
                gender: userInfo.gender || prev.gender,
                state: userInfo.kycDetails?.state || prev.state,
                city: userInfo.kycDetails?.city || prev.city,
                pincode: userInfo.kycDetails?.pincode || prev.pincode,
                address: userInfo.address || userInfo.kycDetails?.address || prev.address,
                expertise: userInfo.profession || prev.expertise,
                bloodGroup: userInfo.bloodGroup || prev.bloodGroup,
                consentGiven: userInfo.consentGiven !== undefined ? userInfo.consentGiven : prev.consentGiven
            }))
        }
    }, [userInfo])

    // Load cities if a state is already pre-filled from userInfo
    useEffect(() => {
        if (userInfo?.kycDetails?.state && states.length > 0) {
            const matchedState = states.find(s => s.name === userInfo.kycDetails.state)
            if (matchedState) {
                setSelectedStateCode(matchedState.iso2)
                loadCities(matchedState.iso2)
            }
        }
    }, [userInfo, states])

    useEffect(() => {
        if (selectedStateCode && citiesCache[selectedStateCode]) {
            setCities(citiesCache[selectedStateCode])
        }
    }, [selectedStateCode, citiesCache])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleStateChange = (e) => {
        const stateName = e.target.value
        const selectedState = states.find(s => s.name === stateName)
        setFormData(prev => ({ ...prev, state: stateName, city: "" }))
        if (selectedState) {
            fetchCities(selectedState.iso2)
        }
    }

    const handleExpertiseChange = (e) => {
        const value = e.target.value
        setFormData(prev => ({ ...prev, expertise: value }))
        setShowCustomExpertise(value === "Other")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const activeCommunity = formData.community || communityParam;

        if (!formData.fullName || !formData.email || !formData.phone || !formData.gender || !formData.state || !formData.city || !formData.expertise || !formData.helpDescription) {
            showToast({
                title: "Incomplete Form",
                message: "Please fill all required fields",
                type: "warning"
            })
            setLoading(false)
            return
        }

        if (activeCommunity === "Blood Donors") {
            if (!formData.bloodGroup) {
                showToast({
                    title: "Blood Group Required",
                    message: "Please select your blood group",
                    type: "warning"
                })
                setLoading(false)
                return
            }
            if (!formData.address) {
                showToast({
                    title: "Detailed Address Required",
                    message: "Please enter your street address to locate you for blood requests",
                    type: "warning"
                })
                setLoading(false)
                return
            }
            if (!formData.consentGiven) {
                showToast({
                    title: "Consent Required",
                    message: "Please check the consent box to allow TPF to contact you for blood donations",
                    type: "warning"
                })
                setLoading(false)
                return
            }
        }

        if (formData.expertise === "Other" && !formData.customExpertise) {
            showToast({
                title: "Specify Expertise",
                message: "Please describe your professional strength",
                type: "warning"
            })
            setLoading(false)
            return
        }

        if (helpWordCount > 500) {
            showToast({
                title: "Limit Exceeded",
                message: "Description should not exceed 500 words",
                type: "warning"
            })
            setLoading(false)
            return
        }

        try {
            const professionToUpdate = formData.expertise === "Other" ? formData.customExpertise : formData.expertise;

            const res = await registerVolunteer({
                fullName: formData.fullName,
                email: formData.email,
                mobileNo: formData.phone,
                gender: formData.gender,
                state: formData.state,
                city: formData.city,
                pincode: formData.pincode,
                address: formData.address,
                profession: professionToUpdate,
                helpDescription: formData.helpDescription,
                community: activeCommunity,
                bloodGroup: formData.bloodGroup,
                consentGiven: formData.consentGiven
            }).unwrap()

            if (userInfo && res?.user) {
                dispatch(setCredentials({
                    ...(userInfo || {}),
                    ...res.user,
                    type: "user"
                }))
            }

            showToast({
                title: userInfo ? "Welcome to the Circle!" : "Registration Submitted!",
                message: userInfo
                    ? (activeCommunity 
                        ? `You've joined the ${activeCommunity} community as a certified TPF Volunteer.`
                        : "You're now a certified TPF Volunteer.")
                    : "Volunteer registration successful! Please log in with your phone and OTP to access your account.",
                type: "success",
                duration: 3500
            })

            setTimeout(() => {
                if (userInfo) {
                    const slug = activeCommunity ? activeCommunity.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';
                    router.push(slug ? `/community/${slug}` : '/#communities')
                } else {
                    router.push("/login")
                }
            }, 2500)
        } catch (error) {
            console.error("Volunteer Reg Error:", error)

            // Handle specific error cases
            const errorMessage = error?.data?.message || "Could not complete registration";

            showToast({
                title: "Registration Failed",
                message: errorMessage,
                type: "error",
                duration: 4000
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredStates = states.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredCities = cities.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredProfessions = professions.filter(p =>
        p.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleStateSelect = (s) => {
        setFormData(prev => ({ ...prev, state: s.name, city: "" }))
        setSelectedStateCode(s.iso2)
        loadCities(s.iso2)
        setOpenDropdown(null)
        setSearchTerm("")
    }

    const handleCitySelect = (c) => {
        setFormData(prev => ({ ...prev, city: c.name }))
        setOpenDropdown(null)
        setSearchTerm("")
    }

    const handleProfessionSelect = (p) => {
        setFormData(prev => ({ ...prev, expertise: p }))
        setShowCustomExpertise(p === "Other")
        setOpenDropdown(null)
        setSearchTerm("")
    }

    const toggleDropdown = (name) => {
        if (openDropdown === name) {
            setOpenDropdown(null)
        } else {
            setOpenDropdown(name)
            setSearchTerm("")
        }
    }

    const SearchPicker = ({ isOpen, onClose, title, items, onSelect, placeholder, showSearch = true }) => {
        const [pickerSearch, setPickerSearch] = useState("")
        const filtered = items.filter(item =>
            (item.name || item).toLowerCase().includes(pickerSearch.toLowerCase())
        )

        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className={`w-full max-w-lg pointer-events-auto rounded-[2.5rem] border overflow-hidden shadow-2xl ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'
                                }`}>
                                <div className="p-6 border-b border-zinc-800/10 flex items-center justify-between">
                                    <h3 className="text-xl font-black">{title}</h3>
                                    <button onClick={onClose} className="p-2 hover:bg-zinc-500/10 rounded-full transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    {showSearch && (
                                        <div className="relative mb-4">
                                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder={placeholder}
                                                value={pickerSearch}
                                                onChange={(e) => setPickerSearch(e.target.value)}
                                                className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium ${darkMode
                                                    ? 'bg-zinc-800 border-zinc-700/50 focus:border-emerald-500 text-white'
                                                    : 'bg-gray-50 border-gray-200 focus:border-emerald-500 text-gray-900'
                                                    }`}
                                            />
                                        </div>
                                    )}
                                    <div
                                        className="max-h-[350px] overflow-y-auto overflow-x-hidden custom-scrollbar space-y-1"
                                        onWheel={(e) => e.stopPropagation()}
                                        onTouchMove={(e) => e.stopPropagation()}
                                    >
                                        {filtered.length > 0 ? (
                                            filtered.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        onSelect(item)
                                                        onClose()
                                                    }}
                                                    className={`px-6 py-4 rounded-2xl cursor-pointer text-sm font-bold transition-all flex items-center justify-between hover:scale-[1.01] ${darkMode
                                                        ? 'text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-400'
                                                        : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                                                        }`}
                                                >
                                                    {item.name || item}
                                                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center text-zinc-500 italic">No results found</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        )
    }

    return (
        <div className={`min-h-screen relative overflow-x-hidden ${darkMode ? 'bg-zinc-950 text-white' : 'bg-[#FDFDFD] text-gray-900'}`}>
            {/* Back Button */}
            <div className="hidden sm:block absolute top-10 left-8 z-40">
                <button
                    onClick={() => router.back()}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${darkMode
                        ? 'bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-700'
                        : 'bg-white/50 hover:bg-white text-gray-500 hover:text-gray-900 border-gray-100 shadow-sm'
                        } border backdrop-blur-md`}
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-bold uppercase tracking-wider">Back</span>
                </button>
            </div>
            {/* Premium Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-0 right-0 w-1/3 h-1/2 blur-[150px] opacity-20 ${darkMode ? 'bg-emerald-600' : 'bg-emerald-200'}`} />
                <div className={`absolute bottom-0 left-0 w-1/3 h-1/2 blur-[150px] opacity-10 ${darkMode ? 'bg-teal-600' : 'bg-teal-200'}`} />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>

            {/* Hero Section */}
            <div className="relative pt-24 pb-12 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6 font-arabic text-2xl sm:text-3xl"
                    style={{ color: '#D4AF37' }}
                >
                    بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight px-4 leading-tight">
                        Join the <span className="text-emerald-500">Circle of Impact</span>
                    </h1>
                    <p className={`text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-medium px-4 ${darkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                        Become a certified TPF Volunteer and dedicate your expertise to the service of humanity.
                    </p>
                </motion.div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 pb-24">
                <div className="grid lg:grid-cols-12 gap-12 items-start">

                    {/* Left Side: Prestige & Stats */}
                    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="space-y-8"
                        >
                            {/* Badge Preview Card */}
                            <div className={`p-1 rounded-[2.5rem] bg-gradient-to-br ${darkMode ? 'from-[#D4AF37]/40 to-emerald-600/20' : 'from-[#D4AF37]/20 to-emerald-600/10 shadow-xl'}`}>
                                <div className={`p-4 rounded-[2.3rem] overflow-hidden ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
                                        <img
                                            src="/VolunteerID.webp"
                                            alt="TPF Volunteer Badge Mockup"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                                            <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Your Future Identity</p>
                                            <p className="text-[#D4AF37] text-base font-black uppercase">Official Contributor</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-1 rounded-[2.5rem] bg-gradient-to-br ${darkMode ? 'from-zinc-800 to-zinc-900' : 'from-gray-100 to-white shadow-xl shadow-gray-200/50'}`}>
                                <div className={`p-8 rounded-[2.3rem] overflow-hidden relative ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                                    {/* Visual Accent */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12 blur-2xl" />

                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                                        Why Volunteer?
                                    </h3>

                                    <div className="space-y-6">
                                        {[
                                            { icon: ShieldCheck, color: "emerald", label: "Certified Role", desc: "Gain official recognition as a TPF Aid humanitarian contributor." },
                                            { icon: Flame, color: "orange", label: "Direct Impact", desc: "Your skills go directly into field projects changing real lives." },
                                            { icon: Users, color: "blue", label: "Exclusive Network", desc: "Join a curated circle of professional volunteers worldwide." }
                                        ].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 + (i * 0.1) }}
                                                className="group"
                                            >
                                                <div className="flex gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${darkMode ? 'bg-zinc-800' : 'bg-gray-50'}`}>
                                                        <item.icon className={`w-6 h-6 ${item.color === 'emerald' ? 'text-emerald-500' : item.color === 'orange' ? 'text-orange-500' : 'text-blue-500'}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm uppercase tracking-wider mb-1" style={{ color: '#D4AF37' }}>{item.label}</p>
                                                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{item.desc}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>


                                </div>
                            </div>
                        </motion.div>

                        {/* Quote Plate */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-center italic"
                        >
                            <p className={`text-sm ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                "And cooperate in righteousness and piety."
                                <br />
                                <span className="text-[10px] mt-2 block uppercase text-gray-500 tracking-widest opacity-70">— Surah Al-Ma'idah, 5:2 - Mafhoom</span>
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Side: Registration Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="lg:col-span-8"
                    >
                        <div className={`p-5 sm:p-8 lg:p-12 rounded-[2rem] sm:rounded-[3.5rem] border relative overflow-hidden ${darkMode
                            ? 'bg-zinc-900/60 backdrop-blur-2xl border-zinc-800 shadow-2xl'
                            : 'bg-white border-gray-100 shadow-2xl shadow-emerald-900/5'
                            }`}>
                            {/* Form Decorative Element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                                        Enrollment Form
                                    </h2>
                                    <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-[#D4AF37] rounded-full" />
                                </div>
                            </div>

                            {(formData.community || communityParam) && (
                                <div className={`p-4 rounded-2xl border mb-8 flex items-center justify-between ${
                                    darkMode ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-emerald-500" />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Joining Community</p>
                                            <p className="text-lg font-extrabold">{formData.community || communityParam}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-3 py-1 bg-emerald-600 text-white rounded-full font-bold">Community Member</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Full Name */}
                                    <div className="space-y-3">
                                        <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                            <User size={14} className="text-[#D4AF37]" /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Muhammad Ali"
                                            className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium ${darkMode
                                                ? 'bg-zinc-800/50 border-zinc-700/50 focus:border-[#D4AF37] text-white focus:bg-zinc-800'
                                                : 'bg-gray-50 border-gray-100 focus:border-[#D4AF37] text-gray-900 focus:bg-white focus:shadow-md'
                                                }`}
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-3">
                                        <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                            <Mail size={14} className="text-[#D4AF37]" /> Official Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="abdul@gmail.com"
                                            className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium ${darkMode
                                                ? 'bg-zinc-800/50 border-zinc-700/50 focus:border-[#D4AF37] text-white focus:bg-zinc-800'
                                                : 'bg-gray-50 border-gray-100 focus:border-[#D4AF37] text-gray-900 focus:bg-white focus:shadow-md'
                                                }`}
                                            required
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-3">
                                        <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                            <Phone size={14} className="text-[#D4AF37]" /> Primary Phone
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+91</span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                                                placeholder="00000 00000"
                                                className={`w-full pl-16 pr-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium ${darkMode
                                                    ? 'bg-zinc-800/50 border-zinc-700/50 focus:border-[#D4AF37] text-white focus:bg-zinc-800'
                                                    : 'bg-gray-50 border-gray-100 focus:border-[#D4AF37] text-gray-900 focus:bg-white focus:shadow-md'
                                                    }`}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Gender Selector */}
                                    <div className="space-y-3">
                                        <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                            <Check size={14} className="text-[#D4AF37]" /> Identity
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setOpenDropdown('gender')}
                                            className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium text-left flex justify-between items-center ${darkMode
                                                ? 'bg-zinc-800/50 border-zinc-700/50 hover:border-[#D4AF37]/50'
                                                : 'bg-gray-50 border-gray-100 hover:border-[#D4AF37]/50'
                                                }`}
                                        >
                                            <span className={!formData.gender ? (darkMode ? 'text-zinc-500' : 'text-gray-400') : 'text-inherit'}>
                                                {formData.gender || "Select Identity"}
                                            </span>
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <SearchPicker
                                            isOpen={openDropdown === 'gender'}
                                            onClose={() => setOpenDropdown(null)}
                                            title="Gender Selection"
                                            showSearch={false}
                                            items={["Male", "Female"]}
                                            onSelect={(val) => setFormData(prev => ({ ...prev, gender: val }))}
                                        />
                                    </div>

                                    {/* State Selector */}
                                    <div className="space-y-3">
                                        <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                            <Globe size={14} className="text-[#D4AF37]" /> Resident State
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setOpenDropdown('state')}
                                            className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium text-left flex justify-between items-center ${darkMode
                                                ? 'bg-zinc-800/50 border-zinc-700/50 hover:border-emerald-500/50'
                                                : 'bg-gray-50 border-gray-100 hover:border-emerald-500/50'
                                                }`}
                                        >
                                            <span className={!formData.state ? (darkMode ? 'text-zinc-500' : 'text-gray-400') : 'text-inherit'}>
                                                {formData.state || "Select State"}
                                            </span>
                                            <ChevronRight className={`w-5 h-5 transition-transform ${openDropdown === 'state' ? 'rotate-90' : ''}`} />
                                        </button>
                                        <SearchPicker
                                            isOpen={openDropdown === 'state'}
                                            onClose={() => setOpenDropdown(null)}
                                            title="Select State"
                                            placeholder="Search state..."
                                            items={states}
                                            onSelect={handleStateSelect}
                                        />
                                    </div>

                                    {/* City Selector */}
                                    <div className="space-y-3">
                                        <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                            <MapPin size={14} className="text-[#D4AF37]" /> Current City
                                        </label>
                                        <button
                                            type="button"
                                            disabled={!formData.state}
                                            onClick={() => setOpenDropdown('city')}
                                            className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium text-left flex justify-between items-center ${darkMode
                                                ? 'bg-zinc-800/50 border-zinc-700/50'
                                                : 'bg-gray-50 border-gray-100'
                                                } ${!formData.state ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500/50'}`}
                                        >
                                            <span className={!formData.city ? (darkMode ? 'text-zinc-500' : 'text-gray-400') : 'text-inherit'}>
                                                {formData.city || "Choose City"}
                                            </span>
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <SearchPicker
                                            isOpen={openDropdown === 'city'}
                                            onClose={() => setOpenDropdown(null)}
                                            title={`Cities in ${formData.state}`}
                                            placeholder="Search city..."
                                            items={cities}
                                            onSelect={handleCitySelect}
                                        />
                                    </div>

                                    {/* Pincode */}
                                    <div className="space-y-3">
                                        <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                            <Building size={14} className="text-[#D4AF37]" /> Postal Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                                            placeholder="e.g. 400001"
                                            className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium ${darkMode
                                                ? 'bg-zinc-800/50 border-zinc-700/50 focus:border-[#D4AF37] text-white focus:bg-zinc-800'
                                                : 'bg-gray-50 border-gray-100 focus:border-[#D4AF37] text-gray-900 focus:bg-white focus:shadow-md'
                                                }`}
                                        />
                                    </div>

                                    {/* Blood Group Selector (if Blood Donors) */}
                                    {(formData.community === "Blood Donors" || communityParam === "Blood Donors") && (
                                        <div className="space-y-3">
                                            <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                                <Droplet size={14} className="text-red-500 fill-red-500" /> Blood Group <span className="text-red-500">*</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setOpenDropdown('bloodGroup')}
                                                className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium text-left flex justify-between items-center ${darkMode
                                                    ? 'bg-zinc-800/50 border-zinc-700/50 hover:border-red-500/50'
                                                    : 'bg-gray-50 border-gray-100 hover:border-red-500/50'
                                                    }`}
                                            >
                                                <span className={!formData.bloodGroup ? (darkMode ? 'text-zinc-500' : 'text-gray-400') : 'text-red-500 font-bold'}>
                                                    {formData.bloodGroup || "Select Blood Group"}
                                                </span>
                                                <ChevronRight className="w-5 h-5 text-red-500" />
                                            </button>
                                            <SearchPicker
                                                isOpen={openDropdown === 'bloodGroup'}
                                                onClose={() => setOpenDropdown(null)}
                                                title="Select Blood Group"
                                                showSearch={false}
                                                items={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                                                onSelect={(val) => setFormData(prev => ({ ...prev, bloodGroup: val }))}
                                            />
                                        </div>
                                    )}

                                    {/* Detailed Address */}
                                    <div className="md:col-span-2 space-y-3">
                                        <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                            <MapPin size={14} className="text-[#D4AF37]" /> Full Street Address {(formData.community === "Blood Donors" || communityParam === "Blood Donors") && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Flat/House No., Street, Area locality to accurately locate you for requests"
                                            className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium ${darkMode
                                                ? 'bg-zinc-800/50 border-zinc-700/50 focus:border-[#D4AF37] text-white focus:bg-zinc-800'
                                                : 'bg-gray-50 border-gray-100 focus:border-[#D4AF37] text-gray-900 focus:bg-white focus:shadow-md'
                                                }`}
                                            required={formData.community === "Blood Donors" || communityParam === "Blood Donors"}
                                        />
                                    </div>

                                    {/* Consent Checkbox */}
                                    <div className="md:col-span-2">
                                        <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                                            formData.consentGiven
                                                ? (darkMode ? 'bg-emerald-950/40 border-emerald-700' : 'bg-emerald-50/80 border-emerald-300')
                                                : (darkMode ? 'bg-zinc-800/30 border-zinc-700/50' : 'bg-gray-50 border-gray-200')
                                        }`}>
                                            <input
                                                type="checkbox"
                                                checked={formData.consentGiven}
                                                onChange={(e) => setFormData(prev => ({ ...prev, consentGiven: e.target.checked }))}
                                                className="mt-1 w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                                            />
                                            <div className="text-xs leading-relaxed">
                                                <span className="font-bold block mb-0.5 text-emerald-600">Consent for TPF Communication & Donation Alerts</span>
                                                <span className={darkMode ? 'text-zinc-300' : 'text-gray-600'}>
                                                    I hereby consent to True Path Foundation (TPF) contacting me via Call, SMS, or WhatsApp for donation requests, emergency community alerts, and volunteer coordination.
                                                </span>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Primary Expertise Selector */}
                                    <div className="md:col-span-2 space-y-3">
                                        <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                            <Briefcase size={14} className="text-[#D4AF37]" /> Primary Expertise
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setOpenDropdown('expertise')}
                                            className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium text-left flex justify-between items-center ${darkMode
                                                ? 'bg-zinc-800/50 border-zinc-700/50 hover:border-[#D4AF37]/50'
                                                : 'bg-gray-50 border-gray-100 hover:border-[#D4AF37]/50'
                                                }`}
                                        >
                                            <span className={!formData.expertise ? (darkMode ? 'text-zinc-500' : 'text-gray-400') : 'text-inherit'}>
                                                {formData.expertise || "What is your professional strength?"}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
                                        </button>
                                        <SearchPicker
                                            isOpen={openDropdown === 'expertise'}
                                            onClose={() => setOpenDropdown(null)}
                                            title="Professional Strength"
                                            placeholder="Search expertise..."
                                            items={professions}
                                            onSelect={handleProfessionSelect}
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {showCustomExpertise && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="md:col-span-2 space-y-3 overflow-hidden"
                                            >
                                                <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                                    <AlertCircle size={14} className="text-emerald-500" /> Specify Other Expertise
                                                </label>
                                                <input
                                                    type="text"
                                                    name="customExpertise"
                                                    value={formData.customExpertise}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. Humanitarian Logistics, Crisis Management"
                                                    className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium ${darkMode
                                                        ? 'bg-zinc-800/50 border-zinc-700/50 focus:border-emerald-500 text-white focus:bg-zinc-800'
                                                        : 'bg-gray-50 border-gray-200 focus:border-emerald-500 text-gray-900'
                                                        }`}
                                                    required={showCustomExpertise}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* How can you help Description */}
                                    <div className="md:col-span-2 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                                                <Heart size={14} className="text-[#D4AF37]" /> How can you help True Path Foundation?
                                            </label>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${helpWordCount > 500 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                {helpWordCount} / 500 WORDS
                                            </span>
                                        </div>
                                        <textarea
                                            name="helpDescription"
                                            value={formData.helpDescription}
                                            onChange={handleInputChange}
                                            placeholder="Tell us about how you can contribute to our cause, your motivations, and any specific ways you'd like to help..."
                                            rows={5}
                                            className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-medium resize-none ${darkMode
                                                ? 'bg-zinc-800/50 border-zinc-700/50 focus:border-[#D4AF37] text-white focus:bg-zinc-800'
                                                : 'bg-gray-50 border-gray-100 focus:border-[#D4AF37] text-gray-900 focus:bg-white focus:shadow-md'
                                                } ${helpWordCount > 500 ? 'border-red-500/50' : ''}`}
                                            required
                                        />
                                        {helpWordCount > 500 && (
                                            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                                <AlertCircle size={10} /> Word limit exceeded
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative group overflow-hidden py-5 px-8 rounded-[2rem] font-black text-xl text-white transition-all disabled:opacity-70 shadow-xl shadow-emerald-500/20"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 opacity-20 group-hover:opacity-100 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                                        <div className="relative flex items-center justify-center gap-3">
                                            {loading ? (
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Register as a Volunteer
                                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-zinc-700/10">
                                    {!userInfo && (
                                        <Link href="/login" className="text-sm font-bold text-emerald-500 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                                            Already a TPF Volunteer? Login
                                            <ChevronRight size={16} />
                                        </Link>
                                    )}
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
