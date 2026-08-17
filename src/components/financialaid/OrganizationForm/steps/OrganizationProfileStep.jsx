"use client"

import { motion } from "framer-motion"
import { Award, ChevronRight, ChevronLeft, Upload } from "lucide-react"
import FilePreview from "../../FilePreview"
export default function OrganizationProfileStep({ 
  formData, 
  handleInputChange,
  removeFile,
  handleNext, 
  handleBack,
  darkMode 
}) {
  const isNGO = formData.isNGO === "yes"
  const maxDescriptionLength = 250

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Award className={`w-8 h-8 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`} />
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}>
          Organization Profile
        </h2>
      </div>

      <p className={`mb-6 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
        Tell us more about your {isNGO ? "NGO" : "organization"}
      </p>

      {isNGO ? (
        // NGO Profile Fields
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Annual Turnover Range <span className="text-red-500">*</span>
              </label>
              <select
                name="annualTurnover"
                value={formData.annualTurnover || formData.annualBudget}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select turnover range</option>
                <option value="0-5L">₹0 - ₹5 Lakhs</option>
                <option value="5L-25L">₹5 Lakhs - ₹25 Lakhs</option>
                <option value="25L-1Cr">₹25 Lakhs - ₹1 Crore</option>
                <option value="1Cr-5Cr">₹1 Crore - ₹5 Crores</option>
                <option value="5Cr+">₹5 Crores+</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Do you maintain a donor database? <span className="text-red-500">*</span>
              </label>
              <select
                name="donorDatabase"
                value={formData.donorDatabase}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="planning">Planning to start</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Full-time fundraising staff? <span className="text-red-500">*</span>
              </label>
              <select
                name="fullTimeFundraising"
                value={formData.fullTimeFundraising}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Have you crowdfunded before? <span className="text-red-500">*</span>
              </label>
              <select
                name="crowdfundedBefore"
                value={formData.crowdfundedBefore}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Number of Employees <span className="text-red-500">*</span>
              </label>
              <select
                name="employeeStrength"
                value={formData.employeeStrength}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select range</option>
                <option value="1-5">1-5</option>
                <option value="6-10">6-10</option>
                <option value="11-25">11-25</option>
                <option value="26-50">26-50</option>
                <option value="51-100">51-100</option>
                <option value="100+">100+</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Number of Volunteers
              </label>
              <select
                name="volunteerStrength"
                value={formData.volunteerStrength}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select range</option>
                <option value="0-10">0-10</option>
                <option value="11-50">11-50</option>
                <option value="51-100">51-100</option>
                <option value="100+">100+</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Do you organize fundraising events?
              </label>
              <select
                name="organizeEvents"
                value={formData.organizeEvents}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select option</option>
                <option value="yes-regular">Yes, regularly</option>
                <option value="yes-occasional">Yes, occasionally</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        // Non-NGO Profile Fields
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Annual Turnover Range <span className="text-red-500">*</span>
              </label>
              <select
                name="annualTurnover"
                value={formData.annualTurnover || formData.annualRevenue}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select turnover range</option>
                <option value="0-50L">₹0 - ₹50 Lakhs</option>
                <option value="50L-1Cr">₹50 Lakhs - ₹1 Crore</option>
                <option value="1Cr-5Cr">₹1 Crore - ₹5 Crores</option>
                <option value="5Cr-10Cr">₹5 Crores - ₹10 Crores</option>
                <option value="10Cr-50Cr">₹10 Crores - ₹50 Crores</option>
                <option value="50Cr+">₹50 Crores+</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Number of Employees <span className="text-red-500">*</span>
              </label>
              <select
                name="numberOfEmployees"
                value={formData.numberOfEmployees}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select range</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="500+">500+</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Years in Operation <span className="text-red-500">*</span>
              </label>
              <select
                name="yearsInOperation"
                value={formData.yearsInOperation}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select option</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Do you have CSR initiatives? <span className="text-red-500">*</span>
              </label>
              <select
                name="csr_initiatives"
                value={formData.csr_initiatives}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select option</option>
                <option value="yes-active">Yes, active CSR programs</option>
                <option value="yes-planning">Yes, planning CSR activities</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                Interest in Partnership/Collaboration <span className="text-red-500">*</span>
              </label>
              <select
                name="partnershipInterest"
                value={formData.partnershipInterest}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-emerald-600"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select option</option>
                <option value="donation">Donation/Funding opportunities</option>
                <option value="sponsorship">Event sponsorship</option>
                <option value="collaboration">Strategic collaboration</option>
                <option value="csr-partner">CSR partnership</option>
                <option value="volunteer">Employee volunteering programs</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Optional Logo Upload */}
      <div className="border-t pt-6 mt-8" style={{ borderColor: darkMode ? "#3f3f46" : "#e4e4e7" }}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-zinc-900"}`}>
          Optional Information
        </h3>
        
        <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
              Organization Logo (Optional)
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 h-[160px] flex items-center justify-center ${
              darkMode ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-300 bg-zinc-50"
            }`}>
              {formData.organizationLogo ? (
                <FilePreview 
                  file={formData.organizationLogo} 
                  darkMode={darkMode}
                  onRemove={() => removeFile("organizationLogo")}
                />
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className={`w-8 h-8 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                  <span className={`text-sm text-center ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    Click to upload logo<br/><span className="text-[10px]">(PNG, JPG - Max 2MB)</span>
                  </span>
                  <input
                    type="file"
                    name="organizationLogo"
                    onChange={handleInputChange}
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
              Organization Cover Photo (Optional)
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 h-[160px] flex items-center justify-center ${
              darkMode ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-300 bg-zinc-50"
            }`}>
              {formData.organizationCover ? (
                <FilePreview 
                  file={formData.organizationCover} 
                  darkMode={darkMode}
                  onRemove={() => removeFile("organizationCover")}
                />
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 text-center">
                  <Upload className={`w-8 h-8 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
                  <span className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    Click to upload cover photo<br/><span className="text-[10px]">(PNG, JPG - Max 5MB)</span>
                  </span>
                  <input
                    type="file"
                    name="organizationCover"
                    onChange={handleInputChange}
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

          <div>
  <label
    className={`block text-sm font-medium mb-2 ${
      darkMode ? "text-zinc-300" : "text-zinc-700"
    }`}
  >
    Organization Description (Optional)
  </label>

  <textarea
    name="organizationDescription"
    value={formData.organizationDescription}
    onChange={handleInputChange}
    rows={5}
    placeholder="Describe what your organization does and how it works..."
    className={`w-full px-4 py-2.5 rounded-lg border transition-colors resize-none ${
      darkMode
        ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-emerald-500"
        : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-emerald-600"
    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
  />
</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 mt-6">
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
          onClick={handleNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-all hover:shadow-lg flex items-center gap-2"
        >
          Next Step
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}