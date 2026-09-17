"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Upload,
  Check,
  ChevronLeft,
  Users,
  Briefcase,
  Building2,
  Camera,
  FileText,
  Plus,
  Trash2
} from "lucide-react"
import FilePreview from "./FilePreview"
import { useSubmitFinancialAidMutation } from "@/utils/slices/financialAidApiSlice"
import { useAppToast } from "@/app/AppToastContext"
import LoginModal from "../login/LoginModal/MainModal"
import { useSelector } from "react-redux"
import { useDraft } from "@/utils/hooks/useDraft"

import { Hash } from "lucide-react"

import Link from "next/link"

export default function OtherForm({ darkModeFromParent }) {
  const router = useRouter()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [submitFinancialAid, { isLoading }] = useSubmitFinancialAidMutation()
  const [darkMode, setDarkMode] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [pendingSubmit, setPendingSubmit] = useState(false)

  const userInfo = useSelector((state) => state.auth.userInfo)
  const { showToast } = useAppToast()

  useEffect(() => {
    if (darkModeFromParent !== undefined) {
      setDarkMode(darkModeFromParent)
    }
  }, [darkModeFromParent])
  const { hasExistingDraft, existingDraftData, saveDraft, clearDraft, setHasExistingDraft } = useDraft("draft_financial_aid_others")
  const [showDraftPrompt, setShowDraftPrompt] = useState(false)
  const [draftSavedStatus, setDraftSavedStatus] = useState("")

  // Check for draft on load
  useEffect(() => {
    if (hasExistingDraft) {
      setShowDraftPrompt(true)
    }
  }, [hasExistingDraft])

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information (Campaigner)
    fullName: '',
    relation: '',
    relationName: '', // Beneficiary Name (Moved to Step 2)
    contactNumber: '',
    email: '',
    idType: '',
    govIdNumber: '',
    govIdDocument: null,

    // Beneficiary Personal Information (Step 2)
    dateOfBirth: '',
    maritalStatus: '',
    gender: '',
    numberOfDependents: '', // Moved here
    beneficiaryIdType: '',
    beneficiaryGovIdNumber: '',
    beneficiaryGovIdDocument: null,

    // Address (Step 3)
    permanentAddress: '',
    currentAddress: '',
    sameAddress: false,

    // Financial & Employment Details (Step 4)
    occupation: '',
    monthlyIncome: '',
    noIncome: false,
    bankNameBranch: '',
    accountNumber: '',
    ifscCode: '',
    bankStatement: null,

    // Reason for Aid Request (Step 5)
    aidType: '',
    hardshipDescription: '',
    supportingDocuments: [],
    supportingPictures: [],

    // Declarations
    declarationAccepted: false,
    assistanceCheck: false,
    termsAccepted: false,
  })

  // Debounced auto-save
  useEffect(() => {
    if (showDraftPrompt) return

    const hasData = Object.entries(formData).some(([key, val]) => {
      if (['govIdDocument', 'beneficiaryGovIdDocument', 'bankStatement', 'supportingDocuments', 'supportingPictures', 'declarationAccepted', 'assistanceCheck', 'termsAccepted', 'sameAddress', 'noIncome'].includes(key)) return false;
      return val !== '' && val !== null && val !== undefined;
    });
    if (!hasData) return

    setDraftSavedStatus("Saving...")
    const delayDebounce = setTimeout(() => {
      const cleanData = { ...formData }
      delete cleanData.govIdDocument
      delete cleanData.beneficiaryGovIdDocument
      delete cleanData.bankStatement
      delete cleanData.supportingDocuments
      delete cleanData.supportingPictures

      saveDraft({ formData: cleanData, currentStep })
      setDraftSavedStatus("Draft Saved")
      setTimeout(() => setDraftSavedStatus(""), 2000)
    }, 2000)

    return () => clearTimeout(delayDebounce)
  }, [formData, currentStep, saveDraft, showDraftPrompt])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    if (type === "file") {
      if (name === "supportingDocuments" || name === "supportingPictures") {
        // Multiple files
        setFormData((prev) => ({
          ...prev,
          [name]: Array.from(e.target.files),
        }));
      } else {
        // Single file
        setFormData((prev) => ({
          ...prev,
          [name]: e.target.files[0],
        }));
      }
      return;
    }

    // Special handling for govIdNumber
    if (name === 'govIdNumber') {
      let formattedValue = value.toUpperCase();
      if (formData.idType === 'aadhar') {
        // Format Aadhar: 1234-5678-9012 (max 14 chars)
        formattedValue = formattedValue.replace(/\D/g, '').substring(0, 12);
        formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1-');
      } else if (formData.idType === 'pan') {
        // PAN: ABCDE1234F (max 10 chars)
        formattedValue = formattedValue.replace(/[^A-Z0-9]/g, '').substring(0, 10);
      }
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }

    // Special handling for beneficiaryGovIdNumber
    if (name === 'beneficiaryGovIdNumber') {
      let formattedValue = value.toUpperCase();
      if (formData.beneficiaryIdType === 'aadhar') {
        formattedValue = formattedValue.replace(/\D/g, '').substring(0, 12);
        formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1-');
      } else if (formData.beneficiaryIdType === 'pan') {
        formattedValue = formattedValue.replace(/[^A-Z0-9]/g, '').substring(0, 10);
      }
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const requiredFields = {
    1: ["fullName", "relation", "contactNumber", "idType", "govIdNumber", "govIdDocument", "declarationAccepted", "assistanceCheck", "termsAccepted"],
    2: ["relationName", "dateOfBirth", "maritalStatus", "gender", "numberOfDependents", "beneficiaryIdType", "beneficiaryGovIdNumber", "beneficiaryGovIdDocument"],
    3: ["currentAddress", "permanentAddress"],
    4: ["occupation", "monthlyIncome", "bankNameBranch", "accountNumber", "ifscCode", "bankStatement"],
    5: ["aidType", "hardshipDescription"],
  };

  const validateStep = (step) => {
    const fields = requiredFields[step];
    if (!fields) return true;

    for (const field of fields) {
      const value = formData[field];

      if ((field === "termsAccepted") && value !== true) {
        return false;
      }

      if (field === "supportingDocuments") {
        if (!value || value.length === 0) return false;
      } else if (value === "" || value === null || value === undefined) {
        return false;
      }
    }
    return true;
  };

  const handleNext = (nextStep) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep(nextStep);
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault()

    // 🔒 LOGIN GUARD
    if (!userInfo) {
      setPendingSubmit(true)
      setShowLoginModal(true)
      return
    }

    setPendingSubmit(false)

    if (!formData.termsAccepted) {
      showToast({
        type: "error",
        title: "Please accept the terms and policies",
        message: ' ',
        duration: 2000,
      });
      return
    }

    try {
      // Create FormData object for file uploads
      const formDataToSend = new FormData()

      // Add form type (IMPORTANT!)
      formDataToSend.append('formType', 'other')

      // Add all text fields
      formDataToSend.append('fullName', formData.fullName)
      formDataToSend.append('relation', formData.relation)
      formDataToSend.append('relationName', formData.relationName)
      formDataToSend.append('dateOfBirth', formData.dateOfBirth)
      formDataToSend.append('maritalStatus', formData.maritalStatus)
      formDataToSend.append('gender', formData.gender)
      formDataToSend.append('permanentAddress', formData.permanentAddress)
      formDataToSend.append('currentAddress', formData.currentAddress)
      formDataToSend.append('sameAddress', formData.sameAddress)
      formDataToSend.append('contactNumber', formData.contactNumber)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('idType', formData.idType)
      formDataToSend.append('govIdNumber', formData.govIdNumber)
      formDataToSend.append('beneficiaryIdType', formData.beneficiaryIdType)
      formDataToSend.append('beneficiaryGovIdNumber', formData.beneficiaryGovIdNumber)
      formDataToSend.append('occupation', formData.occupation)
      formDataToSend.append('monthlyIncome', formData.noIncome ? '0' : formData.monthlyIncome)
      formDataToSend.append('noIncome', formData.noIncome)
      formDataToSend.append('bankNameBranch', formData.bankNameBranch)
      formDataToSend.append('accountNumber', formData.accountNumber)
      formDataToSend.append('ifscCode', formData.ifscCode)
      formDataToSend.append('numberOfDependents', formData.numberOfDependents)
      formDataToSend.append('aidType', formData.aidType)
      formDataToSend.append('hardshipDescription', formData.hardshipDescription)
      formDataToSend.append('declarationConsent', formData.declarationAccepted)

      // Add file uploads
      if (formData.govIdDocument) {
        formDataToSend.append('govIdDocument', formData.govIdDocument)
      }
      if (formData.beneficiaryGovIdDocument) {
        formDataToSend.append('beneficiaryGovIdDocument', formData.beneficiaryGovIdDocument)
      }
      if (formData.bankStatement) {
        formDataToSend.append('bankStatement', formData.bankStatement)
      }
      if (formData.supportingDocuments && formData.supportingDocuments.length > 0) {
        formData.supportingDocuments.forEach((file) => {
          formDataToSend.append('supportingDocuments', file)
        })
      }
      if (formData.supportingPictures && formData.supportingPictures.length > 0) {
        formData.supportingPictures.forEach((file) => {
          formDataToSend.append('supportingPictures', file)
        })
      }

      // Submit the form
      const result = await submitFinancialAid(formDataToSend).unwrap()

      if (result.success) {
        clearDraft()
        setShowSuccessMessage(true)
        setTimeout(() => {
          router.push('/')
        }, 3000)
      }
    } catch (err) {
      console.error('Failed to submit application:', err)
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 5000)
    }
  }


  useEffect(() => {
    if (userInfo && pendingSubmit) {
      handleSubmit()
    }
  }, [userInfo, pendingSubmit])

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
  }


  return (
    <>
      {showDraftPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border transition-all ${
              darkMode ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-zinc-200 text-zinc-900"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">Resume Previous Session?</h3>
            <p className={`text-sm mb-6 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              We found an unsaved draft from your previous session. Would you like to restore your progress and continue?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  clearDraft()
                  setShowDraftPrompt(false)
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                  darkMode
                    ? "border-zinc-600 hover:bg-zinc-700 text-zinc-300"
                    : "border-zinc-300 hover:bg-zinc-100 text-zinc-700"
                }`}
              >
                Start Over
              </button>
              <button
                onClick={() => {
                  if (existingDraftData) {
                    setFormData((prev) => ({
                      ...prev,
                      ...existingDraftData.formData,
                    }))
                    if (existingDraftData.currentStep) {
                      setCurrentStep(existingDraftData.currentStep)
                    }
                  }
                  setShowDraftPrompt(false)
                }}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md"
              >
                Resume Progress
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2  -translate-x-1/2 z-50 
               bg-gradient-to-r from-emerald-600 to-emerald-400 text-white px-6 py-4 rounded-lg shadow-2xl 
               flex items-center gap-3 max-w-md w-[90%] sm:w-auto"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Application Submitted Successfully!</p>
            <p className="text-sm text-emerald-100">Redirecting to home page...</p>
          </div>
        </motion.div>

      )}

      {showErrorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2  -translate-x-1/2 z-50 
         bg-gradient-to-r from-red-600 to-red-400 text-white px-6 py-4 rounded-lg shadow-2xl 
         flex items-center gap-3 max-w-md w-[90%] sm:w-auto"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Submission Failed!</p>
            <p className="text-sm text-red-100">Please try again later</p>
          </div>
        </motion.div>
      )}

      <div className={`min-h-screen ${darkMode ? "bg-zinc-900" : "bg-neutral-50"} py-12 sm:py-20`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-2 pb-12 sm:pb-24">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => router.push('/financial-aid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${darkMode ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"}`}
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Back to Financial Aid</span>
            </button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 ${darkMode ? "text-white" : "text-zinc-900"} `}>
              Financial Aid Application
            </h1>
            <p className={`text-sm sm:text-base ${darkMode ? "text-zinc-400" : "text-zinc-600"} `}>
              Please fill out all required information accurately
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between sm:justify-center sm:gap-4 md:gap-6 mb-2 overflow-x-auto px-2">
              {[1, 2, 3, 4, 5, 6].map((step, index) => (
                <div key={step} className="flex items-center flex-shrink-0">
                  {/* Step Circle + Label */}
                  <button
                    onClick={() => handleNext(step)}
                    className="flex flex-col items-center group cursor-pointer border-none bg-transparent py-2"
                    disabled={step > currentStep}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${currentStep >= step
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        : darkMode
                          ? "bg-zinc-700 text-zinc-400"
                          : "bg-zinc-200 text-zinc-500"
                        } ${step <= currentStep ? "group-hover:scale-110" : ""}`}
                    >
                      {step}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-1 sm:mt-2 whitespace-nowrap transition-colors ${currentStep === step
                        ? "text-emerald-500 font-bold"
                        : darkMode ? "text-zinc-400 group-hover:text-zinc-300" : "text-zinc-600 group-hover:text-zinc-900"
                        }`}
                    >
                      {step === 1 ? "Campaigner" : step === 2 ? "Beneficiary" : step === 3 ? "Address" : step === 4 ? "Financial" : step === 5 ? "Request" : "Preview"}
                    </span>
                  </button>
                  {index < 5 && (
                    <div
                      className={`w-4 sm:w-8 md:w-12 h-1 mx-1 sm:mx-2 rounded transition-all ${currentStep > step
                        ? "bg-emerald-600"
                        : darkMode
                          ? "bg-zinc-700"
                          : "bg-zinc-200"
                        } `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>


          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg relative ${darkMode ? "bg-zinc-800" : "bg-white"} `}
          >
            {draftSavedStatus && (
              <span className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse transition-all ${
                darkMode ? "bg-zinc-700 text-zinc-300" : "bg-zinc-100 text-zinc-600"
              }`}>
                {draftSavedStatus}
              </span>
            )}
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-500 pl-4 mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}>
                    Campaigner's Details
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    Please provide the campaigner's information and relationship to beneficiary
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campaigner Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Campaigner Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter campaigner's full name"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                          ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                          : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                          }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Relationship with Beneficiary <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                      <select
                        name="relation"
                        value={formData.relation}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                          ? "bg-zinc-700 border-zinc-600 text-white"
                          : "bg-white border-zinc-300 text-zinc-900"
                          }`}
                        required
                      >
                        <option value="" disabled>Select Relation</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Wife">Wife</option>
                        <option value="Husband">Husband</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Contact Number <span className="text-red-500">*</span>
                      <span className={`text-xs ml-2 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                        (WhatsApp preferred)
                      </span>
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="+91"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                          ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                          : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                          }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Email ID */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Email ID
                      <span className={`text-xs ml-2 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                        (Optional)
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                          ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                          : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                          }`}
                      />
                    </div>
                  </div>

                  {/* ID Type Selection */}
                  <div className="col-span-1 md:col-span-2 space-y-3">
                    <label className={`block text-sm font-medium ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Select Campaigner ID Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="idType"
                          value="pan"
                          checked={formData.idType === 'pan'}
                          onChange={handleInputChange}
                          className="peer sr-only"
                          required
                        />
                        <div className={`p-4 rounded-lg border-2 transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:dark:bg-emerald-950/30 ${darkMode
                          ? "border-zinc-600 bg-zinc-700 hover:border-zinc-500"
                          : "border-zinc-300 bg-white hover:border-zinc-400"
                          }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CreditCard className={`w-5 h-5 ${formData.idType === 'pan' ? 'text-emerald-600' : darkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                              <div>
                                <p className={`font-semibold ${darkMode ? "text-white" : "text-zinc-900"}`}>PAN Card</p>
                                <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>10 characters</p>
                              </div>
                            </div>
                            {formData.idType === 'pan' && (
                              <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        </div>
                      </label>

                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="idType"
                          value="aadhar"
                          checked={formData.idType === 'aadhar'}
                          onChange={handleInputChange}
                          className="peer sr-only"
                          required
                        />
                        <div className={`p-4 rounded-lg border-2 transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:dark:bg-emerald-950/30 ${darkMode
                          ? "border-zinc-600 bg-zinc-700 hover:border-zinc-500"
                          : "border-zinc-300 bg-white hover:border-zinc-400"
                          }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CreditCard className={`w-5 h-5 ${formData.idType === 'aadhar' ? 'text-emerald-600' : darkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                              <div>
                                <p className={`font-semibold ${darkMode ? "text-white" : "text-zinc-900"}`}>Aadhar Card</p>
                                <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>12 digits</p>
                              </div>
                            </div>
                            {formData.idType === 'aadhar' && (
                              <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* ID Input */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      {formData.idType === "pan" ? "PAN Number" : formData.idType === "aadhar" ? "Aadhar Number" : "Government ID Number"} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                      <input
                        type="text"
                        name="govIdNumber"
                        value={formData.govIdNumber}
                        onChange={handleInputChange}
                        placeholder={formData.idType === "pan" ? "ABCDE1234F" : formData.idType === "aadhar" ? "1234-5678-9012" : "Enter ID Number"}
                        maxLength={formData.idType === "pan" ? 10 : formData.idType === "aadhar" ? 14 : 20}
                        disabled={!formData.idType}
                        className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${!formData.idType ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-zinc-800" : ""} ${darkMode
                          ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                          : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                          }`}
                        required
                      />
                    </div>
                  </div>

                  {/* ID Document Upload */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Upload {formData.idType === 'pan' ? 'PAN Card' : formData.idType === 'aadhar' ? 'Aadhar Card' : 'Government ID'} <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative border-2 border-dashed rounded-lg p-4 transition-all hover:border-emerald-500 ${darkMode ? "border-zinc-600 bg-zinc-700/50" : "border-zinc-300 bg-zinc-50"}`}>
                      <input
                        type="file"
                        name="govIdDocument"
                        onChange={handleInputChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={!formData.idType}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        required
                      />
                      <div className="flex items-center gap-3 pointer-events-none">
                        <div className={`p-2 rounded-lg ${darkMode ? "bg-zinc-600" : "bg-white border border-zinc-200"}`}>
                          <Upload className={`w-5 h-5 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                            {formData.govIdDocument ? formData.govIdDocument.name : "Choose file..."}
                          </p>
                          <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                            PDF, JPG up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Declaration & Consent */}
                <div className={`mt-8 p-6 rounded-lg border ${darkMode ? "bg-zinc-700 border-zinc-600" : "bg-zinc-50 border-zinc-200"}`}>
                  <h3 className={`font-bold text-lg mb-4 ${darkMode ? "text-white" : "text-zinc-900"}`}>
                    Declaration & Consent
                  </h3>
                  <div className={`text-sm leading-relaxed mb-4 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    <p>
                      I, <span className="font-bold underline decoration-emerald-500 underline-offset-4">{formData.fullName || "{Full Name}"}</span> hereby solemnly affirm that the particulars provided in this application are true and correct to the best of my knowledge and belief. I understand that any suppression of facts or provision of false information may lead to the disqualification of my application. I authorize True Path Foundation to conduct on-site visits and contact me directly for verification purposes. I am aware that video verification, online solicitation, and public appeals are mandatory procedures for campaign funding, and I give my full voluntary authorization for the same. I confirm that I am submitting my documents and details of my own accord, without any external pressure. I have fully understood all the terms of this declaration in a language I am proficient in.
                    </p>
                  </div>

                  {/* Declaration Acceptance Checkbox */}
                  <div className={`pt-4 border-t ${darkMode ? 'border-zinc-600' : 'border-zinc-200'}`}>
                    <label className="flex items-start cursor-pointer group mb-3">
                      <input
                        type="checkbox"
                        name="declarationAccepted"
                        checked={formData.declarationAccepted}
                        onChange={(e) => setFormData(prev => ({ ...prev, declarationAccepted: e.target.checked }))}
                        className="sr-only peer"
                        required
                      />
                      <div className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${formData.declarationAccepted
                        ? "border-emerald-600 bg-emerald-600"
                        : darkMode ? "border-zinc-500 bg-zinc-700" : "border-zinc-400 bg-white"
                        }`}>
                        <Check
                          className={`w-3.5 h-3.5 text-white transition-opacity ${formData.declarationAccepted ? "opacity-100" : "opacity-0"}`}
                          strokeWidth={3}
                        />
                      </div>
                      <span className={`ml-3 text-sm font-medium ${formData.declarationAccepted ? 'text-emerald-600' : darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                        I have read and understood the declaration clearly.
                      </span>
                    </label>

                    {/* Assistance Check */}
                    <label className="flex items-start cursor-pointer group mb-3">
                      <input
                        type="checkbox"
                        name="assistanceCheck"
                        checked={formData.assistanceCheck}
                        onChange={(e) => setFormData(prev => ({ ...prev, assistanceCheck: e.target.checked }))}
                        className="sr-only peer"
                        required
                      />
                      <div className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${formData.assistanceCheck
                        ? "border-emerald-600 bg-emerald-600"
                        : darkMode ? "border-zinc-500 bg-zinc-700" : "border-zinc-400 bg-white"
                        }`}>
                        <Check
                          className={`w-3.5 h-3.5 text-white transition-opacity ${formData.assistanceCheck ? "opacity-100" : "opacity-0"}`}
                          strokeWidth={3}
                        />
                      </div>
                      <span className={`ml-3 text-sm font-medium ${formData.assistanceCheck ? 'text-emerald-600' : darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                        I agree I am not getting assistance/provision from any other organization/entity.
                      </span>
                    </label>

                    {/* Terms and Policies Acceptance */}
                    <label className="flex items-start cursor-pointer group">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                        className="sr-only peer"
                        required
                      />
                      <div className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${formData.termsAccepted
                        ? "border-emerald-600 bg-emerald-600"
                        : darkMode ? "border-zinc-500 bg-zinc-700" : "border-zinc-400 bg-white"
                        }`}>
                        <Check
                          className={`w-3.5 h-3.5 text-white transition-opacity ${formData.termsAccepted ? "opacity-100" : "opacity-0"}`}
                          strokeWidth={3}
                        />
                      </div>
                      <span className={`ml-3 text-sm font-medium ${formData.termsAccepted ? 'text-emerald-600' : darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                        I agree to the <Link href="/policies" className="underline hover:text-emerald-500">Terms and Policies</Link> of True Path Foundation <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end pt-4">
                  <button
                    disabled={!validateStep(currentStep)}
                    onClick={() => handleNext(2)}
                    className={`px-8 py-3 text-base rounded-lg font-semibold flex items-center gap-2 transition-all
                      ${!validateStep(currentStep)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-lg"
                      }
                    `}
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Beneficiary Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-500 pl-4 mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}>
                    Beneficiary's Personal Information
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    Please provide the beneficiary's basic personal details
                  </p>
                </div>

                {/* Beneficiary Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Beneficiary Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                    <input
                      type="text"
                      name="relationName"
                      value={formData.relationName}
                      onChange={handleInputChange}
                      placeholder="Enter beneficiary's full name"
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                        ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                        : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                        }`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date of Birth */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                          ? "bg-zinc-700 border-zinc-600 text-white"
                          : "bg-white border-zinc-300 text-zinc-900"
                          }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Marital Status */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Marital Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                        ? "bg-zinc-700 border-zinc-600 text-white"
                        : "bg-white border-zinc-300 text-zinc-900"
                        }`}
                      required
                    >
                      <option value="">Select marital status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    {/* Male */}
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleInputChange}
                        className="sr-only peer"
                        required
                      />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${formData.gender === 'male'
                        ? "border-emerald-600 bg-emerald-600"
                        : darkMode ? "border-zinc-500 bg-zinc-700" : "border-zinc-400 bg-white"
                        }`}>
                        <Check
                          className={`w-3.5 h-3.5 text-white transition-opacity ${formData.gender === 'male' ? "opacity-100" : "opacity-0"}`}
                          strokeWidth={3}
                        />
                      </div>
                      <span className={`ml-3 text-sm font-medium ${formData.gender === 'male' ? 'text-emerald-600' : darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                        Male
                      </span>
                    </label>

                    {/* Female */}
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleInputChange}
                        className="sr-only peer"
                        required
                      />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${formData.gender === 'female'
                        ? "border-emerald-600 bg-emerald-600"
                        : darkMode ? "border-zinc-500 bg-zinc-700" : "border-zinc-400 bg-white"
                        }`}>
                        <Check
                          className={`w-3.5 h-3.5 text-white transition-opacity ${formData.gender === 'female' ? "opacity-100" : "opacity-0"}`}
                          strokeWidth={3}
                        />
                      </div>
                      <span className={`ml-3 text-sm font-medium ${formData.gender === 'female' ? 'text-emerald-600' : darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                        Female
                      </span>
                    </label>

                    {/* Rather not say */}
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value="rather_not_say"
                        checked={formData.gender === 'rather_not_say'}
                        onChange={handleInputChange}
                        className="sr-only peer"
                        required
                      />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${formData.gender === 'rather_not_say'
                        ? "border-emerald-600 bg-emerald-600"
                        : darkMode ? "border-zinc-500 bg-zinc-700" : "border-zinc-400 bg-white"
                        }`}>
                        <Check
                          className={`w-3.5 h-3.5 text-white transition-opacity ${formData.gender === 'rather_not_say' ? "opacity-100" : "opacity-0"}`}
                          strokeWidth={3}
                        />
                      </div>
                      <span className={`ml-3 text-sm font-medium ${formData.gender === 'rather_not_say' ? 'text-emerald-600' : darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                        Rather not say
                      </span>
                    </label>
                  </div>
                </div>

                {/* Number of Dependents */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Number of Dependents <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                    <input
                      type="number"
                      name="numberOfDependents"
                      value={formData.numberOfDependents}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                        ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                        : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                        }`}
                      required
                    />
                  </div>
                </div>

                {/* Beneficiary ID Type Selection */}
                <div className="col-span-1 md:col-span-2 space-y-3 pt-2">
                  <label className={`block text-sm font-medium ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Select Beneficiary ID Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="beneficiaryIdType"
                        value="pan"
                        checked={formData.beneficiaryIdType === 'pan'}
                        onChange={handleInputChange}
                        className="peer sr-only"
                        required
                      />
                      <div className={`p-4 rounded-lg border-2 transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:dark:bg-emerald-950/30 ${darkMode
                        ? "border-zinc-600 bg-zinc-700 hover:border-zinc-500"
                        : "border-zinc-300 bg-white hover:border-zinc-400"
                        }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className={`w-5 h-5 ${formData.beneficiaryIdType === 'pan' ? 'text-emerald-600' : darkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                            <div>
                              <p className={`font-semibold ${darkMode ? "text-white" : "text-zinc-900"}`}>PAN Card</p>
                              <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>10 characters</p>
                            </div>
                          </div>
                          {formData.beneficiaryIdType === 'pan' && (
                            <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="beneficiaryIdType"
                        value="aadhar"
                        checked={formData.beneficiaryIdType === 'aadhar'}
                        onChange={handleInputChange}
                        className="peer sr-only"
                        required
                      />
                      <div className={`p-4 rounded-lg border-2 transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:dark:bg-emerald-950/30 ${darkMode
                        ? "border-zinc-600 bg-zinc-700 hover:border-zinc-500"
                        : "border-zinc-300 bg-white hover:border-zinc-400"
                        }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className={`w-5 h-5 ${formData.beneficiaryIdType === 'aadhar' ? 'text-emerald-600' : darkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                            <div>
                              <p className={`font-semibold ${darkMode ? "text-white" : "text-zinc-900"}`}>Aadhar Card</p>
                              <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>12 digits</p>
                            </div>
                          </div>
                          {formData.beneficiaryIdType === 'aadhar' && (
                            <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Beneficiary ID Input */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      {formData.beneficiaryIdType === "pan" ? "Beneficiary PAN Number" : formData.beneficiaryIdType === "aadhar" ? "Beneficiary Aadhar Number" : "Beneficiary Government ID Number"} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                      <input
                        type="text"
                        name="beneficiaryGovIdNumber"
                        value={formData.beneficiaryGovIdNumber}
                        onChange={handleInputChange}
                        placeholder={formData.beneficiaryIdType === "pan" ? "ABCDE1234F" : formData.beneficiaryIdType === "aadhar" ? "1234-5678-9012" : "Enter ID Number"}
                        maxLength={formData.beneficiaryIdType === "pan" ? 10 : formData.beneficiaryIdType === "aadhar" ? 14 : 20}
                        disabled={!formData.beneficiaryIdType}
                        className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${!formData.beneficiaryIdType ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-zinc-800" : ""} ${darkMode
                          ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                          : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                          }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Beneficiary ID Document Upload */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Upload Beneficiary {formData.beneficiaryIdType === 'pan' ? 'PAN Card' : formData.beneficiaryIdType === 'aadhar' ? 'Aadhar Card' : 'Government ID'} <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative border-2 border-dashed rounded-lg p-4 transition-all hover:border-emerald-500 ${darkMode ? "border-zinc-600 bg-zinc-700/50" : "border-zinc-300 bg-zinc-50"}`}>
                      <input
                        type="file"
                        name="beneficiaryGovIdDocument"
                        onChange={handleInputChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={!formData.beneficiaryIdType}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        required
                      />
                      <div className="flex items-center gap-3 pointer-events-none">
                        <div className={`p-2 rounded-lg ${darkMode ? "bg-zinc-600" : "bg-white border border-zinc-200"}`}>
                          <Upload className={`w-5 h-5 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                            {formData.beneficiaryGovIdDocument ? formData.beneficiaryGovIdDocument.name : "Choose file..."}
                          </p>
                          <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                            PDF, JPG up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => handleNext(1)}
                    className={`px-8 py-3 text-base rounded-lg font-medium transition-all ${darkMode
                      ? "bg-zinc-700 text-white hover:bg-zinc-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Back
                  </button>
                  <button
                    disabled={!validateStep(currentStep)}
                    onClick={() => handleNext(3)}
                    className={`px-8 py-3 text-base rounded-lg font-semibold flex items-center gap-2 transition-all
                      ${!validateStep(currentStep)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-lg"
                      }
                    `}
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Address Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-500 pl-4 mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}>
                    Address Details
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    Please provide the beneficiary's address information
                  </p>
                </div>

                {/* Current Address */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Current Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className={`absolute left-3 top-3 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                    <textarea
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleInputChange}
                      placeholder="Enter current address"
                      rows="3"
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${darkMode
                        ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                        : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                        }`}
                      required
                    />
                  </div>
                </div>

                {/* Same Address Checkbox */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      id="sameAddress"
                      checked={formData.sameAddress || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          sameAddress: checked,
                          permanentAddress: checked ? prev.currentAddress : ""
                        }));
                      }}
                      className="sr-only peer"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${formData.sameAddress
                      ? "border-emerald-600 bg-emerald-600"
                      : darkMode ? "border-zinc-500 bg-zinc-700" : "border-zinc-400 bg-white"
                      }`}>
                      <Check
                        className={`w-3.5 h-3.5 text-white transition-opacity ${formData.sameAddress ? "opacity-100" : "opacity-0"}`}
                        strokeWidth={3}
                      />
                    </div>
                    <span className={`ml-3 text-sm font-medium ${formData.sameAddress ? 'text-emerald-600' : darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Same as Current Address
                    </span>
                  </label>
                </div>

                {/* Permanent Address */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Permanent Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className={`absolute left-3 top-3 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                    <textarea
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleInputChange}
                      placeholder="Enter permanent address"
                      rows="3"
                      readOnly={formData.sameAddress}
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${formData.sameAddress ? "opacity-60 cursor-not-allowed" : ""} ${darkMode
                        ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                        : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                        }`}
                      required
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => handleNext(2)}
                    className={`px-8 py-3 text-base rounded-lg font-medium transition-all ${darkMode
                      ? "bg-zinc-700 text-white hover:bg-zinc-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Back
                  </button>
                  <button
                    disabled={!validateStep(currentStep)}
                    onClick={() => handleNext(4)}
                    className={`px-8 py-3 text-base rounded-lg font-semibold flex items-center gap-2 transition-all
                      ${!validateStep(currentStep)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-lg"
                      }
                    `}
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Financial & Employment Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-500 pl-4 mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}>
                    Financial & Employment
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    Please provide beneficiary's financial details
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Occupation */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Occupation <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        placeholder="Enter occupation"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                          ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                          : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                          }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Monthly Income */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Monthly Income <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mb-2">
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-semibold ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                        ₹
                      </span>
                      <input
                        type="number"
                        name="monthlyIncome"
                        value={formData.monthlyIncome}
                        onChange={handleInputChange}
                        placeholder={formData.noIncome ? "Not Applicable" : "Enter monthly income"}
                        disabled={formData.noIncome}
                        className={`w-full pl-8 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formData.noIncome ? "opacity-50 cursor-not-allowed" : ""} ${darkMode
                          ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                          : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                          }`}
                        required={!formData.noIncome}
                      />
                    </div>

                    {/* No Income Checkbox */}
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        name="noIncome"
                        checked={formData.noIncome || false}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            noIncome: checked,
                            monthlyIncome: checked ? '0' : ''
                          }));
                        }}
                        className="sr-only peer"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${formData.noIncome
                        ? "border-emerald-600 bg-emerald-600"
                        : darkMode ? "border-zinc-500 bg-zinc-700" : "border-zinc-400 bg-white"
                        }`}>
                        <Check
                          className={`w-3 h-3 text-white transition-opacity ${formData.noIncome ? "opacity-100" : "opacity-0"}`}
                          strokeWidth={2}
                        />
                      </div>
                      <span className={`ml-2 text-xs font-medium ${formData.noIncome ? 'text-emerald-600' : darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                        Not Applicable / No Income
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bank Name & Branch */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Bank Name & Branch <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                      <input
                        type="text"
                        name="bankNameBranch"
                        value={formData.bankNameBranch}
                        onChange={handleInputChange}
                        placeholder="e.g. SBI, Main Branch"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                          ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                          : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                          }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="Enter account number"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                          ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                          : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                          }`}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* IFSC Code */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      placeholder="e.g. SBIN0001234"
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode
                        ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                        : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                        }`}
                      required
                    />
                  </div>
                </div>

                {/* Bank Statement Upload */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Upload Bank Statement/Passbook (Latest 3 Months) <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 transition-all group ${darkMode
                    ? "border-zinc-600 bg-zinc-700/50 hover:border-emerald-500 hover:bg-zinc-700"
                    : "border-zinc-300 bg-zinc-50 hover:border-emerald-500 hover:bg-emerald-50"
                    } `}>
                    <input
                      type="file"
                      name="bankStatement"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        setFormData(prev => ({
                          ...prev,
                          bankStatement: file
                        }))
                      }}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={!formData.bankStatement}
                    />
                    <div className="text-center transition-transform group-hover:scale-105 duration-200 pointer-events-none">
                      {formData.bankStatement && typeof formData.bankStatement === 'object' ? (
                        <div>
                          {/* Selected File State */}
                          <div className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 ${darkMode ? "bg-emerald-900/50" : "bg-emerald-100"} `}>
                            <svg className={`w-6 h-6 sm:w-8 sm:h-8 text-emerald-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className={`font-semibold text-sm sm:text-lg mb-1 ${darkMode ? "text-emerald-400" : "text-emerald-600"} `}>
                            {formData.bankStatement.name}
                          </p>
                          <p className={`text-xs sm:text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"} `}>
                            {(formData.bankStatement.size / 1024).toFixed(2)} KB
                          </p>
                          <p className={`text-xs mt-2 ${darkMode ? "text-emerald-400/80" : "text-emerald-600/80"} `}>
                            Click to change file
                          </p>
                        </div>
                      ) : (
                        <div>
                          {/* Empty State */}
                          <div className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 ${darkMode ? "bg-zinc-600" : "bg-white shadow-sm border border-zinc-200"} `}>
                            <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? "text-zinc-400" : "text-zinc-500"} `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className={`font-semibold text-sm sm:text-lg mb-1 ${darkMode ? "text-zinc-200" : "text-zinc-700"} `}>
                            Click to upload or drag and drop
                          </p>
                          <p className={`text-xs sm:text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"} `}>
                            PDF, JPG, JPEG or PNG (Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => handleNext(3)}
                    className={`px-8 py-3 text-base rounded-lg font-medium transition-all ${darkMode
                      ? "bg-zinc-700 text-white hover:bg-zinc-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Back
                  </button>
                  <button
                    disabled={!validateStep(currentStep)}
                    onClick={() => handleNext(5)}
                    className={`px-8 py-3 text-base rounded-lg font-semibold flex items-center gap-2 transition-all
                      ${!validateStep(currentStep)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-lg"
                      }
                    `}
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Reason for Aid Request */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-500 pl-4 mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}>
                    Reason for Aid Request
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    Please provide details about your aid requirements
                  </p>
                </div>

                {/* Type of Aid Required */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Type of Aid Required <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Medical', 'Education', 'Food', 'Shelter', 'Employment', 'Other'].map((aidType) => (
                      <label key={aidType} className="cursor-pointer">
                        <input
                          type="radio"
                          name="aidType"
                          value={aidType.toLowerCase()}
                          checked={formData.aidType === aidType.toLowerCase()}
                          onChange={handleInputChange}
                          className="peer sr-only"
                          required
                        />
                        <div className={`p-3 rounded-lg border-2 text-center transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:dark:bg-emerald-950/30 ${darkMode
                          ? "border-zinc-600 bg-zinc-700 hover:border-zinc-500"
                          : "border-zinc-300 bg-white hover:border-zinc-400"
                          }`}>
                          <span className={`font-medium text-sm ${formData.aidType === aidType.toLowerCase()
                            ? 'text-emerald-600'
                            : darkMode ? "text-white" : "text-zinc-900"
                            }`}>
                            {aidType}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description of Financial Hardship */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Description of Financial Hardship <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="hardshipDescription"
                    value={formData.hardshipDescription}
                    onChange={handleInputChange}
                    placeholder="Please describe your financial hardship and why you need assistance..."
                    rows="5"
                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${darkMode
                      ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                      : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                      }`}
                    required
                  />
                  <p className={`text-xs mt-1 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                    Provide detailed information about your situation
                  </p>
                </div>

                {/* Supporting Documents Upload */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Supporting Documents <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${darkMode
                    ? "border-zinc-600 bg-zinc-700 hover:border-emerald-500"
                    : "border-zinc-300 bg-zinc-50 hover:border-emerald-500"
                    }`}>
                    <input
                      type="file"
                      name="supportingDocuments"
                      onChange={handleInputChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={formData.supportingDocuments.length === 0}
                    />
                    <div className="text-center pointer-events-none">
                      <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${darkMode ? "bg-zinc-600" : "bg-zinc-200"
                        }`}>
                        <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      {formData.supportingDocuments && formData.supportingDocuments.length > 0 ? (
                        <div>
                          <p className={`font-medium text-base ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                            {formData.supportingDocuments.length} file(s) selected
                          </p>
                          <div className={`text-xs mt-2 ${darkMode ? "text-zinc-400" : "text-zinc-600"} max-h-20 overflow-y-auto`}>
                            {formData.supportingDocuments.map((file, idx) => (
                              <div key={idx} className="truncate">{file.name}</div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className={`font-medium text-base ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                            Click to upload or drag and drop
                          </p>
                          <p className={`text-sm mt-1 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                            {(formData.aidType === 'medical' && "Hospital Bills, Medical Reports, Prescriptions") ||
                              (formData.aidType === 'education' && "School Fees, ID Card, Admission Letter") ||
                              (formData.aidType === 'food' && "Ration Card, Income Certificate") ||
                              (formData.aidType === 'shelter' && "Rent Agreement, Eviction Notice") ||
                              (formData.aidType === 'employment' && "Resume, Offer Letter, Termination Letter") ||
                              "Relevant Documents"}
                          </p>
                          <p className={`text-xs mt-1 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                            PDF, JPG, JPEG or PNG (Multiple files allowed)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Supporting Pictures Upload (Optional) */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Supporting Pictures <span className={`text-xs font-normal ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>(Optional)</span>
                  </label>
                  <div className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${darkMode
                    ? "border-zinc-600 bg-zinc-700 hover:border-emerald-500"
                    : "border-zinc-300 bg-zinc-50 hover:border-emerald-500"
                    }`}>
                    <input
                      type="file"
                      name="supportingPictures"
                      onChange={handleInputChange}
                      accept=".jpg,.jpeg,.png"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center pointer-events-none">
                      <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${darkMode ? "bg-zinc-600" : "bg-zinc-200"
                        }`}>
                        <svg className={`w-6 h-6 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {formData.supportingPictures && formData.supportingPictures.length > 0 ? (
                        <div>
                          <p className={`font-medium text-base ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                            {formData.supportingPictures.length} image(s) selected
                          </p>
                          <div className={`text-xs mt-2 ${darkMode ? "text-zinc-400" : "text-zinc-600"} max-h-20 overflow-y-auto`}>
                            {formData.supportingPictures.map((file, idx) => (
                              <div key={idx} className="truncate">{file.name}</div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className={`font-medium text-base ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                            Click to upload images
                          </p>
                          <p className={`text-sm mt-1 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                            Additional photos related to your request
                          </p>
                          <p className={`text-xs mt-1 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                            JPG, JPEG or PNG (Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 gap-3">
                  <button
                    onClick={() => handleNext(4)}
                    className={`px-8 py-3 text-base rounded-lg font-medium transition-all ${darkMode
                      ? "bg-zinc-700 text-white hover:bg-zinc-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Back
                  </button>

                  <button
                    disabled={!validateStep(currentStep)}
                    onClick={() => handleNext(6)}
                    className={`bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 text-base rounded-lg transition-all hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
                  >
                    Preview
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Preview Application */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-500 pl-4 mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}>
                    Preview Application
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    Review all details before final submission
                  </p>
                </div>

                <div className={`rounded-xl p-6 shadow-sm border ${darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"}`}>

                  {/* Campaigner Details */}
                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 border-b pb-2 ${darkMode ? "text-white border-zinc-700" : "text-zinc-900 border-zinc-200"}`}>Campaigner Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">Name</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Relation</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.relation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Contact</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.contactNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Email</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.email || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">ID Type</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.idType?.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">ID Number</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.govIdNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Beneficiary Details */}
                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 border-b pb-2 ${darkMode ? "text-white border-zinc-700" : "text-zinc-900 border-zinc-200"}`}>Beneficiary Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">Name</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.relationName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Date of Birth</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Gender</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.gender === 'rather_not_say' ? "Rather not say" : formData.gender}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Marital Status</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.maritalStatus}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Dependents</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.numberOfDependents}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 border-b pb-2 ${darkMode ? "text-white border-zinc-700" : "text-zinc-900 border-zinc-200"}`}>Address</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">Current Address</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.currentAddress}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Permanent Address</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.permanentAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial */}
                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 border-b pb-2 ${darkMode ? "text-white border-zinc-700" : "text-zinc-900 border-zinc-200"}`}>Financial Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">Occupation</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.occupation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Monthly Income</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                          {formData.noIncome ? "Not Applicable" : `₹${formData.monthlyIncome}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Bank & Branch</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.bankNameBranch}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Account No. & IFSC</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.accountNumber} / {formData.ifscCode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Request */}
                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 border-b pb-2 ${darkMode ? "text-white border-zinc-700" : "text-zinc-900 border-zinc-200"}`}>Request Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">Aid Type</p>
                        <p className={`font-medium capitalize ${darkMode ? "text-white" : "text-zinc-900"}`}>{formData.aidType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Hardship Description</p>
                        <p className={`font-medium text-sm ${darkMode ? "text-white" : "text-zinc-900"} whitespace-pre-wrap`}>{formData.hardshipDescription}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Documents</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                          {formData.supportingDocuments?.length} document(s) attached
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Pictures</p>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                          {formData.supportingPictures?.length || 0} picture(s) attached
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Final Buttons */}
                <div className="flex justify-between pt-4 gap-3">
                  <button
                    onClick={() => handleNext(5)}
                    className={`px-8 py-3 text-base rounded-lg font-medium transition-all ${darkMode
                      ? "bg-zinc-700 text-white hover:bg-zinc-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`px-8 py-3 text-base rounded-lg font-bold text-white shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-1 ${isLoading
                      ? "bg-emerald-800 cursor-not-allowed opacity-80"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/30"
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Check className="w-5 h-5" strokeWidth={3} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        redirectPath="/financial-aid"
      />
    </>
  )
}

