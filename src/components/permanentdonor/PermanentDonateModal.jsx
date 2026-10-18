"use client";

import { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Lock, ShieldCheck, BadgeCheck, AlertCircle, ArrowRight, Quote } from "lucide-react";
import { useSelector } from "react-redux";
import { useAppToast } from "@/app/AppToastContext";
import { useSoftSignupMutation } from "@/utils/slices/authApiSlice";

const PRESET_AMOUNTS = [1000, 5000, 10000];
const MIN_AMOUNT = 1000;
const DONATION_TYPE = "LILLAH";

const fieldCls =
  "w-full h-11 px-3.5 rounded-xl border border-pd-line bg-pd-paper text-base text-pd-ink placeholder:text-pd-muted/70 focus:border-pd-ink focus:outline-none focus:ring-2 focus:ring-pd-gold disabled:opacity-70 disabled:cursor-not-allowed";
const labelCls = "mb-1 block text-xs font-medium text-pd-muted";

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function PermanentDonateModal({ open, onOpenChange, darkMode }) {
  const [activeAmount, setActiveAmount] = useState(1000);
  const [showCustom, setShowCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [userId, setUserId] = useState(null);

  const [isDonating, setIsDonating] = useState(false);
  const [cashfreeData, setCashfreeData] = useState(null);
  const checkoutStartedRef = useRef(null);

  const userInfo = useSelector((state) => state.auth?.userInfo);
  const { showToast } = useAppToast?.() ?? { showToast: () => {} };
  const [softSignup] = useSoftSignupMutation?.() ?? [async () => {}];

  // Every time the modal opens, start again from the recommended ₹1,000.
  useEffect(() => {
    if (open) {
      setActiveAmount(1000);
      setShowCustom(false);
      setCustomAmount("");
    }
  }, [open]);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.fullName) setFullName(userInfo.fullName);
      if (userInfo.email) setEmail(userInfo.email);
      if (userInfo.mobileNo) setMobileNo(userInfo.mobileNo);
      setUserId(userInfo._id || userInfo.userId);
    }
  }, [userInfo]);

  const effectiveAmount = showCustom ? parseInt(customAmount, 10) || 0 : activeAmount || 0;
  const canDonate = effectiveAmount >= MIN_AMOUNT && !isDonating;
  const thanks = effectiveAmount > MIN_AMOUNT;

  const handleIdentifyUser = async () => {
    const result = await softSignup({ fullName, email, mobileNo }).unwrap();
    if (result?.data?.userId) return result.data.userId;
    throw new Error("Unable to identify donor profile");
  };

  const handleDonate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isDonating) return;

    if (!effectiveAmount || effectiveAmount < MIN_AMOUNT) {
      showToast({
        title: "Minimum ₹1,000 Required",
        message: "Permanent Donor contributions must be ₹1,000 or greater per Financial Year.",
        type: "error",
      });
      return;
    }

    if (!userInfo) {
      if (!fullName.trim()) {
        showToast({ title: "Name Required", message: "Please provide your full legal name.", type: "error" });
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast({ title: "Valid Email Required", message: "Please enter a valid email address.", type: "error" });
        return;
      }
      if (!mobileNo.trim() || !/^\d{10}$/.test(mobileNo)) {
        showToast({ title: "Valid Mobile Required", message: "Please enter a valid 10-digit mobile number.", type: "error" });
        return;
      }
    }

    setIsDonating(true);
    try {
      let activeUserId = userId;
      if (!activeUserId && !userInfo) {
        activeUserId = await handleIdentifyUser();
        setUserId(activeUserId);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: effectiveAmount,
          tipAmount: 0,
          donationType: DONATION_TYPE,
          isPermanent: true,
          isPermanentDonor: true,
          isAnonymous: false,
          isTaxEligible: true,
          userId: activeUserId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.cashfree?.paymentSessionId) {
        throw new Error(data?.message || "Failed to initiate payment session");
      }

      // Stay "busy" until checkout has been handed to the gateway, so a second tap
      // cannot create a duplicate pending order while the SDK is still loading.
      setCashfreeData(data.cashfree);
    } catch (err) {
      showToast({
        title: "Initiation Error",
        message: err.message || "Failed to connect to secure gateway.",
        type: "error",
        duration: 6000,
      });
      setIsDonating(false);
    }
  };

  // Cashfree checkout SDK initializer. Keyed by session id so every new order
  // (a retry in the same visit, or after the back button) opens its own checkout.
  useEffect(() => {
    const sessionId = cashfreeData?.paymentSessionId;
    if (!sessionId) return;
    if (checkoutStartedRef.current === sessionId) return;
    checkoutStartedRef.current = sessionId;

    const failCheckout = (message) => {
      checkoutStartedRef.current = null;
      setIsDonating(false);
      showToast({ title: "Payment Gateway Error", message, type: "error", duration: 6000 });
    };

    const startCheckout = () => {
      try {
        const cashfree = new window.Cashfree({
          mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox",
        });
        cashfree.checkout({ paymentSessionId: sessionId, redirectTarget: "_self" });
        // Normally the page navigates away. If it does not (blocked, or the donor
        // comes back), re-enable the button instead of leaving it stuck.
        setTimeout(() => setIsDonating(false), 6000);
      } catch (err) {
        failCheckout("Could not open the secure payment page. Please try again.");
      }
    };

    if (window.Cashfree) {
      startCheckout();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = startCheckout;
    script.onerror = () =>
      failCheckout("Could not load the secure payment page. Check your connection or ad-blocker and try again.");
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [cashfreeData]);

  const chip = (selected) =>
    `h-11 rounded-xl text-sm font-semibold tabular-nums border transition-all cursor-pointer ${
      selected
        ? "bg-pd-forest-soft text-pd-onforest border-pd-edge shadow-sm"
        : "bg-pd-paper text-pd-ink border-pd-line hover:border-pd-ink"
    }`;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[1000001] bg-black/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          data-lenis-prevent
          data-theme={darkMode ? "dark" : "light"}
          className="pd-root fixed z-[1000002] inset-x-0 bottom-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-3xl max-h-[100dvh] overflow-y-auto overscroll-contain rounded-t-3xl md:rounded-3xl bg-pd-surface text-pd-ink shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-8 md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        >
          <Dialog.Close
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-pd-line bg-pd-surface text-pd-ink hover:bg-pd-paper cursor-pointer"
          >
            <X size={16} aria-hidden />
          </Dialog.Close>

          <div className="grid md:grid-cols-5">
            {/* Left: message */}
            <aside className="md:col-span-2 flex flex-col bg-pd-tint border-b md:border-b-0 md:border-r border-pd-line px-5 pt-4 pb-4 md:px-7 md:py-8">
              <Dialog.Title className="pd-serif pr-10 md:pr-0 text-xl md:text-3xl font-medium leading-tight">
                Become a Permanent Donor
              </Dialog.Title>
              <Dialog.Description className="mt-1 hidden md:block text-sm text-pd-muted">
                One payment. No auto-debit.
              </Dialog.Description>

              <figure className="mt-3 md:mt-6 rounded-xl md:rounded-2xl bg-pd-goldsoft p-3 md:p-5">
                <Quote aria-hidden className="hidden md:block h-5 w-5 text-pd-clay" />
                <blockquote className="pd-serif text-base md:mt-2 md:text-xl italic leading-snug">
                  {thanks
                    ? `Jazakallahu khayran. Your ${inr(effectiveAmount)} stands behind every family TPF helps, inshallah.`
                    : "Charity never decreases wealth."}
                </blockquote>
                <figcaption className="mt-1 md:mt-2 text-xs md:text-[13px] text-pd-muted">
                  {thanks ? "May Allah accept it and multiply it." : "Sahih Muslim 2588"}
                  {!thanks && <span className="hidden md:inline">. ₹1,000 a year is less than ₹3 a day.</span>}
                </figcaption>
              </figure>

              <ul className="mt-auto hidden md:flex flex-col gap-2 pt-6 text-xs font-medium text-pd-muted">
                <li className="flex items-center gap-2">
                  <Lock size={14} aria-hidden className="text-pd-edge" /> 256-bit SSL secure payment
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck size={14} aria-hidden className="text-pd-edge" /> Verified NGO
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} aria-hidden className="text-pd-edge" /> 80G tax slip
                </li>
              </ul>
            </aside>

            {/* Right: form */}
            <div className="md:col-span-3 space-y-3 md:space-y-4 px-5 pt-4 pb-5 md:px-7 md:py-8">
              <fieldset>
                <legend className="text-sm font-semibold">Choose your pledge</legend>
                <div role="radiogroup" aria-label="Pledge amount" className="mt-2 grid grid-cols-4 gap-2">
                  {PRESET_AMOUNTS.map((amt) => {
                    const selected = !showCustom && activeAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                          setShowCustom(false);
                          setCustomAmount("");
                          setActiveAmount(amt);
                        }}
                        className={chip(selected)}
                      >
                        {inr(amt)}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={showCustom}
                    onClick={() => {
                      setShowCustom(true);
                      setActiveAmount(null);
                    }}
                    className={chip(showCustom)}
                  >
                    Custom
                  </button>
                </div>

                {showCustom ? (
                  <div className="mt-2">
                    <label htmlFor="pd-modal-custom" className="sr-only">
                      Custom pledge amount in rupees
                    </label>
                    <div className="relative">
                      <span aria-hidden className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-semibold text-pd-muted">
                        ₹
                      </span>
                      <input
                        id="pd-modal-custom"
                        type="text"
                        inputMode="numeric"
                        maxLength={7}
                        placeholder="Enter amount (min. 1,000)"
                        value={customAmount}
                        autoFocus
                        onChange={(e) => setCustomAmount(e.target.value.replace(/\D/g, ""))}
                        className={`${fieldCls} pl-8 font-semibold tabular-nums`}
                      />
                    </div>
                  </div>
                ) : (
                  activeAmount === 1000 && (
                    <p className="mt-1.5 text-xs font-medium text-pd-edge">₹1,000 · Recommended</p>
                  )
                )}

                {effectiveAmount < MIN_AMOUNT && (
                  <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs font-medium text-pd-clay">
                    <AlertCircle size={13} aria-hidden className="mt-0.5 shrink-0" />
                    Minimum pledge is ₹1,000 per financial year.
                  </p>
                )}
              </fieldset>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
                <div className="sm:col-span-2">
                  <label htmlFor="pd-modal-name" className={labelCls}>Full name</label>
                  <input
                    id="pd-modal-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={Boolean(userInfo?.fullName)}
                    className={fieldCls}
                  />
                </div>
                <div>
                  <label htmlFor="pd-modal-email" className={labelCls}>Email</label>
                  <input
                    id="pd-modal-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={Boolean(userInfo?.email)}
                    className={fieldCls}
                  />
                </div>
                <div>
                  <label htmlFor="pd-modal-mobile" className={labelCls}>Mobile number</label>
                  <input
                    id="pd-modal-mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    placeholder="10 digits"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ""))}
                    disabled={Boolean(userInfo?.mobileNo)}
                    className={`${fieldCls} tabular-nums`}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleDonate}
                disabled={!canDonate}
                aria-busy={isDonating}
                className={`w-full h-12 px-5 rounded-full font-bold text-base inline-flex items-center justify-center gap-2.5 transition-all ${
                  canDonate
                    ? "bg-pd-gold text-pd-ongold shadow-[0_10px_24px_-8px_rgba(240,177,58,0.9)] hover:bg-pd-gold-hover hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    : "bg-pd-line text-pd-muted cursor-not-allowed"
                }`}
              >
                {isDonating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v0C5.373 4 0 8.373 0 12h4z" />
                    </svg>
                    Connecting…
                  </>
                ) : (
                  <>
                    Donate {effectiveAmount ? inr(effectiveAmount) : ""}
                    <ArrowRight size={18} aria-hidden />
                  </>
                )}
              </button>

              <p className="flex md:hidden items-center justify-center gap-1.5 text-xs text-pd-muted">
                <Lock size={12} aria-hidden className="text-pd-edge" /> 256-bit SSL · Verified NGO
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
