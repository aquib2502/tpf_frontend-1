"use client"

import { useGetOfflineDonationsQuery, useCreateOfflineDonationMutation, useGetCampaignDropdownQuery } from "@/utils/slices/offlineDonationSlice"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { setCredentials } from "@/utils/slices/authSlice"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import {
  CreditCard,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  ChevronRight,
  ArrowLeft,
  Calendar,
  DollarSign,
  Hash,
  User,
  Mail,
  Phone,
  Landmark,
  AlertCircle,
  Check,
  IndianRupee,
  Smartphone,
} from "lucide-react"
import { useAppToast } from "@/app/AppToastContext"

export default function OfflineDonationsPage({ darkModeFromParent }) {
  const userInfo = useSelector((state) => state.auth?.userInfo || null);
  const [darkMode, setDarkMode] = useState(false)
  const [view, setView] = useState("list")
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isClient, setIsClient] = useState(false);
  const { data: campaignData, isLoading: campaignsLoading } = useGetCampaignDropdownQuery();
  const campaigns = campaignData?.campaigns || [];
  useEffect(() => {
    setIsClient(true);
  }, []);


  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetOfflineDonationsQuery();

  const donations = data?.donations || [];

  const [createDonation, { isLoading: creating }] =
    useCreateOfflineDonationMutation();



  const [formData, setFormData] = useState({
    method: "",
    amount: "",
    donorName: "",
    email: "",
    phone: "",
    transactionDate: "",
    referenceNumber: "",
    utrNumber: "",
    bankName: "",
    branchName: "",
    chequeNumber: "",
    chequeDate: "",
    bankAccountName: "",
    remarks: "",
    donationType: "",
    campaignId: "",
    upiId: "",
    paymentApp: "",
  })

  useEffect(() => {
    if (darkModeFromParent !== undefined) {
      setDarkMode(darkModeFromParent)
    }
  }, [darkModeFromParent])

  const paymentMethods = [
    { id: "rtgs", name: "RTGS", icon: Building2, description: "Real Time Gross Settlement", color: "emerald" },
    { id: "imps", name: "IMPS", icon: CreditCard, description: "Immediate Payment Service", color: "blue" },
    { id: "neft", name: "NEFT", icon: Landmark, description: "National Electronic Funds Transfer", color: "purple" },
    { id: "cheque", name: "CHEQUE", icon: FileText, description: "Bank Cheque Payment", color: "orange" },
    { id: "upi", name: "UPI", icon: Smartphone, description: "Unified Payments Interface", color: "teal" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setFormData(prev => ({ ...prev, phone: numericValue }));
    } else if (name === "donorName") {
      const cleanedValue = value.replace(/[^a-zA-Z\s]/g, ""); // only letters + space
      setFormData(prev => ({ ...prev, donorName: cleanedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        donorName: userInfo.fullName || "",
        email: userInfo.email || "",
        phone: userInfo.mobileNo || "",
      }));
    }
  }, [userInfo]);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method)
    setFormData(prev => ({ ...prev, method: method.name }))
  }

  const dispatch = useDispatch();
  const { showToast } = useAppToast();

  const handleSubmit = async () => {
    try {
      const amount = Number(formData.amount);
      if (!amount || amount < 50) {
        showToast({
          title: "Minimum Amount",
          message: "The minimum donation amount is ₹50.",
          type: "error"
        });
        return;
      }

      const payload = {
        method: formData.method,
        amount,
        remarks: formData.remarks || "",
        donationType: formData.donationType,
        campaignId: formData.campaignId,
        bankName: formData.bankName,
        bankAccountName: formData.bankAccountName,
        transactionDate: formData.transactionDate,
        referenceNumber: formData.referenceNumber,
        utrNumber: formData.utrNumber,
        chequeNumber: formData.chequeNumber,
        chequeDate: formData.chequeDate,
        branchName: formData.branchName,
        upiId: formData.upiId,
        paymentApp: formData.paymentApp,
      }
      console.log("Submitting donation:", payload);

      const data = await createDonation(payload).unwrap();

      dispatch(setCredentials(data.user));

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setView("list");
        setSelectedMethod(null);
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return darkMode ? "text-emerald-400 bg-emerald-950/30 border-emerald-800" : "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "rejected":
        return darkMode ? "text-red-400 bg-red-950/30 border-red-800" : "text-red-700 bg-red-50 border-red-200"
      default:
        return darkMode ? "text-yellow-400 bg-yellow-950/30 border-yellow-800" : "text-yellow-700 bg-yellow-50 border-yellow-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Shared select className — NO appearance-none so native mobile dropdown works
  const selectClass = (extra = "") =>
    `w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${darkMode
      ? "bg-zinc-800 border-zinc-700 text-white focus:border-emerald-500"
      : "bg-white border-gray-200 text-gray-900 focus:border-emerald-500"
    } ${extra}`

  // Shared text input className
  const inputClass = (hasError = false) =>
    `w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${hasError
      ? darkMode
        ? "bg-red-500/5 border-red-500 text-white focus:border-red-500"
        : "bg-red-50 border-red-500 text-gray-900 focus:border-red-500"
      : darkMode
        ? "bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-500 focus:border-emerald-500"
        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500"
    }`

  const iconClass = `absolute left-4 top-3.5 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-gray-400"}`
  const labelClass = `block text-sm font-semibold mb-2 ${darkMode ? "text-zinc-300" : "text-gray-700"}`

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative">

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-50 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl max-w-[calc(100vw-2rem)] sm:max-w-sm ${darkMode
              ? "bg-zinc-900 border border-emerald-500/20"
              : "bg-white border border-emerald-200"
              }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Donation Submitted Successfully!
                </p>
                <p className={`text-sm mt-1 ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>
                  Your request is pending admin approval.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND */}
      <div className="absolute inset-y-0 left-0 right-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] ${darkMode ? "bg-emerald-950/20" : "bg-emerald-50"
          }`} />
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] ${darkMode ? "bg-teal-950/20" : "bg-teal-50"
          }`} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-12 pb-8 sm:pb-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Offline Donations
          </h1>
          <p className={`text-sm sm:text-base ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>
            Submit and track your offline donation requests
          </p>
        </motion.div>

        {/* PAGE VIEW LOGIC */}
        <AnimatePresence mode="wait">

          {/* LIST VIEW */}
          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >

              {/* CREATE NEW donation button */}
              <motion.button
                onClick={() => setView("create")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mb-6 p-5 sm:p-6 rounded-2xl border-2 border-dashed transition-all group hover:border-emerald-500"
                style={{
                  borderColor: darkMode ? "#3f3f46" : "#e5e7eb",
                  backgroundColor: darkMode ? "rgba(39,39,42,0.5)" : "#ffffff"
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${darkMode
                    ? "bg-emerald-950/50 group-hover:bg-emerald-900/50"
                    : "bg-emerald-50 group-hover:bg-emerald-100"
                    }`}>
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-base sm:text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Create New Offline Donation
                    </p>
                    <p className={`text-xs sm:text-sm ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>
                      Submit a new donation request for admin approval
                    </p>
                  </div>
                </div>
              </motion.button>

              {/* DONATION LIST */}
              {donations.length > 0 ? (
                <div className="space-y-4">
                  <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Your Donation Requests
                  </h2>

                  {donations.map((donation, index) => {
                    const donationDate =
                      donation.transactionDate ||
                      donation.chequeDate ||
                      donation.submittedOn

                    const refNumber =
                      donation.referenceNumber ||
                      donation.utrNumber ||
                      donation.chequeNumber ||
                      donation.upiId ||
                      "--"

                    return (
                      <motion.div
                        key={donation._id || `${donation.method}-${donation.submittedOn}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 sm:p-6 rounded-2xl border ${darkMode
                          ? "bg-zinc-900/50 border-zinc-800"
                          : "bg-white border-gray-200 shadow-sm"
                          }`}
                      >
                        {/* Card header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-emerald-950/50" : "bg-emerald-50"
                              }`}>
                              {(() => {
                                const m = paymentMethods.find(m => m.name === donation.method)
                                if (!m) return null
                                const Icon = m.icon
                                return <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                              })()}
                            </div>
                            <div className="min-w-0">
                              <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {donation.method}
                              </p>
                              <p className={`text-xs sm:text-sm truncate ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>
                                {donation._id}
                              </p>
                            </div>
                          </div>

                          {/* STATUS + REMARKS GROUP */}
                          <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-1 flex-wrap">
                            {/* Status badge */}
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(donation.status)}`}>
                              {getStatusIcon(donation.status)}
                              <span className="capitalize">{donation.status}</span>
                            </div>

                            {/* Remarks */}
                            {donation.remarks && (
                              <div className="sm:text-right">
                                <p className={`text-xs uppercase tracking-wide ${darkMode ? "text-zinc-500" : "text-gray-400"}`}>
                                  Remarks
                                </p>
                                <p className={`text-xs sm:text-sm leading-snug ${donation.status === "rejected"
                                  ? darkMode ? "text-red-400" : "text-red-600"
                                  : darkMode ? "text-zinc-300" : "text-gray-700"
                                  }`}>
                                  {donation.remarks}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* body */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                          <div>
                            <p className={`text-xs font-medium mb-1 ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>
                              Amount
                            </p>
                            <p className={`font-bold text-base sm:text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                              ₹{Number(donation.amount || 0).toLocaleString("en-IN")}
                            </p>
                          </div>

                          <div>
                            <p className={`text-xs font-medium mb-1 ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>
                              Date
                            </p>
                            <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                              {new Date(donationDate).toLocaleDateString("en-IN")}
                            </p>
                          </div>

                          <div className="col-span-2">
                            <p className={`text-xs font-medium mb-1 ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>
                              Reference Number
                            </p>
                            <p className={`text-sm font-semibold break-all ${darkMode ? "text-white" : "text-gray-900"}`}>
                              {refNumber}
                            </p>
                          </div>
                        </div>

                        {/* footer */}
                        <div className={`pt-3 sm:pt-4 border-t ${darkMode ? "border-zinc-800" : "border-gray-200"}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>
                              Submitted on {new Date(donation.submittedOn).toLocaleString("en-IN")}
                            </p>
                            {donation.status === "approved" && donation.approvedOn && (
                              <p className={`text-xs ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                                Approved on {new Date(donation.approvedOn).toLocaleString("en-IN")}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-16 rounded-2xl border ${darkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-gray-50 border-gray-200"
                    }`}
                >
                  <FileText className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-zinc-600" : "text-gray-300"}`} />
                  <p className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    No donation requests yet
                  </p>
                  <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>
                    Create your first offline donation request
                  </p>
                </motion.div>
              )}

            </motion.div>
          )}

          {/* CREATE VIEW */}
          {view === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button
                onClick={() => {
                  setView("list")
                  setSelectedMethod(null)
                }}
                className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-xl font-semibold transition-all text-sm sm:text-base ${darkMode
                  ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Back to List
              </button>

              {/* method selection */}
              {!selectedMethod ? (
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Select Payment Method
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paymentMethods.map((method, index) => {
                      const Icon = method.icon
                      return (
                        <motion.button
                          key={method.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleMethodSelect(method)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-5 sm:p-6 rounded-2xl border-2 transition-all text-left group ${darkMode
                            ? "bg-zinc-900/50 border-zinc-800 hover:border-emerald-500"
                            : "bg-white border-gray-200 hover:border-emerald-500 shadow-sm"
                            }`}
                        >
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-colors ${darkMode
                            ? "bg-emerald-950/50 group-hover:bg-emerald-900/50"
                            : "bg-emerald-50 group-hover:bg-emerald-100"
                            }`}>
                            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                          </div>
                          <h3 className={`text-lg sm:text-xl font-bold mb-1 sm:mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {method.name}
                          </h3>
                          <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>
                            {method.description}
                          </p>
                          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm group-hover:gap-3 transition-all">
                            Select
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <>
                  {/* FORM WRAPPER — removed overflow-hidden so select dropdowns render properly on mobile */}
                  <div className={`rounded-3xl ${darkMode
                    ? "bg-zinc-900/50 backdrop-blur-xl border border-zinc-800"
                    : "bg-white backdrop-blur-xl border border-gray-200 shadow-xl"
                    }`}>

                    {/* colored header */}
                    <div className={`relative h-24 sm:h-32 rounded-t-3xl bg-gradient-to-r overflow-hidden ${selectedMethod.color === "emerald" ? "from-emerald-600 via-teal-600 to-emerald-700" :
                      selectedMethod.color === "blue" ? "from-blue-600 via-cyan-600 to-blue-700" :
                        selectedMethod.color === "purple" ? "from-purple-600 via-violet-600 to-purple-700" :
                          selectedMethod.color === "teal" ? "from-teal-600 via-cyan-600 to-teal-700" :
                            "from-orange-600 via-amber-600 to-orange-700"
                      }`}>
                      <div className="absolute inset-0 opacity-20">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                            backgroundSize: "32px 32px"
                          }}
                        />
                      </div>
                      <div className="relative h-full flex items-center justify-center">
                        <div className="text-center px-4">
                          {(() => {
                            const Icon = selectedMethod.icon
                            return <Icon className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-1 sm:mb-2" />
                          })()}
                          <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedMethod.name} Donation</h2>
                          <p className="text-white/80 text-xs sm:text-sm mt-0.5 sm:mt-1">{selectedMethod.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* form fields */}
                    <div className="p-4 sm:p-6 lg:p-8 space-y-6">

                      {/* Donor Information */}
                      <div>
                        <h3 className={`text-base sm:text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          Donor Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                          {/* donor name */}
                          <div>
                            <label className={labelClass}>
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <User className={iconClass} />
                              <input
                                type="text"
                                name="donorName"
                                value={formData.donorName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className={inputClass()}
                              />
                            </div>
                          </div>

                          {/* email */}
                          <div>
                            <label className={labelClass}>
                              Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Mail className={iconClass} />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                className={inputClass()}
                              />
                            </div>
                          </div>

                          {/* phone */}
                          <div>
                            <label className={labelClass}>
                              Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Phone className={iconClass} />
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+91 98765 43210"
                                className={inputClass()}
                              />
                            </div>
                          </div>

                          {/* amount */}
                          <div>
                            <label className={labelClass}>
                              Donation Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <IndianRupee className={iconClass} />
                              <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="Enter amount in ₹"
                                className={inputClass(formData.amount && formData.amount < 50)}
                              />
                            </div>
                            {formData.amount && formData.amount < 50 ? (
                              <p className="mt-2 text-xs font-semibold text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Minimum donation is ₹50
                              </p>
                            ) : !formData.amount ? (
                              <p className={`mt-2 text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Min. ₹50 contribution required
                              </p>
                            ) : null}
                          </div>

                          {/* Donation Type */}
                          <div>
                            <label className={labelClass}>
                              Donation Type <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <FileText className={iconClass} />
                              {/*
                                FIX: Removed `appearance-none` so the native select arrow
                                shows and the dropdown opens properly on mobile devices.
                                The `appearance-none` was hiding the native dropdown trigger
                                on iOS/Android causing the dropdown to appear invisible/broken.
                              */}
                              <select
                                name="donationType"
                                value={formData.donationType}
                                onChange={handleInputChange}
                                className={selectClass()}
                              >
                                <option value="" className="text-gray-900 bg-white dark:bg-zinc-800 dark:text-white">Select donation type</option>
                                <option value="ZAKAAT" className="text-gray-900 bg-white dark:bg-zinc-800 dark:text-white">ZAKAAT</option>
                                <option value="LILLAH" className="text-gray-900 bg-white dark:bg-zinc-800 dark:text-white">LILLAH</option>
                                <option value="IMDAD" className="text-gray-900 bg-white dark:bg-zinc-800 dark:text-white">IMDAD</option>
                                <option value="SADAQAH" className="text-gray-900 bg-white dark:bg-zinc-800 dark:text-white">SADAQAH</option>
                                <option value="RIBA" className="text-gray-900 bg-white dark:bg-zinc-800 dark:text-white">RIBA</option>
                              </select>
                            </div>
                          </div>

                          {/* Campaign */}
                          <div>
                            <label className={labelClass}>
                              Campaign <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Landmark className={iconClass} />
                              {/*
                                FIX: Same fix here — removed `appearance-none`.
                                On mobile (especially iOS Safari), `appearance-none`
                                strips the native select styling AND can break the
                                tap-to-open behaviour, making the dropdown invisible.
                              */}
                              <select
                                name="campaignId"
                                value={formData.campaignId}
                                onChange={handleInputChange}
                                className={selectClass()}
                              >
                                <option value="" className="text-gray-900 bg-white dark:bg-zinc-800 dark:text-white">
                                  {campaignsLoading ? "Loading campaigns..." : "Select a campaign"}
                                </option>
                                {campaigns.map((c) => (
                                  <option key={c._id} value={c._id} className="text-gray-900 bg-white dark:bg-zinc-800 dark:text-white">
                                    {c.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* TRANSACTION DETAILS */}
                      <div>
                        <h3 className={`text-base sm:text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          Transaction Details
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                          {selectedMethod.id === "upi" ? (
                            <>
                              {/* UPI ID */}
                              <div>
                                <label className={labelClass}>
                                  UPI ID <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <Hash className={iconClass} />
                                  <input
                                    type="text"
                                    name="upiId"
                                    value={formData.upiId}
                                    onChange={handleInputChange}
                                    placeholder="e.g. name@upi"
                                    className={inputClass()}
                                  />
                                </div>
                              </div>

                              {/* Transaction ID / Reference Number (Optional) */}
                              <div>
                                <label className={labelClass}>
                                  Transaction ID / Reference Number <span className={`text-xs font-normal ${darkMode ? 'text-zinc-400' : 'text-gray-500'}`}>(Optional)</span>
                                </label>
                                <div className="relative">
                                  <Hash className={iconClass} />
                                  <input
                                    type="text"
                                    name="referenceNumber"
                                    value={formData.referenceNumber}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 12-digit UTR or Txn ID"
                                    className={inputClass()}
                                  />
                                </div>
                              </div>

                              {/* Payment App */}
                              <div>
                                <label className={labelClass}>
                                  Payment App
                                </label>
                                <div className="relative">
                                  <Smartphone className={iconClass} />
                                  <select
                                    name="paymentApp"
                                    value={formData.paymentApp}
                                    onChange={handleInputChange}
                                    className={selectClass()}
                                  >
                                    <option value="">Select payment app</option>
                                    <option value="GooglePay">GooglePay</option>
                                    <option value="PhonePe">PhonePe</option>
                                    <option value="Paytm">Paytm</option>
                                    <option value="BHIM">BHIM</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                              </div>

                              {/* Transaction Date */}
                              <div>
                                <label className={labelClass}>
                                  Transaction Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <Calendar className={iconClass} />
                                  <input
                                    type="date"
                                    name="transactionDate"
                                    value={formData.transactionDate}
                                    onChange={handleInputChange}
                                    className={inputClass()}
                                  />
                                </div>
                              </div>
                            </>
                          ) : selectedMethod.id !== "cheque" ? (
                            <>
                              {/* RTGS/IMPS/NEFT reference/UTR */}
                              <div>
                                <label className={labelClass}>
                                  {selectedMethod.id === "rtgs"
                                    ? "UTR Number"
                                    : selectedMethod.id === "imps"
                                      ? "Transaction ID"
                                      : "Reference Number"}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <Hash className={iconClass} />
                                  <input
                                    type="text"
                                    name={selectedMethod.id === "rtgs" ? "utrNumber" : "referenceNumber"}
                                    value={selectedMethod.id === "rtgs" ? formData.utrNumber : formData.referenceNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter transaction reference"
                                    className={inputClass()}
                                  />
                                </div>
                              </div>

                              {/* Transaction Date */}
                              <div>
                                <label className={labelClass}>
                                  Transaction Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <Calendar className={iconClass} />
                                  <input
                                    type="date"
                                    name="transactionDate"
                                    value={formData.transactionDate}
                                    onChange={handleInputChange}
                                    className={inputClass()}
                                  />
                                </div>
                              </div>

                              {/* bank name */}
                              <div>
                                <label className={labelClass}>
                                  Bank Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <Building2 className={iconClass} />
                                  <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    placeholder="Enter bank name"
                                    className={inputClass()}
                                  />
                                </div>
                              </div>

                              {/* account holder */}
                              <div>
                                <label className={labelClass}>
                                  Account Holder Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <User className={iconClass} />
                                  <input
                                    type="text"
                                    name="bankAccountName"
                                    value={formData.bankAccountName}
                                    onChange={handleInputChange}
                                    placeholder="Account holder name"
                                    className={inputClass()}
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* CHEQUE NUMBER */}
                              <div>
                                <label className={labelClass}>
                                  Cheque Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <Hash className={iconClass} />
                                  <input
                                    type="text"
                                    name="chequeNumber"
                                    value={formData.chequeNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter cheque number"
                                    className={inputClass()}
                                  />
                                </div>
                              </div>

                              {/* cheque date */}
                              <div>
                                <label className={labelClass}>
                                  Cheque Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <Calendar className={iconClass} />
                                  <input
                                    type="date"
                                    name="chequeDate"
                                    value={formData.chequeDate}
                                    onChange={handleInputChange}
                                    className={inputClass()}
                                  />
                                </div>
                              </div>

                              {/* cheque bank name */}
                              <div>
                                <label className={labelClass}>
                                  Bank Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <Building2 className={iconClass} />
                                  <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    placeholder="Bank name on cheque"
                                    className={inputClass()}
                                  />
                                </div>
                              </div>

                              {/* optional branch */}
                              <div>
                                <label className={labelClass}>
                                  Branch Name
                                </label>
                                <div className="relative">
                                  <Landmark className={iconClass} />
                                  <input
                                    type="text"
                                    name="branchName"
                                    value={formData.branchName}
                                    onChange={handleInputChange}
                                    placeholder="Branch name (optional)"
                                    className={inputClass()}
                                  />
                                </div>
                              </div>
                            </>
                          )}

                        </div>
                      </div>

                      {/* Remarks */}
                      <div>
                        <label className={labelClass}>
                          Remarks / Additional Information
                        </label>
                        <textarea
                          name="remarks"
                          value={formData.remarks}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Add any additional information..."
                          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${darkMode
                            ? "bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-500 focus:border-emerald-500"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500"
                            }`}
                        />
                      </div>

                      {/* Notice */}
                      <div className={`p-3 sm:p-4 rounded-xl border ${darkMode ? "bg-blue-900/20 border-blue-800/50" : "bg-blue-50 border-blue-200"
                        }`}>
                        <div className="flex items-start gap-3">
                          <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${darkMode ? "text-blue-400" : "text-blue-600"
                            }`} />
                          <div>
                            <p className={`font-semibold mb-1 text-xs sm:text-sm ${darkMode ? "text-blue-300" : "text-blue-800"
                              }`}>
                              Important Information
                            </p>
                            <p className={`text-xs ${darkMode ? "text-blue-400" : "text-blue-700"}`}>
                              Your donation request will be reviewed by our admin team. You'll receive a
                              notification once it's approved.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Submit */}
                    <div className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-4 sm:pt-6 border-t ${darkMode ? "border-zinc-800" : "border-gray-200"
                      }`}>
                      <button
                        onClick={() => setSelectedMethod(null)}
                        className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${darkMode
                          ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                      >
                        Change Method
                      </button>

                      <button
                        onClick={handleSubmit}
                        disabled={!formData.amount || !formData.donationType || !formData.campaignId || creating}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all shadow-lg text-sm sm:text-base ${!formData.amount || !formData.donationType || !formData.campaignId || creating
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                          }`}
                      >
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        {creating ? "Submitting..." : "Submit Donation Request"}
                      </button>
                    </div>

                  </div>
                </>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}