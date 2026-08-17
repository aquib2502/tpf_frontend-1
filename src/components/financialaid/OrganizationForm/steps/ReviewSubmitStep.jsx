"use client"

import { motion } from "framer-motion"
import { CheckCircle2, ChevronLeft, AlertCircle } from "lucide-react"
import FilePreview from "../../FilePreview"
export default function ReviewSubmitStep({ 
  formData, 
  updateFormData,
  handleSubmit,
  handleBack,
  setCurrentStep,
  isLoading,
  darkMode 
}) {
  const isNGO = formData.isNGO === "yes"

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className={`w-8 h-8 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`} />
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}>
          Review & Submit
        </h2>
      </div>

      <p className={`mb-6 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
        Please review all information before submitting
      </p>

      <div className={`rounded-2xl p-6 shadow-inner mb-6 ${darkMode ? "bg-zinc-800" : "bg-white"}`}>
        {/* Organization Information */}
        <h3 className={`font-semibold mb-3 text-lg ${darkMode ? "text-white" : "text-zinc-900"}`}>
          {isNGO ? "NGO Information" : "Organization Information"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-zinc-500">Organization Type</p>
            <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
              {isNGO ? "NGO/Non-Profit" : "Private Company"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Organization Name</p>
            <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
              {formData.organizationName || "—"}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-zinc-500">Organization Email</p>
            <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
              {formData.organizationEmail || "—"}
            </p>
          </div>
          {formData.officialWebsite && (
            <div>
              <p className="text-xs text-zinc-500">Official Website</p>
              <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                {formData.officialWebsite}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-zinc-500">Location</p>
            <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
              {formData.city}, {formData.state}
            </p>
          </div>
          {isNGO ? (
            <div>
              <p className="text-xs text-zinc-500">Causes Supported</p>
              <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                {formData.causesSupported?.join(", ") || "—"}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-zinc-500">Business Domain</p>
              <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                {formData.businessDomain || "—"}
              </p>
            </div>
          )}
        </div>

        {/* Founder/Director Details */}
        <h3 className={`font-semibold mb-3 text-lg border-t pt-4 ${darkMode ? "text-white" : "text-zinc-900"}`} 
            style={{ borderColor: darkMode ? "#3f3f46" : "#e4e4e7" }}>
          {isNGO ? "Founder Details" : "Director Details"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-zinc-500">Name</p>
            <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
              {isNGO ? formData.founderName : formData.directorName || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Email</p>
            <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
              {isNGO ? formData.founderEmail : formData.directorEmail || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Mobile</p>
            <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
              {isNGO ? formData.founderMobile : formData.directorMobile || "—"}
            </p>
          </div>
        </div>

        {/* Contact Person */}
        <h3 className={`font-semibold mb-3 text-lg border-t pt-4 ${darkMode ? "text-white" : "text-zinc-900"}`}
            style={{ borderColor: darkMode ? "#3f3f46" : "#e4e4e7" }}>
          Point of Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-zinc-500">Name</p>
            <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
              {formData.contactName || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Contact Number</p>
            <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
              {formData.contactNumber || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Email</p>
            <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
              {formData.contactEmail || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Designation</p>
            <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
              {formData.designation || "—"}
            </p>
          </div>
        </div>

        {/* Documents */}
        <h3 className={`font-semibold mb-3 text-lg border-t pt-4 ${darkMode ? "text-white" : "text-zinc-900"}`}
            style={{ borderColor: darkMode ? "#3f3f46" : "#e4e4e7" }}>
          Documents & Certifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {isNGO ? (
            <>
              <div>
                <p className="text-xs text-zinc-500">80G Certification</p>
                <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                  {formData.has80G === "yes" ? "Yes" : "No"}
                </p>
              </div>
              {formData.has80G === "yes" && (
                <>
                  <div>
                    <p className="text-xs text-zinc-500">Certificate Expiry</p>
                    <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                      {formData.expiryDate || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">PAN Number</p>
                    <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                      {formData.panCard || "—"}
                    </p>
                  </div>
                </>
              )}
              <div>
                <p className="text-xs text-zinc-500">FCRA Certification</p>
                <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                  {formData.hasFCRA === "yes" ? "Yes" : "No"}
                </p>
              </div>
            </>
          ) : (
            <div>
              <p className="text-xs text-zinc-500">Document Type</p>
              <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                {formData.documentType === "gst" ? "GST Certificate" :
                 formData.documentType === "incorporation" ? "Certificate of Incorporation" :
                 formData.documentType === "other" ? "Other Business Registration" : "—"}
              </p>
            </div>
          )}
        </div>

        {/* Organization Profile */}
        <h3 className={`font-semibold mb-3 text-lg border-t pt-4 ${darkMode ? "text-white" : "text-zinc-900"}`}
            style={{ borderColor: darkMode ? "#3f3f46" : "#e4e4e7" }}>
          Organization Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isNGO ? (
            <>
              <div>
                <p className="text-xs text-zinc-500">Annual Turnover</p>
                <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                  {formData.annualTurnover || formData.annualBudget || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Donor Database</p>
                <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                  {formData.donorDatabase || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Number of Employees</p>
                <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                  {formData.employeeStrength || "—"}
                </p>
              </div>
              {formData.volunteerStrength && (
                <div>
                  <p className="text-xs text-zinc-500">Number of Volunteers</p>
                  <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                    {formData.volunteerStrength}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <p className="text-xs text-zinc-500">Annual Turnover</p>
                <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                  {formData.annualTurnover || formData.annualRevenue || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Number of Employees</p>
                <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                  {formData.numberOfEmployees || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Years in Operation</p>
                <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                  {formData.yearsInOperation || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">CSR Initiatives</p>
                <p className={`font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
                  {formData.csr_initiatives || "—"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Declaration */}
      <div className={`rounded-lg p-6 mb-6 ${darkMode ? "bg-zinc-800/50 border border-zinc-700" : "bg-emerald-50 border border-emerald-200"}`}>
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? "text-emerald-400" : "text-emerald-900"}`}>
          <AlertCircle className="w-5 h-5" />
          Declaration & Agreement
        </h3>
        <div className={`space-y-3 text-sm ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
          <p>
            I hereby declare that I am an authorized representative of <strong>{formData.organizationName}</strong> and have the authority to register this organization on this platform.
          </p>
          <p>
            I confirm that:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>All information provided is accurate and truthful to the best of my knowledge</li>
            <li>All uploaded documents are authentic and verifiable through official government portals</li>
            <li>The organization is duly registered and operating in compliance with applicable laws and regulations</li>
            <li>I understand that providing false information may result in immediate suspension or termination of the organization's account</li>
            <li>The organization agrees to maintain transparency in its operations and financial reporting</li>
            <li>I consent to the verification of submitted documents and information</li>
            <li>The organization will update its profile information if there are any material changes</li>
          </ul>
          <p className="mt-4">
            By checking the box below and submitting this form, I acknowledge that I have read, understood, and agree to be bound by the platform's Terms of Service and Privacy Policy.
          </p>
        </div>

        <label className={`flex items-start gap-3 mt-4 cursor-pointer p-3 rounded-lg transition-colors ${
          formData.termsAccepted 
            ? darkMode ? "bg-emerald-500/10" : "bg-emerald-100"
            : darkMode ? "hover:bg-zinc-700/50" : "hover:bg-white"
        }`}>
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
            className="mt-0.5 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}>
            I accept the declaration and agree to the Terms of Service and Privacy Policy
          </span>
        </label>
      </div>

      {/* Edit Button */}
      <div className={`text-center mb-6 p-4 rounded-lg ${darkMode ? "bg-zinc-800/50" : "bg-zinc-50"}`}>
        <p className={`text-sm mb-2 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
          Need to make changes? You can edit any section by clicking the step above or using the button below.
        </p>
        <button
          onClick={() => setCurrentStep(1)}
          className={`text-sm font-medium ${darkMode ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-600 hover:text-emerald-700"}`}
        >
          ← Go back to edit information
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            darkMode
              ? "bg-zinc-700 hover:bg-zinc-600 text-white"
              : "bg-zinc-200 hover:bg-zinc-300 text-zinc-900"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!formData.termsAccepted || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all hover:shadow-lg flex items-center gap-2"
        >
          {isLoading ? 'Submitting...' : 'Submit Registration'}
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}