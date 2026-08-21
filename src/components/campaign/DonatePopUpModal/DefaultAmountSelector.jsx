'use client'

const presetAmounts = [
  { value: 50,   label: '₹50' },
  { value: 100,  label: '₹100' },
  { value: 200,  label: '₹200' },
  { value: 500,  label: '₹500' },
  { value: 1000, label: '₹1,000' },
];

export default function DefaultAmountSelector({
  darkMode,
  selectedAmount,
  setSelectedAmount,
  customAmount,
  setCustomAmount,
  showCustomAmountInput,
  setShowCustomAmountInput,
}) {
  const dk = darkMode;

  const activeCls = dk
    ? 'bg-emerald-500/25 border-emerald-400/70 text-emerald-300 font-extrabold shadow-sm'
    : 'bg-emerald-100 border-emerald-400 text-emerald-900 font-extrabold shadow-sm';

  const inactiveCls = dk
    ? 'bg-zinc-900/60 border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:text-zinc-200 font-bold'
    : 'bg-white border-gray-300 text-gray-700 hover:border-emerald-300 font-bold';

  const handleOtherClick = () => {
    const next = !showCustomAmountInput;
    setShowCustomAmountInput(next);
    if (!next) {
      setCustomAmount('');
      setSelectedAmount(100);
    } else {
      setSelectedAmount(null);
      setCustomAmount('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        {presetAmounts.map((amt) => {
          const isActive = (selectedAmount === amt.value || Number(selectedAmount) === Number(amt.value)) && !customAmount;
          return (
            <button
              key={amt.value}
              onClick={() => {
                setSelectedAmount(amt.value);
                setCustomAmount('');
                setShowCustomAmountInput(false);
              }}
              className={`h-8 rounded-lg font-extrabold text-xs transition-colors border ${
                isActive ? activeCls : inactiveCls
              }`}
            >
              {amt.label}
            </button>
          );
        })}

        <button
          onClick={handleOtherClick}
          className={`h-8 rounded-lg font-extrabold text-xs transition-colors border ${
            showCustomAmountInput || customAmount ? activeCls : inactiveCls
          }`}
        >
          {customAmount && !showCustomAmountInput ? `₹${parseInt(customAmount).toLocaleString('en-IN')}` : 'Other'}
        </button>
      </div>

      {showCustomAmountInput && (
        <div className="relative">
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none ${dk ? 'text-zinc-400' : 'text-gray-400'}`}>₹</span>
          <input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            autoFocus
            min={50}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            className={`w-full h-9 pl-7 pr-10 text-sm rounded-lg font-semibold focus:outline-none border transition-colors ${
              dk
                ? 'bg-zinc-800 border-zinc-600 focus:border-emerald-500 text-white placeholder-zinc-500'
                : 'bg-white border-gray-200 focus:border-emerald-400 text-gray-900 placeholder-gray-400'
            }`}
          />
          {customAmount && parseInt(customAmount) >= 50 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm font-bold pointer-events-none">✓</span>
          )}
        </div>
      )}
    </div>
  );
}