"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, Loader2 } from 'lucide-react';

export default function OrganizationEditModal({ isOpen, onClose, section, org, onSave, isLoading }) {
    const [formData, setFormData] = useState({});
    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        if (section === 'basic') {
            setFormData({
                organizationName: org.organizationName,
                officialWebsite: org.officialWebsite,
                organizationDescription: org.organizationDescription
            });
        } else if (section === 'stats') {
            setFormData({
                numberOfEmployees: org.companyDetails?.numberOfEmployees || org.ngoDetails?.employeeStrength,
                annualTurnover: org.companyDetails?.annualTurnover || org.companyDetails?.annualRevenue || org.ngoDetails?.annualTurnover || org.ngoDetails?.annualBudget,
                yearsInOperation: org.companyDetails?.yearsInOperation
            });
        } else if (section === 'personal') {
            const personal = org.isNGO ? {
                name: org.ngoDetails?.founderName,
                email: org.ngoDetails?.founderEmail,
                mobile: org.ngoDetails?.founderMobile
            } : {
                name: org.companyDetails?.directorName,
                email: org.companyDetails?.directorEmail,
                mobile: org.companyDetails?.directorMobile
            };
            setFormData(personal);
        } else if (section === 'contact') {
            setFormData({
                contactName: org.contactDetails?.contactName,
                designation: org.contactDetails?.designation,
                contactEmail: org.contactDetails?.contactEmail,
                contactNumber: org.contactDetails?.contactNumber
            });
        }
    }, [section, org, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, organizationLogo: file });
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <h3 className="text-xl font-bold text-white">
                            {section === 'basic' && 'Edit Basic Info'}
                            {section === 'stats' && 'Update Metrics'}
                            {section === 'personal' && 'Edit Personal Details'}
                            {section === 'contact' && 'Edit Contact Person'}
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                            <X className="w-5 h-5 text-zinc-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {section === 'basic' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-400">Organization Logo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-zinc-800 border-2 border-dashed border-zinc-700 flex items-center justify-center overflow-hidden">
                                            {logoPreview ? (
                                                <img src={logoPreview} className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload className="w-6 h-6 text-zinc-500" />
                                            )}
                                        </div>
                                        <input type="file" onChange={handleFileChange} className="text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-400">Website URL</label>
                                    <input
                                        type="text"
                                        value={formData.officialWebsite || ''}
                                        onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-400">Description</label>
                                    <textarea
                                        rows={4}
                                        value={formData.organizationDescription || ''}
                                        onChange={(e) => setFormData({ ...formData, organizationDescription: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                                    />
                                </div>
                            </>
                        )}

                        {section === 'stats' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-400">Team Size</label>
                                    <select
                                        value={formData.numberOfEmployees || ''}
                                        onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="1-10">1 – 10</option>
                                        <option value="11-50">11 – 50</option>
                                        <option value="51-200">51 – 200</option>
                                        <option value="201-500">201 – 500</option>
                                        <option value="500+">500+</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-400">Annual Turnover</label>
                                    <select
                                        value={formData.annualTurnover || formData.annualRevenue || ''}
                                        onChange={(e) => setFormData({ ...formData, annualTurnover: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="0-50L">₹0 – 50 Lakhs</option>
                                        <option value="50L-1Cr">₹50L – 1 Crore</option>
                                        <option value="1Cr-10Cr">₹1 – 10 Crores</option>
                                        <option value="10Cr+">₹10 Crores+</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-400">Years in Operation</label>
                                    <select
                                        value={formData.yearsInOperation || ''}
                                        onChange={(e) => setFormData({ ...formData, yearsInOperation: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="0-1">Less than 1 year</option>
                                        <option value="1-3">1 – 3 years</option>
                                        <option value="3-5">3 – 5 years</option>
                                        <option value="5-10">5 – 10 years</option>
                                        <option value="10+">10+ years</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {(section === 'personal' || section === 'contact') && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-400">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name || formData.contactName || ''}
                                        onChange={(e) => setFormData({ ...formData, [section === 'personal' ? 'name' : 'contactName']: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                {section === 'contact' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-400">Designation</label>
                                        <input
                                            type="text"
                                            value={formData.designation || ''}
                                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-400">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email || formData.contactEmail || ''}
                                        onChange={(e) => setFormData({ ...formData, [section === 'personal' ? 'email' : 'contactEmail']: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-400">Mobile</label>
                                    <input
                                        type="text"
                                        value={formData.mobile || formData.contactNumber || ''}
                                        onChange={(e) => setFormData({ ...formData, [section === 'personal' ? 'mobile' : 'contactNumber']: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                    <p className="text-xs text-amber-500 font-medium">
                                        Note: Changes to these details require admin approval before they are updated on your profile.
                                    </p>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isLoading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
