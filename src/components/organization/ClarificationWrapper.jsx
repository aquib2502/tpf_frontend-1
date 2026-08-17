"use client";

import React, { useState } from 'react';
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import OrganizationForm from "@/components/financialaid/OrganizationForm/OrganizationForm";
import { useSubmitOrganizationClarificationMutation } from '@/utils/slices/organizationApiSlice';

export default function ClarificationWrapper({ userInfo, darkMode, targetChildren }) {
    const [isEditing, setIsEditing] = useState(false);
    const [submitClarification] = useSubmitOrganizationClarificationMutation();

    if (userInfo.verificationStatus === 'pending') {
        return (
            <div className={`min-h-[70vh] flex flex-col items-center justify-center p-6 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Application Under Review</h1>
                <p className="text-center max-w-lg text-lg text-zinc-500">
                    Your organization registration is currently being reviewed by our administrators. 
                    We will notify you once your application is approved or if any further clarification is required.
                </p>
            </div>
        );
    }

    if (userInfo.verificationStatus === 'clarification_requested') {
        if (isEditing) {
            // Map userInfo back to flat formData structure for OrganizationForm
            const initialData = {
                isNGO: userInfo.isNGO ? "yes" : "no",
                organizationName: userInfo.organizationName || "",
                organizationEmail: userInfo.organizationEmail || "",
                officialWebsite: userInfo.officialWebsite || "",
                state: userInfo.state || "",
                city: userInfo.city || "",
                organizationDescription: userInfo.organizationDescription || "",
                
                // Contact
                contactName: userInfo.contactDetails?.contactName || "",
                contactNumber: userInfo.contactDetails?.contactNumber || "",
                contactEmail: userInfo.contactDetails?.contactEmail || "",
                designation: userInfo.contactDetails?.designation || "",
                
                // NGO
                causesSupported: userInfo.ngoDetails?.causesSupported || [],
                founderName: userInfo.ngoDetails?.founderName || "",
                founderEmail: userInfo.ngoDetails?.founderEmail || "",
                founderMobile: userInfo.ngoDetails?.founderMobile || "",
                has80G: userInfo.ngoDetails?.has80G || "",
                hasFCRA: userInfo.ngoDetails?.hasFCRA || "",
                annualTurnover: userInfo.ngoDetails?.annualTurnover || userInfo.ngoDetails?.annualBudget || userInfo.companyDetails?.annualTurnover || userInfo.companyDetails?.annualRevenue || "",
                annualBudget: userInfo.ngoDetails?.annualBudget || "",
                donorDatabase: userInfo.ngoDetails?.donorDatabase || "",
                fullTimeFundraising: userInfo.ngoDetails?.fullTimeFundraising || "",
                crowdfundedBefore: userInfo.ngoDetails?.crowdfundedBefore || "",
                employeeStrength: userInfo.ngoDetails?.employeeStrength || "",
                volunteerStrength: userInfo.ngoDetails?.volunteerStrength || "",
                organizeEvents: userInfo.ngoDetails?.organizeEvents || "",
                expiryDate: userInfo.ngoDetails?.certification80GExpiryDate ? new Date(userInfo.ngoDetails.certification80GExpiryDate).toISOString().split('T')[0] : "",
                panCard: userInfo.ngoDetails?.panCard || "",

                // Company
                businessDomain: userInfo.companyDetails?.businessDomain || "",
                directorName: userInfo.companyDetails?.directorName || "",
                directorEmail: userInfo.companyDetails?.directorEmail || "",
                directorMobile: userInfo.companyDetails?.directorMobile || "",
                documentType: userInfo.companyDetails?.documentType || "",
                annualRevenue: userInfo.companyDetails?.annualRevenue || "",
                numberOfEmployees: userInfo.companyDetails?.numberOfEmployees || "",
                yearsInOperation: userInfo.companyDetails?.yearsInOperation || "",
                csr_initiatives: userInfo.companyDetails?.csrInitiatives || "",
                partnershipInterest: userInfo.companyDetails?.partnershipInterest || "",

                termsAccepted: true,
            };

            const handleClarifySubmit = async (formDataToSend) => {
                await submitClarification({ id: userInfo._id, formData: formDataToSend }).unwrap();
                setIsEditing(false); // will force reload since state will be pending soon, but RTK might take a second.
                setTimeout(() => window.location.reload(), 1500); 
            };

            return (
                <div className="w-full relative">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className={`absolute top-4 left-4 z-50 px-4 py-2 rounded-xl text-sm font-bold ${darkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-white text-zinc-800 shadow-md hover:bg-zinc-50'}`}
                    >
                        ← Cancel Editing
                    </button>
                    <OrganizationForm 
                        darkModeFromParent={darkMode} 
                        isClarification={true} 
                        initialData={initialData} 
                        onClarifySubmit={handleClarifySubmit} 
                    />
                </div>
            );
        }

        const clarificationsHistory = userInfo.clarifications || [];

        return (
            <div className={`min-h-[70vh] flex flex-col items-center justify-center p-6 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                <div className="w-full max-w-3xl rounded-2xl overflow-hidden border border-amber-200 shadow-xl">
                    <div className="bg-amber-500 p-6 flex items-center gap-4 text-white">
                        <AlertCircle className="w-10 h-10" />
                        <div>
                            <h2 className="text-2xl font-bold">Clarification Required</h2>
                            <p className="text-amber-50 font-medium">Your application requires additional actions before approval.</p>
                        </div>
                    </div>
                    
                    <div className={`p-8 ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                        <div className="mb-8">
                            <h3 className="text-sm uppercase tracking-wider font-bold mb-3 text-zinc-500">Message from Administrator:</h3>
                            <div className="p-5 rounded-xl bg-amber-50 border border-amber-100 text-amber-900 text-lg leading-relaxed italic mb-6">
                                "{userInfo.verificationNotes || 'Please update your submitted documents.'}"
                            </div>

                            {clarificationsHistory.length > 0 && (
                                <div className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                                    <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400">Clarification History & Log</h4>
                                    <div className="space-y-3">
                                        {clarificationsHistory.map((item, idx) => (
                                            <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 space-y-2">
                                                <div className="flex justify-between items-center text-xs text-zinc-500 font-semibold">
                                                    <span>Round #{idx + 1}</span>
                                                    <span>{new Date(item.requestedAt).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                                    Req: "{item.requestNotes}"
                                                </p>
                                                {item.responseNotes && (
                                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                                        Response ({item.respondedAt ? new Date(item.respondedAt).toLocaleDateString() : ''}): "{item.responseNotes}"
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
                            >
                                <FileText size={20} />
                                Fix Application & Re-submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{targetChildren}</>;
}
