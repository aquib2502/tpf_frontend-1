"use client";

import { useSelector } from "react-redux";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  Users,
  Briefcase,
  BadgeCheck,
  Clock,
  TrendingUp,
  FileText,
  User,
  IndianRupee,
  CalendarDays,
  ChevronRight,
  Handshake,
  ShieldCheck,
  Edit2,
} from "lucide-react";
import { getMediaUrl } from "@/utils/media";
import OrganizationEditModal from "./OrganizationEditModal";
import { useUpdateOrganizationMutation, useRequestEditMutation } from "@/utils/slices/organizationApiSlice";
import { toast } from "react-toastify";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = {
  revenue: (v) => {
    const map = {
      "0-50L": "₹0 – 50 Lakhs",
      "50L-1Cr": "₹50L – 1 Crore",
      "1Cr-10Cr": "₹1 – 10 Crores",
      "10Cr+": "₹10 Crores+",
    };
    return map[v] || v || "—";
  },
  employees: (v) => {
    const map = {
      "1-10": "1 – 10",
      "11-50": "11 – 50",
      "51-200": "51 – 200",
      "201-500": "201 – 500",
      "500+": "500+",
    };
    return map[v] || v || "—";
  },
  years: (v) => {
    const map = {
      "0-1": "Less than 1 year",
      "1-3": "1 – 3 years",
      "3-5": "3 – 5 years",
      "5-10": "5 – 10 years",
      "10+": "10+ years",
    };
    return map[v] || v || "—";
  },
  partnership: (v) => {
    const map = {
      "csr-partner": "CSR Partner",
      "donation-drive": "Donation Drive",
      "co-branding": "Co-Branding",
      "volunteering": "Volunteering",
    };
    return map[v] || v || "—";
  },
  date: (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  },
};

// ─── sub-components ──────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: "easeOut" },
});

function StatCard({ icon: Icon, label, value, gradient, darkMode }) {
  return (
    <motion.div
      {...fadeUp(0.05)}
      className={`relative overflow-hidden rounded-2xl p-5 border ${darkMode
        ? "bg-zinc-900 border-zinc-800"
        : "bg-white border-gray-100 shadow-sm"
        }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${gradient}`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p
        className={`text-xs font-semibold mb-1 ${darkMode ? "text-zinc-500" : "text-gray-500"
          }`}
      >
        {label}
      </p>
      <p
        className={`text-sm font-bold leading-tight ${darkMode ? "text-white" : "text-gray-900"
          }`}
      >
        {value || "—"}
      </p>
    </motion.div>
  );
}

function InfoRow({ label, value, darkMode }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span
        className={`text-xs font-semibold shrink-0 ${darkMode ? "text-zinc-500" : "text-gray-500"
          }`}
      >
        {label}
      </span>
      <span
        className={`text-sm font-medium text-right ${darkMode ? "text-zinc-200" : "text-gray-800"
          }`}
      >
        {value}
      </span>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, darkMode, delay = 0, onEdit }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className={`rounded-2xl border overflow-hidden ${darkMode
        ? "bg-zinc-900 border-zinc-800"
        : "bg-white border-gray-100 shadow-sm"
        }`}
    >
      <div
        className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? "border-zinc-800" : "border-gray-100"
          }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          <h3
            className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"
              }`}
          >
            {title}
          </h3>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-zinc-800 text-zinc-500 hover:text-white" : "hover:bg-gray-50 text-gray-400 hover:text-emerald-600"
              }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="px-5 divide-y divide-dashed divide-gray-100 dark:divide-zinc-800">
        {children}
      </div>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function OrgDashboard({ darkModeFromParent }) {
  const org = useSelector((state) => state.auth.userInfo);

  const darkMode =
    darkModeFromParent !== undefined
      ? darkModeFromParent
      : typeof window !== "undefined"
        ? localStorage.getItem("darkMode") === "true"
        : false;

  const logoUrl = getMediaUrl(org?.organizationLogo);

  const cd = org?.companyDetails || {};
  const contact = org?.contactDetails || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const [updateOrg, { isLoading: isUpdating }] = useUpdateOrganizationMutation();
  const [requestEdit, { isLoading: isRequesting }] = useRequestEditMutation();

  const handleEditSave = async (formData) => {
    try {
      if (activeSection === 'personal' || activeSection === 'contact' || (activeSection === 'basic' && formData.officialWebsite !== org.officialWebsite)) {
        // Complex edits needing approval
        const fd = new FormData();
        if (formData.organizationLogo) fd.append('organizationLogo', formData.organizationLogo);
        if (formData.officialWebsite) fd.append('officialWebsite', formData.officialWebsite);

        if (activeSection === 'contact') {
          fd.append('contactDetails', JSON.stringify({
            contactName: formData.contactName,
            designation: formData.designation,
            contactEmail: formData.contactEmail,
            contactNumber: formData.contactNumber
          }));
        }

        if (activeSection === 'personal') {
          fd.append('personalDetails', JSON.stringify({
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile
          }));
        }

        await requestEdit({ id: org._id, formData: fd }).unwrap();
        toast.info("Request submitted for admin approval");
      } else {
        // Basic edits - immediate
        if (activeSection === 'basic') {
          const fd = new FormData();
          if (formData.organizationLogo) {
            fd.append('organizationLogo', formData.organizationLogo);
            await requestEdit({ id: org._id, formData: fd }).unwrap();
          }
          await updateOrg({
            id: org._id,
            data: { organizationDescription: formData.organizationDescription }
          }).unwrap();
        } else if (activeSection === 'stats') {
          const updateData = {};
          if (org.isNGO) {
            updateData.ngoDetails = {
              ...org.ngoDetails,
              employeeStrength: formData.numberOfEmployees,
              annualBudget: formData.annualRevenue
            };
          } else {
            updateData.companyDetails = {
              ...org.companyDetails,
              numberOfEmployees: formData.numberOfEmployees,
              annualRevenue: formData.annualRevenue,
              yearsInOperation: formData.yearsInOperation
            };
          }
          await updateOrg({ id: org._id, data: updateData }).unwrap();
        }
        toast.success("Profile updated successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.data?.message || "Update failed");
    }
  };

  const statusColor =
    org?.verificationStatus === "verified"
      ? "text-emerald-500"
      : org?.verificationStatus === "pending"
        ? "text-amber-500"
        : "text-red-500";

  const statusBg =
    org?.verificationStatus === "verified"
      ? darkMode
        ? "bg-emerald-500/10 border-emerald-500/20"
        : "bg-emerald-50 border-emerald-200"
      : darkMode
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-amber-50 border-amber-200";

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-zinc-950" : "bg-gray-50"}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ── Hero Card ────────────────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0)}
          className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border ${darkMode
            ? "bg-zinc-900 border-zinc-800"
            : "bg-white border-gray-100 shadow-md"
            }`}
        >
          {/* top gradient strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          {/* subtle bg texture */}
          <div
            className={`absolute inset-0 opacity-[0.03] pointer-events-none`}
            style={{
              backgroundImage: `radial-gradient(circle at 80% 20%, #10b981 0%, transparent 60%)`,
            }}
          />

          <div className="relative px-5 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Logo */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 ${darkMode ? "border-zinc-700" : "border-gray-200"
                  }`}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={org?.organizationName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1
                    className={`text-xl sm:text-2xl font-bold truncate ${darkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {org?.organizationName}
                  </h1>
                  <button
                    onClick={() => { setActiveSection('basic'); setIsModalOpen(true); }}
                    className={`p-2 rounded-full transition-all ${darkMode ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-400" : "bg-gray-100 hover:bg-gray-200 text-gray-500"}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBg} ${statusColor}`}
                  >
                    <BadgeCheck className="w-3 h-3" />
                    {org?.verificationStatus
                      ? org.verificationStatus.charAt(0).toUpperCase() +
                      org.verificationStatus.slice(1)
                      : "Pending"}
                  </span>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                  {org?.companyDetails?.businessDomain && (
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium ${darkMode ? "text-zinc-400" : "text-gray-500"
                        }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      {org.companyDetails.businessDomain}
                    </span>
                  )}
                  {org?.city && org?.state && (
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium ${darkMode ? "text-zinc-400" : "text-gray-500"
                        }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {org.city}, {org.state}
                    </span>
                  )}
                  {org?.officialWebsite && (
                    <a
                      href={
                        org.officialWebsite.startsWith("http")
                          ? org.officialWebsite
                          : `https://${org.officialWebsite}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 text-xs font-medium hover:underline ${darkMode
                        ? "text-emerald-400"
                        : "text-emerald-600"
                        }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {org.officialWebsite}
                    </a>
                  )}
                  {org?.organizationEmail && (
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium ${darkMode ? "text-zinc-400" : "text-gray-500"
                        }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {org.organizationEmail}
                    </span>
                  )}
                </div>

                {/* Description */}
                {org?.organizationDescription && (
                  <p
                    className={`mt-3 text-sm leading-relaxed line-clamp-2 ${darkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                  >
                    {org.organizationDescription}
                  </p>
                )}
              </div>
            </div>

            {/* NGO badge */}
            {org?.isNGO && (
              <div
                className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${darkMode
                  ? "bg-violet-500/10 border-violet-500/20 text-violet-400"
                  : "bg-violet-50 border-violet-200 text-violet-700"
                  }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Registered NGO
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Stat Grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={Users}
            label="Team Size"
            value={fmt.employees(cd.numberOfEmployees) + " employees"}
            gradient="from-emerald-500 to-teal-600"
            darkMode={darkMode}
          />
          <StatCard
            icon={TrendingUp}
            label="Annual Turnover"
            value={fmt.revenue(cd.annualTurnover || cd.annualRevenue || org?.ngoDetails?.annualTurnover || org?.ngoDetails?.annualBudget)}
            gradient="from-blue-500 to-indigo-600"
            darkMode={darkMode}
          />
          <StatCard
            icon={Clock}
            label="Years in Operation"
            value={fmt.years(cd.yearsInOperation)}
            gradient="from-amber-500 to-orange-500"
            darkMode={darkMode}
          />
          <StatCard
            icon={Handshake}
            label="Partnership Interest"
            value={fmt.partnership(cd.partnershipInterest)}
            gradient="from-rose-500 to-pink-600"
            darkMode={darkMode}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => { setActiveSection('stats'); setIsModalOpen(true); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${darkMode ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800" : "bg-white border border-gray-100 text-gray-500 hover:text-emerald-600 hover:shadow-sm"}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            Update Metrics
          </button>
        </div>

        {/* ── 2-col grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Company Details */}
          <SectionCard
            title="Company Details"
            icon={Building2}
            darkMode={darkMode}
            delay={0.1}
            onEdit={() => { setActiveSection('personal'); setIsModalOpen(true); }}
          >
            <InfoRow label="Business Domain" value={cd.businessDomain} darkMode={darkMode} />
            <InfoRow label="Director" value={cd.directorName} darkMode={darkMode} />
            <InfoRow label="Director Email" value={cd.directorEmail} darkMode={darkMode} />
            <InfoRow label="Director Mobile" value={cd.directorMobile} darkMode={darkMode} />
            <InfoRow label="Document Type" value={cd.documentType?.toUpperCase()} darkMode={darkMode} />
            <InfoRow
              label="CSR Initiatives"
              value={cd.csrInitiatives === "yes" ? "Active" : "Not Active"}
              darkMode={darkMode}
            />
            <InfoRow
              label="Partnership Interest"
              value={fmt.partnership(cd.partnershipInterest)}
              darkMode={darkMode}
            />
          </SectionCard>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <SectionCard
              title="Contact Person"
              icon={User}
              darkMode={darkMode}
              delay={0.15}
              onEdit={() => { setActiveSection('contact'); setIsModalOpen(true); }}
            >
              <InfoRow label="Name" value={contact.contactName} darkMode={darkMode} />
              <InfoRow label="Designation" value={contact.designation} darkMode={darkMode} />
              <InfoRow label="Email" value={contact.contactEmail} darkMode={darkMode} />
              <InfoRow label="Mobile" value={contact.contactNumber} darkMode={darkMode} />
            </SectionCard>

            {/* Registration Info */}
            <SectionCard
              title="Registration"
              icon={FileText}
              darkMode={darkMode}
              delay={0.2}
            >
              <InfoRow
                label="Joined"
                value={fmt.date(org?.createdAt)}
                darkMode={darkMode}
              />
              <InfoRow
                label="Verified On"
                value={fmt.date(org?.verifiedAt)}
                darkMode={darkMode}
              />
              <InfoRow
                label="Status"
                value={org?.status
                  ? org.status.charAt(0).toUpperCase() + org.status.slice(1)
                  : "—"}
                darkMode={darkMode}
              />
              <InfoRow
                label="Terms Accepted"
                value={org?.termsAccepted ? "Yes" : "No"}
                darkMode={darkMode}
              />
            </SectionCard>
          </div>
        </div>

        {/* ── Quick Links ───────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0.25)}>
          <h3
            className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-zinc-500" : "text-gray-400"
              }`}
          >
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: IndianRupee,
                label: "My Donations",
                sub: "View all contributions",
                href: "/org/mydonation",
                gradient: "from-rose-500 to-pink-600",
              },
              {
                icon: FileText,
                label: "My Campaigns",
                sub: "Manage your fundraisers",
                href: "/organization/profile/my-campaigns",
                gradient: "from-violet-500 to-purple-600",
              },
              {
                icon: CalendarDays,
                label: "Offline Donations",
                sub: "Track offline giving",
                href: "/org/offline-donations",
                gradient: "from-amber-500 to-orange-500",
              },
            ].map((q) => (
              <a key={q.href} href={q.href}>
                <div
                  className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-colors duration-200 group ${darkMode
                    ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                    : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${q.gradient}`}
                  >
                    <q.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      {q.label}
                    </p>
                    <p
                      className={`text-xs ${darkMode ? "text-zinc-500" : "text-gray-400"
                        }`}
                    >
                      {q.sub}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${darkMode ? "text-zinc-600" : "text-gray-300"
                      }`}
                  />
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* ── Footer quote ─────────────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0.3)}
          className={`rounded-2xl px-6 py-5 text-center border ${darkMode
            ? "bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border-emerald-800/30"
            : "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100"
            }`}
        >
          <p
            className={`text-sm sm:text-base font-medium italic ${darkMode ? "text-emerald-300/80" : "text-emerald-800/80"
              }`}
          >
            "The best of people are those who bring most benefit to the rest of mankind."
          </p>
          <p
            className={`text-xs mt-1.5 font-semibold ${darkMode ? "text-emerald-500" : "text-emerald-600"
              }`}
          >
            — Al-Daraqutni
          </p>
        </motion.div>

        <OrganizationEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          section={activeSection}
          org={org}
          onSave={handleEditSave}
          isLoading={isUpdating || isRequesting}
        />
      </div>
    </div>
  );
}