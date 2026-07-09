'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Heart, Lock, Info, Check, AlertCircle, Sparkles, ShieldCheck, User, Mail, Phone, Moon, Coins, Gift, Star, HandHeart, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useAppToast } from '@/app/AppToastContext';
import { useSoftSignupMutation } from '@/utils/slices/authApiSlice';

import CampaignAmountSelector, { getCampaignConfig } from './DonatePopUpModal/CampaignAmountSelector';
import DefaultAmountSelector from './DonatePopUpModal/DefaultAmountSelector';
import ExitConfirmationModal from './DonatePopUpModal/ExitConfirmationModal';

/* ─────────────────────────────────────────────────────────────────────────────
   Donation-type definitions
───────────────────────────────────────────────────────────────────────────── */
const allDonationTypes = [
  { id: 'ZAKAAT', label: 'Zakat', desc: 'Obligatory charity', Icon: Moon },
  { id: 'RIBA', label: 'RIBA', desc: 'Interest Money', Icon: Coins },
  { id: 'SADAQAH', label: 'Sadaqah', desc: 'Voluntary charity', Icon: Gift },
  { id: 'LILLAH', label: 'Lillah', desc: 'For sake of Allah', Icon: Star },
  { id: 'IMDAD', label: 'Imdad', desc: 'Emergency relief', Icon: HandHeart },
];

const tipPercentages = [0, 5, 10, 15];

export default function DonationCard({
  darkMode,
  campaignId,
  campaignSlug,
  zakatVerified,
  taxEligible,
  ribaEligible,
  sadaqahEligible = true,
  lillahEligible = true,
  imdadEligible = true,
  allowedDonationTypes = [],
  unitConfig = null,
  isCompleted = false,
  referral,
  source,
}) {
  /* ── Amount state ─────────────────────────────────────────────────────── */
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomAmountInput, setShowCustomAmountInput] = useState(false);
  const [selectedPresetKey, setSelectedPresetKey] = useState(null);

  /* ── Tip state ────────────────────────────────────────────────────────── */
  const [tipPercentage, setTipPercentage] = useState(5);
  const [customTip, setCustomTip] = useState('');
  const [showCustomTipInput, setShowCustomTipInput] = useState(false);

  /* ── Donor state ──────────────────────────────────────────────────────── */
  const [donationType, setDonationType] = useState(source !== 'FOUNDATION' ? 'IMDAD' : 'SADAQAH');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [claim80G, setClaim80G] = useState(false);

  /* ── Guest details ────────────────────────────────────────────────────── */
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [userId, setUserId] = useState(null);

  /* ── UI / flow state ──────────────────────────────────────────────────── */
  const [isDonating, setIsDonating] = useState(false);
  const [cashfreeData, setCashfreeData] = useState(null);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const checkoutStartedRef = useRef(false);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const { showToast } = useAppToast();
  const [softSignup] = useSoftSignupMutation();

  /* ── Campaign config ──────────────────────────────────────────────────── */
  const pathname = usePathname();
  const slugFromUrl = pathname?.split('/campaign/')?.[1]?.split('/')?.[0] || null;
  const resolvedSlug = campaignSlug || slugFromUrl;
  const campaignConfig = getCampaignConfig(resolvedSlug);

  const dk = darkMode;

  /* ── Filtered donation types ──────────────────────────────────────────── */
  const filteredDonationTypes = (
    allowedDonationTypes?.length > 0
      ? allDonationTypes.filter((t) =>
        allowedDonationTypes.some(
          (at) =>
            at.toUpperCase() === t.id.toUpperCase() ||
            (at.toUpperCase() === 'ZAKAT' && t.id === 'ZAKAAT')
        )
      )
      : allDonationTypes
  ).map((t) => ({
    ...t,
    disabled:
      (t.id === 'ZAKAAT' && !zakatVerified) ||
      (t.id === 'RIBA' && !ribaEligible) ||
      (t.id === 'SADAQAH' && sadaqahEligible === false) ||
      (t.id === 'LILLAH' && lillahEligible === false) ||
      (t.id === 'IMDAD' && imdadEligible === false),
  }));

  /* ── Sync user info into guest fields ─────────────────────────────────── */
  useEffect(() => {
    if (userInfo) {
      setFullName(userInfo.fullName || '');
      setEmail(userInfo.email || '');
      setMobileNo(userInfo.mobileNo || '');
      setUserId(userInfo._id || userInfo.userId);
    }
  }, [userInfo]);

  /* ── Ensure valid default donation type ──────────────────────────────── */
  useEffect(() => {
    if (source !== 'FOUNDATION') {
      setDonationType('IMDAD');
    } else if (
      allowedDonationTypes?.length > 0 &&
      !allowedDonationTypes.some(
        (at) =>
          at.toUpperCase() === donationType.toUpperCase() ||
          (at.toUpperCase() === 'ZAKAT' && donationType === 'ZAKAAT')
      )
    ) {
      setDonationType(filteredDonationTypes[0]?.id || 'SADAQAH');
    }
  }, [allowedDonationTypes, source]);

  /* ── Set initial preset key when campaign config loads ───────────────── */
  useEffect(() => {
    if (campaignConfig) {
      setSelectedAmount(100);
      setSelectedPresetKey('flat-1');
    }
  }, [resolvedSlug]);

  /* ── Derived amounts ──────────────────────────────────────────────────── */
  const baseAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  const tipAmount = customTip
    ? parseInt(customTip)
    : tipPercentage
      ? Math.round(baseAmount * (tipPercentage / 100))
      : 0;
  const totalAmount = baseAmount + (tipAmount || 0);

  /* ── Identify guest user ──────────────────────────────────────────────── */
  const handleIdentifyUser = async () => {
    const result = await softSignup({ fullName, email, mobileNo }).unwrap();
    if (result?.data?.userId) return result.data.userId;
    throw new Error('Unable to identify user');
  };

  /* ── Donate handler ───────────────────────────────────────────────────── */
  const handleDonate = async () => {
    if (isDonating) return;
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount) return;

    if (amount < 50) {
      showToast({ title: 'Minimum Amount', message: 'The minimum donation amount is ₹50.', type: 'error' });
      return;
    }
    if (donationType === 'ZAKAAT' && !zakatVerified) {
      showToast({ title: 'Not Verified', message: 'This campaign is not verified for Zakaat.', type: 'error' });
      return;
    }
    if (!userInfo) {
      if (!fullName.trim()) {
        showToast({ title: 'Name Required', message: 'Please enter your full name.', type: 'error' });
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast({ title: 'Valid Email Required', message: 'Please enter a valid email address.', type: 'error' });
        return;
      }
      if (!mobileNo.trim() || !/^\d{10}$/.test(mobileNo)) {
        showToast({ title: 'Valid Mobile Required', message: 'Please enter a valid 10-digit mobile number.', type: 'error' });
        return;
      }
    }

    setIsDonating(true);
    try {
      let userIdToUse = userId;
      if (!userIdToUse && !userInfo) {
        userIdToUse = await handleIdentifyUser();
        setUserId(userIdToUse);
      }
      const calculatedTipAmount = customTip
        ? parseInt(customTip)
        : tipPercentage
          ? Math.round(amount * (tipPercentage / 100))
          : 0;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount,
          tipAmount: calculatedTipAmount,
          campaignId,
          donationType,
          isAnonymous,
          isTaxEligible: claim80G,
          userId: userIdToUse,
          referral: referral || {},
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.cashfree?.paymentSessionId) {
        throw new Error(data?.message || 'Unable to initiate payment');
      }
      setCashfreeData(data.cashfree);
    } catch (err) {
      console.error('Donation initiate failed', err);
      showToast({ title: 'Error', message: err.message || 'Failed to initiate donation. Please try again.', type: 'error' });
    } finally {
      setIsDonating(false);
    }
  };

  /* ── Cashfree redirect ────────────────────────────────────────────────── */
  useEffect(() => {
    if (!cashfreeData?.paymentSessionId) return;
    if (checkoutStartedRef.current) return;
    checkoutStartedRef.current = true;
    const startCheckout = () => {
      const cashfree = new window.Cashfree({ mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || 'sandbox' });
      cashfree.checkout({ paymentSessionId: cashfreeData.paymentSessionId, redirectTarget: '_self' });
    };
    if (window.Cashfree) { startCheckout(); return; }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = startCheckout;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, [cashfreeData]);

  /* ── Style helpers ────────────────────────────────────────────────────── */
  const inputCls = `w-full h-10 pl-9 pr-3 text-sm rounded-lg font-medium focus:outline-none transition-colors border ${dk
    ? 'bg-zinc-800/80 border-zinc-700 text-white placeholder-zinc-500 focus:border-emerald-500'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10'
    }`;

  const tipBtnCls = (active) =>
    `flex-1 h-9 rounded-lg text-xs font-extrabold transition-colors border ${active
      ? dk
        ? 'bg-emerald-500/25 border-emerald-400/70 text-emerald-300'
        : 'bg-emerald-100 border-emerald-400 text-emerald-900'
      : dk
        ? 'bg-zinc-900/60 border-zinc-600 text-zinc-300 hover:border-zinc-500'
        : 'bg-white border-gray-300 text-gray-600 hover:border-emerald-300'
    }`;

  /* ── Custom checkbox ──────────────────────────────────────────────────── */
  const CustomCheckbox = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors flex-shrink-0 ${checked
          ? 'bg-emerald-500 border-emerald-500'
          : dk ? 'border-zinc-600 bg-zinc-800 group-hover:border-zinc-500' : 'border-gray-300 bg-white group-hover:border-emerald-300'
          }`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </button>
      <span className={`text-sm font-medium ${dk ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
        {label}
      </span>
    </label>
  );

  const SectionLabel = ({ children }) => (
    <label className={`block text-sm font-semibold mb-4 ${dk ? 'text-gray-200' : 'text-gray-800'}`}>
      {children}
    </label>
  );

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <>
      <div className={`${dk ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'} border-2 rounded-xl p-5 sm:p-8 ${isCompleted ? 'opacity-75' : ''}`}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-dashed" style={{ borderColor: dk ? '#27272a' : '#f3f4f6' }}>
          <div className="flex items-start gap-3 sm:gap-4 mb-3">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg ${dk ? 'bg-zinc-800' : 'bg-gray-50'} flex items-center justify-center flex-shrink-0`}>
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${dk ? 'text-emerald-400' : 'text-emerald-600'}`} fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg sm:text-xl font-bold mb-0.5 sm:mb-1 ${dk ? 'text-white' : 'text-gray-900'}`}>
                Support This Cause
              </h3>
              <p className={`text-xs sm:text-sm ${dk ? 'text-gray-400' : 'text-gray-600'}`}>
                Your contribution makes a difference
              </p>
            </div>
            {baseAmount >= 50 && (
              <div className={`flex-shrink-0 flex items-baseline gap-1.5 px-3 py-1.5 rounded-xl ${dk ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100'}`}>
                <span className={`text-[10px] font-medium ${dk ? 'text-zinc-400' : 'text-gray-500'}`}>Total</span>
                <span className={`text-base font-extrabold tracking-tight ${dk ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Donation Type ────────────────────────────────────────────── */}
        <div className="mb-6">
          <SectionLabel>Type of Donation</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {filteredDonationTypes.map((type) => {
              const Icon = type.Icon;
              const isActive = donationType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => !type.disabled && setDonationType(type.id)}
                  disabled={type.disabled}
                  title={type.desc}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors
                    ${isActive
                      ? dk
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400'
                        : 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : dk
                        ? 'border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-gray-900'}
                    ${type.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <Icon className={`w-3 h-3 flex-shrink-0 ${isActive ? (dk ? 'text-emerald-400' : 'text-emerald-600') : ''}`} />
                  {type.label}
                  {type.disabled && <Lock className="w-2.5 h-2.5 opacity-60" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="mb-6 border-t border-dashed" style={{ borderColor: dk ? '#27272a' : '#f3f4f6' }} />

        {/* ── Amount ───────────────────────────────────────────────────── */}
        <div className="mb-2">
          <SectionLabel>Choose Amount</SectionLabel>
          {(campaignConfig || unitConfig) ? (
            <CampaignAmountSelector
              slug={resolvedSlug}
              unitConfig={unitConfig}
              darkMode={dk}
              selectedAmount={selectedAmount}
              setSelectedAmount={setSelectedAmount}
              customAmount={customAmount}
              setCustomAmount={setCustomAmount}
              showCustomAmountInput={showCustomAmountInput}
              setShowCustomAmountInput={setShowCustomAmountInput}
              selectedPresetKey={selectedPresetKey}
              setSelectedPresetKey={setSelectedPresetKey}
            />
          ) : (
            <DefaultAmountSelector
              darkMode={dk}
              selectedAmount={selectedAmount}
              setSelectedAmount={setSelectedAmount}
              customAmount={customAmount}
              setCustomAmount={setCustomAmount}
              showCustomAmountInput={showCustomAmountInput}
              setShowCustomAmountInput={setShowCustomAmountInput}
            />
          )}
        </div>

        {/* ── Selected amount summary ───────────────────────────────────── */}
        <div className={`mb-6 px-3 py-2.5 rounded-lg flex items-center justify-between ${dk ? 'bg-zinc-800/50 border border-zinc-700/50' : 'bg-gray-50 border border-gray-100'}`}>
          <span className={`text-xs font-medium ${dk ? 'text-zinc-400' : 'text-gray-500'}`}>Donation amount</span>
          {baseAmount >= 50 ? (
            <span className={`text-sm font-extrabold ${dk ? 'text-emerald-400' : 'text-emerald-600'}`}>
              ₹{baseAmount.toLocaleString()}
            </span>
          ) : baseAmount > 0 ? (
            <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Min. ₹50
            </span>
          ) : (
            <span className={`text-xs ${dk ? 'text-zinc-600' : 'text-gray-400'}`}>Not selected</span>
          )}
        </div>

        {/* ── Guest Details ────────────────────────────────────────────── */}
        {!userInfo && (
          <div className="mb-8">
            <SectionLabel>Your Details</SectionLabel>
            <div className="space-y-2.5">
              {[
                { Icon: User, type: 'text', placeholder: 'Full Name', value: fullName, onChange: setFullName },
                { Icon: Mail, type: 'email', placeholder: 'Email', value: email, onChange: setEmail },
              ].map(({ Icon, type, placeholder, value, onChange }) => (
                <div key={placeholder} className="relative">
                  <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dk ? 'text-zinc-500' : 'text-gray-400'}`} />
                  <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
                </div>
              ))}
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dk ? 'text-zinc-500' : 'text-gray-400'}`} />
                <input
                  type="tel"
                  placeholder="Mobile (10 digits)"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Platform Tip ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <label className={`text-sm font-semibold ${dk ? 'text-gray-200' : 'text-gray-800'}`}>Support TPF</label>
            <div className="group relative">
              <Info className="w-4 h-4 text-emerald-500 cursor-help" />
              <div className={`
                absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 rounded-lg text-xs leading-relaxed z-10
                ${dk ? 'bg-zinc-800 text-gray-200 border border-zinc-700' : 'bg-gray-900 text-white'}
                opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl
              `}>
                We do not charge for our services and rely on your generosity. Your support helps us run this platform,
                enabling us to connect donors with worthy causes and sustain similar campaigns.
                <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 w-2 h-2 rotate-45 ${dk ? 'bg-zinc-800' : 'bg-gray-900'}`} />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            {tipPercentages.map((pct) => (
              <button
                key={pct}
                onClick={() => { setTipPercentage(pct); setCustomTip(''); setShowCustomTipInput(false); }}
                className={tipBtnCls(tipPercentage === pct && !customTip)}
              >
                {pct === 0 ? 'None' : `${pct}%`}
              </button>
            ))}
            <button
              onClick={() => {
                const next = !showCustomTipInput;
                setShowCustomTipInput(next);
                if (!next) { setCustomTip(''); setTipPercentage(0); }
                else { setTipPercentage(null); setCustomTip(''); }
              }}
              className={tipBtnCls(showCustomTipInput || !!customTip)}
            >
              {customTip && !showCustomTipInput ? `₹${customTip}` : 'Other'}
            </button>
          </div>
          {showCustomTipInput && (
            <div className="relative">
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none ${dk ? 'text-zinc-400' : 'text-gray-400'}`}>₹</span>
              <input
                type="number"
                placeholder="Custom tip amount"
                value={customTip}
                autoFocus
                min={0}
                onChange={(e) => { setCustomTip(e.target.value); setTipPercentage(null); }}
                className={`w-full h-10 pl-7 pr-3 text-sm rounded-lg font-semibold focus:outline-none border transition-colors ${dk
                  ? 'bg-zinc-800 border-zinc-600 focus:border-emerald-500 text-white placeholder-zinc-500'
                  : 'bg-white border-gray-200 focus:border-emerald-400 text-gray-900 placeholder-gray-400'
                  }`}
              />
            </div>
          )}
          {tipAmount > 0 && (
            <p className={`mt-2 text-xs font-medium ${dk ? 'text-zinc-500' : 'text-gray-500'}`}>
              Tip: ₹{tipAmount.toLocaleString()}
              {tipPercentage > 0 && !customTip && ` (${tipPercentage}% of ₹${baseAmount.toLocaleString()})`}
            </p>
          )}
        </div>

        {/* ── Checkboxes ───────────────────────────────────────────────── */}
        <div className="mb-6 space-y-3">
          <CustomCheckbox checked={isAnonymous} onChange={setIsAnonymous} label="Make my donation anonymous" />
          {taxEligible && (
            <CustomCheckbox checked={claim80G} onChange={setClaim80G} label="Claim 80G tax benefits" />
          )}
        </div>

        {/* ── Donate Button ─────────────────────────────────────────────── */}
        {isCompleted ? (
          <div className={`
            w-full h-14 rounded-lg font-bold text-base mb-4
            flex items-center justify-center gap-2
            bg-zinc-100 text-zinc-500 border border-zinc-200
          `}>
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0">
              <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Not accepting payments
          </div>
        ) : (
          <button
            onClick={handleDonate}
            disabled={isDonating || baseAmount < 50}
            className={`
              w-full h-14 rounded-lg font-bold text-base mb-4 transition-all
              flex items-center justify-center gap-2
              ${isDonating
                ? 'bg-emerald-600 text-white cursor-wait'
                : baseAmount >= 50
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white shadow-lg shadow-emerald-600/20'
                  : dk
                    ? 'bg-zinc-800 text-gray-600 cursor-not-allowed border border-zinc-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
          >
            {isDonating ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v0C5.373 4 0 8.373 0 12h4z" />
                </svg>
                Processing Donation…
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {baseAmount === 0
                  ? 'Enter Amount to Continue'
                  : baseAmount < 50
                    ? 'Minimum ₹50 to Donate'
                    : `Donate ₹${totalAmount.toLocaleString()}`}
              </>
            )}
          </button>
        )}

        {/* Secure badge */}
        <div className={`flex items-center justify-center gap-1.5 mb-6 ${dk ? 'text-zinc-600' : 'text-gray-400'}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Secure payment · Receipt via email</span>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="pt-6 border-t-2 border-dashed" style={{ borderColor: dk ? '#27272a' : '#f3f4f6' }}>
          <p className={`text-xs text-center leading-relaxed ${dk ? 'text-gray-500' : 'text-gray-600'}`}>
            By donating, you agree to our terms. Donations are tax-deductible and a receipt will be sent to your email.
          </p>
        </div>
      </div>

      {/* ── Exit Confirmation Modal ──────────────────────────────────────── */}
      <ExitConfirmationModal
        isOpen={showExitConfirmation}
        onConfirm={() => setShowExitConfirmation(false)}
        onCancel={() => setShowExitConfirmation(false)}
        darkMode={dk}
        totalAmount={totalAmount}
      />
    </>
  );
}