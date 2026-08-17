"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRegisterOrganizationMutation } from "@/utils/slices/organizationApiSlice"
import { ChevronLeft } from "lucide-react"
import { useAppToast } from "@/app/AppToastContext"
import { useDraft } from "@/utils/hooks/useDraft"

// Import step components
import OrganizationDetailsStep from "./steps/OrganizationDetailsStep"
import ContactDetailsStep from "./steps/ContactDetailsStep"
import DocumentsStep from "./steps/DocumentsStep"
import OrganizationProfileStep from "./steps/OrganizationProfileStep"
import ReviewSubmitStep from "./steps/ReviewSubmitStep"
import ProgressBar from "./components/ProgressBar"
import SuccessMessage from "./components/SuccessMessage"

export default function OrganizationRegistrationPage({ darkModeFromParent, isClarification = false, initialData = null, onClarifySubmit = null }) {
  const router = useRouter()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [registerOrganization, { isLoading }] = useRegisterOrganizationMutation()
  const [darkMode, setDarkMode] = useState(false)
  const { showToast } = useAppToast()

  const { hasExistingDraft, existingDraftData, saveDraft, clearDraft } = useDraft("draft_financial_aid_organization")
  const [showDraftPrompt, setShowDraftPrompt] = useState(false)
  const [draftSavedStatus, setDraftSavedStatus] = useState("")

  // Check for draft on load (only if not clarification page)
  useEffect(() => {
    if (hasExistingDraft && !isClarification) {
      setShowDraftPrompt(true)
    }
  }, [hasExistingDraft, isClarification])

  useEffect(() => {
    if (darkModeFromParent !== undefined) {
      setDarkMode(darkModeFromParent)
    }
  }, [darkModeFromParent])

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Organization Details
    isNGO: "", // "yes" or "no"
    organizationName: "",
    organizationEmail: "",
    officialWebsite: "",
    state: "",
    city: "",
    
    // NGO specific
    causesSupported: [],
    founderName: "",
    founderEmail: "",
    founderMobile: "",
    
    // Non-NGO specific
    businessDomain: "",
    directorName: "",
    directorEmail: "",
    directorMobile: "",

    // Step 2: Contact Details
    contactName: "",
    contactNumber: "",
    contactEmail: "",
    designation: "",

    // Step 3: Documents
    // For NGO
    has80G: "",
    expiryDate: "",
    certification80G: null,
    panCard: "",
    panCardImage: null,
    hasFCRA: "",
    
    // For Non-NGO
    documentType: "", // "gst", "incorporation", "other"
    businessDocument: null,
    businessPanCard: null,

    // Step 4: Organization Profile
    // Common Turnover Field
    annualTurnover: "",
    annualBudget: "",
    annualRevenue: "",
    donorDatabase: "",
    fullTimeFundraising: "",
    crowdfundedBefore: "",
    employeeStrength: "",
    volunteerStrength: "",
    organizeEvents: "",
    
    // For Non-NGO
    numberOfEmployees: "",
    yearsInOperation: "",
    csr_initiatives: "",
    partnershipInterest: "",
    
    // Common optional fields
    organizationLogo: null,
    organizationCover: null,
    organizationDescription: "",

    otherDocuments: [], // Array of files

    termsAccepted: false,
  })

  // Debounced auto-save
  useEffect(() => {
    if (showDraftPrompt || isClarification) return

    const hasData = Object.entries(formData).some(([key, val]) => {
      if (['certification80G', 'panCardImage', 'businessDocument', 'businessPanCard', 'organizationLogo', 'organizationCover', 'otherDocuments', 'termsAccepted', 'causesSupported'].includes(key)) return false;
      return val !== '' && val !== null && val !== undefined;
    });
    if (!hasData) return

    setDraftSavedStatus("Saving...")
    const delayDebounce = setTimeout(() => {
      const cleanData = { ...formData }
      delete cleanData.certification80G
      delete cleanData.panCardImage
      delete cleanData.businessDocument
      delete cleanData.businessPanCard
      delete cleanData.organizationLogo
      delete cleanData.organizationCover
      delete cleanData.otherDocuments

      saveDraft({ formData: cleanData, currentStep })
      setDraftSavedStatus("Draft Saved")
      setTimeout(() => setDraftSavedStatus(""), 2000)
    }, 2000)

    return () => clearTimeout(delayDebounce)
  }, [formData, currentStep, saveDraft, showDraftPrompt, isClarification])

  const handleInputChange = (e) => {
    const { name, value, type } = e.target

    if (type === "file") {
      if (name === "otherDocuments") {
        const files = Array.from(e.target.files)
        setFormData(prev => ({
          ...prev,
          otherDocuments: [...(prev.otherDocuments || []), ...files].slice(0, 3)
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: e.target.files[0]
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }


  const removeOtherDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      otherDocuments: prev.otherDocuments.filter((_, i) => i !== index)
    }))
  }

  const handleCheckboxChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }))
  }

  const removeFile = (name) => {
    setFormData(prev => ({ ...prev, [name]: null }))
  }

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const validateStep = (step) => {
    const isNGO = formData.isNGO === "yes"
    
    switch (step) {
      case 1:
        const basicFields = ["isNGO", "organizationName", "organizationEmail", "state", "city"]
        for (const field of basicFields) {
          if (!formData[field]) return false
        }
        
        if (isNGO) {
          if (!formData.founderName || !formData.founderEmail || !formData.founderMobile) return false
          if (formData.causesSupported.length === 0) return false
        } else {
          if (!formData.businessDomain || !formData.directorName || !formData.directorEmail || !formData.directorMobile) return false
        }
        return true

      case 2:
        return formData.contactName && formData.contactNumber && formData.contactEmail && formData.designation

      case 3:
        if (isNGO) {
          return formData.has80G !== "" && formData.hasFCRA !== ""
        } else {
          return formData.documentType !== "" && formData.businessDocument !== null
        }

      case 4:
        const hasTurnover = formData.annualTurnover || formData.annualBudget || formData.annualRevenue
        if (isNGO) {
          return hasTurnover && formData.donorDatabase && formData.fullTimeFundraising && 
                 formData.crowdfundedBefore && formData.employeeStrength
        } else {
          return hasTurnover && formData.numberOfEmployees && formData.yearsInOperation &&
                 formData.csr_initiatives && formData.partnershipInterest
        }

      case 5:
        return formData.termsAccepted

      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      setCurrentStep(prev => prev + 1)
    } else {
      showToast({
        type: "error",
        title: "Please fill all required fields",
        message: "Complete all required information before proceeding",
        duration: 3000,
      })
    }
  }

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    if (!formData.termsAccepted) {
      showToast({
        type: "error",
        title: "Please accept the terms and policies",
        message: " ",
        duration: 2000,
      })
      return
    }

    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (Array.isArray(formData[key])) {
            formDataToSend.append(key, JSON.stringify(formData[key]))
          } else if (formData[key] instanceof File) {
            formDataToSend.append(key, formData[key])
          } else {
            formDataToSend.append(key, formData[key])
          }
        }
      })

      if (isClarification && onClarifySubmit) {
        await onClarifySubmit(formDataToSend)
        setShowSuccessMessage(true)
        showToast({
          type: "success",
          title: "Clarification Submitted",
          message: "Your application is back under review.",
          duration: 3000,
        })
        return
      }

      const response = await registerOrganization(formDataToSend).unwrap()

      clearDraft()
      setShowSuccessMessage(true)
      showToast({
        type: "success",
        title: "Registration Successful",
        message: response.message || "Your organization has been registered successfully",
        duration: 3000,
      })

      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error) {
      console.error('Submission error:', error)
      showToast({
        type: "error",
        title: "Submission Failed",
        message: error?.data?.message || "An error occurred during submission",
        duration: 3000,
      })
    }
  }

  const steps = [
    { number: 1, title: formData.isNGO === "yes" ? "NGO Details" : "Organization Details", icon: "building" },
    { number: 2, title: "Contact Details", icon: "users" },
    { number: 3, title: "Documents", icon: "fileText" },
    { number: 4, title: "Organization Profile", icon: "award" },
    { number: 5, title: "Review & Submit", icon: "check" }
  ]

  if (showSuccessMessage) {
    return <SuccessMessage darkMode={darkMode} />
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
      <div className={`min-h-screen ${darkMode ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" : "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"} py-8 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${darkMode ? "text-white" : "text-zinc-900"}`}>
            Organization Registration
          </h1>
          <p className={`text-sm md:text-base ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
            {formData.isNGO === "yes" ? "Register your NGO" : formData.isNGO === "no" ? "Register your company" : "Complete the form to register"}
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          steps={steps} 
          currentStep={currentStep} 
          darkMode={darkMode}
          isNGO={formData.isNGO === "yes"}
        />

        {/* Form Steps */}
        <div className={`rounded-2xl shadow-2xl p-6 md:p-8 mt-8 relative ${darkMode ? "bg-zinc-800/50 backdrop-blur" : "bg-white"}`}>
          {draftSavedStatus && (
            <span className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse transition-all ${
              darkMode ? "bg-zinc-700 text-zinc-300" : "bg-zinc-100 text-zinc-600"
            }`}>
              {draftSavedStatus}
            </span>
          )}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <OrganizationDetailsStep
                key="step1"
                formData={formData}
                updateFormData={updateFormData}
                handleInputChange={handleInputChange}
                handleCheckboxChange={handleCheckboxChange}
                handleNext={handleNext}
                darkMode={darkMode}
              />
            )}

            {currentStep === 2 && (
              <ContactDetailsStep
                key="step2"
                formData={formData}
                handleInputChange={handleInputChange}
                handleNext={handleNext}
                handleBack={handleBack}
                darkMode={darkMode}
              />
            )}

            {currentStep === 3 && (
              <DocumentsStep
                key="step3"
                formData={formData}
                handleInputChange={handleInputChange}
                removeFile={removeFile}
                removeOtherDocument={removeOtherDocument}
                handleNext={handleNext}
                handleBack={handleBack}
                darkMode={darkMode}
              />
            )}

            {currentStep === 4 && (
              <OrganizationProfileStep
                key="step4"
                formData={formData}
                handleInputChange={handleInputChange}
                removeFile={removeFile}
                handleNext={handleNext}
                handleBack={handleBack}
                darkMode={darkMode}
              />
            )}

            {currentStep === 5 && (
              <ReviewSubmitStep
                key="step5"
                formData={formData}
                updateFormData={updateFormData}
                handleSubmit={handleSubmit}
                handleBack={handleBack}
                setCurrentStep={setCurrentStep}
                isLoading={isLoading}
                darkMode={darkMode}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </>
  )
}