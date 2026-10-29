"use client";

import { useState } from "react";
import {
  Shield,
  Smartphone,
  MapPin,
  Bell,
  Camera,
  Trash2,
  Lock,
  Eye,
  FileCheck,
  ExternalLink,
  Mail,
  Phone,
  Building,
  Clock,
  ArrowLeft,
  Copy,
  Check,
  AlertCircle,
  Database,
  Users,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function AppPrivacyPolicy({ darkMode, onBack }) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("grievances@tpfaid.org");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const navItems = [
    { id: "summary", label: "1. Summary" },
    { id: "info-collected", label: "2. Data Collected" },
    { id: "how-we-use", label: "3. How We Use Data" },
    { id: "permissions", label: "4. App Permissions" },
    { id: "third-parties", label: "5. Third Parties" },
    { id: "donations", label: "6. Donations" },
    { id: "visibility-sharing", label: "7-8. Visibility & Sharing" },
    { id: "retention", label: "9. Retention" },
    { id: "user-rights", label: "10. DPDP Rights" },
    { id: "account-deletion", label: "11. Account Deletion" },
    { id: "security-children", label: "12-14. Security & Children" },
    { id: "contact", label: "15-16. Contact & Grievance" },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button & quick meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {onBack ? (
          <button
            onClick={onBack}
            className={`inline-flex items-center gap-2 font-semibold text-sm transition-colors ${
              darkMode
                ? "text-teal-400 hover:text-teal-300"
                : "text-emerald-700 hover:text-emerald-800"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Policies
          </button>
        ) : (
          <Link
            href="/policies"
            className={`inline-flex items-center gap-2 font-semibold text-sm transition-colors ${
              darkMode
                ? "text-teal-400 hover:text-teal-300"
                : "text-emerald-700 hover:text-emerald-800"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            All Policies
          </Link>
        )}

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Google Play Store Compliant</span>
        </div>
      </div>

      {/* Main Document Card */}
      <div
        className={`rounded-3xl border shadow-xl p-6 sm:p-10 md:p-12 transition-colors ${
          darkMode
            ? "bg-zinc-800/80 border-zinc-700/80 text-zinc-200"
            : "bg-white border-zinc-200 text-zinc-800"
        }`}
      >
        {/* Header */}
        <div className="border-b pb-8 mb-8 border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400">
                Official Application Policy
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Privacy Policy for TPF Aid
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2">
            Applicable to the <strong className="text-zinc-800 dark:text-zinc-200">TPF Aid</strong> Android & iOS mobile applications, operated by <strong className="text-zinc-800 dark:text-zinc-200">True Path Foundation</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-dashed border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-500" />
              <span>Effective Date: <strong>27 October 2026</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-500" />
              <span>Last Updated: <strong>27 October 2026</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-teal-500" />
              <span>Entity: <strong>True Path Foundation (Section 8 Company)</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Jump Navigation */}
        <div
          className={`p-4 rounded-2xl mb-10 border ${
            darkMode
              ? "bg-zinc-900/60 border-zinc-700/60"
              : "bg-emerald-50/60 border-emerald-100"
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            Quick Navigation
          </div>
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  darkMode
                    ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
                    : "bg-white hover:bg-emerald-100/70 border-emerald-200/80 text-emerald-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legal Preamble */}
        <div className="mb-10 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            <strong>TPF Aid</strong> (&ldquo;the App&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is operated by{" "}
            <strong>True Path Foundation</strong>, a registered Section 8 non-profit company under the Companies Act, 2013, with registered address at{" "}
            <span className="font-medium">229A, DDA LIG, Pocket - 12, Jasola, New Delhi, Delhi - 110025, India</span>.
          </p>
          <p>
            This policy explains what information the App collects, how we use it, and the choices you have. By using the App you agree to this policy. If you have questions, contact us at{" "}
            <a
              href="mailto:grievances@tpfaid.org"
              className="text-teal-600 dark:text-teal-400 font-semibold underline underline-offset-2 hover:text-teal-500"
            >
              grievances@tpfaid.org
            </a>{" "}
            or{" "}
            <a
              href="mailto:support@tpfaid.org"
              className="text-teal-600 dark:text-teal-400 font-semibold underline underline-offset-2 hover:text-teal-500"
            >
              support@tpfaid.org
            </a>.
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-12 text-sm sm:text-base leading-relaxed">
          {/* Section 1: Summary */}
          <section id="summary" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Summary</h2>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-3.5 p-4 sm:p-5 rounded-2xl border ${
                darkMode
                  ? "bg-zinc-900/40 border-zinc-700/60"
                  : "bg-neutral-50 border-zinc-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p>
                  <strong>No Account Required for Most Features:</strong> Prayer times, Quran, duas, tasbih, Qibla compass, and Hijri calendar work seamlessly without creating an account.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p>
                  <strong>Optional Account:</strong> You only create an account if you want to register a masjid, follow masjids, or manage an administrative profile.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p>
                  <strong>Zero Data Selling:</strong> We do not sell, rent, or monetize your personal information under any circumstance.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p>
                  <strong>Purpose-Limited Location:</strong> We use your location strictly to calculate accurate prayer times and show nearby masjids.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Information We Collect */}
          <section id="info-collected" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Information We Collect</h2>
            </div>

            <div className="space-y-6">
              {/* 2.1 Information you provide */}
              <div
                className={`p-5 rounded-2xl border ${
                  darkMode ? "bg-zinc-900/40 border-zinc-700/60" : "bg-white border-zinc-200 shadow-sm"
                }`}
              >
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Users className="w-5 h-5" />
                  2.1 Information You Provide
                </h3>
                <ul className="space-y-2.5 text-zinc-600 dark:text-zinc-300">
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-100">Mobile Number:</strong> Collected when you sign up or log in. We use it exclusively to send a One-Time Password (OTP) and identify your account.
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-100">Email Address:</strong> Collected when you sign up, edit your profile, or choose email login. We use it to identify your account and dispatch OTPs if you select email authentication.
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-100">Full Name:</strong> Collected during profile setup to personalize your experience.
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-100">Masjid Details:</strong> Name, address, coordinates, prayer/jamaat timings, facilities, and optional cover photo—collected when you register or edit a masjid so we can list it in the community directory.
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-100">Admin Request Details:</strong> Role, contact person name, mobile number, and email address—collected when you request masjid admin status so our verification team can review and approve it.
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-100">User Reports:</strong> Reason and free-text notes submitted when reporting incorrect or outdated masjid information.
                  </li>
                </ul>
                <div className="mt-4 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs sm:text-sm font-medium text-teal-800 dark:text-teal-300">
                  🔒 <strong>Passwordless Security:</strong> We do not store or use passwords. All accounts authenticate via secure, expiring One-Time Passwords (OTPs).
                </div>
              </div>

              {/* 2.2 Location */}
              <div
                className={`p-5 rounded-2xl border ${
                  darkMode ? "bg-zinc-900/40 border-zinc-700/60" : "bg-white border-zinc-200 shadow-sm"
                }`}
              >
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <MapPin className="w-5 h-5" />
                  2.2 Location Data
                </h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-300">
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-100">Precise Location (GPS):</strong> With your explicit runtime permission, the App uses your device GPS to display masjids near you, center the interactive map on your position, and auto-fill coordinates when registering a masjid. You can deny or revoke location access at any time in device settings. The App functions completely without it, defaulting to a general view of India.
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-100">City Selected:</strong> The city you select manually or automatically for prayer timing calculation is stored locally on your device.
                  </li>
                </ul>
              </div>

              {/* 2.3 Photos & Camera */}
              <div
                className={`p-5 rounded-2xl border ${
                  darkMode ? "bg-zinc-900/40 border-zinc-700/60" : "bg-white border-zinc-200 shadow-sm"
                }`}
              >
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Camera className="w-5 h-5" />
                  2.3 Photos and Camera
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300">
                  If you upload a masjid cover photo, the App requests permission to access your camera or photo library. <strong>Only the single photo you explicitly select is accessed.</strong> Before upload, the image is resized and compressed directly on your device to minimize data usage.
                </p>
              </div>

              {/* 2.4 Device-Stored Information */}
              <div
                className={`p-5 rounded-2xl border ${
                  darkMode ? "bg-zinc-900/40 border-zinc-700/60" : "bg-white border-zinc-200 shadow-sm"
                }`}
              >
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Smartphone className="w-5 h-5" />
                  2.4 Information Stored Locally on Your Device
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300 mb-3">
                  The following preferences remain on your device and are not uploaded to our servers unless required for a specific cloud action:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                  <li className="flex items-center gap-2">• Theme (Dark / Light mode)</li>
                  <li className="flex items-center gap-2">• Selected City & Madhab calculation method</li>
                  <li className="flex items-center gap-2">• Reading font size & Hijri adjustment</li>
                  <li className="flex items-center gap-2">• Notification preferences & Tahajjud alarm</li>
                  <li className="flex items-center gap-2">• Quran / Dua bookmarks & last-read position</li>
                  <li className="flex items-center gap-2">• Tasbih digital counter values</li>
                  <li className="flex items-center gap-2">• Primary followed masjid timing snapshot</li>
                  <li className="flex items-center gap-2">• Cached directory data for offline usage</li>
                </ul>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
                  Your authenticated login token is stored exclusively in your device&apos;s hardware-backed secure storage (Android Keystore / iOS Keychain).
                </p>
              </div>

              {/* 2.5 Automated Technical Data */}
              <div
                className={`p-5 rounded-2xl border ${
                  darkMode ? "bg-zinc-900/40 border-zinc-700/60" : "bg-white border-zinc-200 shadow-sm"
                }`}
              >
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Database className="w-5 h-5" />
                  2.5 Technical and Automated Data
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Standard technical logs are generated when the App connects to our servers, including device model, operating system version, app build version, and IP address. This data is used solely to maintain uptime, protect against DDoS or unauthorized abuse, and diagnose technical errors.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section id="how-we-use" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">How We Use Your Information</h2>
            </div>

            <ul className="space-y-2.5 text-zinc-600 dark:text-zinc-300 list-disc list-inside">
              <li>Provide accurate prayer times, Qibla direction, notifications, and masjid discovery.</li>
              <li>Create and safeguard your user account, and deliver one-time verification passwords.</li>
              <li>List, verify, and administer registered masjids and authorized admin privileges.</li>
              <li>Display verified humanitarian relief campaigns and educational initiatives.</li>
              <li>Review community reports to keep masjid directory records truthful and updated.</li>
              <li>Detect automated abuse, fraud, and ensure the cryptographic security of the App.</li>
              <li>Optimize performance, eliminate application crashes, and fix software defects.</li>
              <li>Comply with applicable Indian statutory regulations and legal mandates.</li>
            </ul>
          </section>

          {/* Section 4: Permissions */}
          <section id="permissions" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Permissions the App May Request</h2>
            </div>

            <p className="text-zinc-600 dark:text-zinc-300 mb-4">
              In accordance with Google Play Developer Policies, TPF Aid requests only permissions strictly necessary to deliver core features:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/50 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <div className="flex items-center gap-2 font-bold mb-1.5 text-emerald-600 dark:text-emerald-400">
                  <MapPin className="w-4 h-4" />
                  <span>Location (ACCESS_FINE_LOCATION)</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  Used for nearby masjid discovery, centering map view, and filling masjid coordinates. Can be revoked at any time.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/50 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <div className="flex items-center gap-2 font-bold mb-1.5 text-emerald-600 dark:text-emerald-400">
                  <Bell className="w-4 h-4" />
                  <span>Notifications (POST_NOTIFICATIONS)</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  Used to dispatch prayer time reminders, Azan notifications, and followed masjid announcements.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/50 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <div className="flex items-center gap-2 font-bold mb-1.5 text-emerald-600 dark:text-emerald-400">
                  <Camera className="w-4 h-4" />
                  <span>Camera & Media (CAMERA / READ_MEDIA_IMAGES)</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  Optional. Requested only when uploading or taking a masjid cover photo for directory listings.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/50 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <div className="flex items-center gap-2 font-bold mb-1.5 text-emerald-600 dark:text-emerald-400">
                  <Clock className="w-4 h-4" />
                  <span>Exact Alarms (SCHEDULE_EXACT_ALARM)</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  Ensures timely firing of the Tahajjud alarm and precise prayer alerts even when the device is idle.
                </p>
              </div>

              <div className={`p-4 rounded-xl border md:col-span-2 ${darkMode ? "bg-zinc-900/50 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <div className="flex items-center gap-2 font-bold mb-1.5 text-emerald-600 dark:text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                  <span>SMS User Consent API (Android)</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  Used solely for optional one-tap OTP autofill during login. <strong>TPF Aid does NOT have full SMS read permission.</strong> Android presents an explicit OS dialog showing only the single OTP verification message, which you can approve or dismiss.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Third-Party Services */}
          <section id="third-parties" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Third-Party Services</h2>
            </div>

            <p className="text-zinc-600 dark:text-zinc-300 mb-4">
              We partner with trusted infrastructure service providers to deliver specialized app capabilities. These providers process data strictly to perform their specific operations:
            </p>

            <div className="space-y-3">
              <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-zinc-900/40 border-zinc-700" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
                  Google Maps & Google Places SDK
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Provides map rendering, place search, and geocoding. Requests are securely proxied through our backend to minimize client exposure. Google processes map queries under the Google Privacy Policy.
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-zinc-900/40 border-zinc-700" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
                  Mapbox
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Used for city search lookup when determining geographical prayer time calculation presets.
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-zinc-900/40 border-zinc-700" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
                  SMS & Email Delivery Gateways
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Transactional telecom partners transmit authentication OTPs to your registered phone number or email address.
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-zinc-900/40 border-zinc-700" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
                  Cloud Infrastructure & Databases
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Hosted on secure cloud datacenters physically situated within the Republic of India with end-to-end encryption.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Donations */}
          <section id="donations" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Donations and External Transactions</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300">
              The App highlights active humanitarian relief campaigns. Tapping a campaign link opens our official website (
              <a href="https://tpfaid.org" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 underline font-medium">
                tpfaid.org
              </a>
              ) in your mobile browser. <strong>Financial transactions are not processed inside the Google Play App.</strong> Payment processing occurs exclusively on our secure website through RBI-compliant Indian payment gateways, governed by our platform Terms and Refund Policy.
            </p>
          </section>

          {/* Section 7 & 8: Visibility & Sharing */}
          <section id="visibility-sharing" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                7 & 8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Data Visibility & Sharing</h2>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/40 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <h3 className="font-bold mb-2 text-zinc-800 dark:text-zinc-100">What is Publicly Visible</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  Approved masjid directory listings (name, address, GPS location, prayer timings, facilities, cover photo) are publicly visible to facilitate community worship.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/40 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <h3 className="font-bold mb-2 text-zinc-800 dark:text-zinc-100">What Stays Private</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  Your mobile number, email address, and full name are strictly confidential and never displayed publicly. Which masjids you follow is completely private to your account.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/40 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <h3 className="font-bold mb-2 text-zinc-800 dark:text-zinc-100">Strict Data Sharing Policy</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  We do not sell, rent, or trade your personal data. We disclose information only:
                </p>
                <ul className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 space-y-1 list-disc list-inside">
                  <li>With verified third-party technical vendors necessary to run app functions.</li>
                  <li>With verified masjid administrators strictly to process your administrative request.</li>
                  <li>When required by Indian law, competent court summons, or official regulatory authority.</li>
                  <li>To protect user safety, investigate security breaches, or defend legal rights.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 9: Data Retention */}
          <section id="retention" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                9
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Data Retention</h2>
            </div>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-300 list-disc list-inside">
              <li><strong>Account Information:</strong> Retained while your account remains active.</li>
              <li><strong>Masjid Directory Listings:</strong> Retained until deactivated or removed by authorized administrators.</li>
              <li><strong>Locally Stored Data:</strong> Retained on your device until you clear app storage or uninstall the App.</li>
              <li><strong>Post-Deletion SLA:</strong> Upon receipt of a valid account deletion request, your data is erased or irreversibly anonymized within <strong>30 days</strong>, except where statutory Indian record retention laws require otherwise.</li>
            </ul>
          </section>

          {/* Section 10: Rights under DPDP Act */}
          <section id="user-rights" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                10
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Your Rights and Choices (DPDP Act, 2023)</h2>
            </div>

            <p className="text-zinc-600 dark:text-zinc-300 mb-4">
              Under India&apos;s Digital Personal Data Protection Act, 2023, you maintain comprehensive sovereignty over your personal data:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/30">
                <strong>Right to Access:</strong> View and review the personal information associated with your profile.
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/30">
                <strong>Right to Correction:</strong> Update your name, email, or details anytime in Account settings.
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/30">
                <strong>Right to Erasure:</strong> Request permanent deletion of your account and personal records.
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/30">
                <strong>Right of Grievance Redressal:</strong> Submit grievances directly to our designated Grievance Officer.
              </div>
            </div>
          </section>

          {/* Section 11: Account Deletion */}
          <section id="account-deletion" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-sm">
                11
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Account and Data Deletion</h2>
            </div>

            {/* Google Play Account Deletion Requirement Highlight Card */}
            <div
              className={`p-6 rounded-2xl border ${
                darkMode
                  ? "bg-gradient-to-br from-red-950/20 via-zinc-900 to-zinc-900 border-red-900/40"
                  : "bg-gradient-to-br from-red-50/60 via-white to-neutral-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    Request Account & Data Deletion
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Compliant with Google Play Account Deletion Policy
                  </p>
                </div>
              </div>

              <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-4 leading-relaxed">
                If you wish to permanently delete your TPF Aid account, followed masjids, and associated personal information from our servers, you may submit a request using either of the methods below:
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-500" />
                    Option A: Direct Email Deletion Request
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    Send an email from your registered email address or quote your registered mobile number to{" "}
                    <strong className="text-zinc-800 dark:text-zinc-200">grievances@tpfaid.org</strong> with the subject line{" "}
                    <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-red-600 dark:text-red-400 text-xs font-mono font-bold">
                      Delete my account
                    </code>.
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href="mailto:grievances@tpfaid.org?subject=Delete%20my%20account&body=Hello%20TPF%20Aid%20Team%2C%0A%0APlease%20permanently%20delete%20my%20TPF%20Aid%20account%20and%20all%20associated%20data.%0A%0ARegistered%20Mobile%20Number%3A%20%0ARegistered%20Email%3A%20%0AFull%20Name%3A%20%0A%0AThank%20you."
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Generate Deletion Email
                    </a>

                    <button
                      onClick={copyEmail}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied Email!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy grievances@tpfaid.org</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 mb-1 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-teal-500" />
                    Option B: In-App Profile Deletion
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Open the TPF Aid App &rarr; Navigate to <strong>Profile</strong> &rarr; <strong>Account Settings</strong> &rarr; Tap <strong>Delete Account</strong>.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Processing Timeline:</strong> We confirm and complete account erasure requests within <strong>14 days</strong>. Upon completion, authentication tokens, followed masjid preferences, and personal details are permanently purged.
                </span>
              </div>
            </div>
          </section>

          {/* Section 12, 13, 14: Security, Children, Data Transfers */}
          <section id="security-children" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                12-14
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Security, Children & Data Transfers</h2>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/40 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <h3 className="font-bold mb-1 text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  12. Information Security
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  We enforce TLS/HTTPS cryptographic encryption for all communication between the App and our backend servers, store session authentication tokens strictly inside protected device keystores, and restrict administrative server access to authorized personnel.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/40 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <h3 className="font-bold mb-1 text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  13. Children&apos;s Privacy
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  The App is not directed at children under the age of 13, and we do not knowingly solicit or collect personal information from minors. Under India&apos;s DPDP Act, 2023, we do not knowingly process personal data of anyone under 18 years without verifiable parental consent. If you suspect a minor has provided personal credentials, notify us immediately for immediate erasure.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/40 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <h3 className="font-bold mb-1 text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-500" />
                  14. Data Storage & Transfers
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  All user data is stored on servers located within India. In scenarios where third-party SDK service providers operate cross-border nodes (e.g. global mapping tiles), we mandate contractual safeguards guaranteeing equivalent data security.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/40 border-zinc-700" : "bg-neutral-50 border-zinc-200"}`}>
                <h3 className="font-bold mb-1 text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  15. Changes to this Policy
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  We may periodically revise this policy to reflect operational, legal, or technical changes. Material modifications will be notified via an in-app notice, and the updated date will be reflected at the head of this page.
                </p>
              </div>
            </div>
          </section>

          {/* Section 16: Contact & Grievance Redressal */}
          <section id="contact" className="scroll-mt-28">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                16
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Contact & Grievance Officer</h2>
            </div>

            <div
              className={`p-6 sm:p-8 rounded-2xl border ${
                darkMode
                  ? "bg-gradient-to-br from-teal-950/20 via-zinc-900 to-zinc-900 border-teal-800/40"
                  : "bg-gradient-to-br from-teal-50/70 via-emerald-50/40 to-white border-teal-200"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-1">
                    Operating Entity
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 font-semibold">
                    True Path Foundation
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Section 8 Non-Profit Company (Govt. of India)<br />
                    229A, DDA LIG, Pocket - 12, Jasola,<br />
                    New Delhi, Delhi - 110025, India
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-1">
                    Contact Channels
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-teal-500 shrink-0" />
                      <a href="mailto:support@tpfaid.org" className="hover:underline font-medium">
                        support@tpfaid.org
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-teal-500 shrink-0" />
                      <a href="tel:+919411565185" className="hover:underline font-medium">
                        (+91) 94 115 65185
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-teal-500 shrink-0" />
                      <a href="https://tpfaid.org" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
                        www.tpfaid.org
                      </a>
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-zinc-200 dark:border-zinc-700/60">
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-teal-500" />
                    Designated Grievance Redressal Officer
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    In compliance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, data-related concerns or grievances may be directed to:
                  </p>
                  <div className="mt-2 p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm">
                    <p><strong>Designation:</strong> Compliance & Grievance Redressal Officer</p>
                    <p><strong>Entity:</strong> True Path Foundation</p>
                    <p><strong>Official Email:</strong>{" "}
                      <a href="mailto:grievances@tpfaid.org" className="text-teal-600 dark:text-teal-400 font-bold underline">
                        grievances@tpfaid.org
                      </a>
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
                      Response window: Acknowledgment within 48 hours; resolution within statutory timeline.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
