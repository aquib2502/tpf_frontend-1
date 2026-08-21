'use client'

export const CAMPAIGN_CONFIGS = {
  'help-us-serve-10000-iftars-of-hope-87d4f3': {
    unitName: 'Iftaar Kit',
    unitNamePlural: 'Iftaar Kits',
    unitCost: 50,
    configType: 'unit',
    presets: [
      { amount: 50,    label: '1 Iftaar Kit',    sublabel: '₹50',      qty: 1    },
      { amount: 500,   label: '10 Iftaar Kits',  sublabel: '₹500',     qty: 10   },
      { amount: 5000,  label: '100 Iftaar Kits', sublabel: '₹5,000',   qty: 100  },
      { amount: 50000, label: '1000 Iftaar Kits',sublabel: '₹50,000',  qty: 1000 },
    ],
    emoji: '🌙',
    activeSolid:  'bg-amber-500 text-white border-amber-500',
    activeSoft:   'bg-amber-100 text-amber-900 border-amber-400 font-extrabold',
    activeSoftDk: 'bg-amber-500/25 text-amber-300 border-amber-400/70 font-extrabold',
  },
  'fill-1000-kitchens-with-hope-this-ramadan-87d3bc': {
    unitName: 'Ration Kit',
    unitNamePlural: 'Ration Kits',
    unitCost: 1250,
    configType: 'unit',
    presets: [
      { amount: 1250,   label: '1 Ration Kit',    sublabel: '₹1,250',    qty: 1   },
      { amount: 6250,   label: '5 Ration Kits',   sublabel: '₹6,250',    qty: 5   },
      { amount: 12500,  label: '10 Ration Kits',  sublabel: '₹12,500',   qty: 10  },
      { amount: 125000, label: '100 Ration Kits', sublabel: '₹1,25,000', qty: 100 },
    ],
    emoji: '🍽️',
    activeSolid:  'bg-emerald-500 text-white border-emerald-500',
    activeSoft:   'bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold',
    activeSoftDk: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/70 font-extrabold',
  },
  "give-the-gift-of-qur'an-earn-endless-rewards-87d2ad": {
    unitName: "Qur'an",
    unitNamePlural: "Qur'ans",
    unitCost: 400,
    configType: 'unit',
    presets: [
      { amount: 400,   label: "1 Qur'an",    sublabel: '₹400',    qty: 1   },
      { amount: 2000,  label: "5 Qur'ans",   sublabel: '₹2,000',  qty: 5   },
      { amount: 4000,  label: "10 Qur'ans",  sublabel: '₹4,000',  qty: 10  },
      { amount: 40000, label: "100 Qur'ans", sublabel: '₹40,000', qty: 100 },
    ],
    emoji: '📖',
    activeSolid:  'bg-violet-500 text-white border-violet-500',
    activeSoft:   'bg-violet-100 text-violet-900 border-violet-400 font-extrabold',
    activeSoftDk: 'bg-violet-500/25 text-violet-300 border-violet-400/70 font-extrabold',
  },
  'end-hunger-in-palestine-today-13e390': {
    unitName: 'Ration Kit',
    unitNamePlural: 'Ration Kits',
    unitCost: 5000,
    configType: 'unit',
    presets: [
      { amount: 5000,    label: '1 Ration Kit',     sublabel: '₹5,000',     qty: 1    },
      { amount: 50000,   label: '10 Ration Kits',   sublabel: '₹50,000',    qty: 10   },
      { amount: 500000,  label: '100 Ration Kits',  sublabel: '₹5,00,000',  qty: 100  },
      { amount: 5000000, label: '1000 Ration Kits', sublabel: '₹50,00,000', qty: 1000 },
    ],
    emoji: '🕊️',
    activeSolid:  'bg-rose-500 text-white border-rose-500',
    activeSoft:   'bg-rose-100 text-rose-900 border-rose-400 font-extrabold',
    activeSoftDk: 'bg-rose-500/25 text-rose-300 border-rose-400/70 font-extrabold',
  },
};

export function getCampaignConfig(slug) {
  return CAMPAIGN_CONFIGS[slug] || null;
}

/**
 * Normalise a unitConfig coming from the DB so the component always
 * works with a clean, predictable shape regardless of what was saved.
 *
 * Key behaviour:
 *  - configType is inferred if missing (unit when unitCost > 0 or any qty > 0)
 *  - kitPresets  = presets where qty > 0   (unit-mode buttons)
 *  - flatPresets = presets where qty === 0 (fixed-mode buttons, rare)
 */
function normaliseConfig(raw) {
  if (!raw) return null;

  let configType = raw.configType;
  if (!configType) {
    const hasUnit =
      Number(raw.unitCost) > 0 ||
      (raw.presets || []).some((p) => Number(p.qty) > 0);
    configType = hasUnit ? 'unit' : 'fixed';
  }

  return { ...raw, configType };
}

export default function CampaignAmountSelector({
  slug,
  unitConfig: propUnitConfig,
  darkMode,
  selectedAmount,
  setSelectedAmount,
  customAmount,
  setCustomAmount,
  showCustomAmountInput,
  setShowCustomAmountInput,
  selectedPresetKey,
  setSelectedPresetKey,
}) {
  // Priority: DB unitConfig prop → hardcoded CAMPAIGN_CONFIGS → null
  const rawConfig  = propUnitConfig || getCampaignConfig(slug);
  const config     = normaliseConfig(rawConfig);
  if (!config) return null;

  const dk         = darkMode;
  const isUnitMode = config.configType === 'unit';

  // ── Active / inactive button styles ──────────────────────────────────────
  const activeFlat = (dk ? config.activeSoftDk : config.activeSoft) ||
    (dk
      ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/70 font-extrabold'
      : 'bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold');

  const inactiveFlat = dk
    ? 'bg-zinc-900/60 border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:text-zinc-200'
    : 'bg-white border-gray-300 text-gray-700 hover:border-emerald-300';

  // ── Preset splitting ──────────────────────────────────────────────────────
  // DB unit-mode configs store ONLY kit presets (qty > 0).
  // Hardcoded CAMPAIGN_CONFIGS used to mix flat + kit — we cleaned them above.
  // Either way: kit = qty > 0, flat defaults are always injected below.
  const allPresets = config.presets || [];

  const kitPresets  = isUnitMode
    ? allPresets.filter((p) => Number(p.qty) > 0)
    : [];

  // For unit mode the flat row is always ₹50 / ₹100 / Other (fixed defaults).
  // For fixed mode we use whatever presets the campaign stored.
  const flatPresetsFromDB = allPresets.filter((p) => !p.qty || Number(p.qty) === 0);

  const flatPresets = isUnitMode
    ? [
        { amount: 50,   label: '₹50',    qty: 0 },
        { amount: 100,  label: '₹100',   qty: 0 },
        { amount: 200,  label: '₹200',   qty: 0 },
        { amount: 500,  label: '₹500',   qty: 0 },
        { amount: 1000, label: '₹1,000', qty: 0 },
        // append any DB flat presets that aren't in the default set
        ...flatPresetsFromDB.filter((p) => ![50, 100, 200, 500, 1000].includes(p.amount)),
      ]
    : (flatPresetsFromDB.length ? flatPresetsFromDB : [
        { amount: 50,   label: '₹50',    qty: 0 },
        { amount: 100,  label: '₹100',   qty: 0 },
        { amount: 200,  label: '₹200',   qty: 0 },
        { amount: 500,  label: '₹500',   qty: 0 },
        { amount: 1000, label: '₹1,000', qty: 0 },
      ]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const selectPreset = (preset, key) => {
    setSelectedAmount(preset.amount);
    setCustomAmount('');
    setShowCustomAmountInput(false);
    setSelectedPresetKey(key);
  };

  const handleOtherClick = () => {
    const next = !showCustomAmountInput;
    setShowCustomAmountInput(next);
    if (!next) {
      setCustomAmount('');
      setSelectedAmount(flatPresets[1]?.amount || 100);
      setSelectedPresetKey('flat-1');
    } else {
      setSelectedAmount(null);
      setCustomAmount('');
      setSelectedPresetKey(null);
    }
  };

  const isOtherActive = showCustomAmountInput || !!customAmount;

  return (
    <div className="space-y-2">
      {/* Unit cost badge — only in unit mode */}
      {isUnitMode && config.unitCost > 0 && (
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-medium ${
          dk
            ? 'bg-zinc-900/60 text-zinc-400 border border-zinc-700/50'
            : 'bg-white text-gray-500 border border-gray-200'
        }`}>
          <span>{config.emoji}</span>
          <span>
            1 {config.unitName} = ₹{config.unitCost.toLocaleString('en-IN')}
          </span>
        </div>
      )}

      {/* ── Flat / default amount row ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-1.5">
        {flatPresets.map((preset, i) => {
          const key      = `flat-${i}`;
          const isActive = (selectedPresetKey ? (selectedPresetKey === key || Number(selectedAmount) === Number(preset.amount)) : (Number(selectedAmount) === Number(preset.amount))) && !customAmount;
          return (
            <button
              key={key}
              onClick={() => selectPreset(preset, key)}
              className={`h-8 rounded-lg text-sm font-extrabold transition-colors border ${
                isActive ? activeFlat : inactiveFlat
              }`}
            >
              {preset.label || `₹${preset.amount.toLocaleString('en-IN')}`}
            </button>
          );
        })}

        {/* Other button always last in the flat row */}
        <button
          onClick={handleOtherClick}
          className={`h-8 rounded-lg text-xs font-extrabold transition-colors border ${
            isOtherActive ? activeFlat : inactiveFlat
          }`}
        >
          {customAmount && !showCustomAmountInput
            ? `₹${parseInt(customAmount).toLocaleString('en-IN')}`
            : 'Other'}
        </button>
      </div>

      {/* ── Kit preset row — unit mode only ──────────────────────────────── */}
      {isUnitMode && kitPresets.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5">
          {kitPresets.map((preset, i) => {
            const key      = `kit-${i}`;
            const isActive = selectedPresetKey === key && !customAmount;

            // Label: stored label OR auto-generate from qty + unitName
            const label =
              preset.label?.trim() ||
              `${preset.qty} ${
                preset.qty === 1
                  ? (config.unitName    || 'Unit')
                  : (config.unitNamePlural || config.unitName + 's' || 'Units')
              }`;

            // Sublabel: stored sublabel OR compute from amount
            const sublabel =
              preset.sublabel?.trim() ||
              `₹${(preset.amount || preset.qty * (config.unitCost || 0)).toLocaleString('en-IN')}`;

            return (
              <button
                key={key}
                onClick={() => selectPreset(preset, key)}
                className={`h-10 rounded-lg transition-colors flex flex-col items-center justify-center gap-0.5 px-2 border ${
                  isActive ? activeFlat : inactiveFlat
                }`}
              >
                <span className={`text-[10px] font-medium leading-none ${
                  isActive ? 'opacity-70' : dk ? 'text-zinc-500' : 'text-gray-400'
                }`}>
                  {label}
                </span>
                <span className="text-xs font-bold leading-none mt-0.5">
                  {sublabel}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Custom amount input ───────────────────────────────────────────── */}
      {showCustomAmountInput && (
        <div className="relative">
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none ${
            dk ? 'text-zinc-400' : 'text-gray-400'
          }`}>
            ₹
          </span>
          <input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            autoFocus
            min={50}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
              setSelectedPresetKey(null);
            }}
            className={`w-full h-9 pl-7 pr-10 text-sm rounded-lg font-semibold focus:outline-none border transition-colors ${
              dk
                ? 'bg-zinc-800 border-zinc-600 focus:border-emerald-500 text-white placeholder-zinc-500'
                : 'bg-white border-gray-200 focus:border-emerald-400 text-gray-900 placeholder-gray-400'
            }`}
          />
          {customAmount && parseInt(customAmount) >= 50 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm font-bold pointer-events-none">
              ✓
            </span>
          )}
        </div>
      )}
    </div>
  );
}