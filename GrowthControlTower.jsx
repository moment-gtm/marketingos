import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  AlertTriangle, AlertCircle, ArrowRight, BookOpen, Brain, Check, ChevronRight, Crosshair, Info, Layers,
  RefreshCw, Repeat, RotateCcw, Search, Sparkles, Target, X, Zap, Eye, FileText, Plus, Beaker, Filter,
} from 'lucide-react';
import {
  Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip as RTooltip, ReferenceDot, ReferenceLine, Cell as RCell,
} from 'recharts';

/* ============================================================================
   TOKENS  —  KDP Coffee Operating Unit palette.
   Brand brown comes from the supplied logo (#573027). The workspace ground stays
   a cool grey and the interactive accent stays a cool teal on purpose: brown reads
   as brand against a neutral, and as theme when everything around it is warm.
   Legacy key names (navy, teal, opp, warn …) are kept as aliases so every screen
   keeps resolving to the new palette.
   ========================================================================== */
export const T = {
  brand: '#573027',
  brandLift: '#6E4238',
  brandDeep: '#3C201A',
  ink: '#241812',
  ink60: '#6B5C55',
  ink40: '#9C8F89',
  deck: '#F1F2F5',
  panel: '#FFFFFF',
  rule: '#D8D3CE',
  ruleSoft: '#EAE6E2',
  accent: '#0E7C8F',
  accentDeep: '#0A6272',
  accentWash: '#E3F1F4',
  accentLite: '#5CC7D6',
  // four signal classes
  growth: '#1C7C54', growthWash: '#E7F1EC',
  risk: '#B3252F', riskWash: '#FBEBEC',
  replicate: '#6B4FA8', replicateWash: '#F0ECFA',
  watch: '#946112', watchWash: '#FAF2E3',
  // on-brand-ground text tints
  onBrand: '#E8DAD5', onBrandMute: '#C2AAA2', onBrandDim: '#A38B83',
  // legacy aliases
  navy: '#573027', navyLift: '#6E4238',
  teal: '#0E7C8F', tealDeep: '#0A6272',
  opp: '#1C7C54', oppWash: '#E7F1EC',
  warn: '#946112', warnWash: '#FAF2E3',
};
export const FS = '"Palatino Linotype", Palatino, "Iowan Old Style", Georgia, serif';
export const FU = '"Avenir Next", Avenir, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif';
const NUM = { fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"' };

/* ============================================================================
   BRAND MARKS
   KDP Coffee Operating Unit logo: single flat colour (#573027) on transparent,
   embedded as a data URI so no external image request is made.
   ========================================================================== */
const KDP_LOGO = 'data:image/png;base64,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';

export function BrandMark({ height = 22, light = false }) {
  const img = <img src={KDP_LOGO} alt="Keurig Dr Pepper Coffee Operating Unit" style={{ height, width: 'auto', display: 'block' }} />;
  if (!light) return img;
  return <span style={{ background: '#fff', borderRadius: 3, padding: '4px 8px', display: 'inline-flex' }}>{img}</span>;
}

/* "Built by Cognizant" credit — footer only */
function CognizantMark({ height = 14 }) {
  const w = height * 0.95;
  return (
    <span className="inline-flex items-center" style={{ gap: height * 0.4 }}>
      <svg width={w} height={height} viewBox="0 0 40 44" aria-hidden="true">
        <path d="M20 0 L40 11 L20 22 L0 11 Z" fill="#5BA8DE" />
        <path d="M0 11 L20 22 L20 44 L0 33 Z" fill="#0B1F6B" opacity="0.82" />
        <path d="M20 22 L40 11 L40 33 L20 44 Z" fill="#15707F" />
        <path d="M20 10.5 L37 22 L20 33.5 Z" fill="#FFFFFF" />
      </svg>
      <span style={{ fontFamily: FU, fontSize: height * 0.82, letterSpacing: '-0.02em', fontWeight: 500, color: T.ink60, lineHeight: 1 }}>
        cognizant
      </span>
    </span>
  );
}

/* ============================================================================
   DR1 / DR2 — THE SYNTHETIC DATASET.  One object. Every stage reads from it.
   12 brands × 8 markets = 96 brand-market cells (a filtered slice of a 60-brand,
   100-market portfolio — the interface never presents it as the whole business).
   ========================================================================== */
const MARKETS = ['Germany', 'France', 'Netherlands', 'UK', 'Belgium', 'Austria', 'Brazil', 'Australia'];
const MARKET_SHORT = { Germany: 'DEU', France: 'FRA', Netherlands: 'NLD', UK: 'UK', Belgium: 'BEL', Austria: 'AUT', Brazil: 'BRA', Australia: 'AUS' };
// Last four brands are placeholders to reach twelve — confirm with the client.
const BRANDS = [
  'Jacobs', "L'OR", 'Tassimo', 'Douwe Egberts', 'Kenco', 'Senseo',
  'Pilão', 'Moccona', 'Green Mountain Coffee', 'The Original Donut Shop',
  "Peet's Coffee", 'Caribou Coffee',
];
const BRAND_SHORT = {
  'Douwe Egberts': 'D. Egberts', 'Green Mountain Coffee': 'Green Mtn',
  'The Original Donut Shop': 'Donut Shop', "Peet's Coffee": "Peet's", 'Caribou Coffee': 'Caribou',
};
const CATEGORIES = ['Ground Coffee', 'Coffee Pods', 'RTD Coffee', 'Espresso Systems'];
const CATEGORY_BY_BRAND = {
  'Jacobs': 'Ground Coffee', "L'OR": 'Coffee Pods', 'Tassimo': 'Espresso Systems',
  'Douwe Egberts': 'Ground Coffee', 'Kenco': 'Ground Coffee', 'Senseo': 'Coffee Pods',
  'Pilão': 'Ground Coffee', 'Moccona': 'Ground Coffee', 'Green Mountain Coffee': 'Coffee Pods',
  'The Original Donut Shop': 'Coffee Pods', "Peet's Coffee": 'Espresso Systems', 'Caribou Coffee': 'RTD Coffee',
};

// index vs target, by brand × market (Germany, France, Netherlands, UK, Belgium, Austria, Brazil, Australia)
const IDX = {
  'Jacobs':                  [100,  93, 102,  97, 101,  99,  96,  98],
  "L'OR":                    [114,  89, 108,  96, 104, 101,  97,  95],
  'Tassimo':                 [ 99,  95,  97,  98,  96,  94,  92,  93],
  'Douwe Egberts':           [101,  98, 106,  99, 103,  97,  95,  96],
  'Kenco':                   [ 96,  97,  95,  94,  93,  98,  91,  99],
  'Senseo':                  [ 98,  96, 103,  95, 100,  97,  94,  92],
  'Pilão':                   [ 94,  92,  95,  93,  96,  91, 110,  97],
  'Moccona':                 [ 97,  99,  98,  96,  95,  94, 101,  97],
  'Green Mountain Coffee':   [103,  98,  99, 101,  97, 100,  96,  94],
  'The Original Donut Shop': [ 98,  94,  96, 105,  93,  95,  99,  92],
  "Peet's Coffee":           [102,  97, 100,  98,  99, 106,  94,  96],
  'Caribou Coffee':          [ 95,  93,  97,  96,  94,  92,  98, 107],
};

// revenue target YTD, $M.  L'OR France ($175.0M) is fixed so that +4 index points = +$7.0M.
const TGT = {
  'Jacobs':                  [210, 64, 58, 34, 46, 52, 20, 18],
  "L'OR":                    [142, 175.0, 52, 61, 38, 24, 22, 28],
  'Tassimo':                 [88, 72, 41, 96, 34, 26, 14, 20],
  'Douwe Egberts':           [46, 74, 120, 52, 64, 18, 16, 14],
  'Kenco':                   [30, 38, 24, 98, 18, 22, 12, 36],
  'Senseo':                  [28, 92, 84, 22, 40, 16, 8, 10],
  'Pilão':                   [6, 5, 4, 5, 3, 3, 168, 7],
  'Moccona':                 [14, 18, 16, 22, 12, 9, 28, 96],
  'Green Mountain Coffee':   [38, 22, 26, 44, 18, 20, 12, 34],
  'The Original Donut Shop': [20, 16, 14, 32, 12, 10, 26, 18],
  "Peet's Coffee":           [34, 28, 22, 40, 20, 36, 16, 24],
  'Caribou Coffee':          [24, 20, 18, 34, 14, 12, 18, 30],
};

// Cells carrying a codified playbook that fits them — rendered as a corner marker on ANY signal class.
const PLAYBOOK_MATCH = {
  "L'OR|France": 'pb-premium',
  'Senseo|France': 'pb-premium',
  'Moccona|Australia': 'pb-premium',
  'Jacobs|Netherlands': 'pb-holiday',
  'Kenco|Austria': 'pb-holiday',
  'Green Mountain Coffee|Germany': 'pb-pods',
  'Jacobs|France': 'pb-holiday',
};

// Watch-list triggers: cells on or near plan whose health or share is sliding.
const WATCH_TRIGGERS = {
  'Tassimo|UK': { healthDelta: -3.6, sharePts: -0.3, note: 'Stalling growth: distribution slipping in convenience while the index still holds near plan.' },
  'Green Mountain Coffee|UK': { healthDelta: -3.2, sharePts: -0.2, note: 'Pod trial rate softening ahead of any revenue break.' },
  "Peet's Coffee|Germany": { healthDelta: -3.4, sharePts: -0.5, note: 'Premium consideration down two quarters running; revenue held by price.' },
  'The Original Donut Shop|Brazil': { healthDelta: -3.1, sharePts: -0.4, note: 'Share ceded to a regional roaster; volume holding on promotion.' },
  'Moccona|France': { healthDelta: -3.3, sharePts: -0.2, note: 'Awareness slipping in modern trade while the KPI still holds plan.' },
};

// Client-quoted status labels for the anchor cells (the deck's suggested table).
const STATUS_LABEL = {
  'Jacobs|Germany': 'On plan',
  'Jacobs|France': 'Underperforming',
  'Tassimo|UK': 'Stalling growth',
  'Douwe Egberts|Netherlands': 'Market leader',
  'Kenco|UK': 'Declining share',
  'Pilão|Brazil': 'Winning campaign',
  'Senseo|France': 'Opportunity identified',
  'Moccona|Australia': 'Premiumization opportunity',
};

const AGENCY_BY_MARKET = {
  Germany: 'Continental Collective', France: 'Continental Collective', Austria: 'Continental Collective',
  Netherlands: 'Lowlands Media', Belgium: 'Lowlands Media',
  UK: 'Thames & Co',
  Brazil: 'Southern Cross Studio', Australia: 'Southern Cross Studio',
};
const CHANNELS = ['Linear TV', 'Digital video', 'Retail media', 'Social', 'Trade promo', 'In-store'];
const DIST_CHANNELS = ['Grocery', 'Convenience', 'Club', 'E-commerce', 'Foodservice'];

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const r1 = (n) => Math.round(n * 10) / 10;
const r2 = (n) => Math.round(n * 100) / 100;

const THRESHOLDS = { growth: 105, risk: 95, healthDrop: -3.0, shareDrop: -0.4 };

// Calibration constant: tuned so the spend-weighted portfolio ROI lands on 1.9x,
// the figure quoted in copy on four screens.
const ROI_BASE = 1.61;

function buildCells() {
  const cells = [];
  BRANDS.forEach((brand) => {
    MARKETS.forEach((market, mi) => {
      const key = `${brand}|${market}`;
      const rnd = mulberry32(hash(key));
      const index = IDX[brand][mi];
      const target = TGT[brand][mi];
      const revenue = r1(target * index / 100);
      const gap = r1(revenue - target);

      const margin = r1(29 + rnd() * 15);
      const mediaSpend = r1(target * (0.055 + rnd() * 0.045));
      const roi = r2(Math.max(0.6, Math.min(3.3, ROI_BASE + (index - 95) / 14 + (rnd() - 0.5) * 0.45)));
      let sharePts = r1((index - 100) / 9 + (rnd() - 0.5) * 0.5);
      const health = Math.round(Math.max(31, Math.min(93, 54 + (index - 100) * 1.3 + rnd() * 12)));
      let healthDelta = r1((index - 100) * 0.22 + (rnd() - 0.5) * 4);
      // on-plan cells only reach the Watch List through the five named triggers
      if (!WATCH_TRIGGERS[key] && index > THRESHOLDS.risk && index < THRESHOLDS.growth) {
        healthDelta = Math.max(healthDelta, -2.6);
        sharePts = Math.max(sharePts, -0.3);
      }

      // channel mix — 6 shares to 100
      const raw = CHANNELS.map((c, i) => 6 + rnd() * (i === 0 ? 34 : 22));
      const sum = raw.reduce((a, b) => a + b, 0);
      const mix = raw.map((v) => Math.round(v / sum * 100));
      mix[0] += 100 - mix.reduce((a, b) => a + b, 0);

      const dist = DIST_CHANNELS.map((c) => ({ channel: c, tdp: r1((rnd() - 0.45) * 7 + (index - 100) * 0.09) }));
      const promoPlan = Math.round(17 + rnd() * 8);
      const promoActual = Math.round(promoPlan + (index < 97 ? 3 + rnd() * 9 : (rnd() - 0.6) * 5));

      const cell = {
        id: key, brand, market, index, target, revenue, gap, margin, mediaSpend, roi,
        sharePts, health, healthDelta,
        mix: CHANNELS.map((c, i) => ({ channel: c, share: mix[i] })),
        dist, promo: { plan: promoPlan, actual: Math.max(8, promoActual) },
        innovation: rnd() > 0.74,
        agency: AGENCY_BY_MARKET[market],
        leadingNote: null,
      };

      if (WATCH_TRIGGERS[key]) {
        cell.healthDelta = WATCH_TRIGGERS[key].healthDelta;
        cell.sharePts = WATCH_TRIGGERS[key].sharePts;
        cell.leadingNote = WATCH_TRIGGERS[key].note;
      }
      cells.push(cell);
    });
  });
  return cells;
}

const CELLS_BASE = buildCells();

/* --- Hero case A: L'OR · France.  Exact figures, used by every stage. ------- */
const HERO_A = {
  id: "L'OR|France", brand: "L'OR", market: 'France',
  index: 89, target: 175.0, revenue: 155.8, gap: -19.3,
  margin: 33.4, mediaSpend: 12.6, roi: 1.2, sharePts: -1.6, health: 46, healthDelta: -4.8,
  agency: 'Continental Collective', innovation: false, leadingNote: null,
  mix: [
    { channel: 'Linear TV', share: 52 }, { channel: 'Digital video', share: 12 },
    { channel: 'Retail media', share: 10 }, { channel: 'Social', share: 8 },
    { channel: 'Trade promo', share: 11 }, { channel: 'In-store', share: 7 },
  ],
  dist: [
    { channel: 'Grocery', tdp: -0.6 }, { channel: 'Convenience', tdp: -1.9 },
    { channel: 'Club', tdp: 0.2 }, { channel: 'E-commerce', tdp: 0.8 },
    { channel: 'Foodservice', tdp: -0.4 },
  ],
  promo: { plan: 20, actual: 27 },
};

/* --- Hero case B: L'OR · Germany.  Exact figures — the proven answer. ------- */
const HERO_B = {
  id: "L'OR|Germany", brand: "L'OR", market: 'Germany',
  index: 114, target: 142.0, revenue: 161.9, gap: 19.9,
  margin: 41.2, mediaSpend: 8.2, roi: 2.9, sharePts: 1.9, health: 71, healthDelta: 5.2,
  agency: 'Continental Collective', innovation: true, leadingNote: null,
  mix: [
    { channel: 'Linear TV', share: 22 }, { channel: 'Digital video', share: 22 },
    { channel: 'Retail media', share: 24 }, { channel: 'Social', share: 12 },
    { channel: 'Trade promo', share: 10 }, { channel: 'In-store', share: 10 },
  ],
  dist: [
    { channel: 'Grocery', tdp: 1.4 }, { channel: 'Convenience', tdp: 0.9 },
    { channel: 'Club', tdp: 0.5 }, { channel: 'E-commerce', tdp: 1.6 },
    { channel: 'Foodservice', tdp: 0.8 },
  ],
  promo: { plan: 19, actual: 16 },
};
const MARGINAL_ROI_HERO_B = 2.3; // marginal ROI on new money — diminishing, used by Simulate

/* ============================================================================
   FR1.2 / FR1.3 / FR1.5 — four mutually exclusive signal classes
   Precedence: risk > growth > replicate > watch > ontrack
   ========================================================================== */

function classify(cell) {
  if (cell.index <= THRESHOLDS.risk) return 'risk';
  if (cell.index >= THRESHOLDS.growth) return 'growth';
  if (cell.playbookMatch) return 'replicate';
  if (cell.healthDelta <= THRESHOLDS.healthDrop || cell.sharePts <= THRESHOLDS.shareDrop) return 'watch';
  return 'ontrack';
}

/* Key Driver — the driver whose underlying figure deviates most from the cell's own plan. */
const KEY_DRIVERS = ['Media efficiency', 'Creative performance', 'Distribution', 'Pricing', 'Promotional effectiveness', 'Brand health'];
function driverScores(cell) {
  const rnd = mulberry32(hash(cell.id + 'kd'));
  const tv = cell.mix.find((m) => m.channel === 'Linear TV').share;
  const promoGap = Math.abs(cell.promo.actual - cell.promo.plan);
  const worstTdp = Math.max(...cell.dist.map((d) => Math.abs(d.tdp)));
  const priceLed = cell.margin < 34;
  const promoDev = promoGap / 5;
  const scores = {
    'Media efficiency': Math.abs(tv - 30) / 12,
    'Creative performance': 0.9 + rnd() * 0.15,
    'Distribution': worstTdp / 2,
    'Pricing': promoDev * (priceLed ? 1 : 0.55),
    'Promotional effectiveness': promoDev * (priceLed ? 0.55 : 1),
    'Brand health': Math.abs(cell.healthDelta) / 3,
  };
  return KEY_DRIVERS.map((d) => ({ driver: d, score: r2(scores[d]) })).sort((a, b) => b.score - a.score);
}

const CELLS_RAW = CELLS_BASE.map((c) =>
  c.id === HERO_A.id ? { ...c, ...HERO_A } : c.id === HERO_B.id ? { ...c, ...HERO_B } : c
);
const CELLS = CELLS_RAW.map((c) => {
  const scores = driverScores(c);
  const withPb = { ...c, playbook: PLAYBOOK_MATCH[c.id] || null, playbookMatch: !!PLAYBOOK_MATCH[c.id], keyDriver: scores[0].driver, driverScores: scores };
  return { ...withPb, cls: classify(withPb), category: CATEGORY_BY_BRAND[c.brand] };
});
const CELL_BY_ID = {};
CELLS.forEach((c) => { CELL_BY_ID[c.id] = c; });
const getCell = (brand, market) => CELL_BY_ID[`${brand}|${market}`];

const PORTFOLIO_AVG_ROI = r2(
  CELLS.reduce((a, c) => a + c.roi * c.mediaSpend, 0) / CELLS.reduce((a, c) => a + c.mediaSpend, 0)
);

function signalsFor(cell) {
  const s = [];
  const cls = classify(cell);
  if (cls === 'growth') {
    s.push({
      type: 'growth',
      headline: `Running ${cell.index - 100} pts ahead of plan`,
      detail: `${fmtM(cell.gap)} above target with modeled ROI at ${cell.roi.toFixed(1)}x against a ${PORTFOLIO_AVG_ROI.toFixed(1)}x portfolio average.`,
    });
  }
  if (cls === 'risk') {
    s.push({
      type: 'risk',
      headline: `Revenue ${fmtM(cell.gap)} against target`,
      detail: `Index ${cell.index}. Confirmed miss — the KPI has already broken plan.`,
    });
    if (cell.promo.actual > cell.promo.plan + 5) {
      s.push({ type: 'risk', headline: `Promo depth ${cell.promo.actual}% of volume vs ${cell.promo.plan}% plan`, detail: 'Margin leaking through unplanned discount depth.' });
    }
  }
  if (cell.playbookMatch && cls !== 'risk' && cls !== 'growth') {
    const pb = PLAYBOOK_BY_ID[cell.playbook];
    s.push({
      type: 'replicate',
      headline: `Playbook match: ${pb.name}`,
      detail: `On plan at index ${cell.index}, but a codified playbook fits this cell — replicate rather than rebuild.`,
    });
  }
  if (cls === 'watch') {
    if (cell.healthDelta <= THRESHOLDS.healthDrop) {
      s.push({
        type: 'watch',
        headline: `Brand health ${cell.healthDelta.toFixed(1)} over 90 days`,
        detail: cell.leadingNote || 'Leading indicator only — revenue is still inside plan.',
      });
    }
    if (cell.sharePts <= THRESHOLDS.shareDrop) {
      s.push({
        type: 'watch',
        headline: `Share down ${Math.abs(cell.sharePts).toFixed(1)} pts`,
        detail: cell.leadingNote || 'Share-loss risk ahead of any revenue break.',
      });
    }
  }
  return s;
}

// authored signals, layered on top of the rule output for the cells the client quoted by name
const HERO_SIGNALS = {
  "L'OR|France": [
    { type: 'risk', headline: 'Revenue −$19.3M against target', detail: 'Index 89. Underperforming L\'OR Germany by 25 points — the largest single gap in the portfolio.' },
    { type: 'risk', headline: 'Promo depth 27% of volume vs 20% plan', detail: 'Margin leaking through unplanned discount depth.' },
    { type: 'risk', headline: '52% of media in linear TV', detail: 'Modeled incrementality 0.6 against retail media at 1.9.' },
    { type: 'replicate', headline: 'Playbook available: L\'OR Germany Premiumization', detail: 'Proven in Germany, Netherlands and Belgium — worth +$7M and +4 index points here.' },
  ],
  "L'OR|Germany": [
    { type: 'growth', headline: 'Running 14 pts ahead of plan', detail: '$19.9M above target on 2.9x ROI — the playbook other markets should copy.' },
    { type: 'growth', headline: 'Digital video reach 22% above the Netherlands and France', detail: 'Paired with 14% stronger retail media activation and a 9% higher premium mix.' },
  ],
  'Jacobs|France': [
    { type: 'risk', headline: 'Underperforming — index 93', detail: 'Promo depth above plan and a holiday playbook that has not yet been applied.' },
  ],
  'Tassimo|UK': [
    { type: 'watch', headline: 'Stalling growth — brand health −3.6', detail: WATCH_TRIGGERS['Tassimo|UK'].note },
  ],
  'Douwe Egberts|Netherlands': [
    { type: 'growth', headline: 'Market leader — index 106', detail: 'Seasonal activation is the next lever: accelerate rather than rebuild.' },
  ],
  'Kenco|UK': [
    { type: 'risk', headline: 'Declining share — index 94', detail: 'Linear TV still carries the budget while retail media is under-weighted.' },
  ],
  'Pilão|Brazil': [
    { type: 'growth', headline: 'Winning campaign — index 110', detail: 'Unexpected: not the biggest brand, but the one most clearly beating plan.' },
  ],
  'Senseo|France': [
    { type: 'replicate', headline: 'Opportunity identified — index 96', detail: 'Retail media is live and the premium range is absent: a partial fit for the Germany playbook.' },
  ],
  'Moccona|Australia': [
    { type: 'replicate', headline: 'Premiumization opportunity — index 97', detail: 'Needs retailer negotiation before the premium range can land.' },
  ],
};
function allSignals(cell) {
  return HERO_SIGNALS[cell.id] || signalsFor(cell);
}

// Four classes, each distinguishable without relying on hue (glyph + border scheme).
const SIGNAL_META = {
  growth: { label: 'Growth Opportunity', color: T.growth, wash: T.growthWash, glyph: 'triangle', desc: 'Index 105 or above — working, put more money here' },
  risk: { label: 'Underperformance Risk', color: T.risk, wash: T.riskWash, glyph: 'square', desc: 'Index 95 or below — the KPI has already broken target' },
  replicate: { label: 'Replication Opportunity', color: T.replicate, wash: T.replicateWash, glyph: 'copy', desc: 'On plan, and a codified playbook matches the cell' },
  watch: { label: 'Watch List', color: T.watch, wash: T.watchWash, glyph: 'diamond', desc: 'On plan, but health or share is sliding' },
  ontrack: { label: 'On plan', color: T.ink40, wash: '#FFFFFF', glyph: 'none', desc: 'Inside tolerance' },
};
// the border treatment that carries each class without hue
function signalBorder(cls, color) {
  const c = color || SIGNAL_META[cls].color;
  if (cls === 'growth') return { border: `1px solid ${c}55`, borderLeft: `3px solid ${c}` };
  if (cls === 'risk') return { border: `1px solid ${c}55`, borderBottom: `3px solid ${c}` };
  if (cls === 'replicate') return { border: `1px solid ${c}55`, borderLeft: `2px solid ${c}`, borderRight: `2px solid ${c}` };
  if (cls === 'watch') return { border: `1px dashed ${c}` };
  return { border: `1px solid ${T.ruleSoft}` };
}

/* ============================================================================
   FR2.1 / FR2.2 — diagnosis
   ========================================================================== */
const CAUSES = ['Audience targeting', 'Media effectiveness', 'Creative performance', 'Distribution', 'Promotional effectiveness', 'Competitive activity'];
const KD_TO_CAUSE = {
  'Media efficiency': 'Media effectiveness', 'Creative performance': 'Creative performance', 'Distribution': 'Distribution',
  'Pricing': 'Promotional effectiveness', 'Promotional effectiveness': 'Promotional effectiveness', 'Brand health': 'Audience targeting',
};
const HERO_A_CAUSES = [
  { cause: 'Media effectiveness', weight: 34, finding: '52% of media in linear TV at modeled incrementality 0.6; retail media sits at 1.9', lever: 'Shift spend from linear TV into retail media and digital video' },
  { cause: 'Promotional effectiveness', weight: 23, finding: 'Promo depth at 27% of volume against a 20% plan', lever: 'Reduce ineffective promotion depth to plan' },
  { cause: 'Distribution', weight: 18, finding: 'Convenience distribution down 1.9 TDP', lever: 'Rebuild convenience door count' },
  { cause: 'Creative performance', weight: 12, finding: 'Brand health −4.8 over 90 days against +5.2 in Germany', lever: 'Deploy the L\'OR Germany creative playbook' },
  { cause: 'Audience targeting', weight: 8, finding: 'Premium-skewing shoppers under-reached in digital video', lever: 'Re-target premium shoppers behind retail media' },
  { cause: 'Competitive activity', weight: 5, finding: 'Competitor share of voice +12% since last quarter', lever: 'Hold share of voice in the core occasion' },
];
// AI Root Cause Assessment — rule-weighted, not a model (see the label on screen).
const HERO_A_AI = { conf: 82, primary: 'Media effectiveness', secondary: [['Promotion strategy', 67], ['Distribution', 54], ['Creative performance', 43]] };

const HERO_B_DRIVERS = [
  { driver: 'Digital video reach', pts: 5.6, note: '22% higher reach than the Netherlands and France' },
  { driver: 'Retail media activation', pts: 4.1, note: '14% stronger activation against the same store list' },
  { driver: 'Premium mix', pts: 2.8, note: '9% higher premium mix on the core pod range' },
  { driver: 'Brand strength', pts: 1.5, note: 'Unaided awareness up 4 pts year on year' },
];

function templatedCauses(cell) {
  const rnd = mulberry32(hash(cell.id + 'cause'));
  const mixOf = (n) => cell.mix.find((m) => m.channel === n).share;
  const tv = mixOf('Linear TV'); const rm = mixOf('Retail media');
  const dv = mixOf('Digital video'); const soc = mixOf('Social');
  const worstDist = [...cell.dist].sort((a, b) => a.tdp - b.tdp)[0];
  const promoGap = cell.promo.actual - cell.promo.plan;
  const raw = [
    { cause: 'Audience targeting', w: 6 + Math.max(0, -cell.healthDelta) * 1.2 + Math.max(0, 20 - (dv + soc)) * 0.2 + rnd() * 5, finding: `Digital video and social carry ${dv + soc}% of media against a premium-skewing shopper`, lever: 'Re-target the core shopper' },
    { cause: 'Media effectiveness', w: 8 + tv * 0.35 + (20 - rm) * 0.3 + rnd() * 6, finding: `${tv}% of media in linear TV against ${rm}% in retail media`, lever: 'Rebalance toward retail media' },
    { cause: 'Creative performance', w: 5 + Math.max(0, -cell.healthDelta) * 1.6 + rnd() * 5, finding: `Brand health ${cell.healthDelta > 0 ? '+' : ''}${cell.healthDelta.toFixed(1)} over 90 days`, lever: 'Refresh creative against the core occasion' },
    { cause: 'Distribution', w: 6 + Math.max(0, -worstDist.tdp) * 3.2 + rnd() * 5, finding: `${worstDist.channel} distribution ${worstDist.tdp > 0 ? '+' : ''}${worstDist.tdp.toFixed(1)} TDP`, lever: `Rebuild ${worstDist.channel.toLowerCase()} availability` },
    { cause: 'Promotional effectiveness', w: 8 + Math.max(0, promoGap) * 2.4 + rnd() * 6, finding: `Promo depth at ${cell.promo.actual}% of volume against a ${cell.promo.plan}% plan`, lever: 'Reset promo depth to plan' },
    { cause: 'Competitive activity', w: 5 + Math.max(0, -cell.sharePts) * 5 + rnd() * 5, finding: `Share ${cell.sharePts > 0 ? '+' : ''}${cell.sharePts.toFixed(1)} pts`, lever: 'Price-pack response' },
  ];
  // the Sense key driver and the Diagnose top cause must agree
  const lead = KD_TO_CAUSE[cell.keyDriver];
  raw.forEach((r) => { if (r.cause === lead) r.w += 12; });
  const sum = raw.reduce((a, b) => a + b.w, 0);
  const out = raw.map((r) => ({ ...r, weight: Math.round(r.w / sum * 100) }));
  const top = out.reduce((a, b) => (b.weight > a.weight ? b : a), out[0]);
  top.weight += 100 - out.reduce((a, b) => a + b.weight, 0);
  return out.sort((a, b) => b.weight - a.weight).map((r) => ({
    cause: r.cause, weight: r.weight, finding: r.finding, lever: r.lever,
  }));
}
function causesFor(cell) {
  const base = cell.id === HERO_A.id ? HERO_A_CAUSES : templatedCauses(cell);
  return base.map((c) => ({ ...c, impact: `~${fmtM(Math.abs(cell.gap) * c.weight / 100)} of the gap` }));
}
const SECONDARY_LABEL = { 'Promotional effectiveness': 'Promotion strategy' };
function aiAssessmentFor(cell, causes) {
  if (cell.id === HERO_A.id) return HERO_A_AI;
  const [p, ...rest] = causes;
  return {
    conf: Math.min(92, Math.round(48 + p.weight * 1.0)),
    primary: p.cause,
    secondary: rest.slice(0, 3).map((c) => [SECONDARY_LABEL[c.cause] || c.cause, Math.min(88, Math.round(28 + c.weight * 2.1))]),
  };
}
function driversFor(cell) {
  if (cell.id === HERO_B.id) return HERO_B_DRIVERS;
  const lift = cell.index - 100;
  const split = [0.42, 0.28, 0.18, 0.12];
  return [
    { driver: 'Availability and distribution', pts: r1(lift * split[0]), note: 'Door count and shelf position gains' },
    { driver: 'Working media quality', pts: r1(lift * split[1]), note: `Modeled ROI ${cell.roi.toFixed(1)}x` },
    { driver: 'Premium mix', pts: r1(lift * split[2]), note: 'Mix shift into higher-margin packs' },
    { driver: 'Brand strength', pts: r1(lift * split[3]), note: `Brand health ${cell.health}` },
  ];
}

/* "What changed vs last quarter?" — direction + magnitude, coloured by whether it helps or hurts */
function changesFor(cell) {
  if (cell.id === HERO_A.id) {
    return [
      { label: 'Competitor share of voice', value: '+12%', dir: 'up', good: false },
      { label: 'Digital video reach', value: '−15%', dir: 'down', good: false },
      { label: 'Retail media spend', value: '−18%', dir: 'down', good: false },
      { label: 'Distribution', value: 'stable', dir: 'flat', good: null },
    ];
  }
  const mixOf = (n) => cell.mix.find((m) => m.channel === n).share;
  const sov = Math.round(-cell.sharePts * 7 + 3);
  const dv = Math.round((mixOf('Digital video') - 14) * 1.6);
  const rm = Math.round((mixOf('Retail media') - 14) * 1.5);
  const worst = Math.min(...cell.dist.map((d) => d.tdp));
  const pct = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}%`;
  return [
    { label: 'Competitor share of voice', value: pct(sov), dir: sov > 0 ? 'up' : sov < 0 ? 'down' : 'flat', good: sov > 0 ? false : sov < 0 ? true : null },
    { label: 'Digital video reach', value: pct(dv), dir: dv > 0 ? 'up' : dv < 0 ? 'down' : 'flat', good: dv > 0 ? true : dv < 0 ? false : null },
    { label: 'Retail media spend', value: pct(rm), dir: rm > 0 ? 'up' : rm < 0 ? 'down' : 'flat', good: rm > 0 ? true : rm < 0 ? false : null },
    worst < -1.2
      ? { label: 'Distribution', value: `${worst.toFixed(1)} TDP`, dir: 'down', good: false }
      : { label: 'Distribution', value: 'stable', dir: 'flat', good: null },
  ];
}

/* FR2.4 — investment effectiveness */
function investmentVerdict(cell) {
  const spendIntensity = cell.mediaSpend / cell.target;
  const leaking = cell.promo.actual > cell.promo.plan + 5;
  if (leaking && cell.roi < PORTFOLIO_AVG_ROI) return { label: 'Leaking', color: T.risk, why: `${cell.promo.actual - cell.promo.plan} pts of promo depth above plan while ROI sits at ${cell.roi.toFixed(1)}x` };
  if (cell.roi < 1.6 && spendIntensity > 0.07) return { label: 'Over-funded', color: T.warn, why: `${fmtM(cell.mediaSpend)} working at ${cell.roi.toFixed(1)}x, below the ${PORTFOLIO_AVG_ROI.toFixed(1)}x portfolio average` };
  if (cell.roi > 2.4 && spendIntensity < 0.08) return { label: 'Under-funded', color: T.opp, why: `${cell.roi.toFixed(1)}x ROI on only ${fmtM(cell.mediaSpend)} of working media` };
  if (leaking) return { label: 'Leaking', color: T.risk, why: `Promo depth ${cell.promo.actual}% against a ${cell.promo.plan}% plan` };
  return { label: 'Appropriately funded', color: T.ink60, why: `ROI ${cell.roi.toFixed(1)}x on ${fmtM(cell.mediaSpend)} of working media` };
}

/* Recommendation for any cell — every screen ends in a named action, an impact and a confidence. */
function recommendationFor(cell) {
  const cls = classify(cell);
  const pb = cell.playbook ? PLAYBOOK_BY_ID[cell.playbook] : null;
  const revImpact = r1(Math.abs(cell.gap) * 0.363);
  const pts = Math.max(1, Math.round(revImpact / cell.target * 100));
  if (cls === 'risk') {
    const interventions = ['Increase retail media investment', pb ? `Replicate the ${pb.name} playbook` : 'Replicate the strongest in-brand market play', 'Reduce ineffective promotion depth'];
    return { priority: cell.index <= 92 ? 'High' : 'Medium', interventions, revenue: revImpact, pts, roi: r1(cell.roi + 0.4) };
  }
  if (cls === 'growth') {
    return { priority: 'High', interventions: ['Increase investment while marginal ROI holds', 'Codify what is working as a playbook', 'Protect the premium mix'], revenue: r1(cell.gap * 0.4), pts: Math.max(1, Math.round(cell.gap * 0.4 / cell.target * 100)), roi: r1(Math.min(cell.roi, MARGINAL_ROI_HERO_B)) };
  }
  if (cls === 'replicate') {
    return { priority: 'Medium', interventions: [pb ? `Replicate the ${pb.name} playbook` : 'Replicate the closest proven playbook', 'Close the capability gaps first', 'Track the first four weeks against plan'], revenue: r1(cell.target * 0.04), pts: 4, roi: r1(cell.roi + 0.3) };
  }
  if (cls === 'watch') {
    return { priority: 'Medium', interventions: ['Investigate the leading indicators now', 'Hold spend while the cause is confirmed', 'Set a trigger to escalate if health falls further'], revenue: r1(cell.target * 0.02), pts: 2, roi: r1(cell.roi + 0.1) };
  }
  return { priority: 'Low', interventions: ['Monitor only — no action needed'], revenue: 0, pts: 0, roi: cell.roi };
}

/* ============================================================================
   FR1.4 — market intelligence overlay (context, not baked into the grid)
   ========================================================================== */
const MARKET_INTEL = {
  Germany: { competitor: 'Premium pod entrants discounting in grocery', share: 'Portfolio share +0.8 pts', shareShort: 'share +0.8', trend: 'Category volume +1.4%, premium pods +7.2%' },
  France: { competitor: 'Competitor share of voice +12% in modern trade', share: 'Portfolio share −0.9 pts', shareShort: 'share −0.9', trend: 'Category volume −0.8%, value +2.1% on price' },
  Netherlands: { competitor: 'Private label expanding in single-serve pods', share: 'Portfolio share +0.5 pts', shareShort: 'share +0.5', trend: 'Category volume flat, premium ground +4.6%' },
  UK: { competitor: 'Two discounters delisting mid-tier SKUs', share: 'Portfolio share −0.4 pts', shareShort: 'share −0.4', trend: 'Category volume −2.1%, RTD coffee +9%' },
  Belgium: { competitor: 'Regional roaster pushing convenience bundles', share: 'Portfolio share +0.2 pts', shareShort: 'share +0.2', trend: 'Category volume +0.6%, pods +3.8%' },
  Austria: { competitor: 'Specialty cafés bundling home-brew kits', share: 'Portfolio share +0.1 pts', shareShort: 'share +0.1', trend: 'Category volume +0.9%, espresso systems +5.1%' },
  Brazil: { competitor: 'Regional roasters competing on price in traditional trade', share: 'Portfolio share +1.1 pts', shareShort: 'share +1.1', trend: 'Category volume +3.9%, premium ground +8.4%' },
  Australia: { competitor: 'Premium instant gaining in grocery', share: 'Portfolio share −0.2 pts', shareShort: 'share −0.2', trend: 'Category volume +0.4%, RTD +11%' },
};

/* ============================================================================
   CODIFIED PLAYBOOKS — Capture → Codify → Replicate as a first-class object
   ========================================================================== */
const PLAYBOOKS = [
  {
    id: 'pb-premium', name: "L'OR Germany Premiumization", pattern: 'premiumization',
    markets: ['Germany', 'Netherlands', 'Belgium'], marketCount: 3, deployedTo: ['Netherlands', 'Belgium', 'Austria'],
    avgOutcome: '+12% growth', revenueImpact: 18.0,
    drivers: ['22% higher digital video reach', '14% stronger retail media activation', '9% higher premium mix'],
    target: { brand: "L'OR", market: 'France' }, impact: 7.0, indexPoints: 4,
  },
  {
    id: 'pb-rtd', name: 'Summer RTD Launch', pattern: 'rtd_launch',
    markets: ['Germany', 'Netherlands', 'Belgium'], marketCount: 3, revenueImpact: 18.0,
    drivers: ['High digital video penetration', 'Premium creative', 'Influencer activation'],
  },
  {
    id: 'pb-holiday', name: 'Holiday Premiumization', pattern: 'holiday_premium',
    markets: ['Germany', 'France', 'Netherlands', 'UK', 'Belgium'], marketCount: 5, revenueImpact: 14.0,
    drivers: ['Gift-pack premium tiers', 'Retail media timed to the seasonal peak', 'Influencer unboxing content'],
  },
  {
    id: 'pb-pods', name: 'Premium Pods Expansion', pattern: 'pods_expansion',
    markets: ['Germany', 'France', 'UK', 'Australia'], marketCount: 4, revenueImpact: 11.0,
    drivers: ['Premium pod range at shelf', 'Trial offers on compatible machines', 'Retail media against machine owners'],
  },
];
const PLAYBOOK_BY_ID = {};
PLAYBOOKS.forEach((p) => { PLAYBOOK_BY_ID[p.id] = p; });

/* Recommended-action taxonomy — the client's own words */
const ACTIONS = ['Increase investment', 'Replicate campaign', 'Fix underperformance', 'Monitor only', 'Expand distribution', 'Accelerate activation'];
const ACTION_TONE = {
  'Increase investment': { color: T.growth, wash: T.growthWash },
  'Replicate campaign': { color: T.replicate, wash: T.replicateWash },
  'Fix underperformance': { color: T.risk, wash: T.riskWash },
  'Monitor only': { color: T.watch, wash: T.watchWash },
  'Expand distribution': { color: T.accent, wash: T.accentWash },
  'Accelerate activation': { color: '#2F5F9E', wash: '#E8EFF8' },
};

/* ============================================================================
   DR3 — SEEDED OUTCOMES LOG.  Never empty at first render.
   Exactly two succeeded precedents at pattern `premiumization` put the hero
   replication row at 62% on first load. Do not add a third.
   ========================================================================== */
const PATTERNS = {
  premiumization: 'Premiumization playbook',
  rtd_launch: 'RTD launch playbook',
  holiday_premium: 'Holiday premiumization playbook',
  pods_expansion: 'Premium pods expansion playbook',
  media_mix: 'Linear TV to retail media shift',
  promo_reset: 'Promo depth reset',
  distribution: 'Distribution recovery',
  scale_spend: 'Scale behind outperformance',
  content_refresh: 'Creative and content refresh',
  stop_spend: 'Stop unproductive spend',
};
const FAMILIES = {
  premiumization: 'Premiumization and playbook replication',
  rtd_launch: 'Premiumization and playbook replication',
  holiday_premium: 'Premiumization and playbook replication',
  pods_expansion: 'Premiumization and playbook replication',
  media_mix: 'Retail media and shopper activation',
  distribution: 'Retail media and shopper activation',
  promo_reset: 'Price and promo',
  scale_spend: 'Investment level',
  content_refresh: 'Content and creative',
  stop_spend: 'Investment level',
};

const SEED_LOG = [
  {
    id: 'L-01', seeded: true, period: 'Q3 2024', title: "L'OR Germany premiumization", brand: "L'OR", market: 'Germany',
    type: 'media_support', pattern: 'premiumization', outcome: 'succeeded', roi: 3.4, result: '+$19.9M revenue, +1.9 share pts',
    drivers: ['Digital video reach +22%', 'Retail media activation +14%', 'Premium mix +9%'],
    context: 'Pilot in two regions, scaled nationally',
    learning: 'Premiumization converts only where retail media runs against the same store list as the digital video.',
  },
  {
    id: 'L-02', seeded: true, period: 'Q1 2025', title: "L'OR Netherlands premiumization rollout", brand: "L'OR", market: 'Netherlands',
    type: 'media_support', pattern: 'premiumization', outcome: 'succeeded', roi: 2.6, result: '+$4.1M revenue',
    drivers: ['Digital video reach +15%', 'Premium mix +6%'],
    context: 'Randstad and Brabant grocery',
    learning: 'Works at smaller scale, but the lift halves without a dedicated retail media route.',
  },
  {
    id: 'L-03', seeded: true, period: 'Q2 2024', title: 'Jacobs Germany promo depth reset', brand: 'Jacobs', market: 'Germany',
    type: 'offer_change', pattern: 'promo_reset', outcome: 'succeeded', roi: 2.7, result: '+$3.4M gross profit, volume −0.8%',
    drivers: ['Depth cut from 29% to 20% of volume', 'Feature frequency held'],
    context: 'Four national grocery accounts',
    learning: 'Depth can come down nine points before volume reacts, if feature frequency holds.',
  },
  {
    id: 'L-04', seeded: true, period: 'Q4 2024', title: 'Douwe Egberts Netherlands promo calendar rebuild', brand: 'Douwe Egberts', market: 'Netherlands',
    type: 'offer_change', pattern: 'promo_reset', outcome: 'succeeded', roi: 2.2, result: '+$1.1M gross profit',
    drivers: ['Overlapping events removed', 'Shifted two events out of peak'],
    context: 'Grocery and convenience',
    learning: 'Most of the gain came from removing event overlap, not from depth.',
  },
  {
    id: 'L-05', seeded: true, period: 'Q3 2024', title: 'Kenco UK linear TV into retail media', brand: 'Kenco', market: 'UK',
    type: 'budget_shift', pattern: 'media_mix', outcome: 'succeeded', roi: 2.6, result: '+$4.8M revenue on a $2.1M shift',
    drivers: ['Retail media incrementality 1.8', 'Linear TV incrementality 0.7'],
    context: 'Two retailer media networks',
    learning: 'Shifts up to roughly 25% of a brand’s TV budget held incrementality; past that the curve flattened.',
  },
  {
    id: 'L-06', seeded: true, period: 'Q1 2025', title: 'Tassimo UK digital video uplift', brand: 'Tassimo', market: 'UK',
    type: 'media_support', pattern: 'media_mix', outcome: 'failed', roi: 0.4, result: '−$0.9M against the business case',
    drivers: ['Creative landed six weeks late', 'Flighting missed the season'],
    context: 'National digital video',
    learning: 'Creative readiness, not budget, was the binding constraint. Gate the spend on asset delivery.',
    failureReason: 'Creative landed six weeks late and the flighting missed the season.',
  },
  {
    id: 'L-07', seeded: true, period: 'Q2 2025', title: 'Senseo France distribution expansion', brand: 'Senseo', market: 'France',
    type: 'retail_intervention', pattern: 'distribution', outcome: 'failed', roi: 0.7, result: '−$0.4M, 58% of planned doors activated',
    drivers: ['Retailer compliance below target', 'No merchandising route to verify'],
    context: 'Three convenience chains',
    learning: 'Door expansion without compliance verification does not land. Measure compliance weekly.',
    failureReason: 'Retailer compliance fell below 60%.',
  },
];

/* ============================================================================
   FR4.1 / FR4.2 — tuned elasticity lookup, one row-set per option.
   Not a model. A lookup table with interpolation, pre-tuned so the curve
   visibly bends: revenue saturates, gross profit peaks before the maximum.
   Control = amount allocated to the option, $0–$20M, detent at $10.0M.
   ========================================================================== */
const ALLOC_MAX = 20;
const ALLOC_DETENT = 10;
const SIM_OPTIONS = [
  {
    id: 'opt-lor-de', label: "Germany — L'OR", axis: 'brand-market', brand: "L'OR", market: 'Germany', cellId: "L'OR|Germany",
    rev10: 15, roi10: 2.3, conf10: 83, payback10: 5, sat: 1.6, apk: 14, pattern: 'scale_spend',
    risks: ['Distribution constraints', 'Competitor response', 'Media inventory saturation'],
    reasons: ['Highest projected return', 'Proven growth playbook available', 'Strong execution confidence'],
  },
  {
    id: 'opt-rtd', label: 'RTD Coffee', axis: 'category', category: 'RTD Coffee', cellId: null, brand: 'Caribou Coffee', market: 'UK',
    rev10: 11, roi10: 2.0, conf10: 76, payback10: 6, sat: 1.7, apk: 13, pattern: 'scale_spend',
    risks: ['Summer weather dependency', 'Cold-chain distribution', 'Competitor response'],
    reasons: ['Fastest-growing category in the slice', 'Summer RTD Launch playbook available', 'Execution confidence below the Germany option'],
  },
  {
    id: 'opt-jacobs-fr', label: 'France — Jacobs', axis: 'brand-market', brand: 'Jacobs', market: 'France', cellId: 'Jacobs|France',
    rev10: 8, roi10: 1.6, conf10: 70, payback10: 8, sat: 1.8, apk: 12, pattern: 'media_mix',
    risks: ['Promo depth above plan', 'Convenience distribution gap', 'Retailer compliance'],
    reasons: ['Recovers a cell already below plan', 'Return sits below the portfolio average', 'Needs promo reset first'],
  },
  {
    id: 'opt-pods', label: 'Coffee Pods', axis: 'category', category: 'Coffee Pods', cellId: null, brand: 'Senseo', market: 'France',
    rev10: 4, roi10: 1.3, conf10: 64, payback10: 11, sat: 2.0, apk: 11, pattern: 'scale_spend',
    risks: ['Machine-owner base saturating', 'Private label pressure', 'Media inventory saturation'],
    reasons: ['Category-wide spend dilutes the strongest cells', 'Lowest return of the four options', 'Better funded cell by cell'],
  },
].map((o) => ({ ...o, category: o.category || CATEGORY_BY_BRAND[o.brand] }));
const SIM_BY_ID = {};
SIM_OPTIONS.forEach((o) => { SIM_BY_ID[o.id] = o; });

function buildElasticity(o) {
  const q = 1 - 1 / o.sat;                       // exp(-10 / tau)
  const tau = -ALLOC_DETENT / Math.log(q);
  const rmax = o.rev10 / (1 - q);
  const m = 0.4;                                 // gross margin on incremental revenue
  const c = m * (rmax / tau) * Math.exp(-o.apk / tau); // cost slope that puts the gross-profit peak at apk
  const g = o.roi10 * ALLOC_DETENT / o.rev10;    // gross return per net revenue dollar
  const rows = [];
  for (let a = 0; a <= ALLOC_MAX; a += 1) {
    const rev = rmax * (1 - Math.exp(-a / tau));
    rows.push({
      alloc: a,
      rev: r2(rev),
      gp: r2(m * rev - c * a),
      roi: a === 0 ? null : r2(g * rev / a),
      conf: Math.round(o.conf10 - (a < ALLOC_DETENT ? (ALLOC_DETENT - a) * 0.9 : (a - ALLOC_DETENT) * 1.7)),
      payback: a === 0 ? null : r1(o.payback10 * (0.6 + 0.04 * a) + 0.03 * Math.pow(Math.max(0, a - o.apk), 2)),
    });
  }
  return rows;
}
const ELASTICITY = {};
SIM_OPTIONS.forEach((o) => { ELASTICITY[o.id] = buildElasticity(o); });

const SCENARIOS = {
  premiumisation: {
    label: 'Premiumisation investment',
    detail: 'Adds support behind premium pods and single-origin ground ranges.',
    effect: { rev: 1.14, gp: 1.22, conf: -4 },
    assumptions: ['Premium packs carry 8 pts more gross margin', 'Assumes no price increase on the core range', 'Volume mix shifts 3 pts toward premium'],
  },
  agency: {
    label: 'Agency-dependency reduction',
    detail: 'Moves retail-media execution in-house over two quarters.',
    effect: { rev: 0.96, gp: 1.11, conf: -7 },
    assumptions: ['Agency fee saving of roughly 11% of working media', 'Two quarters of lower execution quality while capability builds', 'No change to creative production'],
  },
};

const INNOVATION_TIMING = [
  { window: 'Q1 launch', incremental: 62, cannibalised: 38, net: 4.1, note: 'Into the softest category quarter — least cannibalisation, slowest build.' },
  { window: 'Q2 launch', incremental: 71, cannibalised: 29, net: 6.8, note: 'Ahead of iced-coffee season with distribution already set.' },
  { window: 'Q3 launch', incremental: 54, cannibalised: 46, net: 3.2, note: 'Peak season demand, but it takes volume from the core 12oz.' },
];
const INNOVATION_ASSUMPTIONS = [
  'Cannibalisation is a fixed rate per launch window, taken from the two most recent launches in the same category.',
  'Incremental volume is held flat after week 12; no long-run trial-to-repeat curve is modelled.',
  'No competitive response is assumed.',
];

/* Recommended reallocation — "where to invest more, where less".  Net is computed from the rows. */
const REALLOC = {
  increase: [
    { label: 'Germany', amount: 4, yieldX: 2.8 },
    { label: 'Brazil', amount: 3, yieldX: 2.7 },
  ],
  reduce: [
    { label: 'France', amount: 2, yieldX: 1.4 },
    { label: 'UK', amount: 1, yieldX: 1.5 },
  ],
};
function reallocation(scale) {
  const inc = REALLOC.increase.map((r) => ({ ...r, amount: r1(r.amount * scale) }));
  const red = REALLOC.reduce.map((r) => ({ ...r, amount: r1(r.amount * scale) }));
  const net = inc.reduce((a, r) => a + r.amount * r.yieldX, 0) - red.reduce((a, r) => a + r.amount * r.yieldX, 0);
  return { inc, red, net: r1(net) };
}

/* ============================================================================
   FR6.1–6.3 — replication candidates.  A candidate is a cell; its similarity and
   impact depend on which codified playbook is being replicated.
   ========================================================================== */
const REP_CELLS = {
  'rep-lorfr': {
    brand: "L'OR", market: 'France', note: 'Same brand, same agency, same category',
    attrs: [
      { attr: 'Shopper profile', score: 0.94, note: 'Same brand, same premium-skewing pod shopper' },
      { attr: 'Category conditions', score: 0.90, note: 'Premium pods growing at a similar rate' },
      { attr: 'Existing capabilities', score: 0.89, note: 'Same agency, same trade structure' },
    ],
    have: ['Continental Collective already runs the Germany remit', 'Retail media networks contracted', 'Premium pod range already ranged'],
    need: ['Planogram sign-off with two national chains'],
  },
  'rep-senseofr': {
    brand: 'Senseo', market: 'France', note: 'Retail media live, premium range absent',
    attrs: [
      { attr: 'Shopper profile', score: 0.74, note: 'Mainstream pod shopper, skews older than L\'OR' },
      { attr: 'Category conditions', score: 0.81, note: 'Single-serve pods growing' },
      { attr: 'Existing capabilities', score: 0.79, note: 'Retail media live; no premium range' },
    ],
    have: ['Retail media networks already activated', 'Shopper measurement in place'],
    need: ['Premium range built from scratch', 'Shelf space negotiated with three chains'],
  },
  'rep-moccaus': {
    brand: 'Moccona', market: 'Australia', note: 'Needs retailer negotiation',
    attrs: [
      { attr: 'Shopper profile', score: 0.72, note: 'Premium instant buyer, older and larger basket' },
      { attr: 'Category conditions', score: 0.76, note: 'Premium instant growing, pods less developed' },
      { attr: 'Existing capabilities', score: 0.73, note: 'Needs retailer negotiation for premium space' },
    ],
    have: ['Southern Cross Studio holds the shopper remit', 'Grocery relationships strong'],
    need: ['Retailer negotiation for premium space', 'Retail media buying in two states'],
  },
  'rep-jacobsnl': {
    brand: 'Jacobs', market: 'Netherlands', note: 'Different shopper profile',
    attrs: [
      { attr: 'Shopper profile', score: 0.48, note: 'Different shopper — filter and ground, grocery-led' },
      { attr: 'Category conditions', score: 0.69, note: 'Premium ground contested' },
      { attr: 'Existing capabilities', score: 0.66, note: 'Retail media live, creative not shopper-ready' },
    ],
    have: ['Retail media buying capability', 'Club channel distribution'],
    need: ['Shopper-first creative built for the fixture', 'Different retailer set', 'Pack-price test before scaling'],
  },
  'rep-kencoat': {
    brand: 'Kenco', market: 'Austria', note: 'Gift-pack range needs ranging',
    attrs: [
      { attr: 'Shopper profile', score: 0.80, note: 'Gifting occasion skews to the same households' },
      { attr: 'Category conditions', score: 0.77, note: 'Seasonal peak in grocery' },
      { attr: 'Existing capabilities', score: 0.72, note: 'Foodservice-led, thin in grocery' },
    ],
    have: ['Continental Collective holds the remit', 'Seasonal promo calendar in place'],
    need: ['Gift-pack range', 'Grocery retail media buying'],
  },
  'rep-gmcde': {
    brand: 'Green Mountain Coffee', market: 'Germany', note: 'Pod range present, premium tier thin',
    attrs: [
      { attr: 'Shopper profile', score: 0.84, note: 'Pod shopper, similar household profile' },
      { attr: 'Category conditions', score: 0.82, note: 'Premium pods growing' },
      { attr: 'Existing capabilities', score: 0.78, note: 'Pod range present, premium tier thin' },
    ],
    have: ['Retail media live', 'Machine-owner CRM base'],
    need: ['Premium tier ranging', 'Machine-compatible trial offer'],
  },
  'rep-caribouau': {
    brand: 'Caribou Coffee', market: 'Australia', note: 'RTD range present',
    attrs: [
      { attr: 'Shopper profile', score: 0.85, note: 'Young, convenience-led RTD buyer' },
      { attr: 'Category conditions', score: 0.88, note: 'RTD coffee growing fast' },
      { attr: 'Existing capabilities', score: 0.80, note: 'Digital video live, influencer bench thin' },
    ],
    have: ['Digital video buying in place', 'Cold-chain distribution contracted'],
    need: ['Influencer activation bench'],
  },
};
// similarity and impact per playbook; absent = not a candidate for that playbook
const REP_BY_PLAYBOOK = {
  'pb-premium': { 'rep-lorfr': [0.91, 7.0], 'rep-senseofr': [0.78, 4.2], 'rep-moccaus': [0.74, 3.1], 'rep-jacobsnl': [0.61, 2.4] },
  'pb-rtd': { 'rep-caribouau': [0.87, 3.9], 'rep-moccaus': [0.72, 2.6], 'rep-kencoat': [0.66, 1.8], 'rep-jacobsnl': [0.58, 1.5] },
  'pb-holiday': { 'rep-jacobsnl': [0.82, 3.2], 'rep-kencoat': [0.79, 2.4], 'rep-lorfr': [0.73, 3.8], 'rep-gmcde': [0.64, 2.0] },
  'pb-pods': { 'rep-senseofr': [0.88, 4.6], 'rep-gmcde': [0.80, 3.4], 'rep-lorfr': [0.70, 2.9], 'rep-moccaus': [0.59, 1.4] },
};
function repStatus(sim) {
  if (sim >= 0.85) return { status: 'Ready', statusTone: 'ready' };
  if (sim >= 0.70) return { status: 'Partial', statusTone: 'partial' };
  return { status: 'Adaptation required', statusTone: 'adapt' };
}
function candidatesFor(pbId) {
  const map = REP_BY_PLAYBOOK[pbId] || {};
  return Object.keys(map).map((id) => {
    const base = REP_CELLS[id];
    const [similarity, impact] = map[id];
    const st = repStatus(similarity);
    return { id, ...base, similarity, impact, playbook: pbId, ...st, cellId: `${base.brand}|${base.market}` };
  }).sort((a, b) => b.similarity - a.similarity);
}
const DEFAULT_PLAYBOOK = 'pb-premium';
const HERO_CANDIDATE = candidatesFor(DEFAULT_PLAYBOOK)[0]; // L'OR · France at 0.91

/* ============================================================================
   FR3.1 — priority items. Factor scores authored; confidence derived (§5).
   `verdict` is the four-way stance; `action` is the six-word recommended action.
   ========================================================================== */
const PRIORITY_ITEMS = [
  {
    id: 'p-lor-de-scale', defaultType: 'media_support', title: "Increase L'OR Germany investment while marginal ROI holds",
    brand: "L'OR", market: 'Germany', verdict: 'Increase investment', action: 'Increase investment', pattern: 'scale_spend', base: 54,
    f: { rev: 86, prof: 78, strat: 82, ease: 72, speed: 70 },
    value: 12.0, money: 3.0, resource: 'Media team has capacity; Continental Collective absorbs the extra weight inside the retainer.',
    funding: '$3.0M incremental — the highest-return ask', stage: 4,
  },
  {
    id: 'p-lor-fr-repl', defaultType: 'media_support', title: "Replicate the L'OR Germany premiumization playbook to L'OR · France",
    brand: "L'OR", market: 'France', verdict: 'Replicate campaign', action: 'Replicate campaign', pattern: 'premiumization', base: 43,
    f: { rev: 68, prof: 62, strat: 76, ease: 80, speed: 76 },
    value: 7.0, money: 2.1, resource: 'No new talent. Continental Collective already runs the Germany remit.',
    funding: '$2.1M incremental, payback inside two quarters', stage: 6,
  },
  {
    id: 'p-jacobs-fr-promo', defaultType: 'offer_change', title: 'Reset Jacobs France promo depth to plan',
    brand: 'Jacobs', market: 'France', verdict: 'Fix underperformance', action: 'Fix underperformance', pattern: 'promo_reset', base: 46,
    f: { rev: 58, prof: 86, strat: 70, ease: 58, speed: 80 },
    value: 3.4, money: 0, resource: 'Revenue growth management lead plus two account teams.',
    funding: 'No funding needed — margin recovery', stage: 5,
  },
  {
    id: 'p-pilao-scale', defaultType: 'media_support', title: 'Scale Pilão Brazil behind the winning campaign',
    brand: 'Pilão', market: 'Brazil', verdict: 'Increase investment', action: 'Increase investment', pattern: 'scale_spend', base: 52,
    f: { rev: 82, prof: 72, strat: 68, ease: 60, speed: 58 },
    value: 8.1, money: 2.6, resource: 'Media team at capacity in Brazil; needs agency hours or AI-assisted planning.',
    funding: '$2.6M incremental — the surprise outperformer', stage: 4,
  },
  {
    id: 'p-senseo-fr-repl', defaultType: 'media_support', title: 'Replicate the premiumization playbook to Senseo · France',
    brand: 'Senseo', market: 'France', verdict: 'Replicate campaign', action: 'Replicate campaign', pattern: 'premiumization', base: 41,
    f: { rev: 66, prof: 62, strat: 70, ease: 56, speed: 52 },
    value: 4.2, money: 1.4, resource: 'Needs a premium range built — specialist range capability absent in France.',
    funding: '$1.4M incremental including range development', stage: 6,
  },
  {
    id: 'p-moccona-au-repl', defaultType: 'media_support', title: 'Replicate the premiumization playbook to Moccona · Australia',
    brand: 'Moccona', market: 'Australia', verdict: 'Replicate campaign', action: 'Replicate campaign', pattern: 'premiumization', base: 38,
    f: { rev: 52, prof: 56, strat: 58, ease: 44, speed: 40 },
    value: 3.1, money: 1.1, resource: 'Retailer negotiation capability is the constraint, not money.',
    funding: '$1.1M incremental, gated on retailer agreement', stage: 6,
  },
  {
    id: 'p-kenco-uk-fix', defaultType: 'budget_shift', title: 'Fix Kenco UK share decline — move linear TV into retail media',
    brand: 'Kenco', market: 'UK', verdict: 'Fix underperformance', action: 'Fix underperformance', pattern: 'media_mix', base: 49,
    f: { rev: 62, prof: 68, strat: 66, ease: 62, speed: 66 },
    value: 3.8, money: 0, resource: 'Reallocation inside the existing UK retainer; no new agency spend.',
    funding: 'Reallocation, not incremental funding', stage: 5,
  },
  {
    id: 'p-tassimo-uk-stall', defaultType: 'retail_intervention', title: 'Arrest the Tassimo UK stall — investigate the distribution decline',
    brand: 'Tassimo', market: 'UK', verdict: 'Fix underperformance', action: 'Fix underperformance', pattern: 'distribution', base: 40,
    f: { rev: 50, prof: 48, strat: 52, ease: 46, speed: 40 },
    value: 2.4, money: 0.9, resource: 'Needs a merchandising route with weekly compliance checks.',
    funding: '$0.9M incremental — hold until the cause is confirmed', stage: 2,
  },
  {
    id: 'p-peets-at-dist', defaultType: 'retail_intervention', title: "Expand Peet's Coffee Austria distribution",
    brand: "Peet's Coffee", market: 'Austria', verdict: 'Increase investment', action: 'Expand distribution', pattern: 'distribution', base: 44,
    f: { rev: 56, prof: 54, strat: 50, ease: 52, speed: 46 },
    value: 2.6, money: 1.5, resource: 'Needs a merchandising route with weekly compliance checks.',
    funding: '$1.5M incremental — hold until compliance measurement exists', stage: 5,
  },
  {
    id: 'p-gm-uk-monitor', defaultType: 'content_refresh', title: 'Monitor Green Mountain Coffee UK pod trial softness',
    brand: 'Green Mountain Coffee', market: 'UK', verdict: 'Monitor only', action: 'Monitor only', pattern: 'content_refresh', base: 52,
    f: { rev: 40, prof: 44, strat: 60, ease: 82, speed: 70 },
    value: 1.2, money: 0.4, resource: 'Absorbed by the UK team; no new capability needed.',
    funding: '$0.4M held in reserve until the signal is confirmed', stage: 2,
  },
];

const DEFAULT_WEIGHTS = { rev: 25, prof: 20, strat: 15, ease: 10, speed: 10, conf: 20 };
const WEIGHT_LABELS = {
  rev: 'Revenue impact', prof: 'Profit impact', strat: 'Strategic importance',
  ease: 'Ease of execution', speed: 'Speed to value', conf: 'Confidence',
};

// the four-way stance reuses the action vocabulary and its colours
const VERDICT_TONE = ACTION_TONE;

const INTERVENTION_TYPES = {
  budget_shift: 'Budget shift',
  offer_change: 'Offer change',
  media_support: 'Media support',
  content_refresh: 'Content refresh',
  retail_intervention: 'Retail intervention',
};

/* ============================================================================
   FR7.4 — agency capacity (resource optimisation)
   ========================================================================== */
const AGENCY_CAPACITY = {
  'Continental Collective': 124,
  'Lowlands Media': 92,
  'Thames & Co': 84,
  'Southern Cross Studio': 88,
};

/* ============================================================================
   FORMATTERS
   ========================================================================== */
function fmtM(v) {
  if (v === null || v === undefined) return '—';
  const s = v < 0 ? '−' : '';
  const a = Math.abs(v);
  return `${s}$${a >= 1000 ? a.toFixed(0) : a.toFixed(1)}M`;
}
function fmtMoney(v) {
  const s = v < 0 ? '−' : '';
  const a = Math.abs(v);
  if (a >= 1e6) return `${s}$${(a / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `${s}$${Math.round(a / 1e3)}K`;
  return `${s}$${a}`;
}
function fmtSigned(v, d = 1) { return `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(d)}`; }
function fmtWhole(v) { return `${v < 0 ? '−' : '+'}$${Math.abs(Math.round(v))}M`; }
function fmtMonths(v) { return v === null || v === undefined ? '—' : `${Number.isInteger(v) ? v : v.toFixed(1)} months`; }

/* ============================================================================
   §5 — THE FEEDBACK LOOP.  Derived on every render, never stored.
   Confidence = authored base + evidence drawn from the outcomes log.
   Each logged instance of the same play counts 1.0; a failure counts −0.75.
   ========================================================================== */
function evidenceFor(log, pattern) {
  // A decision that has only been logged carries no evidence until it is acted on.
  const matches = log.filter((l) => l.pattern === pattern && l.outcome !== 'queued');
  const completed = matches.filter((m) => m.outcome === 'succeeded' || m.outcome === 'failed');
  const failures = matches.filter((m) => m.outcome === 'failed');
  const inFlight = matches.filter((m) => m.outcome === 'in_flight');
  const raw = matches.reduce((a, m) => a + (m.outcome === 'failed' ? -0.75 : 1), 0);
  return {
    matches: matches.length,
    completed: completed.length,
    inFlight: inFlight.length,
    failures: failures.length,
    weight: Math.max(-2, Math.min(5, raw)),
    entries: matches,
  };
}
const EVIDENCE_PER_INSTANCE = 9.5;

function confidenceFor(item, log) {
  const ev = evidenceFor(log, item.pattern);
  const value = Math.max(35, Math.min(90, Math.round(item.base + EVIDENCE_PER_INSTANCE * ev.weight)));
  return { value, ev };
}
function scoreFor(item, log, weights) {
  const { value: conf, ev } = confidenceFor(item, log);
  const total = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const s = (weights.rev * item.f.rev + weights.prof * item.f.prof + weights.strat * item.f.strat
    + weights.ease * item.f.ease + weights.speed * item.f.speed + weights.conf * conf) / total;
  return { score: Math.round(s * 10) / 10, conf, ev };
}
function rankedItems(log, weights) {
  return PRIORITY_ITEMS
    .map((i) => ({ ...i, ...scoreFor(i, log, weights) }))
    .sort((a, b) => b.score - a.score)
    .map((r, ix) => ({ ...r, rank: ix + 1 }));
}

/* FR8.3 — aggregated pattern insight, recomputed as entries land */
function tally(log, keyFn, labelFn) {
  const by = {};
  log.forEach((l) => {
    const k = keyFn(l);
    if (!by[k]) by[k] = { key: k, label: labelFn(k), n: 0, wins: 0, losses: 0, inFlight: 0, queued: 0, roiSum: 0, roiN: 0 };
    const b = by[k];
    b.n += 1;
    if (l.outcome === 'succeeded') { b.wins += 1; b.roiSum += l.roi || 0; b.roiN += 1; }
    else if (l.outcome === 'failed') b.losses += 1;
    else if (l.outcome === 'in_flight') b.inFlight += 1;
    else b.queued += 1;
  });
  return Object.values(by).map((b) => ({
    ...b,
    successRate: b.wins + b.losses > 0 ? Math.round(b.wins / (b.wins + b.losses) * 100) : null,
    avgRoi: b.roiN ? Math.round(b.roiSum / b.roiN * 10) / 10 : null,
  })).sort((a, b) => b.n - a.n);
}
function patternStats(log) {
  return tally(log, (l) => l.pattern, (k) => PATTERNS[k] || k).map((b) => ({ ...b, pattern: b.key, family: FAMILIES[b.key] }));
}
function typeStats(log) {
  return tally(log, (l) => l.type, (k) => INTERVENTION_TYPES[k] || k).map((b) => ({ ...b, type: b.key }));
}
function logHeadline(log) {
  const completed = log.filter((l) => l.outcome === 'succeeded' || l.outcome === 'failed');
  const wins = completed.filter((l) => l.outcome === 'succeeded');
  const rate = completed.length ? Math.round(wins.length / completed.length * 100) : 0;
  const avgRoi = wins.length ? Math.round(wins.reduce((a, l) => a + (l.roi || 0), 0) / wins.length * 10) / 10 : 0;
  return { total: log.length, completed: completed.length, wins: wins.length, rate, avgRoi, inFlight: log.length - completed.length };
}

/* FR4.1 / FR4.2 — interpolate the elasticity lookup for an option */
function interp(optId, alloc) {
  const rows = ELASTICITY[optId];
  const s = Math.max(0, Math.min(ALLOC_MAX, alloc));
  const lo = Math.floor(s);
  const hi = Math.min(ALLOC_MAX, lo + 1);
  const a = rows[lo]; const b = rows[hi];
  const t = hi === lo ? 0 : s - lo;
  const mix = (x, y) => x + (y - x) * t;
  const roiA = a.roi === null ? b.roi : a.roi;
  const pbA = a.payback === null ? b.payback : a.payback;
  return {
    rev: mix(a.rev, b.rev), gp: mix(a.gp, b.gp), roi: mix(roiA, b.roi),
    conf: mix(a.conf, b.conf), payback: mix(pbA, b.payback),
  };
}
function simulate(optId, alloc, scenario) {
  const o = SIM_BY_ID[optId];
  const base = interp(optId, alloc);
  const sc = scenario ? SCENARIOS[scenario] : null;
  const rev = base.rev * (sc ? sc.effect.rev : 1);
  const gp = base.gp * (sc ? sc.effect.gp : 1);
  const conf = Math.max(30, Math.min(92, Math.round(base.conf + (sc ? sc.effect.conf : 0))));
  const payback = alloc <= 0.01 ? null : Math.round(base.payback * (sc ? (1 / sc.effect.gp) : 1) * 10) / 10;
  return {
    rev: Math.round(rev * 10) / 10,
    gp: Math.round(gp * 100) / 100,
    roi: Math.round(base.roi * (sc ? sc.effect.rev : 1) * 10) / 10,
    conf,
    payback,
    equityRisk: alloc > o.apk + 3,
    diminishing: alloc > o.apk,
  };
}
const curveFor = (optId) => ELASTICITY[optId].map((e) => ({ alloc: e.alloc, rev: e.rev, gp: e.gp }));
// the options table is read at the detent and sorted by revenue impact, descending
function optionTable(scenario) {
  return SIM_OPTIONS
    .map((o) => ({ ...o, at: simulate(o.id, ALLOC_DETENT, scenario) }))
    .sort((a, b) => b.at.rev - a.at.rev)
    .map((o, i) => ({ ...o, recommended: i === 0 }));
}
const RECOMMENDED_OPTION = optionTable(null)[0].id;

/* FR7.1 — portfolio roll-up across all 96 cells */
function portfolioRoll(cells, interventions) {
  const shifted = {};
  interventions.filter((i) => i.type === 'budget_shift').forEach((i) => {
    shifted[i.cellId] = (shifted[i.cellId] || 0) + (i.impact / 1e6) * 0.4;
  });
  const sumBy = (arr, f) => arr.reduce((a, c) => a + f(c), 0);
  const revenue = sumBy(cells, (c) => c.revenue);
  const target = sumBy(cells, (c) => c.target);
  const spend = sumBy(cells, (c) => c.mediaSpend);
  const weightedRoi = sumBy(cells, (c) => c.roi * c.mediaSpend) / spend;
  const extra = Object.values(shifted).reduce((a, b) => a + b, 0);
  const group = (sub) => {
    const sp = sumBy(sub, (c) => c.mediaSpend);
    return {
      revenue: Math.round(sumBy(sub, (c) => c.revenue)),
      spend: Math.round(sp * 10) / 10,
      roi: Math.round(sumBy(sub, (c) => c.roi * c.mediaSpend) / sp * 100) / 100,
      index: Math.round(sumBy(sub, (c) => c.revenue) / sumBy(sub, (c) => c.target) * 100),
    };
  };
  const byMarket = MARKETS.map((m) => ({ market: m, ...group(cells.filter((c) => c.market === m)) }));
  const byBrand = BRANDS.map((b) => ({
    brand: b, short: BRAND_SHORT[b] || b, ...group(cells.filter((c) => c.brand === b)),
  })).sort((a, b) => b.roi - a.roi);
  return {
    revenue: Math.round(revenue), target: Math.round(target),
    bestRoi: Math.max(...cells.map((c) => c.roi)),
    worstRoi: Math.min(...cells.map((c) => c.roi)),
    index: Math.round(revenue / target * 100),
    spend: Math.round(spend * 10) / 10,
    roi: Math.round(weightedRoi * 100) / 100,
    uplift: Math.round(extra * 10) / 10,
    byMarket, byBrand,
  };
}

/* FR7.2 / FR7.3 — portfolio rebalance, recomputed from weights + session state.
   Money moves out of cells below the portfolio average and into cells clearly above it. */
const SOURCE_ROI = 1.75;
const DEST_ROI = 2.2;
function rebalance(cells, weights, log, interventions) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const effTilt = (weights.prof + weights.conf) / total;   // profit-and-confidence led
  const growthTilt = (weights.rev + weights.speed) / total; // revenue-and-speed led
  const acted = new Set(interventions.map((i) => i.cellId));

  const sources = cells
    .filter((c) => c.roi < SOURCE_ROI && c.mediaSpend > 0.4)
    .map((c) => ({
      cell: c,
      amount: c.mediaSpend * (0.14 + (SOURCE_ROI - c.roi) * 0.2 * (1 + effTilt)),
      reason: c.promo.actual > c.promo.plan + 5
        ? `Promo depth ${c.promo.actual}% vs ${c.promo.plan}% plan, ROI ${c.roi.toFixed(1)}x`
        : `ROI ${c.roi.toFixed(1)}x, below the ${PORTFOLIO_AVG_ROI.toFixed(1)}x portfolio average`,
    }))
    .sort((a, b) => b.amount - a.amount);

  const destinations = cells
    .filter((c) => c.roi > DEST_ROI)
    .map((c) => {
      const patternBoost = acted.has(c.id) ? 1.18 : 1;
      return {
        cell: c,
        pull: c.roi * (1 + growthTilt) * (c.index >= 105 ? 1.25 : 1) * patternBoost,
        reason: `ROI ${c.roi.toFixed(1)}x, index ${c.index}${acted.has(c.id) ? ' · already backed this session' : ''}`,
      };
    })
    .sort((a, b) => b.pull - a.pull);

  const rawOut = sources.reduce((a, s) => a + s.amount, 0);
  const targetPool = 18.0 * (0.9 + growthTilt * 0.2);
  const k = rawOut > 0 ? Math.min(1, targetPool / rawOut) : 0;
  const out = sources.map((s) => ({ ...s, amount: Math.round(s.amount * k * 10) / 10 })).filter((s) => s.amount >= 0.1);
  const pool = Math.round(out.reduce((a, s) => a + s.amount, 0) * 10) / 10;

  const pullSum = destinations.reduce((a, d) => a + d.pull, 0) || 1;
  const into = destinations.map((d) => ({ ...d, amount: Math.round(d.pull / pullSum * pool * 10) / 10 })).filter((d) => d.amount >= 0.1);

  const gain = into.reduce((a, d) => a + d.amount * d.cell.roi, 0) - out.reduce((a, s) => a + s.amount * s.cell.roi, 0);
  const marginGain = into.reduce((a, d) => a + d.amount * d.cell.roi * (d.cell.margin / 100), 0)
    - out.reduce((a, s) => a + s.amount * s.cell.roi * (s.cell.margin / 100), 0);

  return {
    pool,
    out: out.slice(0, 7),
    into: into.slice(0, 7),
    outCount: out.length,
    intoCount: into.length,
    gain: Math.round(gain * 10) / 10,
    marginGain: Math.round(marginGain * 10) / 10,
    roiAfter: Math.round((portfolioRoll(cells, interventions).roi + gain / 100) * 100) / 100,
  };
}

/* FR7.4 — agency utilisation */
function agencyLoad(cells, interventions) {
  return Object.keys(AGENCY_CAPACITY).map((a) => {
    const sub = cells.filter((c) => c.agency === a);
    const assigned = sub.reduce((x, c) => x + c.mediaSpend, 0)
      + interventions.filter((i) => i.agency === a).reduce((x, i) => x + i.impact / 1e6 * 0.25, 0);
    const util = Math.round(assigned / AGENCY_CAPACITY[a] * 100);
    return { agency: a, assigned: Math.round(assigned * 10) / 10, capacity: AGENCY_CAPACITY[a], util, cells: sub.length };
  }).sort((a, b) => b.util - a.util);
}

/* ============================================================================
   UI PRIMITIVES
   ========================================================================== */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const h = (e) => setReduced(e.matches);
    if (mq.addEventListener) { mq.addEventListener('change', h); return () => mq.removeEventListener('change', h); }
    mq.addListener(h); return () => mq.removeListener(h);
  }, []);
  return reduced;
}

function SignalGlyph({ type, size = 9, filled = true }) {
  const m = SIGNAL_META[type];
  if (!m || m.glyph === 'none') return null;
  const c = m.color;
  if (m.glyph === 'triangle') {
    return <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true"><polygon points="5,1 9.5,9 0.5,9" fill={c} /></svg>;
  }
  if (m.glyph === 'square') {
    return <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true"><rect x="1" y="1" width="8" height="8" fill={c} /></svg>;
  }
  if (m.glyph === 'copy') {
    // two overlapping squares — the copy glyph
    return (
      <svg width={size + 1} height={size + 1} viewBox="0 0 12 12" aria-hidden="true">
        <rect x="0.8" y="0.8" width="7" height="7" fill="none" stroke={c} strokeWidth="1.5" />
        <rect x="4.2" y="4.2" width="7" height="7" fill={c} fillOpacity="0.9" stroke={c} strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg width={size + 1} height={size + 1} viewBox="0 0 10 10" aria-hidden="true">
      <polygon points="5,0.8 9.2,5 5,9.2 0.8,5" fill={filled ? 'none' : c} stroke={c} strokeWidth="1.8" />
    </svg>
  );
}

function SignalTag({ type, children, small }) {
  const m = SIGNAL_META[type];
  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: 5, fontFamily: FU, fontSize: small ? 10.5 : 11.5, fontWeight: 600, color: m.color,
        background: m.wash, padding: small ? '2px 6px' : '3px 8px',
        ...signalBorder(type),
      }}
    >
      <SignalGlyph type={type} size={small ? 8 : 9} />
      {children || m.label}
    </span>
  );
}

function Panel({ title, note, children, span = 1, rowSpan = 1, accent, dense, action, id }) {
  return (
    <section
      id={id}
      className="flex flex-col"
      style={{
        background: T.panel,
        border: `1px solid ${T.rule}`,
        borderTop: accent ? `2px solid ${accent}` : `1px solid ${T.rule}`,
        gridColumn: `span ${span}`,
        gridRow: `span ${rowSpan}`,
        minWidth: 0,
      }}
    >
      {(title || action) && (
        <header className="flex items-start justify-between" style={{ padding: dense ? '9px 12px 7px' : '12px 14px 9px', borderBottom: `1px solid ${T.ruleSoft}`, gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            {title && <h3 style={{ fontFamily: FU, fontSize: 13, fontWeight: 600, color: T.ink, letterSpacing: '-0.01em' }}>{title}</h3>}
            {note && <p style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60, marginTop: 2, lineHeight: 1.45 }}>{note}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="flex-1" style={{ padding: dense ? '10px 12px 12px' : '12px 14px 14px', minWidth: 0 }}>{children}</div>
    </section>
  );
}

function Hint({ text, children }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center" style={{ gap: 4 }}>
      {children}
      <button
        type="button"
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        aria-label="What this means"
        className="inline-flex items-center justify-center focus:outline-none focus:ring-2"
        style={{ width: 15, height: 15, borderRadius: 8, border: `1px solid ${T.rule}`, color: T.ink40, background: '#fff' }}
      >
        <Info size={9} />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute z-40"
          style={{
            bottom: '130%', left: 0, width: 250, background: T.navy, color: '#fff',
            fontFamily: FU, fontSize: 11.5, lineHeight: 1.5, padding: '8px 10px',
            boxShadow: '0 6px 18px rgba(25,25,26,0.25)',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

function Btn({ children, onClick, tone = 'default', size = 'md', disabled, icon: Icon, full }) {
  const tones = {
    default: { bg: '#FFFFFF', fg: T.ink, bd: T.rule },
    primary: { bg: T.teal, fg: '#FFFFFF', bd: T.teal },
    navy: { bg: T.navy, fg: '#FFFFFF', bd: T.navy },
    quiet: { bg: 'transparent', fg: T.ink60, bd: 'transparent' },
    danger: { bg: '#FFFFFF', fg: T.risk, bd: '#E8C3CE' },
  };
  const t = tones[tone] || tones.default;
  const pad = size === 'sm' ? '4px 9px' : size === 'lg' ? '10px 16px' : '6px 12px';
  const fz = size === 'sm' ? 11.5 : size === 'lg' ? 14 : 12.5;
  return (
    <button
      type="button" onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 ${full ? 'w-full' : ''}`}
      style={{
        gap: 6, fontFamily: FU, fontSize: fz, fontWeight: 600, padding: pad,
        background: t.bg, color: disabled ? T.ink40 : t.fg, border: `1px solid ${disabled ? T.ruleSoft : t.bd}`,
        cursor: disabled ? 'not-allowed' : 'pointer', letterSpacing: '-0.005em',
      }}
    >
      {Icon && <Icon size={fz === 11.5 ? 11 : 13} />}
      {children}
    </button>
  );
}

function Readout({ label, value, sub, size = 'md', tone, flash }) {
  const sizes = { sm: 17, md: 23, lg: 34, xl: 44 };
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginBottom: 2 }}>{label}</div>
      <div
        style={{
          ...NUM, fontFamily: FU, fontSize: sizes[size], fontWeight: 600, lineHeight: 1.05,
          color: tone || T.ink, letterSpacing: '-0.025em',
          transition: flash ? 'color 240ms ease' : undefined,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginTop: 3, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

function MiniBar({ value, max, color, height = 6, track = '#EEEAE6' }) {
  return (
    <div style={{ background: track, height, width: '100%' }}>
      <div style={{ width: `${Math.max(0, Math.min(100, value / max * 100))}%`, height: '100%', background: color, transition: 'width 320ms cubic-bezier(.2,.7,.3,1)' }} />
    </div>
  );
}

function Slider({ value, min, max, step, onChange, label, suffix, marks, ariaLabel, display }) {
  return (
    <div>
      {label && (
        <div className="flex items-baseline justify-between" style={{ marginBottom: 5 }}>
          <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60 }}>{label}</span>
          <span style={{ ...NUM, fontFamily: FU, fontSize: 12.5, fontWeight: 600, color: T.ink }}>{display !== undefined ? display : `${value}${suffix || ''}`}</span>
        </div>
      )}
      <input
        type="range" min={min} max={max} step={step} value={value}
        aria-label={ariaLabel || label}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full focus:outline-none focus:ring-2"
        style={{ accentColor: T.teal, height: 18, cursor: 'pointer' }}
      />
      {marks && (
        <div className="flex justify-between" style={{ fontFamily: FU, fontSize: 10, color: T.ink40, ...NUM }}>
          {marks.map((m) => <span key={m}>{m}</span>)}
        </div>
      )}
    </div>
  );
}

function Question({ children, sub }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{ fontFamily: FS, fontSize: 25, color: T.ink, letterSpacing: '-0.015em', lineHeight: 1.15 }}>{children}</h2>
      {sub && <p style={{ fontFamily: FU, fontSize: 12.5, color: T.ink60, marginTop: 5, maxWidth: 680, lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

function Row({ children, onClick, active, tone }) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={onClick ? 'focus:outline-none focus:ring-2' : ''}
      style={{
        borderBottom: `1px solid ${T.ruleSoft}`,
        borderLeft: active ? `3px solid ${tone || T.teal}` : '3px solid transparent',
        background: active ? '#F7F5F3' : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        padding: '9px 10px',
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================================
   STAGE DEFINITIONS
   Every question passes the "what should I do next" test — none asks what happened.
   ========================================================================== */
const STAGES = [
  { n: 1, key: 'sense', name: 'Sense', q: 'Where should we focus next?', next: 'Diagnose why' },
  { n: 2, key: 'diagnose', name: 'Diagnose', q: 'Why is L’OR France underperforming Germany?', next: 'Prioritise what matters' },
  { n: 3, key: 'prioritise', name: 'Prioritise', q: 'Which opportunities do we fund, and in what order?', next: 'Simulate the decision' },
  { n: 4, key: 'simulate', name: 'Simulate', q: 'How should we allocate the next $10M of growth investment?', next: 'Turn it into action' },
  { n: 5, key: 'orchestrate', name: 'Orchestrate', q: 'How do we turn decisions into action?', next: 'Scale what works' },
  { n: 6, key: 'replicate', name: 'Replicate', q: 'How do we scale what works?', next: 'Optimise the portfolio' },
  { n: 7, key: 'optimise', name: 'Optimise', q: 'How do we keep improving?', next: 'See what we learned' },
  { n: 8, key: 'learn', name: 'Learn', q: 'How does the enterprise get smarter?', next: 'Back to Prioritise — watch confidence move' },
];

const PORTFOLIO_CONTEXT = '12 of 60 brands | 8 of 100 markets | 96 brand-market cells';

/* ============================================================================
   TOP CHROME
   ========================================================================== */
function FiltersPopover() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return undefined;
    const h = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open]);
  return (
    <span className="relative inline-flex">
      <button
        type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="dialog"
        className="inline-flex items-center focus:outline-none focus:ring-2"
        style={{ gap: 5, fontFamily: FU, fontSize: 10.5, color: T.onBrand, background: 'transparent', border: 'none', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 }}
      >
        <Filter size={11} /> Filters: category, market, agency
      </button>
      {open && (
        <div
          role="dialog" aria-label="About the filtered slice"
          className="absolute z-50"
          style={{ top: '135%', right: 0, width: 330, background: '#fff', color: T.ink, border: `1px solid ${T.rule}`, borderTop: `3px solid ${T.accent}`, boxShadow: '0 8px 24px rgba(36,24,18,0.22)', padding: '11px 13px' }}
        >
          <div className="flex items-start justify-between" style={{ gap: 8 }}>
            <div style={{ fontFamily: FU, fontSize: 12.5, fontWeight: 700 }}>You are looking at a slice, not the whole business</div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="focus:outline-none focus:ring-2" style={{ color: T.ink60 }}><X size={13} /></button>
          </div>
          <p style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, marginTop: 5, lineHeight: 1.5 }}>
            This demonstration shows 12 of the Coffee Operating Unit’s 60 brands across 8 of its 100 markets. In the full
            tower, filters by category, market and agency drill deeper into the rest of the portfolio.
          </p>
          {[['Category', CATEGORIES], ['Market', MARKETS], ['Agency', Object.keys(AGENCY_CAPACITY)]].map(([k, vals]) => (
            <div key={k} style={{ marginTop: 7 }}>
              <div style={{ fontFamily: FU, fontSize: 10, color: T.ink40 }}>{k} in this slice</div>
              <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, lineHeight: 1.45 }}>{vals.join(' · ')}</div>
            </div>
          ))}
        </div>
      )}
    </span>
  );
}

function TopChrome({ stage, selectedCell, onPickHero, onReset, onOpenCoverage, onAsk }) {
  const a = getCell("L'OR", 'France');
  const b = getCell("L'OR", 'Germany');
  const isA = selectedCell && selectedCell.id === a.id;
  const isB = selectedCell && selectedCell.id === b.id;
  return (
    <header style={{ background: T.brand, color: '#fff', borderBottom: `1px solid ${T.brandLift}` }}>
      <div className="flex items-center justify-between flex-wrap" style={{ padding: '9px 16px', gap: 12 }}>
        <div className="flex items-center" style={{ gap: 14, minWidth: 0 }}>
          <BrandMark height={26} light />
          <span style={{ width: 1, height: 22, background: T.onBrandDim }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FU, fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>Assisted Decisioning System</div>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.onBrand }}>
              KDP · Coffee Operating Unit Marketing
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap" style={{ gap: 10 }}>
          <span className="inline-flex items-center flex-wrap" style={{ gap: 8 }}>
            <span style={{ fontFamily: FU, fontSize: 10.5, color: T.onBrand, ...NUM }}>{PORTFOLIO_CONTEXT}</span>
            <FiltersPopover />
          </span>
          <span
            className="inline-flex items-center"
            style={{
              gap: 5, fontFamily: FU, fontSize: 10, fontWeight: 700, color: '#FFE2A8',
              border: '1px dashed #C9A34E', padding: '3px 8px', letterSpacing: '0.04em',
            }}
            title="Every figure in this tool is fabricated for demonstration. Nothing here is KDP reporting."
          >
            <AlertCircle size={11} /> SYNTHETIC DATA
          </span>
          <button
            type="button" onClick={onAsk}
            className="inline-flex items-center focus:outline-none focus:ring-2"
            aria-label="Ask the GCT"
            style={{ gap: 7, fontFamily: FU, fontSize: 11.5, color: T.onBrand, background: T.brandDeep, border: `1px solid ${T.onBrandDim}`, padding: '4px 10px', minWidth: 150 }}
          >
            <Sparkles size={12} color={T.accentLite} /> Ask the GCT…
          </button>
          <Btn size="sm" tone="quiet" icon={FileText} onClick={onOpenCoverage}>
            <span style={{ color: T.onBrand }}>Coverage</span>
          </Btn>
          <Btn size="sm" tone="quiet" icon={RotateCcw} onClick={onReset}>
            <span style={{ color: T.onBrand }}>Reset session</span>
          </Btn>
        </div>
      </div>

      {/* hero-case breadcrumb + stage progress */}
      <div className="flex items-center justify-between flex-wrap" style={{ padding: '6px 16px', background: T.brandLift, gap: 10 }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <span style={{ fontFamily: FU, fontSize: 10.5, color: T.onBrandMute }}>Following</span>
          {[{ c: a, tag: 'A', on: isA, type: 'risk' }, { c: b, tag: 'B', on: isB, type: 'growth' }].map(({ c, tag, on, type }) => (
            <button
              key={c.id} type="button" onClick={() => onPickHero(c)}
              className="inline-flex items-center focus:outline-none focus:ring-2"
              style={{
                gap: 6, fontFamily: FU, fontSize: 11.5, fontWeight: on ? 700 : 500,
                color: on ? '#fff' : T.onBrand, padding: '3px 9px',
                background: on ? SIGNAL_META[type].color : 'transparent',
                border: `1px solid ${on ? SIGNAL_META[type].color : T.onBrandDim}`,
              }}
            >
              <span style={{ ...NUM, fontSize: 9.5, opacity: 0.85 }}>{tag}</span>
              {c.brand} · {c.market}
              <span style={{ ...NUM, opacity: 0.9 }}>{c.index}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center" style={{ gap: 6 }}>
          <span style={{ fontFamily: FU, fontSize: 10.5, color: T.onBrandMute, ...NUM }}>
            Stage {stage} of 8
          </span>
          <div className="flex" style={{ gap: 2 }}>
            {STAGES.map((s) => (
              <span key={s.n} style={{ width: 16, height: 3, background: s.n <= stage ? T.accentLite : T.brandDeep }} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function StageRail({ stage, onGo, flags }) {
  return (
    <nav
      className="shrink-0"
      style={{ width: 146, background: T.brand, borderRight: `1px solid ${T.brandLift}` }}
      aria-label="Stages"
    >
      <ul style={{ padding: '10px 0' }}>
        {STAGES.map((s) => {
          const on = s.n === stage;
          const done = s.n < stage;
          return (
            <li key={s.key}>
              <button
                type="button" onClick={() => onGo(s.n)}
                className="w-full text-left focus:outline-none focus:ring-2"
                style={{
                  display: 'flex', gap: 9, alignItems: 'baseline',
                  padding: '8px 12px',
                  background: on ? T.brandDeep : 'transparent',
                  borderLeft: on ? `3px solid ${T.accentLite}` : '3px solid transparent',
                }}
              >
                <span style={{ ...NUM, fontFamily: FU, fontSize: 10.5, color: on ? T.accentLite : done ? T.onBrandMute : T.onBrandDim, fontWeight: 600, width: 9 }}>{s.n}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: FU, fontSize: 12.5, fontWeight: on ? 700 : 500, color: on ? '#fff' : T.onBrand, letterSpacing: '-0.01em' }}>
                    {s.name}
                  </span>
                  {on && <span style={{ display: 'block', fontFamily: FU, fontSize: 10, color: T.onBrandMute, marginTop: 1, lineHeight: 1.35 }}>{s.q}</span>}
                </span>
                {flags[s.key] > 0 && (
                  <span style={{ ...NUM, marginLeft: 'auto', fontFamily: FU, fontSize: 9.5, fontWeight: 700, color: T.brandDeep, background: T.accentLite, padding: '1px 5px' }}>
                    {flags[s.key]}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <div style={{ padding: '8px 12px 12px', borderTop: `1px solid ${T.brandLift}`, marginTop: 4 }}>
        <div style={{ fontFamily: FU, fontSize: 9.5, color: T.onBrandMute, lineHeight: 1.5 }}>
          One continuous story. Every stage reads the same 96-cell dataset.
        </div>
      </div>
    </nav>
  );
}

/* ============================================================================
   INTRO OVERLAY (unaccompanied review) — three lines, dismissible
   ========================================================================== */
function Intro({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(36,24,18,0.72)', padding: 20 }}>
      <div style={{ background: '#fff', maxWidth: 540, border: `1px solid ${T.rule}`, borderTop: `3px solid ${T.brand}` }}>
        <div style={{ padding: '20px 22px 8px' }}>
          <BrandMark height={30} />
          <h2 style={{ fontFamily: FS, fontSize: 24, color: T.ink, marginTop: 14, lineHeight: 1.18, letterSpacing: '-0.015em' }}>
            A control tower for the Coffee Operating Unit.
          </h2>
          <ol style={{ marginTop: 14 }}>
            {[
              '12 of 60 coffee brands across 8 markets, with the next decision on every screen.',
              'L’OR France is missing plan; L’OR Germany has the playbook that fixes it.',
              'What you decide here changes what the tower recommends next — by stage 8 you will see it.',
            ].map((l, i) => (
              <li key={i} className="flex" style={{ gap: 10, marginBottom: 9 }}>
                <span style={{ ...NUM, fontFamily: FU, fontSize: 11, fontWeight: 700, color: T.accent, paddingTop: 2 }}>{i + 1}</span>
                <span style={{ fontFamily: FU, fontSize: 13, color: T.ink, lineHeight: 1.5 }}>{l}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex items-center justify-between" style={{ padding: '12px 22px 18px', gap: 10 }}>
          <span style={{ fontFamily: FU, fontSize: 11, color: T.ink60 }}>Takes 12–15 minutes end to end. Synthetic data throughout.</span>
          <Btn tone="navy" size="lg" onClick={onDismiss} icon={Crosshair}>Start at Sense</Btn>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   REQUIREMENT COVERAGE DRAWER
   ========================================================================== */
const COVERAGE = [
  ['FR1.1', 'Portfolio performance grid, 12 brands × 8 markets against target', 1, 'Sense · portfolio lattice'],
  ['FR1.2', 'Rule-based thresholds auto-flagging over- and under-performance', 1, 'Sense · lattice legend'],
  ['FR1.3', 'Four signal classes surfaced and counted', 1, 'Sense · signal queue'],
  ['FR1.4', 'Market-intelligence overlay: competitor, share, category trend', 1, 'Sense · overlay toggle'],
  ['FR1.5', 'Watch List distinguished from confirmed Underperformance Risk', 1, 'Sense · legend and queue'],
  ['FR2.1', 'Templated root-cause breakdown with contribution weights', 2, 'Diagnose · root cause'],
  ['FR2.2', 'Growth-driver contribution view for outperformers', 2, 'Diagnose · driver contribution'],
  ['FR2.3', 'Market-versus-market comparison', 2, 'Diagnose · Similar Markets Benchmark'],
  ['FR2.4', 'Investment effectiveness: over-funded, under-funded, leaking', 2, 'Diagnose · investment read'],
  ['FR3.1', 'Ranked opportunities on six scored factors with adjustable weights', 3, 'Prioritise · ranked list'],
  ['FR3.2', 'Four-way stance and a recommended action on every row', 3, 'Prioritise · verdict and action columns'],
  ['FR3.3', 'Investment prioritisation for incremental funding', 3, 'Prioritise · funding view'],
  ['FR3.4', 'Resource prioritisation for talent, agency and AI', 3, 'Prioritise · resource view'],
  ['FR4.1', 'Budget-allocation control, $0–$20M with a $10M detent', 4, 'Simulate · allocation control'],
  ['FR4.2', 'Live projected outcome from the elasticity table', 4, 'Simulate · projection readout'],
  ['FR4.3', 'Templated scenarios: premiumisation, agency dependency', 4, 'Simulate · scenario toggles'],
  ['FR4.4', 'Innovation timing and cannibalisation with stated assumptions', 4, 'Simulate · launch timing'],
  ['FR5.1', 'One-click conversion of a recommendation into a typed intervention', 5, 'Orchestrate · create record'],
  ['FR5.2', 'Running intervention log held for the whole session', 5, 'Orchestrate · intervention log'],
  ['FR5.3', 'Escalation versus auto-resolve against an adjustable threshold', 5, 'Orchestrate · threshold control'],
  ['FR5.4', 'Coordination context: brand, market, function, agency', 5, 'Orchestrate · record detail'],
  ['FR6.1', 'Ranked replication candidates with similarity attributes', 6, 'Replicate · candidate list'],
  ['FR6.2', 'Estimated impact per candidate', 6, 'Replicate · impact column'],
  ['FR6.3', 'Existing capability versus required adaptation', 6, 'Replicate · capability split'],
  ['FR7.1', 'Portfolio-wide ROI and effectiveness roll-up across all 96 cells', 7, 'Optimise · portfolio roll-up'],
  ['FR7.2', 'Multi-brand rebalancing recommendation', 7, 'Optimise · rebalance'],
  ['FR7.3', 'Live recalculation as spend, performance or weights change', 7, 'Optimise · recalculation note'],
  ['FR7.4', 'Resource optimisation alongside budget', 7, 'Optimise · agency utilisation'],
  ['FR8.1', 'Every simulated and orchestrated decision auto-logged', 8, 'Learn · outcomes log'],
  ['FR8.2', 'Search and “initiatives like this one” filter', 8, 'Learn · search and similarity filter'],
  ['FR8.3', 'Aggregated pattern insight recomputing as entries land', 8, 'Learn · pattern insight'],
  ['FR8.4', 'Flywheel view linking each node to the record it came from', 8, 'Learn · flywheel'],
];

const CLIENT_FEEDBACK = [
  ['CF-1', 'Sense asks “Where should we focus next?”', 1, 'Sense · stage question'],
  ['CF-2', 'Priority Growth Opportunities: ranked, three rows, dollar figure largest', 1, 'Sense · Priority Growth Opportunities'],
  ['CF-3', 'Growth Control Tower Recommendations with one-click routes, above the fold', 1, 'Sense · recommendations panel'],
  ['CF-4', 'Proven Playbooks Available, each opening Replicate for that playbook', 1, 'Sense · playbooks panel'],
  ['CF-5', 'Key Driver read on the lattice with a “Diagnose why” bridge', 1, 'Sense · Key Driver panel'],
  ['CF-6', 'Four signal classes in the legend and queue filters', 1, 'Sense · legend and queue'],
  ['CF-7', 'Portfolio context string and the filters affordance', 1, 'Top chrome · context and filters popover'],
  ['CF-8', 'Diagnose asks “Why is L’OR France underperforming Germany?”', 2, 'Diagnose · stage question'],
  ['CF-9', 'Six marketing-specific root-cause drivers, weights sum to 100', 2, 'Diagnose · root cause'],
  ['CF-10', 'AI Root Cause Assessment, labelled as rule-weighted lookup', 2, 'Diagnose · assessment block'],
  ['CF-11', 'What changed vs last quarter, coloured by help or harm', 2, 'Diagnose · trend panel'],
  ['CF-12', 'Recommended Actions, each routed to the stage that executes it', 2, 'Diagnose · recommended actions'],
  ['CF-13', 'Replicate Winning Practice callout with a replicate button', 2, 'Diagnose · playbook callout'],
  ['CF-14', 'Similar Markets Benchmark with a Key Learning block', 2, 'Diagnose · benchmark'],
  ['CF-15', 'Conclusive Growth Control Tower Recommendation', 2, 'Diagnose · recommendation'],
  ['CF-16', 'Explicit Recommended Action column on the ranked list', 3, 'Prioritise · ranked list'],
  ['CF-17', 'Ten priority items retargeted to coffee; the hero row starts at 62%', 3, 'Prioritise · ranked list'],
  ['CF-18', 'Simulate asks how to allocate the next $10M', 4, 'Simulate · stage question'],
  ['CF-19', 'Four options compared side by side, driving the detail view', 4, 'Simulate · options table'],
  ['CF-20', 'Elasticity re-anchored: $0–$20M, detent $10M, curve bends', 4, 'Simulate · allocation control'],
  ['CF-21', 'Execution Confidence and Risk Factors', 4, 'Simulate · confidence and risks'],
  ['CF-22', 'Explicit Growth Control Tower Recommendation block', 4, 'Simulate · recommendation'],
  ['CF-23', 'Recommended Reallocation with a computed net impact', 4, 'Simulate · reallocation'],
  ['CF-24', 'Similar Investments — enterprise learning', 4, 'Simulate · similar investments'],
  ['CF-25', 'KDP-specific examples throughout', 4, 'Simulate · all panels'],
  ['CF-26', 'Ask the GCT panel with four questions, answered from live state', 5, 'Orchestrate · Ask the GCT'],
  ['CF-27', 'Ask the GCT entry point on every screen', 5, 'Top chrome · Ask the GCT'],
  ['CF-28', 'Orchestration kept intact; threshold reads “Coffee OU review”', 5, 'Orchestrate · threshold control'],
  ['CF-29', 'Winning Playbooks panel, selectable, re-ranking the candidates', 6, 'Replicate · Winning Playbooks'],
  ['CF-30', 'Replication candidates retargeted to the Germany playbook', 6, 'Replicate · candidate list'],
  ['CF-31', 'Recommended Interventions that create Orchestrate records', 7, 'Optimise · recommended interventions'],
  ['CF-32', 'Flywheel relabelled Capture → Codify → Replicate', 8, 'Learn · flywheel'],
  ['CF-33', 'Seeded outcomes log re-skinned to coffee', 8, 'Learn · outcomes log'],
  ['CF-34', 'Intro rewritten to lead with decisions', 1, 'Intro overlay'],
  ['CF-35', 'Every stage question audited against “what should I do next”', 1, 'Stage rail and footer'],
];

function CoverageDrawer({ open, onClose, onGo }) {
  if (!open) return null;
  const table = (rows) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {rows.map(([id, desc, st, where]) => (
          <tr
            key={id}
            onClick={() => { onGo(st); onClose(); }}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') { onGo(st); onClose(); } }}
            className="focus:outline-none focus:ring-2"
            style={{ borderBottom: `1px solid ${T.ruleSoft}`, cursor: 'pointer' }}
          >
            <td style={{ ...NUM, fontFamily: FU, fontSize: 11.5, fontWeight: 700, color: T.accent, padding: '8px 10px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{id}</td>
            <td style={{ fontFamily: FU, fontSize: 12, color: T.ink, padding: '8px 6px', lineHeight: 1.45 }}>
              {desc}
              <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginTop: 2 }}>{where}</div>
            </td>
            <td style={{ padding: '8px 12px 8px 4px', verticalAlign: 'top' }}>
              <span className="inline-flex items-center" style={{ gap: 4, fontFamily: FU, fontSize: 11, color: T.growth, fontWeight: 600 }}>
                <Check size={11} /> Built
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(36,24,18,0.5)' }}>
      <div style={{ background: '#fff', width: 580, maxWidth: '100%', height: '100%', overflowY: 'auto', borderLeft: `1px solid ${T.rule}` }}>
        <div className="flex items-start justify-between sticky top-0" style={{ padding: '14px 16px', background: '#fff', borderBottom: `1px solid ${T.rule}` }}>
          <div>
            <h2 style={{ fontFamily: FU, fontSize: 14, fontWeight: 700, color: T.ink }}>Requirement coverage</h2>
            <p style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60, marginTop: 2 }}>
              {COVERAGE.length} functional requirements and {CLIENT_FEEDBACK.length} client feedback items, each against the view that satisfies it. Click a row to open that view.
            </p>
          </div>
          <Btn size="sm" icon={X} onClick={onClose}>Close</Btn>
        </div>
        <h3 style={{ fontFamily: FU, fontSize: 12, fontWeight: 700, color: T.ink, padding: '12px 16px 4px' }}>Functional requirements</h3>
        {table(COVERAGE)}
        <h3 style={{ fontFamily: FU, fontSize: 12, fontWeight: 700, color: T.ink, padding: '16px 16px 4px' }}>Client feedback round — CF-1 to CF-35</h3>
        {table(CLIENT_FEEDBACK)}
        <div style={{ padding: '14px 16px', fontFamily: FU, fontSize: 11, color: T.ink60, lineHeight: 1.6 }}>
          Out of scope by design, and deliberately not stubbed: live platform integrations, production ML and causal
          inference, multi-user roles and approvals, a persistent knowledge graph, and governance controls. All logic
          here is rule-based or lookup-driven, and labelled as such wherever a number appears.
        </div>
      </div>
    </div>
  );
}

/* small shared pieces used by several views */
function ActionChip({ action, label, small }) {
  const tone = ACTION_TONE[action] || { color: T.ink60, wash: '#F4F1EE' };
  return (
    <span
      style={{
        fontFamily: FU, fontSize: small ? 10.5 : 11, fontWeight: 700, color: tone.color, background: tone.wash,
        border: `1px solid ${tone.color}33`, padding: small ? '1px 6px' : '2px 7px', display: 'inline-block', whiteSpace: 'nowrap',
      }}
    >
      {label || action}
    </span>
  );
}

function RouteLink({ children, onClick }) {
  return (
    <button
      type="button" onClick={onClick}
      className="inline-flex items-center focus:outline-none focus:ring-2"
      style={{ gap: 4, fontFamily: FU, fontSize: 11, fontWeight: 700, color: T.accent, background: 'transparent', border: `1px solid ${T.accent}55`, padding: '3px 8px', whiteSpace: 'nowrap' }}
    >
      {children} <ArrowRight size={11} />
    </button>
  );
}

/* ============================================================================
   STAGE 1 — SENSE
   ========================================================================== */
function PortfolioLattice({ selected, onSelect, onHover, overlay, catFilter }) {
  const brands = BRANDS.filter((b) => catFilter === 'All' || CATEGORY_BY_BRAND[b] === catFilter);
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', fontFamily: FU, fontSize: 10.5, color: T.ink60, fontWeight: 500, padding: '0 8px 5px 0', width: 104 }}>
              Brand
            </th>
            {MARKETS.map((m) => (
              <th key={m} title={m} style={{ fontFamily: FU, fontSize: 10, color: T.ink60, fontWeight: 600, padding: '0 2px 5px', textAlign: 'center', minWidth: 42 }}>
                {MARKET_SHORT[m]}
                {overlay && (
                  <div style={{ fontFamily: FU, fontSize: 8.5, color: T.accent, fontWeight: 500, marginTop: 1, lineHeight: 1.2 }}>
                    {MARKET_INTEL[m].shareShort}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {brands.map((b) => (
            <tr key={b}>
              <th
                scope="row" title={`${b} · ${CATEGORY_BY_BRAND[b]}`}
                style={{ textAlign: 'left', fontFamily: FU, fontSize: 11, fontWeight: 500, color: T.ink, padding: '0 6px 0 0', whiteSpace: 'nowrap', borderRight: `1px solid ${T.rule}` }}
              >
                {BRAND_SHORT[b] || b}
              </th>
              {MARKETS.map((m) => {
                const c = getCell(b, m);
                const cls = c.cls;
                const meta = SIGNAL_META[cls];
                const isSel = selected && selected.brand === b && selected.market === m;
                const hero = c.id === HERO_A.id ? 'A' : c.id === HERO_B.id ? 'B' : null;
                return (
                  <td key={m} style={{ padding: 1 }}>
                    <button
                      type="button"
                      onClick={() => onSelect(c)}
                      onMouseEnter={() => onHover(c)}
                      onMouseLeave={() => onHover(null)}
                      onFocus={() => onHover(c)}
                      onBlur={() => onHover(null)}
                      className="w-full relative focus:outline-none focus:ring-2"
                      aria-label={`${b} ${m}, index ${c.index}, ${meta.label}${c.playbookMatch ? ', playbook available' : ''}`}
                      style={{
                        display: 'block', height: 30, background: cls === 'ontrack' ? '#FBFBFC' : meta.wash,
                        ...signalBorder(cls),
                        outline: isSel ? `2px solid ${T.brand}` : 'none',
                        outlineOffset: isSel ? 1 : 0,
                        cursor: 'pointer', position: 'relative', textAlign: 'center',
                      }}
                    >
                      <span style={{ ...NUM, fontFamily: FU, fontSize: 12, fontWeight: cls === 'ontrack' ? 500 : 700, color: cls === 'ontrack' ? T.ink40 : meta.color }}>
                        {c.index}
                      </span>
                      <span style={{ position: 'absolute', top: 2, right: cls === 'replicate' ? 4 : 3 }}>
                        <SignalGlyph type={cls} size={7} />
                      </span>
                      {hero && (
                        <span
                          style={{
                            ...NUM, position: 'absolute', top: 1, left: cls === 'growth' ? 1 : 2,
                            fontFamily: FU, fontSize: 8, fontWeight: 700, color: '#fff', background: T.brand,
                            padding: '0 3px', lineHeight: 1.5,
                          }}
                        >
                          {hero}
                        </span>
                      )}
                      {c.playbookMatch && (
                        <span
                          title="A codified playbook matches this cell"
                          style={{
                            position: 'absolute', bottom: 1, left: cls === 'growth' ? 2 : 2, width: 9, height: 9, borderRadius: 5,
                            background: T.replicate, color: '#fff', fontFamily: FU, fontSize: 6.5, fontWeight: 800,
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                          }}
                        >
                          P
                        </span>
                      )}
                      {overlay && c.sharePts !== 0 && (
                        <span style={{ ...NUM, position: 'absolute', bottom: 1, right: 3, fontFamily: FU, fontSize: 8, color: c.sharePts > 0 ? T.growth : T.risk }}>
                          {fmtSigned(c.sharePts)}
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center flex-wrap" style={{ gap: '6px 14px', marginTop: 10, paddingTop: 9, borderTop: `1px solid ${T.ruleSoft}` }}>
        {['growth', 'risk', 'replicate', 'watch', 'ontrack'].map((k) => (
          <span key={k} className="inline-flex items-center" style={{ gap: 5 }}>
            <span
              style={{
                width: 16, height: 14, background: k === 'ontrack' ? '#FBFBFC' : SIGNAL_META[k].wash,
                ...signalBorder(k), display: 'inline-block', boxSizing: 'border-box',
              }}
            />
            <SignalGlyph type={k} size={8} />
            <span style={{ fontFamily: FU, fontSize: 10.5, color: T.ink }}>
              <strong style={{ fontWeight: 600 }}>{SIGNAL_META[k].label}</strong>
            </span>
          </span>
        ))}
        <span className="inline-flex items-center" style={{ gap: 5 }}>
          <span style={{ width: 9, height: 9, borderRadius: 5, background: T.replicate, color: '#fff', fontFamily: FU, fontSize: 6.5, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>P</span>
          <span style={{ fontFamily: FU, fontSize: 10.5, color: T.ink }}><strong style={{ fontWeight: 600 }}>Playbook available</strong> — on any class</span>
        </span>
      </div>
      <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink40, marginTop: 7, lineHeight: 1.5 }}>
        Cells read index versus target. Border and glyph carry the class, so the four stay distinguishable without
        relying on colour: Growth at or above {THRESHOLDS.growth}, Underperformance Risk at or below {THRESHOLDS.risk}, Replication
        Opportunity when an on-plan cell has a codified playbook that fits, Watch List when an on-plan cell has brand health
        down {Math.abs(THRESHOLDS.healthDrop).toFixed(1)} or share down {Math.abs(THRESHOLDS.shareDrop).toFixed(1)} pts.
      </div>
    </div>
  );
}

// the client's three focus areas, ranked — dollar figures are the client's own anchors
const PRIORITY_GROWTH = [
  { rank: 1, area: 'Germany · Coffee Pods', cellId: "L'OR|Germany", value: 12, action: 'Increase investment', tone: 'Increase investment' },
  { rank: 2, area: "France · L'OR RTD", cellId: "L'OR|France", value: 8, action: 'Replicate the Germany campaign', tone: 'Replicate campaign' },
  { rank: 3, area: 'Netherlands · Seasonal', cellId: 'Douwe Egberts|Netherlands', value: 5, action: 'Accelerate activation', tone: 'Accelerate activation' },
];

function SenseView({ state, set, go }) {
  const [filter, setFilter] = useState('all');
  const [cat, setCat] = useState('All');
  const [hover, setHover] = useState(null);
  const counts = useMemo(() => {
    const c = { growth: 0, risk: 0, replicate: 0, watch: 0, ontrack: 0 };
    CELLS.forEach((x) => { c[x.cls] += 1; });
    return c;
  }, []);
  const queue = useMemo(() => {
    const items = [];
    CELLS.forEach((c) => {
      allSignals(c).forEach((s) => items.push({ ...s, cell: c }));
    });
    const order = { risk: 0, growth: 1, replicate: 2, watch: 3 };
    const heroRank = (c) => (c.id === HERO_A.id ? 0 : c.id === HERO_B.id ? 1 : STATUS_LABEL[c.id] ? 2 : 3);
    return items.sort((a, b) => {
      if (heroRank(a.cell) !== heroRank(b.cell)) return heroRank(a.cell) - heroRank(b.cell);
      if (order[a.type] !== order[b.type]) return order[a.type] - order[b.type];
      return Math.abs(b.cell.gap) - Math.abs(a.cell.gap);
    });
  }, []);
  const shown = filter === 'all' ? queue : queue.filter((q) => q.type === filter);
  const focus = hover || getCell(state.selectedCell.brand, state.selectedCell.market);
  const focusMeta = SIGNAL_META[focus.cls];
  const topScore = focus.driverScores[0].score || 1;
  const pickCell = (c) => set({ selectedCell: { brand: c.brand, market: c.market } });
  const openCell = (c, stage) => { pickCell(c); go(stage); };
  const prioritySum = PRIORITY_GROWTH.reduce((a, p) => a + p.value, 0);

  const recommendations = [
    { text: 'Increase Germany Coffee Pods investment by $3M', to: 'Simulate', run: () => { set({ simOption: 'opt-lor-de', selectedCell: { brand: "L'OR", market: 'Germany' } }); go(4); } },
    { text: "Replicate the L'OR Germany premiumization playbook into France", to: 'Replicate', run: () => { set({ playbook: DEFAULT_PLAYBOOK, repOpen: HERO_CANDIDATE.id, selectedCell: { brand: "L'OR", market: 'France' } }); go(6); } },
    { text: 'Reallocate spend from Kenco UK to Pilão Brazil', to: 'Optimise', run: () => go(7) },
    { text: 'Investigate the Tassimo UK distribution decline', to: 'Diagnose', run: () => { set({ selectedCell: { brand: 'Tassimo', market: 'UK' } }); go(2); } },
  ];
  const playbooksShown = PLAYBOOKS.filter((p) => p.id !== 'pb-premium');

  return (
    <div>
      <Question sub="Twelve brands across eight markets, scored against target — and three places to look first. Two cases are tagged A and B; follow them through all eight stages.">
        Where should we focus next?
      </Question>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 10, marginBottom: 10 }}>
        <Panel
          title="Priority Growth Opportunities"
          note="Focus on these three first."
          accent={T.brand}
        >
          {PRIORITY_GROWTH.map((p) => {
            const c = getCell(...p.cellId.split('|'));
            const tone = ACTION_TONE[p.tone];
            return (
              <button
                key={p.rank} type="button" onClick={() => openCell(c, 2)}
                className="w-full text-left focus:outline-none focus:ring-2"
                style={{ display: 'block', padding: '9px 10px', marginBottom: 7, background: '#fff', border: `1px solid ${T.rule}`, borderLeft: `4px solid ${tone.color}` }}
              >
                <span className="flex items-center" style={{ gap: 12 }}>
                  <span style={{ ...NUM, fontFamily: FU, fontSize: 11, fontWeight: 700, color: T.ink40, width: 18 }}>#{p.rank}</span>
                  <span style={{ ...NUM, fontFamily: FU, fontSize: 30, fontWeight: 600, color: tone.color, letterSpacing: '-0.035em', lineHeight: 1, minWidth: 74 }}>
                    +${p.value}M
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: FU, fontSize: 12.5, fontWeight: 600, color: T.ink, lineHeight: 1.3 }}>{p.area}</span>
                    <span style={{ display: 'block', marginTop: 3 }}><ActionChip action={p.tone} label={p.action} small /></span>
                  </span>
                </span>
              </button>
            );
          })}
          <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, lineHeight: 1.5 }}>
            {fmtWhole(prioritySum)} of opportunity across the three. Click a row to diagnose it.
          </div>
        </Panel>

        <Panel
          title="Growth Control Tower Recommendations"
          note="The next four moves, each one click from the stage that acts on it."
          accent={T.accent}
        >
          {recommendations.map((r, i) => (
            <div key={i} className="flex items-center" style={{ gap: 10, padding: '8px 0', borderBottom: i < recommendations.length - 1 ? `1px solid ${T.ruleSoft}` : 'none' }}>
              <span style={{ ...NUM, fontFamily: FU, fontSize: 11, fontWeight: 700, color: '#fff', background: T.accent, width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontFamily: FU, fontSize: 12.5, fontWeight: 600, color: T.ink, lineHeight: 1.4 }}>{r.text}</span>
              <RouteLink onClick={r.run}>{r.to}</RouteLink>
            </div>
          ))}
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        <Panel
          span={2} rowSpan={2}
          title="Portfolio lattice — index versus target"
          note="Click any cell to read its key driver."
          action={
            <Btn
              size="sm" tone={state.marketIntelOverlay ? 'primary' : 'default'} icon={Eye}
              onClick={() => set({ marketIntelOverlay: !state.marketIntelOverlay })}
            >
              {state.marketIntelOverlay ? 'Hide market intel' : 'Market intel overlay'}
            </Btn>
          }
        >
          <div className="flex items-center flex-wrap" style={{ gap: 5, marginBottom: 9 }}>
            <span style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginRight: 2 }}>Category</span>
            {['All', ...CATEGORIES].map((k) => (
              <button
                key={k} type="button" onClick={() => setCat(k)}
                className="focus:outline-none focus:ring-2"
                style={{
                  fontFamily: FU, fontSize: 10.5, fontWeight: 600, padding: '3px 7px',
                  color: cat === k ? '#fff' : T.ink60, background: cat === k ? T.brand : '#fff',
                  border: `1px solid ${cat === k ? T.brand : T.rule}`,
                }}
              >
                {k}
              </button>
            ))}
          </div>
          <PortfolioLattice
            selected={state.selectedCell}
            overlay={state.marketIntelOverlay}
            catFilter={cat}
            onHover={setHover}
            onSelect={pickCell}
          />
        </Panel>

        <Panel
          title="Key Driver"
          note={hover ? 'Reading the cell under your cursor.' : 'Reading the selected cell.'}
          accent={focusMeta.color} dense
        >
          <div className="flex items-start justify-between" style={{ gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: FU, fontSize: 12.5, fontWeight: 700, color: T.ink, lineHeight: 1.3 }}>{focus.brand} · {focus.market}</div>
              <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 1 }}>
                {focus.category}{STATUS_LABEL[focus.id] ? ` · ${STATUS_LABEL[focus.id]}` : ''}
              </div>
            </div>
            <SignalTag type={focus.cls} small />
          </div>
          <div className="flex items-baseline" style={{ gap: 10, margin: '9px 0 7px' }}>
            <span style={{ ...NUM, fontFamily: FU, fontSize: 28, fontWeight: 600, color: focusMeta.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{focus.index}</span>
            <span style={{ ...NUM, fontFamily: FU, fontSize: 11.5, fontWeight: 600, color: T.ink }}>{fmtM(focus.gap)} {focus.gap < 0 ? 'behind' : 'ahead'}</span>
            {focus.playbookMatch && (
              <span style={{ fontFamily: FU, fontSize: 10.5, fontWeight: 700, color: T.replicate }}>Playbook available</span>
            )}
          </div>
          <div style={{ fontFamily: FU, fontSize: 10, color: T.ink40 }}>Why — the driver furthest from this cell’s own plan</div>
          <div style={{ fontFamily: FU, fontSize: 15, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em', margin: '2px 0 7px' }}>{focus.keyDriver}</div>
          {focus.driverScores.slice(1, 3).map((d) => (
            <div key={d.driver} className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, width: 168, flexShrink: 0 }}>Runner-up · {d.driver}</span>
              <span style={{ flex: 1 }}><MiniBar value={d.score} max={topScore} height={4} color={T.ink40} /></span>
            </div>
          ))}
          <div style={{ marginTop: 9 }}>
            <Btn full tone="navy" icon={Search} onClick={() => openCell(focus, 2)}>Diagnose why</Btn>
          </div>
        </Panel>

        <Panel
          title="Proven Playbooks Available"
          note="Capture → Codify → Replicate"
          accent={T.replicate} dense
        >
          {playbooksShown.map((p) => (
            <button
              key={p.id} type="button"
              onClick={() => { set({ playbook: p.id, repOpen: candidatesFor(p.id)[0].id }); go(6); }}
              className="w-full text-left focus:outline-none focus:ring-2"
              style={{ display: 'block', padding: '7px 9px', marginBottom: 6, background: T.replicateWash, border: `1px solid ${T.replicate}33`, borderLeft: `3px solid ${T.replicate}` }}
            >
              <span className="flex items-baseline justify-between" style={{ gap: 8 }}>
                <span style={{ fontFamily: FU, fontSize: 12, fontWeight: 600, color: T.ink }}>{p.name}</span>
                <span style={{ ...NUM, fontFamily: FU, fontSize: 11.5, fontWeight: 700, color: T.replicate }}>{p.marketCount} markets</span>
              </span>
            </button>
          ))}
          <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, lineHeight: 1.45 }}>
            Each opens Replicate filtered to that playbook.
          </div>
        </Panel>

        <Panel
          span={3}
          title="Signal queue"
          note={`${queue.length} signals raised by rule across ${CELLS.length} cells. Anchor cells carry the client’s own status wording.`}
        >
          <div className="flex" style={{ gap: 5, marginBottom: 9, flexWrap: 'wrap' }}>
            {[['all', `All ${queue.length}`],
              ['risk', `Underperformance Risk ${queue.filter((q) => q.type === 'risk').length}`],
              ['growth', `Growth Opportunity ${queue.filter((q) => q.type === 'growth').length}`],
              ['replicate', `Replication Opportunity ${queue.filter((q) => q.type === 'replicate').length}`],
              ['watch', `Watch List ${queue.filter((q) => q.type === 'watch').length}`]].map(([k, l]) => (
              <button
                key={k} type="button" onClick={() => setFilter(k)}
                className="focus:outline-none focus:ring-2"
                style={{
                  fontFamily: FU, fontSize: 10.5, fontWeight: 600, padding: '3px 7px',
                  color: filter === k ? '#fff' : T.ink60,
                  background: filter === k ? T.brand : '#fff',
                  border: `1px solid ${filter === k ? T.brand : T.rule}`, ...NUM,
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <div style={{ maxHeight: 300, overflowY: 'auto', margin: '0 -10px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', columnGap: 4 }}>
            {shown.slice(0, 40).map((s, i) => (
              <Row key={i} onClick={() => openCell(s.cell, 2)} tone={SIGNAL_META[s.type].color}>
                <div className="flex items-start" style={{ gap: 7 }}>
                  <span style={{ paddingTop: 3 }}><SignalGlyph type={s.type} size={8} /></span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: FU, fontSize: 11.5, fontWeight: 600, color: T.ink, lineHeight: 1.35 }}>
                      {s.cell.brand} · {s.cell.market}
                    </span>
                    <span style={{ display: 'block', fontFamily: FU, fontSize: 11, color: SIGNAL_META[s.type].color, lineHeight: 1.4, marginTop: 1 }}>
                      {s.headline}
                    </span>
                  </span>
                </div>
              </Row>
            ))}
          </div>
        </Panel>

        <Panel
          span={3} dense
          title={state.marketIntelOverlay ? 'Market intelligence — on, overlaid on the lattice' : 'Market intelligence — off'}
          note="Context held separately from performance, so competitor noise never gets baked into the index."
        >
          {state.marketIntelOverlay ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10 }}>
              {MARKETS.map((m) => (
                <div key={m} style={{ borderLeft: `2px solid ${T.accent}`, paddingLeft: 9 }}>
                  <div style={{ fontFamily: FU, fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>{m}</div>
                  {[['Competitor', MARKET_INTEL[m].competitor], ['Share', MARKET_INTEL[m].share], ['Category', MARKET_INTEL[m].trend]].map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 4 }}>
                      <span style={{ fontFamily: FU, fontSize: 10, color: T.ink40 }}>{k}</span>
                      <div style={{ fontFamily: FU, fontSize: 11, color: T.ink, lineHeight: 1.4 }}>{v}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap" style={{ gap: 10 }}>
              <span style={{ fontFamily: FU, fontSize: 12, color: T.ink60, maxWidth: 620, lineHeight: 1.5 }}>
                Turn the overlay on to read competitor activity, share movement and category trend against each
                market — and to see share deltas inside the lattice cells.
              </span>
              <Btn size="sm" icon={Eye} onClick={() => set({ marketIntelOverlay: true })}>Show market intel</Btn>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ============================================================================
   STAGE 2 — DIAGNOSE
   Client framing, kept as the design intent for this screen:
   "At the moment the screen tells us really well 'Why did we miss plan?' — let's
   evolve it to 'Why is France underperforming Germany and what should we do about
   it?' So we transform it from a diagnostic dashboard into a true Growth Control
   Tower decision-support screen, which is exactly where our differentiation lies."
   ========================================================================== */
const fmtRev = (v) => `${v < 0 ? '−' : '+'}$${Number.isInteger(Math.abs(v)) ? Math.abs(v) : Math.abs(v).toFixed(1)}M`;

function bestOfBrand(brand) {
  return MARKETS.map((m) => getCell(brand, m)).sort((a, b) => b.index - a.index)[0];
}

function diagnoseQuestion(cell) {
  const best = bestOfBrand(cell.brand);
  if (cell.cls === 'growth') return `Why is ${cell.brand} ${cell.market} ahead of plan?`;
  if (cell.cls === 'risk') {
    return best.id === cell.id ? `Why is ${cell.brand} ${cell.market} underperforming plan?` : `Why is ${cell.brand} ${cell.market} underperforming ${best.market}?`;
  }
  if (cell.cls === 'watch') return `Why is ${cell.brand} ${cell.market} showing early warnings?`;
  if (cell.cls === 'replicate') return `Where can ${cell.brand} ${cell.market} copy a proven play?`;
  return `Why is ${cell.brand} ${cell.market} holding plan?`;
}

/* the playbook callout for a cell — a source, a target, or nothing */
function calloutFor(cell) {
  if (cell.playbook) {
    const pb = PLAYBOOK_BY_ID[cell.playbook];
    const cand = candidatesFor(pb.id).find((c) => c.cellId === cell.id);
    const impact = cand ? cand.impact : recommendationFor(cell).revenue;
    const pts = pb.id === DEFAULT_PLAYBOOK && cell.id === HERO_A.id ? pb.indexPoints : Math.max(1, Math.round(impact / cell.target * 100));
    return { pb, kind: 'target', impact, pts, candId: cand ? cand.id : null };
  }
  if (cell.id === HERO_B.id) {
    const pb = PLAYBOOK_BY_ID[DEFAULT_PLAYBOOK];
    return { pb, kind: 'source', impact: pb.impact, pts: pb.indexPoints, candId: HERO_CANDIDATE.id };
  }
  return null;
}

function actionsFor(cell, go, set) {
  const best = bestOfBrand(cell.brand);
  const tv = cell.mix.find((m) => m.channel === 'Linear TV').share;
  const callout = calloutFor(cell);
  const dvAdd = Math.max(1, Math.round(cell.mediaSpend * 0.16));
  const simulate = () => { set({ simOption: 'opt-lor-de', selectedCell: { brand: cell.brand, market: cell.market } }); go(4); };
  return [
    { text: `Increase digital video investment by $${dvAdd}M`, to: 'Simulate', run: simulate },
    { text: tv > 35 ? 'Shift 15% of spend from linear TV to retail media' : 'Hold the channel mix and test a 5% shift into retail media', to: 'Simulate', run: simulate },
    {
      text: best.id !== cell.id ? `Deploy the ${best.brand} ${best.market} creative playbook` : 'Codify this cell’s creative as a reusable playbook',
      to: 'Replicate',
      run: () => { set({ playbook: callout ? callout.pb.id : DEFAULT_PLAYBOOK, repOpen: callout && callout.candId ? callout.candId : null }); go(6); },
    },
    { text: 'Reallocate budget from the underperforming promo mechanic', to: 'Orchestrate', run: () => go(5) },
  ];
}

function benchmarkRows(cell, cmpBrand) {
  const sorted = MARKETS.map((m) => getCell(cmpBrand, m)).sort((a, b) => b.index - a.index);
  const picked = new Map();
  sorted.slice(0, 2).forEach((c) => picked.set(c.id, c));
  const sel = cmpBrand === cell.brand ? cell : sorted[sorted.length - 1];
  picked.set(sel.id, sel);
  for (let i = 2; picked.size < 3 && i < sorted.length; i += 1) picked.set(sorted[i].id, sorted[i]);
  return { rows: [...picked.values()].sort((a, b) => b.index - a.index), sel, best: sorted[0] };
}

function keyLearning(best, sel) {
  if (best.id === HERO_B.id && sel.id === HERO_A.id) {
    return { head: 'L’OR Germany achieves', lines: PLAYBOOK_BY_ID[DEFAULT_PLAYBOOK].drivers };
  }
  if (best.id === sel.id) return { head: `${best.brand} ${best.market} is the benchmark`, lines: ['The strongest read for this brand — codify it as a playbook before it drifts.'] };
  const share = (c, n) => c.mix.find((m) => m.channel === n).share;
  const pctMore = (a, b) => Math.round((a / b - 1) * 100);
  return {
    head: `${best.brand} ${best.market} achieves`,
    lines: [
      `${pctMore(share(best, 'Digital video'), share(sel, 'Digital video'))}% higher digital video share of media`,
      `${pctMore(share(best, 'Retail media'), share(sel, 'Retail media'))}% stronger retail media activation`,
      `${best.health - sel.health} points higher brand health`,
    ],
  };
}

function DiagnoseView({ state, set, go }) {
  const cell = getCell(state.selectedCell.brand, state.selectedCell.market);
  const cls = cell.cls;
  const isGrowth = cls === 'growth';
  const meta = SIGNAL_META[cls];
  const causes = causesFor(cell);
  const drivers = driversFor(cell);
  const verdict = investmentVerdict(cell);
  const ai = aiAssessmentFor(cell, causes);
  const changes = changesFor(cell);
  const rec = recommendationFor(cell);
  const callout = calloutFor(cell);
  const actions = actionsFor(cell, go, set);

  const [cmpBrand, setCmpBrand] = useState(cell.brand);
  useEffect(() => { setCmpBrand(cell.brand); }, [cell.brand]);
  const bench = benchmarkRows(cell, cmpBrand);
  const learning = keyLearning(bench.best, bench.sel);

  const replicateFromCallout = () => {
    set({ playbook: callout.pb.id, repOpen: callout.kind === 'source' ? HERO_CANDIDATE.id : callout.candId });
    go(6);
  };

  return (
    <div>
      <Question sub={`${cell.brand} ${cell.market} — index ${cell.index}, revenue ${fmtM(cell.revenue)} against a ${fmtM(cell.target)} target. ${isGrowth ? 'Driver contributions are rule-derived from the cell’s own availability, media and pack figures.' : 'Cause weights are rule-derived from the cell’s own promo, media, distribution and share figures. The screen ends in a recommendation, not a finding.'}`}>
        {diagnoseQuestion(cell)}
      </Question>

      {/* the hero number */}
      <div
        className="flex items-center flex-wrap"
        style={{ gap: 26, background: '#fff', border: `1px solid ${T.rule}`, borderLeft: `6px solid ${meta.color}`, padding: '12px 16px', marginBottom: 10 }}
      >
        <div>
          <div className="flex items-center" style={{ gap: 7, marginBottom: 2 }}>
            <span style={{ fontFamily: FU, fontSize: 13, fontWeight: 700, color: T.ink }}>{cell.brand} · {cell.market}</span>
            <SignalTag type={cls === 'ontrack' ? 'watch' : cls} small>{STATUS_LABEL[cell.id] || (cls === 'ontrack' ? 'On plan' : undefined)}</SignalTag>
            {cell.playbookMatch && <span style={{ fontFamily: FU, fontSize: 10.5, fontWeight: 700, color: T.replicate }}>Playbook available</span>}
          </div>
          <div className="flex items-baseline" style={{ gap: 10 }}>
            <span style={{ ...NUM, fontFamily: FU, fontSize: 52, fontWeight: 600, color: meta.color, letterSpacing: '-0.04em', lineHeight: 1 }}>{cell.index}</span>
            <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60 }}>index vs target</span>
          </div>
        </div>
        {[
          ['Revenue YTD', fmtM(cell.revenue), `Target ${fmtM(cell.target)}`, T.ink],
          ['Gap to target', fmtM(cell.gap), cell.gap < 0 ? 'behind plan' : 'ahead of plan', cell.gap < 0 ? T.risk : T.growth],
          ['Modeled ROI', `${cell.roi.toFixed(1)}x`, `Portfolio ${PORTFOLIO_AVG_ROI.toFixed(1)}x`, cell.roi >= 2 ? T.growth : cell.roi < 1.4 ? T.risk : T.ink],
          ['Brand health', `${cell.health}`, `${fmtSigned(cell.healthDelta)} over 90 days`, cell.healthDelta < 0 ? T.risk : T.growth],
        ].map(([k, v, sub, tone]) => (
          <Readout key={k} label={k} value={v} sub={sub} size="lg" tone={tone} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10 }}>
        <Panel
          span={2}
          accent={meta.color}
          title={isGrowth ? 'Growth-driver contribution' : 'Root cause breakdown'}
          note={isGrowth ? 'What is producing the outperformance, in index points of lift.' : 'Six marketing drivers, weighted to 100.'}
        >
          {isGrowth ? (
            <div>
              {drivers.map((d) => (
                <div key={d.driver} style={{ marginBottom: 11 }}>
                  <div className="flex items-baseline justify-between" style={{ gap: 10 }}>
                    <span style={{ fontFamily: FU, fontSize: 12.5, fontWeight: 600, color: T.ink }}>{d.driver}</span>
                    <span style={{ ...NUM, fontFamily: FU, fontSize: 13.5, fontWeight: 700, color: T.growth }}>+{d.pts.toFixed(1)} pts</span>
                  </div>
                  <div style={{ margin: '4px 0 3px' }}>
                    <MiniBar value={d.pts} max={Math.max(...drivers.map((x) => x.pts))} color={T.growth} height={7} />
                  </div>
                  <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, lineHeight: 1.4 }}>{d.note}</div>
                </div>
              ))}
              <div style={{ background: T.growthWash, border: `1px solid ${T.growth}33`, padding: '9px 10px', marginTop: 4 }}>
                <div style={{ fontFamily: FU, fontSize: 12, fontWeight: 700, color: T.ink }}>
                  {cell.id === HERO_B.id ? 'The winning play: L’OR Germany Premiumization' : 'Pattern worth naming'}
                </div>
                <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, marginTop: 3, lineHeight: 1.5 }}>
                  {cell.id === HERO_B.id
                    ? `Digital video reach, retail media activation and premium mix, run together. ROI ${cell.roi.toFixed(1)}x against a ${PORTFOLIO_AVG_ROI.toFixed(1)}x portfolio average; marginal ROI on new money is ${MARGINAL_ROI_HERO_B.toFixed(1)}x, so there is still room to invest.`
                    : `Availability and working-media quality are carrying the lift. ROI ${cell.roi.toFixed(1)}x against a ${PORTFOLIO_AVG_ROI.toFixed(1)}x portfolio average.`}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ background: T.accentWash, border: `1px solid ${T.accent}44`, borderLeft: `4px solid ${T.accent}`, padding: '10px 12px', marginBottom: 13 }}>
                <div className="flex items-center" style={{ gap: 6, marginBottom: 6 }}>
                  <Sparkles size={13} color={T.accent} />
                  <span style={{ fontFamily: FU, fontSize: 11, fontWeight: 700, color: T.accentDeep, letterSpacing: '0.02em' }}>AI Root Cause Assessment</span>
                </div>
                <div className="flex items-start" style={{ gap: 14 }}>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ ...NUM, fontFamily: FU, fontSize: 34, fontWeight: 600, color: T.accentDeep, letterSpacing: '-0.035em', lineHeight: 1 }}>{ai.conf}%</div>
                    <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60 }}>confidence</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FU, fontSize: 13, fontWeight: 700, color: T.ink, lineHeight: 1.35 }}>{ai.primary} is the primary performance driver</div>
                    <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, margin: '7px 0 3px' }}>Secondary factors</div>
                    {ai.secondary.map(([k, v]) => (
                      <div key={k} className="flex items-center" style={{ gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, width: 136 }}>{k}</span>
                        <span style={{ flex: 1 }}><MiniBar value={v} max={100} height={5} color={T.accent} /></span>
                        <span style={{ ...NUM, fontFamily: FU, fontSize: 11.5, fontWeight: 700, color: T.ink, width: 32, textAlign: 'right' }}>{v}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 8, lineHeight: 1.45 }}>
                  Rule-weighted confidence derived from the drivers below. Lookup logic on synthetic data, not a trained model.
                </div>
              </div>
              {causes.map((c) => (
                <div key={c.cause} style={{ marginBottom: 12 }}>
                  <div className="flex items-baseline justify-between" style={{ gap: 10 }}>
                    <span style={{ fontFamily: FU, fontSize: 12.5, fontWeight: 600, color: T.ink }}>{c.cause}</span>
                    <span style={{ ...NUM, fontFamily: FU, fontSize: 13.5, fontWeight: 700, color: T.ink }}>{c.weight}%</span>
                  </div>
                  <div style={{ margin: '4px 0 4px' }}>
                    <MiniBar value={c.weight} max={Math.max(...causes.map((x) => x.weight))} color={T.risk} height={7} />
                  </div>
                  <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, lineHeight: 1.45 }}>{c.finding}</div>
                  <div className="flex flex-wrap" style={{ gap: 10, marginTop: 2 }}>
                    <span style={{ fontFamily: FU, fontSize: 11, color: T.risk, fontWeight: 600 }}>{c.impact}</span>
                    <span style={{ fontFamily: FU, fontSize: 11, color: T.ink60 }}>Lever: {c.lever}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="What changed vs last quarter?" note="Direction and size of the movement, coloured by whether it helps or hurts." accent={T.ink40}>
          {changes.map((c) => {
            const color = c.good === true ? T.growth : c.good === false ? T.risk : T.ink60;
            return (
              <div key={c.label} className="flex items-center justify-between" style={{ gap: 8, padding: '9px 0', borderBottom: `1px solid ${T.ruleSoft}` }}>
                <span style={{ fontFamily: FU, fontSize: 12, color: T.ink }}>{c.label}</span>
                <span className="inline-flex items-center" style={{ gap: 5 }}>
                  <span aria-hidden="true" style={{ fontFamily: FU, fontSize: 13, color }}>{c.dir === 'up' ? '▲' : c.dir === 'down' ? '▼' : '■'}</span>
                  <span style={{ ...NUM, fontFamily: FU, fontSize: 16, fontWeight: 700, color, letterSpacing: '-0.02em' }}>{c.value}</span>
                  <span style={{ fontFamily: FU, fontSize: 10, color, width: 38 }}>{c.good === true ? 'helps' : c.good === false ? 'hurts' : 'neutral'}</span>
                </span>
              </div>
            );
          })}
          <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 8, lineHeight: 1.45 }}>
            Quarter-on-quarter movement, derived from this cell’s own channel mix, share and distribution figures.
          </div>
        </Panel>

        {callout && (
          <div
            style={{
              gridColumn: 'span 3', background: T.replicateWash, border: `1px solid ${T.replicate}55`,
              borderLeft: `8px solid ${T.replicate}`, padding: '14px 18px',
            }}
          >
            <div className="flex items-center justify-between flex-wrap" style={{ gap: 14 }}>
              <div style={{ minWidth: 0 }}>
                <div className="flex items-center" style={{ gap: 7 }}>
                  <BookOpen size={15} color={T.replicate} />
                  <span style={{ fontFamily: FU, fontSize: 11, fontWeight: 700, color: T.replicate, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Replicate Winning Practice · Proven Playbook Available
                  </span>
                </div>
                <div style={{ fontFamily: FS, fontSize: 22, color: T.ink, letterSpacing: '-0.015em', margin: '4px 0 6px' }}>{callout.pb.name} Strategy</div>
                <div className="flex flex-wrap" style={{ gap: 26 }}>
                  <div>
                    <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60 }}>Applied successfully in</div>
                    <div style={{ fontFamily: FU, fontSize: 13, fontWeight: 600, color: T.ink }}>{callout.pb.markets.join(' · ')}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60 }}>
                      {callout.kind === 'source' ? 'Potential impact in France' : `Potential impact in ${cell.market}`}
                    </div>
                    <div style={{ ...NUM, fontFamily: FU, fontSize: 13, fontWeight: 700, color: T.replicate }}>
                      {fmtRev(callout.impact)} revenue, +{callout.pts} index points
                    </div>
                  </div>
                </div>
              </div>
              <Btn tone="primary" size="lg" icon={Repeat} onClick={replicateFromCallout}>
                Replicate this playbook to {callout.kind === 'source' ? 'France' : cell.market}
              </Btn>
            </div>
          </div>
        )}

        <Panel
          span={2}
          accent={T.accent}
          title="Recommended Actions"
          note="Four owner-ready moves, each routed to the stage that executes it."
        >
          {actions.map((a, i) => (
            <div key={i} className="flex items-center" style={{ gap: 10, padding: '8px 0', borderBottom: i < actions.length - 1 ? `1px solid ${T.ruleSoft}` : 'none' }}>
              <span style={{ ...NUM, fontFamily: FU, fontSize: 11, fontWeight: 700, color: '#fff', background: T.accent, width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontFamily: FU, fontSize: 12.5, fontWeight: 600, color: T.ink, lineHeight: 1.4 }}>{a.text}</span>
              <RouteLink onClick={a.run}>{a.to}</RouteLink>
            </div>
          ))}
        </Panel>

        <Panel title="Growth Control Tower Recommendation" accent={T.brand}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 9 }}>
            <span style={{ fontFamily: FU, fontSize: 11, color: T.ink60 }}>Priority</span>
            <span style={{
              fontFamily: FU, fontSize: 11.5, fontWeight: 700, padding: '2px 8px',
              color: rec.priority === 'High' ? T.risk : rec.priority === 'Medium' ? T.watch : T.ink60,
              background: rec.priority === 'High' ? T.riskWash : rec.priority === 'Medium' ? T.watchWash : '#F4F1EE',
              border: `1px solid ${rec.priority === 'High' ? T.risk : rec.priority === 'Medium' ? T.watch : T.ink40}44`,
            }}>
              {rec.priority}
            </span>
          </div>
          <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginBottom: 3 }}>Recommended intervention</div>
          {rec.interventions.map((x) => (
            <div key={x} className="flex" style={{ gap: 6, marginBottom: 3 }}>
              <Check size={12} color={T.accent} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontFamily: FU, fontSize: 12, fontWeight: 600, color: T.ink, lineHeight: 1.4 }}>{x}</span>
            </div>
          ))}
          {rec.revenue > 0 && (
            <>
              <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, margin: '9px 0 3px' }}>Expected impact</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
                <Readout label="Revenue" value={fmtRev(rec.revenue)} size="sm" tone={T.growth} />
                <Readout label="Index" value={`+${rec.pts} pts`} size="sm" tone={T.growth} />
                <Readout label="ROI" value={`${rec.roi.toFixed(1)}x`} size="sm" />
              </div>
            </>
          )}
          <div className="flex flex-col" style={{ gap: 6, marginTop: 11 }}>
            <Btn full tone="navy" icon={Target} onClick={() => go(3)}>Add to the ranked list</Btn>
            <Btn full icon={Beaker} onClick={() => { set({ simOption: 'opt-lor-de' }); go(4); }}>Simulate the allocation</Btn>
          </div>
        </Panel>

        <Panel
          span={2}
          title="Similar Markets Benchmark"
          note="The same brand read across its strongest markets — where the play already works and where it does not."
          action={
            <select
              value={cmpBrand} onChange={(e) => setCmpBrand(e.target.value)}
              aria-label="Brand to benchmark across markets"
              className="focus:outline-none focus:ring-2"
              style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, border: `1px solid ${T.rule}`, padding: '3px 6px', background: '#fff' }}
            >
              {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          }
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Market', 'Index', 'Revenue', 'ROI', 'Retail media', 'Health'].map((h) => (
                  <th key={h} style={{ fontFamily: FU, fontSize: 10, color: T.ink60, fontWeight: 500, textAlign: h === 'Market' ? 'left' : 'right', padding: '0 6px 5px', borderBottom: `1px solid ${T.rule}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bench.rows.map((c) => {
                const rm = c.mix.find((m) => m.channel === 'Retail media').share;
                const sel = c.id === cell.id;
                return (
                  <tr
                    key={c.id}
                    onClick={() => set({ selectedCell: { brand: c.brand, market: c.market } })}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') set({ selectedCell: { brand: c.brand, market: c.market } }); }}
                    className="focus:outline-none focus:ring-2"
                    style={{ borderBottom: `1px solid ${T.ruleSoft}`, background: sel ? '#F7F5F3' : 'transparent', cursor: 'pointer' }}
                  >
                    <td style={{ fontFamily: FU, fontSize: 12, fontWeight: sel ? 700 : 500, color: T.ink, padding: '8px 6px' }}>
                      <span className="inline-flex items-center" style={{ gap: 5 }}><SignalGlyph type={c.cls} size={7} />{c.market}</span>
                    </td>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 14, fontWeight: 700, color: SIGNAL_META[c.cls].color, textAlign: 'right', padding: '8px 6px' }}>
                      <span style={{ fontSize: 10, fontWeight: 500, color: T.ink60, marginRight: 4 }}>Index</span>{c.index}
                    </td>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 11.5, color: T.ink, textAlign: 'right', padding: '8px 6px' }}>{fmtM(c.revenue)}</td>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 11.5, color: T.ink, textAlign: 'right', padding: '8px 6px' }}>{c.roi.toFixed(1)}x</td>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 11.5, color: T.ink, textAlign: 'right', padding: '8px 6px' }}>{rm}%</td>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 11.5, color: T.ink, textAlign: 'right', padding: '8px 6px' }}>{c.health} ({fmtSigned(c.healthDelta)})</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ background: '#F7F5F3', border: `1px solid ${T.ruleSoft}`, borderLeft: `3px solid ${T.replicate}`, padding: '9px 11px', marginTop: 10 }}>
            <div style={{ fontFamily: FU, fontSize: 10.5, fontWeight: 700, color: T.replicate, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Key Learning</div>
            <div style={{ fontFamily: FU, fontSize: 12, fontWeight: 600, color: T.ink, margin: '3px 0 4px' }}>{learning.head}</div>
            {learning.lines.map((l) => (
              <div key={l} style={{ fontFamily: FU, fontSize: 12, color: T.ink, lineHeight: 1.5 }}>— {l}</div>
            ))}
          </div>
        </Panel>

        <Panel title="Investment effectiveness" note="Is the money in the right place?" accent={verdict.color}>
          <div style={{ border: `1px solid ${verdict.color}44`, background: verdict.color === T.ink60 ? '#F8F6F4' : verdict.color + '11', padding: '9px 10px', marginBottom: 10 }}>
            <div style={{ fontFamily: FU, fontSize: 15, fontWeight: 700, color: verdict.color, letterSpacing: '-0.01em' }}>{verdict.label}</div>
            <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, marginTop: 3, lineHeight: 1.45 }}>{verdict.why}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <Readout label="Working media" value={fmtM(cell.mediaSpend)} size="sm" />
            <Readout label="Gross margin" value={`${cell.margin.toFixed(1)}%`} size="sm" />
            <Readout label="On deal" value={`${cell.promo.actual}%`} size="sm" tone={cell.promo.actual > cell.promo.plan + 5 ? T.risk : T.ink} sub={`Plan ${cell.promo.plan}%`} />
            <Readout label="Key driver" value={cell.keyDriver} size="sm" />
          </div>
          <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginBottom: 5 }}>Channel mix</div>
          {cell.mix.map((m) => (
            <div key={m.channel} className="flex items-center" style={{ gap: 8, marginBottom: 3 }}>
              <span style={{ fontFamily: FU, fontSize: 10.5, color: T.ink, width: 76, flexShrink: 0 }}>{m.channel}</span>
              <span style={{ flex: 1 }}>
                <MiniBar
                  value={m.share} max={60} height={5}
                  color={m.channel === 'Linear TV' && m.share > 40 ? T.risk : m.channel === 'Retail media' ? T.accent : T.ink40}
                />
              </span>
              <span style={{ ...NUM, fontFamily: FU, fontSize: 10.5, color: T.ink60, width: 26, textAlign: 'right' }}>{m.share}%</span>
            </div>
          ))}
          <div style={{ marginTop: 10, paddingTop: 9, borderTop: `1px solid ${T.ruleSoft}` }}>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginBottom: 4 }}>Distribution, TDP change</div>
            {cell.dist.map((d) => (
              <div key={d.channel} className="flex items-center justify-between" style={{ gap: 8, marginBottom: 2 }}>
                <span style={{ fontFamily: FU, fontSize: 10.5, color: T.ink }}>{d.channel}</span>
                <span style={{ ...NUM, fontFamily: FU, fontSize: 11, fontWeight: 600, color: d.tdp < -1 ? T.risk : d.tdp > 1 ? T.growth : T.ink60 }}>
                  {fmtSigned(d.tdp)}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ============================================================================
   STAGE 3 — PRIORITISE  (the flywheel's return path)
   ========================================================================== */
/* open a ranked item in the stage that acts on it, with the right cell / playbook / option pre-selected */
function openPriorityItem(r, set, go) {
  const cellId = `${r.brand}|${r.market}`;
  const patch = { selectedCell: { brand: r.brand, market: r.market } };
  if (r.stage === 6) {
    const pbObj = PLAYBOOKS.find((p) => p.pattern === r.pattern) || PLAYBOOK_BY_ID[DEFAULT_PLAYBOOK];
    const cand = candidatesFor(pbObj.id).find((c) => c.cellId === cellId);
    patch.playbook = pbObj.id;
    patch.repOpen = cand ? cand.id : null;
  }
  if (r.stage === 4) patch.simOption = (SIM_OPTIONS.find((o) => o.cellId === cellId) || SIM_BY_ID[RECOMMENDED_OPTION]).id;
  set(patch);
  go(r.stage);
}
const STAGE_VERB = { 2: 'Diagnose it', 4: 'Simulate it', 5: 'Open it in Orchestrate', 6: 'Open it in Replicate' };

function PrioritiseView({ state, set, go, createIntervention }) {
  const view = state.priView || 'ranked';
  const setView = (k) => set({ priView: k });
  const weights = state.priorityWeights;
  const ranked = useMemo(() => rankedItems(state.outcomesLog, weights), [state.outcomesLog, weights]);
  const baseline = useMemo(() => rankedItems(SEED_LOG, weights), [weights]);
  const baseById = useMemo(() => { const m = {}; baseline.forEach((b) => { m[b.id] = b; }); return m; }, [baseline]);
  const learned = state.outcomesLog.length > SEED_LOG.length;
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0);

  const setW = (k, v) => set({ priorityWeights: { ...weights, [k]: v } });

  return (
    <div>
      <Question sub="Ten flagged items scored on six factors. Confidence is not typed in — it is computed from matching outcomes in the Learn log, so it moves as the portfolio accumulates evidence.">
        Which opportunities do we fund, and in what order?
      </Question>

      <div className="flex items-center justify-between flex-wrap" style={{ gap: 10, marginBottom: 10 }}>
        <div className="flex" style={{ gap: 5 }}>
          {[['ranked', 'Ranked list'], ['funding', 'Incremental funding'], ['resource', 'Talent, agency and AI']].map(([k, l]) => (
            <button
              key={k} type="button" onClick={() => setView(k)}
              className="focus:outline-none focus:ring-2"
              style={{
                fontFamily: FU, fontSize: 12, fontWeight: 600, padding: '5px 11px',
                color: view === k ? '#fff' : T.ink60, background: view === k ? T.navy : '#fff',
                border: `1px solid ${view === k ? T.navy : T.rule}`,
              }}
            >
              {l}
            </button>
          ))}
        </div>
        {learned && (
          <div
            className="inline-flex items-center"
            style={{ gap: 7, background: T.replicateWash, border: `1px solid ${T.replicate}55`, borderLeft: `4px solid ${T.replicate}`, padding: '6px 10px' }}
          >
            <Brain size={14} color={T.replicate} />
            <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, lineHeight: 1.4 }}>
              This list has been re-scored. {state.outcomesLog.length - SEED_LOG.length} new outcome
              {state.outcomesLog.length - SEED_LOG.length === 1 ? '' : 's'} logged this session changed confidence and rank order.
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.45fr) minmax(0, 1fr)', gap: 10 }}>
        {view === 'ranked' && (
          <Panel title="Ranked opportunities" note="Click a row to open it in the stage that acts on it." dense>
            <div style={{ margin: '0 -12px' }}>
              <div
                className="flex items-center"
                style={{ gap: 8, padding: '0 12px 6px', borderBottom: `1px solid ${T.rule}` }}
              >
                <span style={{ fontFamily: FU, fontSize: 10, color: T.ink60, width: 30 }}>Rank</span>
                <span style={{ fontFamily: FU, fontSize: 10, color: T.ink60, flex: 1 }}>Item</span>
                <span style={{ fontFamily: FU, fontSize: 10, color: T.ink60, width: 118 }}>Verdict</span>
                <span style={{ fontFamily: FU, fontSize: 10, color: T.ink60, width: 128 }}>Recommended Action</span>
                <span style={{ fontFamily: FU, fontSize: 10, color: T.ink60, width: 118, textAlign: 'right' }}>Confidence</span>
                <span style={{ fontFamily: FU, fontSize: 10, color: T.ink60, width: 48, textAlign: 'right' }}>Score</span>
              </div>
              {ranked.map((r) => {
                const b = baseById[r.id];
                const confMoved = b && b.conf !== r.conf;
                const rankMoved = b && b.rank !== r.rank;
                const tone = VERDICT_TONE[r.verdict];
                const sessionCount = r.ev.entries.filter((e) => !e.seeded).length;
                return (
                  <div
                    key={r.id}
                    style={{
                      borderBottom: `1px solid ${T.ruleSoft}`,
                      background: confMoved ? '#FBFAFE' : 'transparent',
                      borderLeft: confMoved ? `3px solid ${T.replicate}` : '3px solid transparent',
                      padding: '8px 12px 8px 9px',
                      transition: 'background 300ms ease',
                    }}
                  >
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <span style={{ width: 30, display: 'block' }}>
                        <span style={{ ...NUM, display: 'block', fontFamily: FU, fontSize: 16, fontWeight: 700, color: r.rank <= 3 ? T.ink : T.ink40, letterSpacing: '-0.03em', lineHeight: 1 }}>{r.rank}</span>
                        {rankMoved && (
                          <span style={{ ...NUM, display: 'block', fontFamily: FU, fontSize: 9.5, fontWeight: 700, color: r.rank < b.rank ? T.opp : T.ink40, marginTop: 2 }}>
                            {r.rank < b.rank ? `up ${b.rank - r.rank}` : `down ${r.rank - b.rank}`}
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => openPriorityItem(r, set, go)}
                        className="text-left flex-1 focus:outline-none focus:ring-2"
                        style={{ minWidth: 0 }}
                      >
                        <span style={{ display: 'block', fontFamily: FU, fontSize: 12.5, fontWeight: 600, color: T.ink, lineHeight: 1.35 }}>{r.title}</span>
                        <span style={{ display: 'block', fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 2 }}>
                          {r.brand} · {r.market} &nbsp;|&nbsp; {fmtM(r.value)} value at stake &nbsp;|&nbsp; {PATTERNS[r.pattern]}
                        </span>
                      </button>
                      <span style={{ width: 118 }}>
                        <span style={{ fontFamily: FU, fontSize: 11, fontWeight: 700, color: tone.color, background: tone.wash, border: `1px solid ${tone.color}33`, padding: '2px 7px', display: 'inline-block' }}>
                          {r.verdict}
                        </span>
                      </span>
                      <span style={{ width: 128 }}>
                        <ActionChip action={r.action} />
                      </span>
                      <span style={{ width: 118, textAlign: 'right' }}>
                        <span className="inline-flex items-baseline" style={{ gap: 5, justifyContent: 'flex-end' }}>
                          {confMoved && (
                            <span style={{ ...NUM, fontFamily: FU, fontSize: 11, color: T.ink40, textDecoration: 'line-through' }}>{b.conf}%</span>
                          )}
                          <span style={{ ...NUM, fontFamily: FU, fontSize: confMoved ? 19 : 15, fontWeight: 700, color: confMoved ? T.replicate : r.conf >= 70 ? T.opp : r.conf < 50 ? T.warn : T.ink, letterSpacing: '-0.02em' }}>
                            {r.conf}%
                          </span>
                        </span>
                        <span style={{ display: 'block' }}>
                          <MiniBar value={r.conf} max={100} height={3} color={confMoved ? T.replicate : T.ink40} />
                        </span>
                      </span>
                      <span style={{ ...NUM, width: 48, textAlign: 'right', fontFamily: FU, fontSize: 14, fontWeight: 600, color: T.ink }}>{r.score}</span>
                    </div>
                    <div style={{ fontFamily: FU, fontSize: 10.5, color: confMoved ? T.replicate : T.ink60, marginTop: 4, paddingLeft: 38, lineHeight: 1.45 }}>
                      {r.ev.matches === 0
                        ? `No comparable initiative in the log yet — confidence sits at the base ${r.base}% for this play type.`
                        : confMoved
                          ? `Up from ${b.conf}% — ${r.ev.matches} logged instances of ${PATTERNS[r.pattern]}${sessionCount ? `, ${sessionCount} added this session` : ''}${r.ev.failures ? `, ${r.ev.failures} of them unsuccessful` : ', none unsuccessful'}.`
                          : `${r.ev.matches} logged instance${r.ev.matches === 1 ? '' : 's'} of ${PATTERNS[r.pattern]}${r.ev.failures ? `, including ${r.ev.failures} that did not work` : ''}.`}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}

        {view === 'funding' && (
          <Panel title="Incremental funding requests" note="Which asks earn new money, which are reallocation, and which release funds." dense>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Rank', 'Item', 'Ask', 'Value', 'Return', 'Call'].map((h, i) => (
                    <th key={h} style={{ fontFamily: FU, fontSize: 10, color: T.ink60, fontWeight: 500, textAlign: i > 1 ? 'right' : 'left', padding: '0 6px 6px', borderBottom: `1px solid ${T.rule}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ranked.map((r) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${T.ruleSoft}` }}>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 12, fontWeight: 700, color: T.ink40, padding: '7px 6px' }}>{r.rank}</td>
                    <td style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, padding: '7px 6px', lineHeight: 1.35 }}>
                      {r.title}
                      <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60 }}>{r.funding}</div>
                    </td>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 12, fontWeight: 600, color: r.money > 0 ? T.ink : T.opp, textAlign: 'right', padding: '7px 6px' }}>
                      {r.money === 0 ? 'None' : fmtM(r.money)}
                    </td>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 12, color: T.ink, textAlign: 'right', padding: '7px 6px' }}>{fmtM(r.value)}</td>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 12, fontWeight: 600, color: T.opp, textAlign: 'right', padding: '7px 6px' }}>
                      {r.money > 0 ? `${(r.value / r.money).toFixed(1)}x` : '—'}
                    </td>
                    <td style={{ textAlign: 'right', padding: '7px 6px' }}>
                      <span style={{ fontFamily: FU, fontSize: 10.5, fontWeight: 700, color: ACTION_TONE[r.action].color }}>{r.action}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginTop: 9, lineHeight: 1.5 }}>
              Total incremental ask {fmtM(ranked.reduce((a, r) => a + Math.max(0, r.money), 0))} against
              {' '}{fmtM(ranked.reduce((a, r) => a + r.value, 0))} of value at stake. Two items need no funding at all —
              they are margin recovery, and they rank on profit impact rather than revenue.
            </div>
          </Panel>
        )}

        {view === 'resource' && (
          <Panel title="Where talent, agency spend and AI should go" note="Money is rarely the binding constraint. Capability usually is." dense>
            {ranked.map((r) => (
              <div key={r.id} className="flex items-start" style={{ gap: 10, padding: '9px 0', borderBottom: `1px solid ${T.ruleSoft}` }}>
                <span style={{ ...NUM, fontFamily: FU, fontSize: 13, fontWeight: 700, color: T.ink40, width: 20 }}>{r.rank}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: FU, fontSize: 12, fontWeight: 600, color: T.ink, lineHeight: 1.35 }}>{r.title}</span>
                  <span style={{ display: 'block', fontFamily: FU, fontSize: 11, color: T.ink60, marginTop: 2, lineHeight: 1.45 }}>{r.resource}</span>
                </span>
                <span style={{ fontFamily: FU, fontSize: 10.5, fontWeight: 700, color: VERDICT_TONE[r.verdict].color, background: VERDICT_TONE[r.verdict].wash, padding: '2px 6px', whiteSpace: 'nowrap' }}>{r.verdict}</span>
              </div>
            ))}
          </Panel>
        )}

        <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
          <Panel
            title="Scoring weights"
            note="Move a weight and the list reorders. These same weights tilt the Optimise rebalance."
            accent={T.teal}
            dense
          >
            {Object.keys(WEIGHT_LABELS).map((k) => (
              <div key={k} style={{ marginBottom: 7 }}>
                <Slider
                  label={WEIGHT_LABELS[k]} display={`${Math.round(weights[k] / totalW * 100)}%`}
                  min={0} max={40} step={1} value={weights[k]} onChange={(v) => setW(k, v)}
                  ariaLabel={`${WEIGHT_LABELS[k]} weight`}
                />
              </div>
            ))}
            <div className="flex items-center justify-between" style={{ marginTop: 6, gap: 8 }}>
              <span style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60 }}>
                Weights are normalised, so they never need to total 100.
              </span>
              <Btn size="sm" icon={RotateCcw} onClick={() => set({ priorityWeights: { ...DEFAULT_WEIGHTS } })}>Reset weights</Btn>
            </div>
          </Panel>

          <Panel title="How confidence is calculated" dense accent={T.replicate}>
            <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, lineHeight: 1.6 }}>
              Each item carries a base confidence for its play type. Every matching initiative in the Learn log then
              adjusts it: an instance counts {EVIDENCE_PER_INSTANCE} points, an unsuccessful one counts against it.
              Nothing here is a trained model — it is a transparent lookup, which is why the arithmetic is on screen.
            </div>
            <div style={{ marginTop: 10, paddingTop: 9, borderTop: `1px solid ${T.ruleSoft}` }}>
              <div className="flex items-baseline justify-between" style={{ gap: 8 }}>
                <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60 }}>Outcomes in the log</span>
                <span style={{ ...NUM, fontFamily: FU, fontSize: 18, fontWeight: 700, color: T.ink }}>{state.outcomesLog.length}</span>
              </div>
              <div className="flex items-baseline justify-between" style={{ gap: 8, marginTop: 4 }}>
                <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60 }}>Added this session</span>
                <span style={{ ...NUM, fontFamily: FU, fontSize: 18, fontWeight: 700, color: learned ? T.replicate : T.ink40 }}>
                  {state.outcomesLog.length - SEED_LOG.length}
                </span>
              </div>
              <div style={{ marginTop: 9 }}>
                <Btn size="sm" full icon={Brain} onClick={() => go(8)}>Open the outcomes log</Btn>
              </div>
            </div>
          </Panel>

          <Panel title="Act on the top item" dense accent={T.brand}>
            <div style={{ fontFamily: FU, fontSize: 12, fontWeight: 600, color: T.ink, lineHeight: 1.4 }}>{ranked[0].title}</div>
            <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginTop: 3, lineHeight: 1.45 }}>
              {ranked[0].brand} · {ranked[0].market} · {fmtM(ranked[0].value)} at stake · confidence {ranked[0].conf}%
            </div>
            <div style={{ marginTop: 6 }}><ActionChip action={ranked[0].action} /></div>
            <div className="flex flex-col" style={{ gap: 6, marginTop: 9 }}>
              <Btn
                full tone="navy" icon={ranked[0].stage === 6 ? Repeat : Beaker}
                onClick={() => openPriorityItem(ranked[0], set, go)}
              >
                {STAGE_VERB[ranked[0].stage] || 'Open it'}
              </Btn>
              <Btn full icon={Beaker} onClick={() => { set({ simOption: RECOMMENDED_OPTION }); go(4); }}>
                Simulate the next $10M
              </Btn>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   STAGE 4 — SIMULATE
   One option is never enough: four are compared side by side, then the screen concludes.
   ========================================================================== */
const optionName = (o) => (o.axis === 'brand-market' ? `${o.brand} ${o.market}` : o.label);

function SimulateView({ state, set, go, createIntervention }) {
  const { alloc, scenario } = state.simulation;
  const o = SIM_BY_ID[state.simOption] || SIM_BY_ID[RECOMMENDED_OPTION];
  const out = simulate(o.id, alloc, scenario);
  const table = useMemo(() => optionTable(scenario), [scenario]);
  const recommended = table[0];
  const atDetent = simulate(o.id, ALLOC_DETENT, scenario);
  const realloc = reallocation(alloc / ALLOC_DETENT);
  const pb = PLAYBOOK_BY_ID[DEFAULT_PLAYBOOK];
  const [timing, setTiming] = useState('Q2 launch');
  const t = INNOVATION_TIMING.find((x) => x.window === timing);
  const reduced = usePrefersReducedMotion();
  const curve = useMemo(() => curveFor(o.id), [o.id]);
  const gpPeak = curve.reduce((a, b) => (b.gp > a.gp ? b : a), curve[0]);

  const setAlloc = (v) => {
    const snapped = Math.abs(v - ALLOC_DETENT) < 0.36 ? ALLOC_DETENT : v;
    set({ simulation: { ...state.simulation, alloc: snapped, projectedOutcome: simulate(o.id, snapped, scenario) } });
  };
  const setOption = (id) => set({ simOption: id, simulation: { ...state.simulation, projectedOutcome: simulate(id, alloc, scenario) } });
  const setScenario = (k) => {
    const next = scenario === k ? null : k;
    set({ simulation: { ...state.simulation, scenario: next, projectedOutcome: simulate(o.id, alloc, next) } });
  };

  return (
    <div>
      <Question sub="Four options, evaluated side by side on the same $10M, then one conclusion. Modelled on a tuned lookup table rather than a live model; every assumption is stated next to the numbers.">
        How should we allocate the next $10M of growth investment?
      </Question>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10 }}>
        <Panel
          span={3} accent={T.accent}
          title="Options side by side"
          note="Each option is read at $10M. Click a row to load it into the allocation control below."
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Option', 'Axis', 'Category', 'Revenue impact', 'ROI', 'Execution confidence', 'Recommendation'].map((h, i) => (
                  <th key={h} style={{ fontFamily: FU, fontSize: 10, color: T.ink60, fontWeight: 500, textAlign: i >= 3 && i <= 5 ? 'right' : 'left', padding: '0 8px 6px', borderBottom: `1px solid ${T.rule}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((r) => {
                const sel = r.id === o.id;
                return (
                  <tr
                    key={r.id}
                    onClick={() => setOption(r.id)}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOption(r.id); } }}
                    aria-selected={sel}
                    className="focus:outline-none focus:ring-2"
                    style={{
                      borderBottom: `1px solid ${T.ruleSoft}`, cursor: 'pointer',
                      background: r.recommended ? T.accentWash : sel ? '#F7F5F3' : 'transparent',
                      borderLeft: r.recommended ? `4px solid ${T.accent}` : sel ? `4px solid ${T.ink40}` : '4px solid transparent',
                    }}
                  >
                    <td style={{ fontFamily: FU, fontSize: 13, fontWeight: 700, color: T.ink, padding: '9px 8px' }}>{r.label}</td>
                    <td style={{ fontFamily: FU, fontSize: 11, color: T.ink60, padding: '9px 8px' }}>{r.axis}</td>
                    <td style={{ fontFamily: FU, fontSize: 11, color: T.ink60, padding: '9px 8px' }}>{r.category}</td>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 18, fontWeight: 700, color: T.growth, textAlign: 'right', padding: '9px 8px', letterSpacing: '-0.02em' }}>{fmtRev(r.at.rev)}</td>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 14, fontWeight: 700, color: T.ink, textAlign: 'right', padding: '9px 8px' }}>{r.at.roi.toFixed(1)}x</td>
                    <td style={{ ...NUM, fontFamily: FU, fontSize: 12.5, color: T.ink, textAlign: 'right', padding: '9px 8px' }}>{r.at.conf}%</td>
                    <td style={{ padding: '9px 8px' }}>
                      {r.recommended && (
                        <span className="inline-flex items-center" style={{ gap: 4, fontFamily: FU, fontSize: 11, fontWeight: 700, color: '#fff', background: T.accent, padding: '2px 8px' }}>
                          <Check size={11} /> Recommended
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 8, lineHeight: 1.5 }}>
            Basis: the revenue column is the net portfolio effect once the reductions in Recommended Reallocation are netted off;
            ROI is the gross return on the $10M allocated — 2.3x on $10M is about $23M gross against +$15M net. Brand-market and
            category options are mixed on purpose: a real allocation decision weighs both.
          </div>
        </Panel>

        <Panel
          span={2}
          title={`Allocate to ${optionName(o)}`}
          note={`${o.axis === 'brand-market' ? 'Brand-market option' : 'Category option'} · ${o.category}. The curve is a tuned lookup table with interpolation between measured points.`}
          accent={T.brand}
        >
          <div style={{ marginBottom: 4 }}>
            <div className="flex items-end justify-between" style={{ gap: 12, marginBottom: 6 }}>
              <div>
                <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60 }}>Amount allocated</div>
                <div style={{ ...NUM, fontFamily: FU, fontSize: 40, fontWeight: 600, color: T.ink, letterSpacing: '-0.035em', lineHeight: 1 }}>
                  ${alloc.toFixed(1)}M
                </div>
              </div>
              <div className="flex items-center" style={{ gap: 8 }}>
                {alloc !== ALLOC_DETENT && (
                  <Btn size="sm" onClick={() => setAlloc(ALLOC_DETENT)}>Snap to the $10.0M detent</Btn>
                )}
                {alloc === ALLOC_DETENT && (
                  <span className="inline-flex items-center" style={{ gap: 5, fontFamily: FU, fontSize: 11, fontWeight: 600, color: T.accent, border: `1px solid ${T.accent}55`, background: T.accentWash, padding: '3px 8px' }}>
                    <Check size={11} /> At the $10M decision point
                  </span>
                )}
              </div>
            </div>
            <Slider
              min={0} max={ALLOC_MAX} step={0.5} value={alloc} onChange={setAlloc}
              ariaLabel="Amount allocated to the selected option, in millions"
              marks={['$0', '$5M', '$10M', '$15M', '$20M']}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10, margin: '12px 0 10px', paddingTop: 11, borderTop: `1px solid ${T.ruleSoft}` }}>
            <Readout label="Revenue impact" value={fmtRev(out.rev)} size="lg" tone={T.growth} flash />
            <Readout label="ROI" value={`${out.roi.toFixed(1)}x`} size="lg" tone={out.roi >= PORTFOLIO_AVG_ROI ? T.growth : T.warn} flash sub={`Portfolio ${PORTFOLIO_AVG_ROI.toFixed(1)}x`} />
            <Readout label="Execution confidence" value={`${out.conf}%`} size="lg" tone={out.conf >= 70 ? T.ink : T.warn} flash
              sub={out.conf < 70 ? 'Outside the range we have evidence for' : 'Inside the tested range'} />
            <Readout label="Payback" value={fmtMonths(out.payback)} size="lg" flash />
          </div>

          <div style={{ height: 162, margin: '0 -6px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={curve} margin={{ top: 6, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gct-curve" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={T.ruleSoft} vertical={false} />
                <XAxis dataKey="alloc" tick={{ fontSize: 10, fill: T.ink60, fontFamily: FU }} tickFormatter={(v) => `$${v}M`} stroke={T.rule} />
                <YAxis tick={{ fontSize: 10, fill: T.ink60, fontFamily: FU }} tickFormatter={(v) => `${v}`} stroke={T.rule} />
                <RTooltip
                  contentStyle={{ fontFamily: FU, fontSize: 11, border: `1px solid ${T.rule}`, borderRadius: 0 }}
                  formatter={(v, n) => [`$${Number(v).toFixed(2)}M`, n === 'rev' ? 'Revenue impact' : 'Gross profit']}
                  labelFormatter={(v) => `Allocate $${v}M`}
                />
                <Area type="monotone" dataKey="rev" stroke={T.accent} strokeWidth={2} fill="url(#gct-curve)" isAnimationActive={!reduced} />
                <Line type="monotone" dataKey="gp" stroke={T.growth} strokeWidth={1.6} dot={false} isAnimationActive={!reduced} />
                <ReferenceLine x={o.apk} stroke={T.watch} strokeDasharray="4 3" label={{ value: 'Returns flatten', position: 'insideTopRight', fontSize: 9.5, fill: T.watch, fontFamily: FU }} />
                <ReferenceLine x={o.apk + 3} stroke={T.risk} strokeDasharray="2 3" />
                <ReferenceDot x={Math.round(alloc)} y={interp(o.id, Math.round(alloc)).rev} r={5} fill={T.brand} stroke="#fff" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center" style={{ gap: 12, fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 2 }}>
            <span className="inline-flex items-center" style={{ gap: 5 }}><span style={{ width: 12, height: 2, background: T.accent }} /> Revenue impact</span>
            <span className="inline-flex items-center" style={{ gap: 5 }}><span style={{ width: 12, height: 2, background: T.growth }} /> Gross profit</span>
            <span>Gross profit peaks near ${gpPeak.alloc}M and then falls — revenue keeps rising while margin does not.</span>
          </div>

          {out.equityRisk && (
            <div className="flex items-start" style={{ gap: 8, marginTop: 10, background: T.riskWash, border: `1px solid ${T.risk}44`, borderLeft: `4px solid ${T.risk}`, padding: '8px 10px' }}>
              <AlertTriangle size={14} color={T.risk} style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, lineHeight: 1.5 }}>
                Above ${o.apk + 3}M, {optionName(o)} drops below the reach floor the brand-health model treats as sustaining.
                Short-term revenue still rises; brand equity does not. This is a flag, not a hard stop.
              </span>
            </div>
          )}
          {out.diminishing && !out.equityRisk && (
            <div className="flex items-start" style={{ gap: 8, marginTop: 10, background: T.watchWash, border: `1px dashed ${T.watch}`, padding: '8px 10px' }}>
              <AlertCircle size={14} color={T.watch} style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, lineHeight: 1.5 }}>
                Past ${o.apk}M the retail-media networks run out of incremental inventory against this shopper. Each
                additional million returns roughly a third of the first.
              </span>
            </div>
          )}
        </Panel>

        <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
          <Panel title="Growth Control Tower Recommendation" accent={T.accent} dense>
            <div style={{ fontFamily: FS, fontSize: 19, color: T.ink, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
              Invest {fmtM(alloc)} in {optionName(o)}
            </div>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, margin: '8px 0 3px' }}>Expected impact</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
              <Readout label="Revenue" value={fmtRev(out.rev)} size="sm" tone={T.growth} />
              <Readout label="ROI" value={`${out.roi.toFixed(1)}x`} size="sm" />
              <Readout label="Payback" value={fmtMonths(out.payback)} size="sm" />
            </div>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, margin: '9px 0 3px' }}>Reason</div>
            {o.reasons.map((r) => (
              <div key={r} className="flex" style={{ gap: 6, marginBottom: 3 }}>
                <Check size={12} color={T.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, lineHeight: 1.4 }}>{r}</span>
              </div>
            ))}
            {o.id !== recommended.id && (
              <div style={{ fontFamily: FU, fontSize: 11, color: T.watch, background: T.watchWash, border: `1px dashed ${T.watch}`, padding: '6px 8px', marginTop: 7, lineHeight: 1.45 }}>
                Not the recommended option. {recommended.label} returns {fmtRev(recommended.at.rev)} at $10M against {fmtRev(atDetent.rev)} here.
              </div>
            )}
          </Panel>

          <Panel title="Execution Confidence" note="Everyone will ask how certain we are." dense accent={T.ink40}>
            <div className="flex items-baseline" style={{ gap: 8 }}>
              <span style={{ ...NUM, fontFamily: FU, fontSize: 30, fontWeight: 600, color: out.conf >= 70 ? T.ink : T.warn, letterSpacing: '-0.03em', lineHeight: 1 }}>{out.conf}%</span>
              <span style={{ fontFamily: FU, fontSize: 11, color: T.ink60 }}>of the range is covered by measured reads</span>
            </div>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, margin: '9px 0 3px' }}>Risk factors</div>
            {o.risks.map((r) => (
              <div key={r} className="flex" style={{ gap: 6, marginBottom: 3 }}>
                <AlertTriangle size={11} color={T.watch} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, lineHeight: 1.4 }}>{r}</span>
              </div>
            ))}
          </Panel>

          <Panel title="Commit this decision" dense accent={T.brand}>
            <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, lineHeight: 1.5, marginBottom: 9 }}>
              Invest {fmtM(alloc)} in {optionName(o)} for {fmtRev(out.rev)} of revenue impact at {out.roi.toFixed(1)}x,
              paying back in {fmtMonths(out.payback)}.
            </div>
            <Btn
              full tone="navy" size="lg" icon={Zap} disabled={alloc <= 0}
              onClick={() => {
                const cellId = o.cellId || `${o.brand}|${o.market}`;
                createIntervention({
                  type: 'budget_shift',
                  title: `Invest ${fmtM(alloc)} in ${optionName(o)}`,
                  brand: o.brand, market: o.market, cellId,
                  impact: Math.round(out.rev * 1e6),
                  functions: ['Media', 'Shopper marketing', 'Revenue growth management'],
                  agency: getCell(o.brand, o.market).agency,
                  pattern: o.pattern,
                  source: 'Simulate · stage 4',
                  confidence: out.conf,
                  detail: `${fmtM(alloc)} allocated to ${optionName(o)}. Projected ${fmtRev(out.rev)} revenue, ${out.roi.toFixed(1)}x ROI, ${out.conf}% confidence, ${fmtMonths(out.payback)} payback.`,
                });
                go(5);
              }}
            >
              Invest {fmtM(alloc)} in {optionName(o)}
            </Btn>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 7, lineHeight: 1.45 }}>
              This creates an intervention record in Orchestrate and an entry in the Learn log.
            </div>
          </Panel>
        </div>

        <Panel title="Recommended Reallocation" note="Where to invest more, and where less." dense accent={T.growth}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontFamily: FU, fontSize: 11, fontWeight: 700, color: T.growth, marginBottom: 5 }}>Increase</div>
              {realloc.inc.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between" style={{ gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: FU, fontSize: 12, color: T.ink }}>{r.label}</span>
                  <span style={{ ...NUM, fontFamily: FU, fontSize: 13, fontWeight: 700, color: T.growth }}>+${r.amount}M</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: FU, fontSize: 11, fontWeight: 700, color: T.risk, marginBottom: 5 }}>Reduce</div>
              {realloc.red.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between" style={{ gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: FU, fontSize: 12, color: T.ink }}>{r.label}</span>
                  <span style={{ ...NUM, fontFamily: FU, fontSize: 13, fontWeight: 700, color: T.risk }}>−${r.amount}M</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 9, paddingTop: 9, borderTop: `1px solid ${T.ruleSoft}` }}>
            <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60 }}>Net impact: </span>
            <span style={{ ...NUM, fontFamily: FU, fontSize: 15, fontWeight: 700, color: T.growth }}>{fmtRev(realloc.net)} incremental revenue</span>
          </div>
          <div style={{ fontFamily: FU, fontSize: 10, color: T.ink40, marginTop: 4, lineHeight: 1.4 }}>
            Computed from the rows at each market’s marginal return, and scaled with the amount allocated.
          </div>
        </Panel>

        <Panel title="Similar Investments" note="Enterprise learning — what the portfolio already knows." dense accent={T.replicate}>
          <div style={{ fontFamily: FU, fontSize: 12.5, fontWeight: 700, color: T.ink }}>Germany Premiumization Playbook</div>
          <div style={{ marginTop: 6 }}>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60 }}>Previously deployed</div>
            <div style={{ fontFamily: FU, fontSize: 12, fontWeight: 600, color: T.ink }}>{pb.deployedTo.join(' · ')}</div>
          </div>
          <div style={{ marginTop: 6 }}>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60 }}>Average outcome</div>
            <div style={{ ...NUM, fontFamily: FU, fontSize: 16, fontWeight: 700, color: T.replicate }}>{pb.avgOutcome}</div>
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: 9, paddingTop: 8, borderTop: `1px solid ${T.ruleSoft}`, gap: 8 }}>
            <span style={{ fontFamily: FU, fontSize: 11, fontWeight: 700, color: T.replicate }}>Capture → Codify → Replicate</span>
            <RouteLink onClick={() => go(8)}>Learn</RouteLink>
          </div>
        </Panel>

        <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
          <Panel title="Assumptions behind these numbers" dense accent={T.ink40}>
            <ul>
              {[
                'Retail media incrementality 1.9, linear TV 0.6 — both taken from the last two measured reads, held constant.',
                `Gross margin on incremental revenue held at 40%, with no price change.`,
                `Diminishing returns applied above $${o.apk}M as retail-media inventory saturates.`,
                'No competitive response modelled.',
                'Confidence is the share of the range covered by measured reads, not a statistical interval.',
              ].map((a, i) => (
                <li key={i} className="flex" style={{ gap: 7, marginBottom: 5 }}>
                  <span style={{ color: T.ink40, fontSize: 11 }}>—</span>
                  <span style={{ fontFamily: FU, fontSize: 10.5, color: T.ink, lineHeight: 1.45 }}>{a}</span>
                </li>
              ))}
            </ul>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, borderTop: `1px solid ${T.ruleSoft}`, paddingTop: 7, lineHeight: 1.5 }}>
              A tuned lookup table with interpolation between measured points. It is not a media mix model and is not labelled as one.
            </div>
          </Panel>

          <Panel title="Scenario overlays" note="Each one re-prices every option." dense>
            {Object.entries(SCENARIOS).map(([k, s]) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <button
                  type="button" onClick={() => setScenario(k)}
                  className="w-full text-left focus:outline-none focus:ring-2"
                  style={{
                    padding: '8px 9px',
                    border: `1px solid ${scenario === k ? T.accent : T.rule}`,
                    background: scenario === k ? T.accentWash : '#fff',
                    borderLeft: scenario === k ? `4px solid ${T.accent}` : `1px solid ${T.rule}`,
                  }}
                >
                  <span className="flex items-center justify-between" style={{ gap: 8 }}>
                    <span style={{ fontFamily: FU, fontSize: 12, fontWeight: 600, color: T.ink }}>{s.label}</span>
                    <span style={{ fontFamily: FU, fontSize: 10.5, fontWeight: 700, color: scenario === k ? T.accent : T.ink40 }}>
                      {scenario === k ? 'On' : 'Off'}
                    </span>
                  </span>
                  <span style={{ display: 'block', fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 2, lineHeight: 1.4 }}>{s.detail}</span>
                  {scenario === k && (
                    <span style={{ display: 'block', marginTop: 6 }}>
                      {s.assumptions.map((a) => (
                        <span key={a} style={{ display: 'block', fontFamily: FU, fontSize: 10.5, color: T.ink, lineHeight: 1.45 }}>— {a}</span>
                      ))}
                    </span>
                  )}
                </button>
              </div>
            ))}
          </Panel>
        </div>

        <Panel
          span={3} dense
          title="Innovation timing and cannibalisation"
          note="Caribou Coffee RTD Cold Brew 12oz — when to launch, and how much of the volume comes from the existing range."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr) minmax(0,1fr)', gap: 14 }}>
            <div>
              <div className="flex" style={{ gap: 5, marginBottom: 9 }}>
                {INNOVATION_TIMING.map((x) => (
                  <button
                    key={x.window} type="button" onClick={() => setTiming(x.window)}
                    className="focus:outline-none focus:ring-2"
                    style={{
                      fontFamily: FU, fontSize: 11.5, fontWeight: 600, padding: '4px 10px',
                      color: timing === x.window ? '#fff' : T.ink60,
                      background: timing === x.window ? T.brand : '#fff',
                      border: `1px solid ${timing === x.window ? T.brand : T.rule}`,
                    }}
                  >
                    {x.window}
                  </button>
                ))}
              </div>
              <div className="flex items-baseline" style={{ gap: 18 }}>
                <Readout label="Incremental volume" value={`${t.incremental}%`} size="md" tone={T.growth} />
                <Readout label="Taken from the core range" value={`${t.cannibalised}%`} size="md" tone={T.watch} />
                <Readout label="Net new revenue" value={fmtM(t.net)} size="md" />
              </div>
              <div style={{ marginTop: 9, display: 'flex', height: 12, border: `1px solid ${T.rule}` }}>
                <div style={{ width: `${t.incremental}%`, background: T.growth, transition: 'width 300ms ease' }} />
                <div style={{ width: `${t.cannibalised}%`, background: T.watch, transition: 'width 300ms ease' }} />
              </div>
              <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, marginTop: 8, lineHeight: 1.5 }}>{t.note}</div>
            </div>
            <div>
              <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginBottom: 6 }}>Net new revenue by window</div>
              <div style={{ height: 118 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={INNOVATION_TIMING} margin={{ top: 2, right: 6, left: -22, bottom: 0 }}>
                    <CartesianGrid stroke={T.ruleSoft} vertical={false} />
                    <XAxis dataKey="window" tick={{ fontSize: 10, fill: T.ink60, fontFamily: FU }} stroke={T.rule} />
                    <YAxis tick={{ fontSize: 10, fill: T.ink60, fontFamily: FU }} stroke={T.rule} />
                    <RTooltip contentStyle={{ fontFamily: FU, fontSize: 11, borderRadius: 0, border: `1px solid ${T.rule}` }} formatter={(v) => [`$${v}M`, 'Net new']} />
                    <Bar dataKey="net" isAnimationActive={!reduced}>
                      {INNOVATION_TIMING.map((x) => (
                        <RCell key={x.window} fill={x.window === timing ? T.brand : '#CDBEB8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginBottom: 6 }}>Simplifying assumptions, stated</div>
              {INNOVATION_ASSUMPTIONS.map((a) => (
                <div key={a} className="flex" style={{ gap: 7, marginBottom: 6 }}>
                  <span style={{ color: T.ink40, fontSize: 11 }}>—</span>
                  <span style={{ fontFamily: FU, fontSize: 11, color: T.ink, lineHeight: 1.5 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ============================================================================
   ASK THE GCT — the front door.
   No model sits behind this. Each question returns a short deterministic answer
   composed from the real computed state (ranked list, rebalance, diagnosis),
   then routes to the stage that owns it with the right cell pre-selected.
   ========================================================================== */
const ASK_QUESTIONS = [
  'Where should I invest next quarter?',
  'Which brands deserve incremental funding?',
  'Why is France underperforming Germany?',
  'What happens if media spend is reduced 20%?',
];
const MARGINAL_CUT_FACTOR = 0.7; // revenue lost per dollar of media cut, as a share of modeled ROI (diminishing returns)

function composeAnswer(qIndex, state) {
  const ranked = rankedItems(state.outcomesLog, state.priorityWeights);
  const reb = rebalance(CELLS, state.priorityWeights, state.outcomesLog, state.interventions);
  if (qIndex === 0) {
    const top = ranked[0];
    const into = reb.into.slice(0, 2).map((d) => `${d.cell.brand} ${d.cell.market} (+${fmtM(d.amount)})`).join(' and ');
    const best = optionTable(null)[0];
    return {
      text: `Top of the ranked list is “${top.title}” — ${fmtM(top.value)} at stake, ${top.conf}% confidence. The rebalance moves ${fmtM(reb.pool)} into ${into || 'no destination yet'}. Simulate’s strongest allocation is $${ALLOC_DETENT}M in ${optionName(best)}, ${fmtRev(best.at.rev)} at ${best.at.roi.toFixed(1)}x.`,
      stage: 4, label: 'Open Simulate', run: (set) => set({ simOption: best.id, selectedCell: { brand: top.brand, market: top.market } }),
    };
  }
  if (qIndex === 1) {
    const funded = ranked.filter((r) => r.money > 0).sort((a, b) => b.value / b.money - a.value / a.money).slice(0, 3);
    const line = funded.map((r) => `${r.brand} ${r.market} (${(r.value / r.money).toFixed(1)}x on ${fmtM(r.money)})`).join(', ');
    return {
      text: `Ranked by return on the incremental ask: ${line}. Together that is ${fmtM(funded.reduce((a, r) => a + r.money, 0))} of new money against ${fmtM(funded.reduce((a, r) => a + r.value, 0))} of value at stake.`,
      stage: 3, label: 'Open the funding view', run: (set) => set({ priView: 'funding' }),
    };
  }
  if (qIndex === 2) {
    const a = getCell("L'OR", 'France'); const b = getCell("L'OR", 'Germany');
    const causes = causesFor(a);
    const ai = aiAssessmentFor(a, causes);
    return {
      text: `L’OR France is at index ${a.index} against ${b.index} in Germany — ${fmtM(a.gap)} to plan. ${causes[0].cause} explains ${causes[0].weight}% and ${causes[1].cause.toLowerCase()} ${causes[1].weight}% (rule-weighted confidence ${ai.conf}%). The Germany premiumization playbook is worth ${fmtRev(PLAYBOOK_BY_ID[DEFAULT_PLAYBOOK].impact)} here.`,
      stage: 2, label: 'Open Diagnose', run: (set) => set({ selectedCell: { brand: "L'OR", market: 'France' } }),
    };
  }
  const roll = portfolioRoll(CELLS, []);
  const flatMedia = roll.spend * 0.2;
  const flatRev = CELLS.reduce((a, c) => a + c.mediaSpend * 0.2 * c.roi * MARGINAL_CUT_FACTOR, 0);
  const low = CELLS.filter((c) => c.roi < SOURCE_ROI);
  const lowMedia = low.reduce((a, c) => a + c.mediaSpend * 0.2, 0);
  const lowRev = low.reduce((a, c) => a + c.mediaSpend * 0.2 * c.roi * MARGINAL_CUT_FACTOR, 0);
  const idxAfter = Math.round((roll.revenue - flatRev) / roll.target * 100);
  return {
    text: `A flat 20% cut takes ${fmtM(flatMedia)} out of working media and costs about ${fmtM(flatRev)} of revenue (portfolio index ${roll.index} to ${idxAfter}). Cutting only the ${low.length} cells below ${SOURCE_ROI}x ROI releases ${fmtM(lowMedia)} for about ${fmtM(lowRev)} of lost revenue — which is why Optimise rebalances rather than cuts across the board.`,
    stage: 7, label: 'Open Optimise', run: () => {},
  };
}

function AskPanel({ state, set, go, onDone }) {
  const q = state.askQ;
  const answer = q === null || q === undefined ? null : composeAnswer(q, state);
  return (
    <Panel
      title="Ask the GCT"
      note="The front door to the tower — pick a question and it answers, then takes you to the stage that owns it."
      accent={T.accent}
      action={<Sparkles size={15} color={T.accent} />}
    >
      <div className="flex flex-wrap" style={{ gap: 7, marginBottom: 10 }}>
        {ASK_QUESTIONS.map((text, i) => (
          <button
            key={text} type="button" onClick={() => set({ askQ: i })}
            aria-pressed={q === i}
            className="focus:outline-none focus:ring-2"
            style={{
              fontFamily: FU, fontSize: 12, fontWeight: 600, padding: '6px 11px', textAlign: 'left',
              color: q === i ? '#fff' : T.ink, background: q === i ? T.accent : T.accentWash,
              border: `1px solid ${q === i ? T.accent : T.accent + '55'}`,
            }}
          >
            {text}
          </button>
        ))}
      </div>
      <div aria-live="polite" style={{ minHeight: 52 }}>
        {answer ? (
          <div style={{ background: '#F7F5F3', border: `1px solid ${T.ruleSoft}`, borderLeft: `4px solid ${T.accent}`, padding: '10px 12px' }}>
            <div style={{ fontFamily: FU, fontSize: 11, fontWeight: 700, color: T.accentDeep, marginBottom: 3 }}>{ASK_QUESTIONS[q]}</div>
            <div style={{ fontFamily: FU, fontSize: 12.5, color: T.ink, lineHeight: 1.55 }}>{answer.text}</div>
            <div style={{ marginTop: 9 }}>
              <Btn tone="navy" size="sm" icon={ArrowRight} onClick={() => { answer.run(set); go(answer.stage); if (onDone) onDone(); }}>{answer.label}</Btn>
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: FU, fontSize: 12, color: T.ink60, lineHeight: 1.5 }}>Choose a question above.</div>
        )}
      </div>
      <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 8, lineHeight: 1.45 }}>
        Answers are composed from the live session state. Lookup logic, not a language model.
      </div>
    </Panel>
  );
}

function AskModal({ open, state, set, go, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center" style={{ background: 'rgba(36,24,18,0.55)', padding: '70px 20px 20px' }} onClick={onClose}>
      <div role="dialog" aria-label="Ask the GCT" style={{ width: 640, maxWidth: '100%' }} onClick={(e) => e.stopPropagation()}>
        <AskPanel state={state} set={set} go={go} onDone={onClose} />
        <div style={{ marginTop: 8, textAlign: 'right' }}>
          <Btn size="sm" icon={X} onClick={onClose}>Close</Btn>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   STAGE 5 — ORCHESTRATE
   ========================================================================== */
function OrchestrateView({ state, set, go, createIntervention, actOn }) {
  const { interventions, escalationThreshold } = state;
  const [types, setTypes] = useState({});
  const reduced = usePrefersReducedMotion();
  const escalated = interventions.filter((i) => i.impact >= escalationThreshold);
  const auto = interventions.filter((i) => i.impact < escalationThreshold);
  const ranked = rankedItems(state.outcomesLog, state.priorityWeights);
  const notYet = ranked.filter((r) => !interventions.some((i) => i.sourceId === r.id)).slice(0, 4);

  return (
    <div>
      <Question sub="Each record carries the brand, market, functions and agency it spans, so the coordination problem is visible rather than assumed.">
        How do we turn decisions into action?
      </Question>

      <div style={{ marginBottom: 10 }}>
        <AskPanel state={state} set={set} go={go} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2.2fr) minmax(0,1fr)', gap: 10 }}>
        <Panel
          title={`Intervention log — ${interventions.length} record${interventions.length === 1 ? '' : 's'} this session`}
          note="Held in session state and read by Replicate, Optimise and Learn."
          dense
          action={
            <span className="inline-flex items-center" style={{ gap: 10 }}>
              <span style={{ fontFamily: FU, fontSize: 11, color: T.risk, fontWeight: 600, ...NUM }}>{escalated.length} escalated</span>
              <span style={{ fontFamily: FU, fontSize: 11, color: T.opp, fontWeight: 600, ...NUM }}>{auto.length} auto-resolve</span>
            </span>
          }
        >
          {interventions.length === 0 ? (
            <div style={{ padding: '18px 4px' }}>
              <div style={{ fontFamily: FU, fontSize: 13, fontWeight: 600, color: T.ink }}>Nothing has been committed yet.</div>
              <div style={{ fontFamily: FU, fontSize: 12, color: T.ink60, marginTop: 4, lineHeight: 1.5, maxWidth: 480 }}>
                Turn one of the ranked recommendations below into a record, or go back to Simulate and commit the
                $10M allocation. Records created here stay for the rest of the session.
              </div>
            </div>
          ) : (
            <div style={{ margin: '0 -12px' }}>
              {interventions.map((i, ix) => {
                const esc = i.impact >= escalationThreshold;
                return (
                  <div
                    key={i.id}
                    style={{
                      borderBottom: `1px solid ${T.ruleSoft}`,
                      borderLeft: `3px solid ${esc ? T.risk : T.opp}`,
                      padding: '10px 12px',
                      background: (state.justAdded || []).includes(i.ref) ? '#F7F5F3' : 'transparent',
                      animation: (state.justAdded || []).includes(i.ref) && !reduced ? 'gctLand 420ms ease-out' : undefined,
                    }}
                  >
                    <div className="flex items-start justify-between" style={{ gap: 10 }}>
                      <div style={{ minWidth: 0 }}>
                        <div className="flex items-center flex-wrap" style={{ gap: 7 }}>
                          <span style={{ ...NUM, fontFamily: FU, fontSize: 10.5, fontWeight: 700, color: T.ink40 }}>{i.ref}</span>
                          <span style={{ fontFamily: FU, fontSize: 10.5, fontWeight: 700, color: T.navy, background: '#EFE6E2', padding: '1px 6px' }}>
                            {INTERVENTION_TYPES[i.type]}
                          </span>
                          <span style={{ fontFamily: FU, fontSize: 12.5, fontWeight: 600, color: T.ink }}>{i.title}</span>
                        </div>
                        <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginTop: 3, lineHeight: 1.45 }}>{i.detail}</div>
                        <div className="flex flex-wrap items-center" style={{ gap: 8, marginTop: 5 }}>
                          {[`${i.brand} · ${i.market}`, ...i.functions, i.agency].map((f, fi) => (
                            <span key={fi} style={{ fontFamily: FU, fontSize: 10, color: T.ink60, border: `1px solid ${T.rule}`, padding: '1px 6px' }}>{f}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ ...NUM, fontFamily: FU, fontSize: 17, fontWeight: 700, color: T.ink, letterSpacing: '-0.02em' }}>{fmtMoney(i.impact)}</div>
                        <div
                          style={{
                            fontFamily: FU, fontSize: 10.5, fontWeight: 700, color: esc ? T.risk : T.opp,
                            background: esc ? T.riskWash : T.oppWash, padding: '2px 7px', marginTop: 3,
                            border: `1px solid ${(esc ? T.risk : T.opp)}33`, transition: 'background 220ms ease',
                          }}
                        >
                          {esc ? 'Escalate to Coffee OU review' : 'Auto-resolve in market'}
                        </div>
                        <div style={{ marginTop: 6 }}>
                          {i.status === 'acted' ? (
                            <span className="inline-flex items-center" style={{ gap: 4, fontFamily: FU, fontSize: 10.5, fontWeight: 600, color: T.opp }}>
                              <Check size={11} /> Acted — logged to Learn
                            </span>
                          ) : (
                            <Btn size="sm" tone="primary" icon={Check} onClick={() => actOn(i.id)}>Act on it</Btn>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
          <Panel title="Escalation threshold" note="Records reclassify the moment you move it." accent={T.risk} dense>
            <div className="flex items-baseline" style={{ gap: 8, marginBottom: 7 }}>
              <span style={{ ...NUM, fontFamily: FU, fontSize: 30, fontWeight: 600, color: T.ink, letterSpacing: '-0.03em', lineHeight: 1 }}>
                {fmtMoney(escalationThreshold)}
              </span>
              <span style={{ fontFamily: FU, fontSize: 11, color: T.ink60 }}>and above goes to Coffee OU review</span>
            </div>
            <Slider
              min={500000} max={8000000} step={100000} value={escalationThreshold}
              onChange={(v) => set({ escalationThreshold: v })}
              ariaLabel="Escalation threshold in dollars"
              marks={['$0.5M', '$4M', '$8M']}
            />
            <div style={{ fontFamily: FU, fontSize: 11, color: T.ink, marginTop: 7, lineHeight: 1.5 }}>
              At {fmtMoney(escalationThreshold)}, {escalated.length} of {interventions.length} record
              {interventions.length === 1 ? '' : 's'} need Coffee OU review and {auto.length} can be resolved in market.
            </div>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 6, lineHeight: 1.45 }}>
              Default is $2.0M — the point above which a single market decision affects the Coffee OU plan.
            </div>
          </Panel>

          <Panel title="Turn a recommendation into a record" note="One click. The record keeps its source." dense accent={T.teal}>
            {notYet.length === 0 ? (
              <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60, lineHeight: 1.5 }}>
                Every top recommendation already has a record. Open Replicate to scale the Germany playbook, or Optimise
                to rebalance the portfolio.
              </div>
            ) : notYet.map((r) => (
              <div key={r.id} style={{ borderBottom: `1px solid ${T.ruleSoft}`, paddingBottom: 9, marginBottom: 9 }}>
                <div style={{ fontFamily: FU, fontSize: 11.5, fontWeight: 600, color: T.ink, lineHeight: 1.4 }}>{r.title}</div>
                <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 2 }}>
                  Rank {r.rank}, {fmtM(r.value)} at stake, {r.conf}% confidence
                </div>
                <div className="flex items-center" style={{ gap: 6, marginTop: 7 }}>
                  <select
                    value={types[r.id] || r.defaultType}
                    onChange={(e) => setTypes((t) => ({ ...t, [r.id]: e.target.value }))}
                    aria-label={`Record type for ${r.title}`}
                    className="focus:outline-none focus:ring-2"
                    style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, border: `1px solid ${T.rule}`, padding: '4px 5px', background: '#fff', flex: 1, minWidth: 0 }}
                  >
                    {Object.entries(INTERVENTION_TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                  <Btn
                    size="sm" tone="primary" icon={Plus}
                    onClick={() => createIntervention({
                      type: types[r.id] || r.defaultType, title: r.title, brand: r.brand, market: r.market,
                      cellId: `${r.brand}|${r.market}`, impact: Math.round(r.value * 1e6),
                      functions: ['Brand marketing', 'Media', 'Category'],
                      agency: getCell(r.brand, r.market).agency,
                      pattern: r.pattern, source: 'Prioritise · stage 3', sourceId: r.id, confidence: r.conf,
                      detail: `${PATTERNS[r.pattern]}, ${fmtM(r.value)} of value at stake, confidence ${r.conf}%`,
                    })}
                  >
                    Create record
                  </Btn>
                </div>
              </div>
            ))}
          </Panel>

          <Panel title="Coordination load" dense>
            {interventions.length === 0 ? (
              <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60, lineHeight: 1.5 }}>
                Create a record and the functions, markets and agencies it spans show up here.
              </div>
            ) : (
              <div>
                {[['Brands touched', new Set(interventions.map((i) => i.brand)).size],
                  ['Markets touched', new Set(interventions.map((i) => i.market)).size],
                  ['Functions spanned', new Set(interventions.flatMap((i) => i.functions)).size],
                  ['Agencies involved', new Set(interventions.map((i) => i.agency)).size],
                  ['Committed value', fmtMoney(interventions.reduce((a, i) => a + i.impact, 0))]].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between" style={{ gap: 8, padding: '4px 0', borderBottom: `1px solid ${T.ruleSoft}` }}>
                    <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60 }}>{k}</span>
                    <span style={{ ...NUM, fontFamily: FU, fontSize: 15, fontWeight: 700, color: T.ink }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   STAGE 6 — REPLICATE
   The learning has to feel reusable: a codified playbook, selectable, re-ranking the candidates.
   ========================================================================== */
const TONE_BY_STATUS = { ready: T.growth, partial: T.watch, adapt: T.ink60 };

function ReplicateView({ state, set, go, replicateTo }) {
  const pbId = state.playbook || DEFAULT_PLAYBOOK;
  const pb = PLAYBOOK_BY_ID[pbId];
  const candidates = useMemo(() => candidatesFor(pbId), [pbId]);
  const open = state.repOpen;
  const done = state.interventions.filter((i) => i.source && i.source.startsWith('Replicate'));
  const doneKeys = new Set(done.map((d) => d.repKey));
  const origin = pb.id === DEFAULT_PLAYBOOK ? getCell("L'OR", 'Germany') : null;
  const choosePlaybook = (id) => set({ playbook: id, repOpen: candidatesFor(id)[0].id });

  return (
    <div>
      <Question sub={`${pb.name} is a codified play: it was captured from the markets where it worked, written down once, and can now be replicated. Similarity is scored on shopper profile, category conditions and existing capability — all three are shown, because a bare score is a black box.`}>
        How do we scale what works?
      </Question>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2.2fr) minmax(0,1fr)', gap: 10 }}>
        <Panel title="Replication candidates" note={`Ranked by similarity to ${pb.name}. Pick a different playbook on the right and the ranking re-computes.`} dense>
          <div style={{ margin: '0 -12px' }}>
            {candidates.map((r) => {
              const isOpen = open === r.id;
              const replicated = doneKeys.has(`${pb.id}|${r.id}`);
              const tone = TONE_BY_STATUS[r.statusTone];
              const cell = getCell(r.brand, r.market);
              return (
                <div key={r.id} style={{ borderBottom: `1px solid ${T.ruleSoft}`, borderLeft: `3px solid ${replicated ? T.growth : 'transparent'}` }}>
                  <button
                    type="button" onClick={() => set({ repOpen: isOpen ? null : r.id })}
                    aria-expanded={isOpen}
                    className="w-full text-left focus:outline-none focus:ring-2"
                    style={{ padding: '10px 12px', background: isOpen ? '#F7F5F3' : 'transparent' }}
                  >
                    <span className="flex items-center" style={{ gap: 12 }}>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span className="flex items-center" style={{ gap: 7 }}>
                          <span style={{ fontFamily: FU, fontSize: 13, fontWeight: 600, color: T.ink }}>{r.brand} · {r.market}</span>
                          <SignalGlyph type={cell.cls} size={7} />
                          {replicated && (
                            <span className="inline-flex items-center" style={{ gap: 3, fontFamily: FU, fontSize: 10, fontWeight: 700, color: T.growth, background: T.growthWash, padding: '1px 6px' }}>
                              <Check size={10} /> Replicated
                            </span>
                          )}
                        </span>
                        <span style={{ display: 'block', fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 2 }}>
                          {r.status} — {r.note} · {r.have.length} in place, {r.need.length} to build
                        </span>
                      </span>
                      <span style={{ width: 118 }}>
                        <span className="flex items-baseline justify-between" style={{ gap: 6 }}>
                          <span style={{ fontFamily: FU, fontSize: 10, color: T.ink60 }}>Similarity</span>
                          <span style={{ ...NUM, fontFamily: FU, fontSize: 14, fontWeight: 700, color: T.ink }}>{r.similarity.toFixed(2)}</span>
                        </span>
                        <MiniBar value={r.similarity * 100} max={100} height={4} color={tone} />
                      </span>
                      <span style={{ width: 74, textAlign: 'right' }}>
                        <span style={{ display: 'block', fontFamily: FU, fontSize: 10, color: T.ink60 }}>Est. impact</span>
                        <span style={{ ...NUM, fontFamily: FU, fontSize: 16, fontWeight: 700, color: T.growth, letterSpacing: '-0.02em' }}>+{fmtM(r.impact)}</span>
                      </span>
                      <span style={{ width: 128 }}>
                        <span style={{ fontFamily: FU, fontSize: 10.5, fontWeight: 700, color: tone, border: `1px solid ${tone}44`, background: tone + '11', padding: '2px 7px', display: 'inline-block' }}>
                          {r.status}
                        </span>
                      </span>
                      <ChevronRight size={14} color={T.ink40} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 180ms ease' }} />
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '2px 12px 14px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 14 }}>
                      <div>
                        <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginBottom: 6 }}>What drives the similarity score</div>
                        {r.attrs.map((a) => (
                          <div key={a.attr} style={{ marginBottom: 7 }}>
                            <div className="flex items-baseline justify-between" style={{ gap: 8 }}>
                              <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, fontWeight: 600 }}>{a.attr}</span>
                              <span style={{ ...NUM, fontFamily: FU, fontSize: 12, fontWeight: 700, color: a.score >= 0.85 ? T.growth : a.score >= 0.7 ? T.watch : T.risk }}>{a.score.toFixed(2)}</span>
                            </div>
                            <MiniBar value={a.score * 100} max={100} height={4} color={a.score >= 0.85 ? T.growth : a.score >= 0.7 ? T.watch : T.risk} />
                            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 2, lineHeight: 1.4 }}>{a.note}</div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontFamily: FU, fontSize: 11, color: T.growth, marginBottom: 6, fontWeight: 600 }}>Already in place</div>
                        {r.have.map((h) => (
                          <div key={h} className="flex" style={{ gap: 6, marginBottom: 5 }}>
                            <Check size={12} color={T.growth} style={{ marginTop: 1, flexShrink: 0 }} />
                            <span style={{ fontFamily: FU, fontSize: 11, color: T.ink, lineHeight: 1.45 }}>{h}</span>
                          </div>
                        ))}
                        <div style={{ fontFamily: FU, fontSize: 11, color: T.watch, margin: '9px 0 6px', fontWeight: 600 }}>Needs building</div>
                        {r.need.map((n) => (
                          <div key={n} className="flex" style={{ gap: 6, marginBottom: 5 }}>
                            <Plus size={12} color={T.watch} style={{ marginTop: 1, flexShrink: 0 }} />
                            <span style={{ fontFamily: FU, fontSize: 11, color: T.ink, lineHeight: 1.45 }}>{n}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginBottom: 6 }}>If we do it</div>
                        <Readout label="Estimated revenue" value={`+${fmtM(r.impact)}`} size="md" tone={T.growth} />
                        <div style={{ marginTop: 8 }}>
                          <Readout label="Agency" value={cell.agency} size="sm" />
                        </div>
                        <div style={{ marginTop: 10 }}>
                          {replicated ? (
                            <div>
                              <div className="inline-flex items-center" style={{ gap: 5, fontFamily: FU, fontSize: 11.5, fontWeight: 600, color: T.growth, marginBottom: 7 }}>
                                <Check size={13} /> Record created and logged
                              </div>
                              <div className="flex" style={{ gap: 6 }}>
                                <Btn size="sm" onClick={() => go(5)}>See the record</Btn>
                                <Btn size="sm" onClick={() => go(8)}>See the log entry</Btn>
                              </div>
                            </div>
                          ) : (
                            <Btn full tone="navy" icon={Repeat} onClick={() => replicateTo(r)}>
                              Replicate to {r.brand} {r.market}
                            </Btn>
                          )}
                        </div>
                        <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 8, lineHeight: 1.45 }}>
                          Replicating writes an intervention record in Orchestrate and an entry in the Learn log — which
                          is what moves confidence on the ranked list.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>

        <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
          <Panel title="Winning Playbooks" note="Capture → Codify → Replicate. Pick one to re-rank the candidates." accent={T.replicate} dense>
            <div className="flex flex-wrap" style={{ gap: 5, marginBottom: 10 }}>
              {PLAYBOOKS.map((p) => (
                <button
                  key={p.id} type="button" onClick={() => choosePlaybook(p.id)}
                  aria-pressed={p.id === pbId}
                  className="focus:outline-none focus:ring-2"
                  style={{
                    fontFamily: FU, fontSize: 10.5, fontWeight: 600, padding: '3px 7px', textAlign: 'left',
                    color: p.id === pbId ? '#fff' : T.ink60, background: p.id === pbId ? T.replicate : '#fff',
                    border: `1px solid ${p.id === pbId ? T.replicate : T.rule}`,
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60 }}>Campaign</div>
            <div style={{ fontFamily: FU, fontSize: 14, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em', marginBottom: 8 }}>{pb.name}</div>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginBottom: 3 }}>Success drivers</div>
            {pb.drivers.map((d) => (
              <div key={d} className="flex" style={{ gap: 6, marginBottom: 3 }}>
                <Check size={12} color={T.replicate} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, lineHeight: 1.4 }}>{d}</span>
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              <Readout label="Markets where replicated" value={pb.markets.join(' · ')} size="sm" />
              <Readout label="Revenue impact" value={`+${fmtM(pb.revenueImpact)}`} size="sm" tone={T.growth} />
            </div>
            {origin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10, paddingTop: 9, borderTop: `1px solid ${T.ruleSoft}` }}>
                <Readout label="Proven on" value="L’OR · Germany" size="sm" />
                <Readout label="ROI" value={`${origin.roi.toFixed(1)}x`} size="sm" tone={T.growth} sub={`Portfolio ${PORTFOLIO_AVG_ROI.toFixed(1)}x`} />
                <Readout label="Index" value={`${origin.index}`} size="sm" tone={T.growth} />
                <Readout label="Revenue above plan" value={fmtM(origin.gap)} size="sm" tone={T.growth} />
              </div>
            )}
          </Panel>

          <Panel title="Replication so far" dense accent={done.length ? T.growth : undefined}>
            {done.length === 0 ? (
              <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink60, lineHeight: 1.5 }}>
                Nothing replicated yet. {candidates[0].brand} {candidates[0].market} is the highest-similarity candidate at {candidates[0].similarity.toFixed(2)}
                {candidates[0].statusTone === 'ready' ? ' and needs no new capability' : ''} — start there.
              </div>
            ) : (
              <div>
                {done.map((d) => (
                  <div key={d.id} style={{ borderBottom: `1px solid ${T.ruleSoft}`, padding: '5px 0' }}>
                    <div style={{ fontFamily: FU, fontSize: 11.5, fontWeight: 600, color: T.ink }}>{d.brand} · {d.market}</div>
                    <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60 }}>{d.ref} · {fmtMoney(d.impact)} estimated</div>
                  </div>
                ))}
                <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, marginTop: 9, lineHeight: 1.5 }}>
                  {done.length} replication{done.length === 1 ? '' : 's'} worth
                  {' '}{fmtMoney(done.reduce((a, d) => a + d.impact, 0))}, now carrying evidence for the next decision.
                </div>
                <div style={{ marginTop: 8 }}>
                  <Btn size="sm" full tone="primary" icon={Target} onClick={() => go(3)}>See what this did to the ranked list</Btn>
                </div>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   STAGE 7 — OPTIMISE
   ========================================================================== */
const MARKET_READ = {
  Germany: 'Best effectiveness — the source of the play being replicated',
  France: 'Largest absolute gap, largest absolute upside',
  Netherlands: 'Strong; premiumization already rolled out',
  UK: 'Linear TV still heavy; share under pressure',
  Belgium: 'Steady; follows the Netherlands',
  Austria: 'Thin; Peet’s is the standout',
  Brazil: 'Pilão carrying the market',
  Australia: 'Steady; Caribou and Moccona split the upside',
};

/* Recommended Interventions — each carries an expected impact and creates an Orchestrate record */
function recommendedInterventions() {
  const item = (id) => PRIORITY_ITEMS.find((p) => p.id === id);
  const ukTv = CELLS.filter((c) => c.market === 'UK').reduce((a, c) => a + c.mediaSpend * c.mix.find((m) => m.channel === 'Linear TV').share / 100 * 0.15, 0);
  const podsImpact = candidatesFor('pb-pods').reduce((a, c) => a + c.impact, 0);
  const lorDe = item('p-lor-de-scale'); const lorFr = item('p-lor-fr-repl');
  return [
    { text: "Increase investment in L'OR Germany", impact: `${fmtRev(lorDe.value)} revenue`, value: lorDe.value, brand: "L'OR", market: 'Germany', type: 'media_support', pattern: 'scale_spend', functions: ['Media', 'Brand marketing', 'Finance'] },
    { text: 'Scale the Germany premiumization campaign to France', impact: `${fmtRev(lorFr.value)} revenue`, value: lorFr.value, brand: "L'OR", market: 'France', type: 'media_support', pattern: 'premiumization', functions: ['Brand marketing', 'Media', 'Category'] },
    { text: 'Reduce linear TV spend in the UK', impact: `Releases ${fmtM(r1(ukTv))}`, value: r1(ukTv), brand: 'Kenco', market: 'UK', type: 'budget_shift', pattern: 'media_mix', functions: ['Media', 'Finance'] },
    { text: 'Deploy the Premium Pods Expansion playbook across EMEA', impact: `${fmtRev(r1(podsImpact))} revenue`, value: r1(podsImpact), brand: 'Senseo', market: 'France', type: 'media_support', pattern: 'pods_expansion', functions: ['Brand marketing', 'Shopper marketing', 'Media'] },
  ];
}

function OptimiseView({ state, set, go, createIntervention }) {
  const reduced = usePrefersReducedMotion();
  const roll = useMemo(() => portfolioRoll(CELLS, state.interventions), [state.interventions]);
  const reb = useMemo(
    () => rebalance(CELLS, state.priorityWeights, state.outcomesLog, state.interventions),
    [state.priorityWeights, state.outcomesLog, state.interventions]
  );
  const load = useMemo(() => agencyLoad(CELLS, state.interventions), [state.interventions]);
  const hottest = load[0];
  const coolest = load[load.length - 1];
  const repAgency = load.find((a) => a.agency === getCell("L'OR", 'France').agency) || hottest;
  const interventionRows = useMemo(() => recommendedInterventions(), []);

  return (
    <div>
      <Question sub="All 96 cells, rolled up. Everything on this screen recalculates when spend, performance or the Prioritise weights change — including the rebalance below.">
        How do we keep improving across the whole portfolio?
      </Question>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10 }}>
        <Panel span={4} dense title="Portfolio roll-up" note="12 of 60 brands · 8 of 100 markets · 96 brand-market cells · synthetic">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 14 }}>
            <Readout label="Revenue YTD" value={`$${roll.revenue.toLocaleString()}M`} size="md" sub={`Target $${roll.target.toLocaleString()}M`} />
            <Readout label="Portfolio index" value={`${roll.index}`} size="md" tone={roll.index >= 100 ? T.opp : T.warn} sub={roll.index >= 100 ? 'Ahead of plan' : 'Behind plan'} />
            <Readout label="Working media" value={`$${roll.spend}M`} size="md" sub="Spend-weighted" />
            <Readout label="Blended ROI" value={`${roll.roi.toFixed(2)}x`} size="md" sub={`Best cell ${roll.bestRoi.toFixed(1)}x, weakest ${roll.worstRoi.toFixed(1)}x`} />
            <Readout
              label="Committed this session"
              value={state.interventions.length ? fmtMoney(state.interventions.reduce((a, i) => a + i.impact, 0)) : '—'}
              size="md"
              tone={state.interventions.length ? T.teal : T.ink40}
              sub={`${state.interventions.length} intervention${state.interventions.length === 1 ? '' : 's'}`}
            />
          </div>
        </Panel>

        <Panel
          span={4} accent={T.accent} dense
          title="Recommended Interventions"
          note="Most dashboards stop at the roll-up. These four carry an expected impact and create the Orchestrate record in one click."
        >
          {interventionRows.map((r, i) => (
            <div key={r.text} className="flex items-center" style={{ gap: 12, padding: '8px 0', borderBottom: i < interventionRows.length - 1 ? `1px solid ${T.ruleSoft}` : 'none' }}>
              <span style={{ ...NUM, fontFamily: FU, fontSize: 11, fontWeight: 700, color: '#fff', background: T.accent, width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontFamily: FU, fontSize: 12.5, fontWeight: 600, color: T.ink, lineHeight: 1.4 }}>{r.text}</span>
              <span style={{ ...NUM, fontFamily: FU, fontSize: 13, fontWeight: 700, color: T.growth, minWidth: 130, textAlign: 'right' }}>{r.impact}</span>
              <Btn
                size="sm" tone="primary" icon={Plus}
                onClick={() => {
                  createIntervention({
                    type: r.type, title: r.text, brand: r.brand, market: r.market,
                    cellId: `${r.brand}|${r.market}`, impact: Math.round(r.value * 1e6),
                    functions: r.functions, agency: getCell(r.brand, r.market).agency, pattern: r.pattern,
                    source: 'Optimise · stage 7',
                    detail: `${r.text}. Expected impact ${r.impact}.`,
                  });
                  go(5);
                }}
              >
                Create record
              </Btn>
            </div>
          ))}
        </Panel>

        <Panel span={2} title="Effectiveness by brand" note="Spend-weighted ROI against index versus target." dense>
          <div style={{ height: 206, margin: '0 -8px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roll.byBrand} margin={{ top: 4, right: 8, left: -24, bottom: 36 }}>
                <CartesianGrid stroke={T.ruleSoft} vertical={false} />
                <XAxis dataKey="short" tick={{ fontSize: 9.5, fill: T.ink60, fontFamily: FU }} angle={-38} textAnchor="end" interval={0} stroke={T.rule} height={44} />
                <YAxis tick={{ fontSize: 10, fill: T.ink60, fontFamily: FU }} stroke={T.rule} />
                <RTooltip
                  contentStyle={{ fontFamily: FU, fontSize: 11, borderRadius: 0, border: `1px solid ${T.rule}` }}
                  formatter={(v, n, p) => [`${v}x ROI · index ${p.payload.index} · $${p.payload.spend}M media`, p.payload.brand]}
                />
                <ReferenceLine y={PORTFOLIO_AVG_ROI} stroke={T.navy} strokeDasharray="3 3" label={{ value: 'Portfolio average', position: 'insideTopLeft', fontSize: 9.5, fill: T.navy, fontFamily: FU }} />
                <Bar dataKey="roi" isAnimationActive={!reduced}>
                  {roll.byBrand.map((b) => (
                    <RCell key={b.brand} fill={b.roi >= DEST_ROI ? T.opp : b.roi < SOURCE_ROI ? T.risk : '#CDBEB8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, lineHeight: 1.5 }}>
            Green brands clear {DEST_ROI}x and are candidates for more money. Red brands sit below the
            {' '}{PORTFOLIO_AVG_ROI.toFixed(1)}x portfolio average and fund the moves. Grey brands stay as they are.
          </div>
        </Panel>

        <Panel
          span={2}
          accent={T.teal}
          title={`Portfolio rebalance — ${fmtM(reb.pool)} on the move`}
          note={`Out of ${reb.outCount} cells below the ${PORTFOLIO_AVG_ROI.toFixed(1)}x average, into ${reb.intoCount} that clear ${DEST_ROI}x. Recomputed from the Prioritise weights.`}
          dense
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontFamily: FU, fontSize: 11, fontWeight: 600, color: T.risk, marginBottom: 5 }}>Out of</div>
              {reb.out.map((s) => (
                <div key={s.cell.id} style={{ marginBottom: 6 }}>
                  <div className="flex items-baseline justify-between" style={{ gap: 8 }}>
                    <span style={{ fontFamily: FU, fontSize: 11, color: T.ink }}>{s.cell.brand} · {s.cell.market}</span>
                    <span style={{ ...NUM, fontFamily: FU, fontSize: 12, fontWeight: 700, color: T.risk }}>−{fmtM(s.amount).replace('$', '$')}</span>
                  </div>
                  <div style={{ fontFamily: FU, fontSize: 10, color: T.ink60, lineHeight: 1.35 }}>{s.reason}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: FU, fontSize: 11, fontWeight: 600, color: T.opp, marginBottom: 5 }}>Into</div>
              {reb.into.map((d) => (
                <div key={d.cell.id} style={{ marginBottom: 6 }}>
                  <div className="flex items-baseline justify-between" style={{ gap: 8 }}>
                    <span style={{ fontFamily: FU, fontSize: 11, color: T.ink }}>{d.cell.brand} · {d.cell.market}</span>
                    <span style={{ ...NUM, fontFamily: FU, fontSize: 12, fontWeight: 700, color: T.opp }}>+{fmtM(d.amount)}</span>
                  </div>
                  <div style={{ fontFamily: FU, fontSize: 10, color: T.ink60, lineHeight: 1.35 }}>{d.reason}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-end justify-between" style={{ gap: 10, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.ruleSoft}` }}>
            <Readout label="Net revenue effect" value={`+${fmtM(reb.gain)}`} size="md" tone={T.opp} />
            <Readout label="Gross profit effect" value={`+${fmtM(reb.marginGain)}`} size="md" tone={T.opp} />
            <Btn
              tone="navy" icon={Zap}
              onClick={() => createIntervention({
                type: 'budget_shift',
                title: `Rebalance ${fmtM(reb.pool)} across the portfolio`,
                brand: 'Portfolio', market: 'All markets', cellId: 'portfolio',
                impact: Math.round(reb.gain * 1e6),
                functions: ['Media', 'Finance', 'Category', 'Brand marketing'],
                agency: 'Multiple',
                pattern: 'media_mix',
                source: 'Optimise · stage 7',
                detail: `${fmtM(reb.pool)} moved out of ${reb.outCount} cells below the portfolio average into ${reb.intoCount} cells above ${DEST_ROI}x. Projected +${fmtM(reb.gain)} revenue, +${fmtM(reb.marginGain)} gross profit.`,
              })}
            >
              Commit the rebalance
            </Btn>
          </div>
        </Panel>

        <Panel span={2} title="Agency and talent load" note="Budget is only half the constraint." dense accent={hottest.util > 90 ? T.risk : undefined}>
          {load.map((a) => (
            <div key={a.agency} style={{ marginBottom: 9 }}>
              <div className="flex items-baseline justify-between" style={{ gap: 8 }}>
                <span style={{ fontFamily: FU, fontSize: 11.5, fontWeight: 600, color: T.ink }}>{a.agency}</span>
                <span style={{ ...NUM, fontFamily: FU, fontSize: 14, fontWeight: 700, color: a.util > 90 ? T.risk : a.util < 55 ? T.warn : T.ink }}>{a.util}%</span>
              </div>
              <MiniBar value={a.util} max={110} height={6} color={a.util > 90 ? T.risk : a.util < 55 ? T.warn : T.ink40} />
              <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 2 }}>
                {fmtM(a.assigned)} assigned against {fmtM(a.capacity)} of capacity · {a.cells} cells
              </div>
            </div>
          ))}
          <div style={{ background: T.warnWash, border: `1px dashed ${T.warn}`, padding: '8px 10px', marginTop: 4 }}>
            <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, lineHeight: 1.5 }}>
              {repAgency.agency} is at {repAgency.util}% while {coolest.agency} sits at {coolest.util}%. The L’OR France
              replication needs {repAgency.agency}, so either the retainer grows or one of its lower-value cells moves
              to {coolest.agency}.
            </div>
          </div>
        </Panel>

        <Panel span={2} title="Market roll-up" dense note="Index and effectiveness by market.">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Market', 'Revenue', 'Index', 'Media', 'ROI', 'Read'].map((h, i) => (
                  <th key={h} style={{ fontFamily: FU, fontSize: 10, color: T.ink60, fontWeight: 500, textAlign: i === 0 || i === 5 ? 'left' : 'right', padding: '0 6px 6px', borderBottom: `1px solid ${T.rule}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roll.byMarket.map((m) => (
                <tr key={m.market} style={{ borderBottom: `1px solid ${T.ruleSoft}` }}>
                  <td style={{ fontFamily: FU, fontSize: 11.5, fontWeight: 600, color: T.ink, padding: '7px 6px' }}>{m.market}</td>
                  <td style={{ ...NUM, fontFamily: FU, fontSize: 11.5, color: T.ink, textAlign: 'right', padding: '7px 6px' }}>${m.revenue.toLocaleString()}M</td>
                  <td style={{ ...NUM, fontFamily: FU, fontSize: 12.5, fontWeight: 700, color: m.index >= 100 ? T.opp : T.risk, textAlign: 'right', padding: '7px 6px' }}>{m.index}</td>
                  <td style={{ ...NUM, fontFamily: FU, fontSize: 11.5, color: T.ink, textAlign: 'right', padding: '7px 6px' }}>${m.spend}M</td>
                  <td style={{ ...NUM, fontFamily: FU, fontSize: 11.5, fontWeight: 600, color: m.roi >= 2 ? T.opp : m.roi < 1.5 ? T.risk : T.ink, textAlign: 'right', padding: '7px 6px' }}>{m.roi.toFixed(2)}x</td>
                  <td style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, padding: '7px 6px', lineHeight: 1.35 }}>
                    {MARKET_READ[m.market]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-start" style={{ gap: 8, marginTop: 10, background: '#F7F5F3', border: `1px solid ${T.ruleSoft}`, padding: '8px 10px' }}>
            <RefreshCw size={13} color={T.teal} style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontFamily: FU, fontSize: 11, color: T.ink, lineHeight: 1.5 }}>
              Live. The rebalance above is derived from the current Prioritise weights
              ({Object.keys(WEIGHT_LABELS).map((k) => `${WEIGHT_LABELS[k].toLowerCase()} ${state.priorityWeights[k]}`).join(', ')})
              and from {state.interventions.length} intervention{state.interventions.length === 1 ? '' : 's'} committed
              this session. Change a weight in stage 3 and this number moves.
            </span>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ============================================================================
   STAGE 8 — LEARN  (the one bold room)
   ========================================================================== */
const FLYWHEEL_NODES = [
  { key: 'action', label: 'Action', stage: 5, blurb: 'Decisions become typed intervention records' },
  { key: 'outcome', label: 'Outcome', stage: 7, blurb: 'Results read against the plan' },
  { key: 'learning', label: 'Capture', stage: 8, blurb: 'What worked, what did not, and why' },
  { key: 'codification', label: 'Codify', stage: 8, blurb: 'The play gets a name and a success rate' },
  { key: 'replication', label: 'Replicate', stage: 6, blurb: 'The named play is matched to similar cells' },
  { key: 'decisions', label: 'Better decisions', stage: 3, blurb: 'Confidence and rank move on the next decision' },
];

function Flywheel({ state, go, onNode }) {
  const reduced = usePrefersReducedMotion();
  const session = state.outcomesLog.filter((l) => !l.seeded);
  const interventions = state.interventions;
  const ranked = rankedItems(state.outcomesLog, state.priorityWeights);
  const baseline = rankedItems(SEED_LOG, state.priorityWeights);
  const moved = ranked.filter((r) => {
    const b = baseline.find((x) => x.id === r.id);
    return b && b.conf !== r.conf;
  });
  const counts = {
    action: interventions.length,
    outcome: interventions.filter((i) => i.status === 'acted').length,
    learning: session.length,
    codification: patternStats(state.outcomesLog).length,
    replication: interventions.filter((i) => i.source.startsWith('Replicate')).length,
    decisions: moved.length,
  };
  const evidence = {
    action: interventions.slice(-2).map((i) => `${i.ref} · ${i.title}`),
    outcome: interventions.filter((i) => i.status === 'acted').slice(-2).map((i) => `${i.ref} · ${fmtMoney(i.impact)}`),
    learning: session.slice(-2).map((l) => `${l.id} · ${l.title}`),
    codification: [`${PATTERNS.premiumization} — ${evidenceFor(state.outcomesLog, 'premiumization').matches} logged instances`],
    replication: interventions.filter((i) => i.source.startsWith('Replicate')).map((i) => `${i.brand} · ${i.market}`),
    decisions: moved.slice(0, 2).map((m) => `${m.title.slice(0, 44)}… now ${m.conf}%`),
  };

  const R = 136;
  const cx = 228; const cy = 174;
  const pts = FLYWHEEL_NODES.map((n, i) => {
    const ang = (-90 + i * 60) * Math.PI / 180;
    return { ...n, x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) * 0.84 };
  });

  return (
    <div style={{ background: T.navy, border: `1px solid ${T.navyLift}`, color: '#fff' }}>
      <div className="flex items-start justify-between flex-wrap" style={{ padding: '14px 16px 6px', gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: FS, fontSize: 21, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            The compounding intelligence flywheel
          </h3>
          <p style={{ fontFamily: FU, fontSize: 11.5, color: T.onBrand, marginTop: 3, maxWidth: 560, lineHeight: 1.5 }}>
            Not a diagram. Every node counts real records from this session — click one to open the stage and the
            record it came from.
          </p>
        </div>
        <div className="flex" style={{ gap: 16 }}>
          <div>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.onBrandMute }}>Turns completed</div>
            <div style={{ ...NUM, fontFamily: FU, fontSize: 26, fontWeight: 600, color: counts.decisions > 0 ? T.accentLite : T.onBrandDim, letterSpacing: '-0.03em' }}>
              {counts.decisions > 0 ? 1 : 0}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: FU, fontSize: 10.5, color: T.onBrandMute }}>Decisions re-scored</div>
            <div style={{ ...NUM, fontFamily: FU, fontSize: 26, fontWeight: 600, color: moved.length ? T.accentLite : T.onBrandDim, letterSpacing: '-0.03em' }}>
              {moved.length}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,456px) minmax(0,1fr)', gap: 10, padding: '0 16px 16px', alignItems: 'start' }}>
        <svg viewBox="0 0 456 352" style={{ width: '100%', maxWidth: 456 }} role="img" aria-label="Flywheel from action to better decisions">
          <defs>
            <marker id="gct-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={T.accentLite} />
            </marker>
            <marker id="gct-arrow-dim" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={T.onBrandDim} />
            </marker>
          </defs>
          <ellipse
            cx={cx} cy={cy} rx={R} ry={R * 0.84} fill="none" stroke="#8A6F66" strokeWidth="1.5"
            strokeDasharray="5 7"
            style={!reduced ? { animation: 'gctSpin 26s linear infinite', transformOrigin: `${cx}px ${cy}px` } : undefined}
          />
          {pts.map((p, i) => {
            const n = pts[(i + 1) % pts.length];
            const live = counts[p.key] > 0 && counts[n.key] > 0;
            const mx = (p.x + n.x) / 2; const my = (p.y + n.y) / 2;
            const k = 1.15;
            const qx = cx + (mx - cx) * k; const qy = cy + (my - cy) * k;
            const dx = n.x - p.x; const dy = n.y - p.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const inset = 27;
            return (
              <path
                key={`arc-${p.key}`}
                d={`M ${p.x + dx / len * inset} ${p.y + dy / len * inset} Q ${qx} ${qy} ${n.x - dx / len * inset} ${n.y - dy / len * inset}`}
                fill="none" stroke={live ? T.accentLite : '#7C5F57'} strokeWidth={live ? 2.2 : 1.4}
                markerEnd={live ? 'url(#gct-arrow)' : 'url(#gct-arrow-dim)'}
              />
            );
          })}
          <text x={cx} y={cy - 16} textAnchor="middle" style={{ ...NUM, fontFamily: FU, fontSize: 26, fontWeight: 600, fill: '#fff', letterSpacing: '-0.03em' }}>
            {state.outcomesLog.length}
          </text>
          <text x={cx} y={cy + 1} textAnchor="middle" style={{ fontFamily: FU, fontSize: 10.5, fill: T.onBrandMute }}>
            outcomes in the log
          </text>
          <text x={cx} y={cy + 20} textAnchor="middle" style={{ fontFamily: FU, fontSize: 10.5, fill: T.onBrandMute }}>
            {state.interventions.length} intervention{state.interventions.length === 1 ? '' : 's'} this session
          </text>
          {pts.map((p) => {
            const live = counts[p.key] > 0;
            return (
              <g
                key={p.key}
                onClick={() => onNode(p)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onNode(p); }}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`${p.label}, ${counts[p.key]} records`}
              >
                <circle cx={p.x} cy={p.y} r="26" fill={live ? T.accent : T.brandDeep} stroke={live ? T.accentLite : '#8A6F66'} strokeWidth={live ? 2.2 : 1.2} />
                <text x={p.x} y={p.y + 6} textAnchor="middle" style={{ ...NUM, fontFamily: FU, fontSize: 17, fontWeight: 700, fill: live ? '#fff' : T.onBrandDim }}>
                  {counts[p.key]}
                </text>
                <text
                  x={p.x} y={p.y + (p.y < cy - 4 ? -34 : p.y > cy + 4 ? 42 : 5)}
                  textAnchor={Math.abs(p.y - cy) < 5 ? (p.x < cx ? 'end' : 'start') : 'middle'}
                  dx={Math.abs(p.y - cy) < 5 ? (p.x < cx ? -32 : 32) : 0}
                  style={{ fontFamily: FU, fontSize: 11, fontWeight: 600, fill: live ? '#fff' : T.onBrandMute }}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div>
          {FLYWHEEL_NODES.map((n) => {
            const live = counts[n.key] > 0;
            return (
              <button
                key={n.key} type="button" onClick={() => onNode(n)}
                className="w-full text-left focus:outline-none focus:ring-2"
                style={{
                  display: 'block', padding: '7px 10px', marginBottom: 5,
                  background: live ? T.brandLift : 'transparent',
                  border: `1px solid ${live ? '#3F8E9C' : '#7C5F57'}`,
                  borderLeft: `3px solid ${live ? T.accentLite : '#8A6F66'}`,
                }}
              >
                <span className="flex items-baseline justify-between" style={{ gap: 10 }}>
                  <span style={{ fontFamily: FU, fontSize: 12, fontWeight: 600, color: live ? '#fff' : T.onBrandMute }}>{n.label}</span>
                  <span style={{ ...NUM, fontFamily: FU, fontSize: 12, fontWeight: 700, color: live ? T.accentLite : T.onBrandDim }}>
                    {counts[n.key]} {counts[n.key] === 1 ? 'record' : 'records'}
                  </span>
                </span>
                <span style={{ display: 'block', fontFamily: FU, fontSize: 10.5, color: T.onBrand, marginTop: 1, lineHeight: 1.4 }}>{n.blurb}</span>
                {live && evidence[n.key] && evidence[n.key].length > 0 && (
                  <span style={{ display: 'block', marginTop: 4 }}>
                    {evidence[n.key].map((e, i) => (
                      <span key={i} style={{ display: 'block', fontFamily: FU, fontSize: 10, color: T.accentLite, lineHeight: 1.45 }}>{e}</span>
                    ))}
                  </span>
                )}
              </button>
            );
          })}
          {counts.decisions === 0 && (
            <div style={{ fontFamily: FU, fontSize: 11, color: T.onBrand, marginTop: 7, lineHeight: 1.5 }}>
              The loop is not closed yet. Replicate the L’OR Germany playbook to L’OR France, act on the record in
              Orchestrate, then come back — the last node lights up when a ranked decision changes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LearnView({ state, set, go, jumpTo }) {
  const [query, setQuery] = useState('');
  const [similarTo, setSimilarTo] = useState(null);
  const log = state.outcomesLog;
  const head = logHeadline(log);
  const pStats = patternStats(log);
  const tStats = typeStats(log);
  const reduced = usePrefersReducedMotion();
  const premium = evidenceFor(log, 'premiumization');

  const filtered = useMemo(() => {
    let out = [...log].reverse();
    if (similarTo) {
      const base = log.find((l) => l.id === similarTo);
      if (base) out = out.filter((l) => l.pattern === base.pattern || l.type === base.type);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((l) => [l.title, l.brand, l.market, l.learning, l.context, PATTERNS[l.pattern], INTERVENTION_TYPES[l.type], l.result]
        .filter(Boolean).some((f) => String(f).toLowerCase().includes(q)));
    }
    return out;
  }, [log, query, similarTo]);

  const lead = tStats.filter((t) => t.successRate !== null).sort((a, b) => b.n - a.n)[0];

  return (
    <div>
      <Question sub="Every decision taken in this session is in here, alongside seven past initiatives — including two that did not work, with the reason stated. Capture what happened, codify the play, replicate it.">
        How does the enterprise get smarter?
      </Question>

      <div style={{ marginBottom: 10 }}>
        <Flywheel state={state} go={go} onNode={(n) => jumpTo(n)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10 }}>
        <Panel
          span={2}
          title="Outcomes log"
          note={`${head.total} initiatives. ${head.wins} of ${head.completed} completed ones succeeded${head.inFlight ? `, ${head.inFlight} still open` : ''}.`}
          dense
          action={
            <span className="inline-flex items-center" style={{ gap: 6 }}>
              <Search size={13} color={T.ink40} />
              <input
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brand, play, learning"
                aria-label="Search the outcomes log"
                className="focus:outline-none focus:ring-2"
                style={{ fontFamily: FU, fontSize: 11.5, border: `1px solid ${T.rule}`, padding: '4px 7px', width: 186, color: T.ink }}
              />
            </span>
          }
        >
          {similarTo && (
            <div className="flex items-center justify-between" style={{ gap: 10, background: T.replicateWash, border: `1px solid ${T.replicate}55`, padding: '6px 9px', marginBottom: 8 }}>
              <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink }}>
                Showing initiatives like {log.find((l) => l.id === similarTo)?.title} — same play or same intervention type.
              </span>
              <Btn size="sm" icon={X} onClick={() => setSimilarTo(null)}>Clear filter</Btn>
            </div>
          )}
          <div style={{ margin: '0 -12px', maxHeight: 560, overflowY: 'auto' }}>
            {filtered.length === 0 && (
              <div style={{ padding: '18px 12px', fontFamily: FU, fontSize: 12, color: T.ink60, lineHeight: 1.5 }}>
                Nothing matches that. Try a brand name, a market, or a phrase like compliance or premiumization.
              </div>
            )}
            {filtered.map((l, ix) => {
              const tone = l.outcome === 'succeeded' ? T.opp : l.outcome === 'failed' ? T.risk : l.outcome === 'queued' ? T.ink40 : T.teal;
              const isNew = !l.seeded;
              return (
                <div
                  key={l.id}
                  style={{
                    borderBottom: `1px solid ${T.ruleSoft}`, borderLeft: `3px solid ${tone}`,
                    padding: '9px 12px', background: isNew ? '#F6FAFB' : 'transparent',
                    animation: (state.justAdded || []).includes(l.id) && !reduced ? 'gctLand 420ms ease-out' : undefined,
                  }}
                >
                  <div className="flex items-start justify-between" style={{ gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div className="flex items-center flex-wrap" style={{ gap: 7 }}>
                        <span style={{ ...NUM, fontFamily: FU, fontSize: 10, fontWeight: 700, color: T.ink40 }}>{l.id}</span>
                        <span style={{ fontFamily: FU, fontSize: 12.5, fontWeight: 600, color: T.ink }}>{l.title}</span>
                        {isNew && (
                          <span style={{ fontFamily: FU, fontSize: 9.5, fontWeight: 700, color: '#fff', background: T.teal, padding: '1px 5px' }}>
                            This session
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 2 }}>
                        {l.brand} · {l.market} · {l.period} · {INTERVENTION_TYPES[l.type]} · {PATTERNS[l.pattern]}
                      </div>
                      <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, marginTop: 4, lineHeight: 1.45 }}>
                        <strong style={{ fontWeight: 600 }}>{l.result}</strong>
                        {l.context ? ` · ${l.context}` : ''}
                      </div>
                      {l.drivers && (
                        <div className="flex flex-wrap" style={{ gap: 6, marginTop: 4 }}>
                          {l.drivers.map((d) => (
                            <span key={d} style={{ fontFamily: FU, fontSize: 10, color: T.ink60, border: `1px solid ${T.rule}`, padding: '1px 6px' }}>{d}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ fontFamily: FU, fontSize: 11, color: l.outcome === 'failed' ? T.risk : T.ink60, marginTop: 5, lineHeight: 1.45 }}>
                        {l.outcome === 'failed' ? `Why it failed: ${l.failureReason} ` : ''}{l.learning}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <Btn size="sm" icon={Layers} onClick={() => { setSimilarTo(l.id); setQuery(''); }}>Show me initiatives like this one</Btn>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: FU, fontSize: 10.5, fontWeight: 700, color: tone, background: tone + '15', border: `1px solid ${tone}33`, padding: '2px 7px' }}>
                        {l.outcome === 'succeeded' ? 'Succeeded' : l.outcome === 'failed' ? 'Did not work' : l.outcome === 'queued' ? 'Logged, not yet acted on' : 'In flight'}
                      </div>
                      <div style={{ ...NUM, fontFamily: FU, fontSize: 19, fontWeight: 700, color: tone, marginTop: 5, letterSpacing: '-0.02em' }}>
                        {l.roi ? `${l.roi.toFixed(1)}x` : '—'}
                      </div>
                      <div style={{ fontFamily: FU, fontSize: 10, color: T.ink60 }}>{l.roi ? 'ROI' : 'ROI pending'}</div>
                      {l.confidence && (
                        <div style={{ ...NUM, fontFamily: FU, fontSize: 10.5, color: T.ink60, marginTop: 3 }}>{l.confidence}% confidence at decision</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
          <Panel title="Pattern insight" note="Recomputed every time an entry lands." accent={T.replicate} dense>
            <div style={{ background: '#F7F5FB', border: `1px solid ${T.replicate}33`, padding: '9px 10px', marginBottom: 10 }}>
              <div style={{ fontFamily: FU, fontSize: 12, fontWeight: 700, color: T.ink, lineHeight: 1.4 }}>
                {lead ? `${lead.label} is the most evidenced intervention type in the portfolio` : 'No completed outcomes yet'}
              </div>
              {lead && (
                <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, marginTop: 4, lineHeight: 1.5 }}>
                  {lead.n} logged, {lead.successRate}% success rate{lead.avgRoi ? `, ${lead.avgRoi}x average ROI on the ones that worked` : ''}.
                  Across the whole log, {head.rate}% of completed initiatives succeeded at {head.avgRoi}x average ROI.
                </div>
              )}
            </div>
            <div style={{ fontFamily: FU, fontSize: 11, color: T.ink60, marginBottom: 6 }}>Success rate by intervention type</div>
            {tStats.map((t) => (
              <div key={t.type} style={{ marginBottom: 8 }}>
                <div className="flex items-baseline justify-between" style={{ gap: 8 }}>
                  <span style={{ fontFamily: FU, fontSize: 11.5, color: T.ink }}>{t.label}</span>
                  <span style={{ ...NUM, fontFamily: FU, fontSize: 12.5, fontWeight: 700, color: t.successRate === null ? T.ink40 : t.successRate >= 70 ? T.opp : t.successRate >= 50 ? T.warn : T.risk }}>
                    {t.successRate === null ? 'In flight' : `${t.successRate}%`}
                  </span>
                </div>
                <MiniBar value={t.successRate || 0} max={100} height={5} color={t.successRate === null ? T.teal : t.successRate >= 70 ? T.opp : T.warn} />
                <div style={{ fontFamily: FU, fontSize: 10, color: T.ink60, marginTop: 2 }}>
                  {t.n} logged{t.inFlight ? `, ${t.inFlight} in flight` : ''}{t.queued ? `, ${t.queued} not yet acted on` : ''}{t.avgRoi ? `, ${t.avgRoi}x average on the ones that worked` : ''}
                </div>
              </div>
            ))}
          </Panel>

          <Panel title="Codified plays" note="A play earns a name once it has evidence." dense>
            {pStats.map((p) => (
              <div key={p.pattern} style={{ borderBottom: `1px solid ${T.ruleSoft}`, padding: '6px 0' }}>
                <div className="flex items-baseline justify-between" style={{ gap: 8 }}>
                  <span style={{ fontFamily: FU, fontSize: 11.5, fontWeight: 600, color: T.ink }}>{p.label}</span>
                  <span style={{ ...NUM, fontFamily: FU, fontSize: 12, fontWeight: 700, color: T.ink }}>{p.n}</span>
                </div>
                <div style={{ fontFamily: FU, fontSize: 10.5, color: T.ink60, lineHeight: 1.4 }}>
                  {p.family} · {p.successRate === null ? 'awaiting results' : `${p.successRate}% success`}{p.avgRoi ? ` · ${p.avgRoi}x` : ''}
                </div>
              </div>
            ))}
            <div style={{ background: T.replicateWash, border: `1px solid ${T.replicate}33`, padding: '8px 10px', marginTop: 9 }}>
              <div style={{ fontFamily: FU, fontSize: 11.5, color: T.ink, lineHeight: 1.5 }}>
                The L’OR Germany Premiumization playbook now has {premium.matches} logged instance{premium.matches === 1 ? '' : 's'}
                {premium.inFlight ? `, ${premium.inFlight} of them started this session` : ''}. That is what lifts its
                confidence on the ranked list.
              </div>
              <div style={{ marginTop: 8 }}>
                <Btn size="sm" full tone="navy" icon={Target} onClick={() => go(3)}>Go back to Prioritise and see it</Btn>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SHELL — one state object, threaded down
   ========================================================================== */
const INITIAL_STATE = {
  stage: 1,
  selectedCell: { brand: "L'OR", market: 'France' },
  priorityWeights: { ...DEFAULT_WEIGHTS },
  simOption: RECOMMENDED_OPTION,
  simulation: { alloc: ALLOC_DETENT, scenario: null, projectedOutcome: simulate(RECOMMENDED_OPTION, ALLOC_DETENT, null) },
  playbook: DEFAULT_PLAYBOOK,
  repOpen: HERO_CANDIDATE.id,
  priView: 'ranked',
  askQ: null,
  askOpen: false,
  interventions: [],
  outcomesLog: [...SEED_LOG],
  escalationThreshold: 2000000,
  marketIntelOverlay: false,
  justAdded: [],
};

export default function GrowthControlTower() {
  const [state, setState] = useState(INITIAL_STATE);
  const [intro, setIntro] = useState(true);
  const [coverage, setCoverage] = useState(false);
  const [toast, setToast] = useState(null);
  const seq = useRef({ int: 0, log: 0 });
  const reduced = usePrefersReducedMotion();

  const set = useCallback((patch) => setState((s) => ({ ...s, ...patch })), []);
  const go = useCallback((n) => setState((s) => ({ ...s, stage: Math.max(1, Math.min(8, n)) })), []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!state.justAdded || state.justAdded.length === 0) return;
    const t = setTimeout(() => setState((s) => ({ ...s, justAdded: [] })), 1500);
    return () => clearTimeout(t);
  }, [state.justAdded]);

  const nextLogId = () => { seq.current.log += 1; return `L-${String(SEED_LOG.length + seq.current.log).padStart(2, '0')}`; };
  const nextIntRef = () => { seq.current.int += 1; return `INT-${String(seq.current.int).padStart(2, '0')}`; };

  /* FR5.1 + FR8.1 — a decision becomes a typed record, and is logged the moment it is made */
  const createIntervention = useCallback((payload) => {
    const ref = nextIntRef();
    const id = `int-${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    const logId = nextLogId();
    const record = { ...payload, id, ref, status: 'queued', logId };
    const entry = {
      id: logId, seeded: false, period: 'This session', title: payload.title,
      brand: payload.brand, market: payload.market, type: payload.type, pattern: payload.pattern,
      outcome: 'queued', roi: null, result: 'Logged, no result yet',
      drivers: payload.functions, context: `${payload.source} · record ${ref}`,
      learning: 'Logged at the point of decision. It becomes evidence once the intervention is acted on.',
      confidence: payload.confidence || null, recordRef: ref,
    };
    setState((s) => ({ ...s, interventions: [...s.interventions, record], outcomesLog: [...s.outcomesLog, entry], justAdded: [ref, logId] }));
    setToast({ kind: 'created', text: `${ref} created and logged. Act on it in Orchestrate to turn it into evidence.` });
  }, []);

  /* acting on a record makes it evidence — this is what moves confidence in Prioritise */
  const actOn = useCallback((recordId) => {
    setState((s) => {
      const rec = s.interventions.find((i) => i.id === recordId);
      if (!rec || rec.status === 'acted') return s;
      const logId = nextLogId();
      const entry = {
        id: logId, seeded: false, period: 'This session', title: `Early read — ${rec.title}`,
        brand: rec.brand, market: rec.market, type: rec.type, pattern: rec.pattern,
        outcome: 'in_flight', roi: null, result: `${fmtMoney(rec.impact)} committed, tracking to plan`,
        drivers: rec.functions, context: `Acted from Orchestrate · record ${rec.ref}`,
        learning: 'In market now. Counted as an instance of this play, not yet as a completed result.',
        recordRef: rec.ref,
      };
      const log = s.outcomesLog.map((l) => (l.id === rec.logId ? { ...l, outcome: 'in_flight', result: `${fmtMoney(rec.impact)} committed`, learning: 'Acted on in market. Now counted as evidence for this play.' } : l));
      return {
        ...s,
        interventions: s.interventions.map((i) => (i.id === recordId ? { ...i, status: 'acted' } : i)),
        outcomesLog: [...log, entry],
        justAdded: [rec.ref, logId],
      };
    });
    setToast({ kind: 'acted', text: 'Acted. Two log entries now carry this play — Prioritise has been re-scored.' });
  }, []);

  /* FR6 — replication writes a record and a log entry */
  const replicateTo = useCallback((cand) => {
    const ref = nextIntRef();
    const id = `int-${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    const logId = nextLogId();
    const cell = getCell(cand.brand, cand.market);
    const pbObj = PLAYBOOK_BY_ID[cand.playbook];
    const record = {
      id, ref, repId: cand.id, repKey: `${cand.playbook}|${cand.id}`, status: 'queued', logId,
      type: 'media_support',
      title: `${pbObj.name} in ${cand.market}`,
      brand: cand.brand, market: cand.market, cellId: cell.id,
      impact: Math.round(cand.impact * 1e6),
      functions: ['Brand marketing', 'Shopper marketing', 'Media'],
      agency: cell.agency, pattern: pbObj.pattern,
      source: 'Replicate · stage 6',
      detail: `Similarity ${cand.similarity.toFixed(2)} to ${pbObj.name} · ${cand.status} · estimated +${fmtM(cand.impact)}`,
    };
    const entry = {
      id: logId, seeded: false, period: 'This session',
      title: `Replication launched — ${cand.brand} ${cand.market}`,
      brand: cand.brand, market: cand.market, type: 'media_support', pattern: pbObj.pattern,
      outcome: 'in_flight', roi: null,
      result: `Estimated +${fmtM(cand.impact)}, similarity ${cand.similarity.toFixed(2)}`,
      drivers: cand.attrs.map((a) => `${a.attr} ${a.score.toFixed(2)}`),
      context: `Replicated from ${pbObj.name} · record ${ref}`,
      learning: `${cand.have.length} capabilities already in place, ${cand.need.length} to build. Counted as an instance of this play.`,
      recordRef: ref,
    };
    setState((s) => ({ ...s, interventions: [...s.interventions, record], outcomesLog: [...s.outcomesLog, entry], justAdded: [ref, logId] }));
    setToast({ kind: 'replicated', text: `Replicated to ${cand.brand} ${cand.market}. ${ref} is in Orchestrate and ${logId} is in the Learn log.` });
  }, []);

  const reset = useCallback(() => {
    seq.current = { int: 0, log: 0 };
    setState({ ...INITIAL_STATE, priorityWeights: { ...DEFAULT_WEIGHTS }, outcomesLog: [...SEED_LOG], interventions: [], justAdded: [] });
    setToast({ kind: 'reset', text: 'Session reset. The seven seeded outcomes are still in the log.' });
  }, []);

  /* the chained primary action — a presenter can run the whole story from this one button */
  const unactedRep = state.interventions.find((i) => i.source && i.source.startsWith('Replicate') && i.status !== 'acted');
  const hasShift = state.interventions.some((i) => i.type === 'budget_shift' && i.source && i.source.startsWith('Simulate'));
  const hasReplication = state.interventions.some((i) => i.source && i.source.startsWith('Replicate'));
  const ranked = rankedItems(state.outcomesLog, state.priorityWeights);
  const baseline = rankedItems(SEED_LOG, state.priorityWeights);
  const confMoved = ranked.some((r) => {
    const b = baseline.find((x) => x.id === r.id);
    return b && b.conf !== r.conf;
  });

  function primaryAction() {
    const s = state.stage;
    if (s === 1) return { label: 'Next: diagnose why L’OR France is missing plan', run: () => { set({ selectedCell: { brand: "L'OR", market: 'France' } }); go(2); } };
    if (s === 2) return { label: 'Next: see where this ranks against everything else', run: () => go(3) };
    if (s === 3) return { label: 'Next: decide how to allocate the next $10M', run: () => go(4) };
    if (s === 4) {
      if (!hasShift) {
        const o = SIM_BY_ID[state.simOption] || SIM_BY_ID[RECOMMENDED_OPTION];
        const alloc = state.simulation.alloc;
        const out = simulate(o.id, alloc, state.simulation.scenario);
        return {
          label: `Commit ${fmtM(alloc)} to ${optionName(o)} and open Orchestrate`,
          run: () => {
            createIntervention({
              type: 'budget_shift',
              title: `Invest ${fmtM(alloc)} in ${optionName(o)}`,
              brand: o.brand, market: o.market, cellId: o.cellId || `${o.brand}|${o.market}`,
              impact: Math.round(out.rev * 1e6),
              functions: ['Media', 'Shopper marketing', 'Revenue growth management'],
              agency: getCell(o.brand, o.market).agency, pattern: o.pattern,
              source: 'Simulate · stage 4', confidence: out.conf,
              detail: `${fmtM(alloc)} allocated to ${optionName(o)}. Projected ${fmtRev(out.rev)} revenue, ${out.roi.toFixed(1)}x ROI, ${out.conf}% confidence, ${fmtMonths(out.payback)} payback.`,
            });
            go(5);
          },
        };
      }
      return { label: 'Next: turn the decision into action', run: () => go(5) };
    }
    if (s === 5) {
      if (!hasReplication) return { label: 'Next: scale the play that is already working', run: () => { set({ playbook: DEFAULT_PLAYBOOK, repOpen: HERO_CANDIDATE.id }); go(6); } };
      if (unactedRep) return { label: 'Act on the replication record', run: () => actOn(unactedRep.id) };
      return { label: 'Next: optimise the whole portfolio', run: () => go(7) };
    }
    if (s === 6) {
      if (!hasReplication) {
        const first = candidatesFor(state.playbook || DEFAULT_PLAYBOOK)[0];
        return { label: `Replicate the play to ${first.brand} · ${first.market}`, run: () => replicateTo(first) };
      }
      if (unactedRep) return { label: 'Act on it in Orchestrate', run: () => { actOn(unactedRep.id); go(5); } };
      return { label: 'Next: optimise the whole portfolio', run: () => go(7) };
    }
    if (s === 7) return { label: 'Next: see what the portfolio just learned', run: () => go(8) };
    return {
      label: confMoved ? 'Back to Prioritise — confidence has moved' : 'Back to Prioritise',
      run: () => go(3),
    };
  }
  const pa = primaryAction();

  const flags = {
    sense: 0, diagnose: 0, prioritise: 0, simulate: 0,
    orchestrate: state.interventions.length,
    replicate: state.interventions.filter((i) => i.source && i.source.startsWith('Replicate')).length,
    optimise: 0,
    learn: state.outcomesLog.length - SEED_LOG.length,
  };

  const jumpTo = (node) => {
    if (node.stage === 3) set({ stage: 3 });
    else go(node.stage);
  };

  const common = { state, set, go, createIntervention, actOn, replicateTo, jumpTo };

  return (
    <div style={{ background: T.deck, minHeight: '100vh', color: T.ink, fontFamily: FU }}>
      <style>{`
        @keyframes gctLand { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: none; } }
        @keyframes gctSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes gctToast { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
        .gct-main *:focus-visible, .gct-chrome *:focus-visible { outline: 2px solid ${T.teal}; outline-offset: 1px; }
        input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-runnable-track { height: 4px; background: ${T.rule}; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: ${T.navy}; border: 2px solid #fff; margin-top: -6px; box-shadow: 0 0 0 1px ${T.rule}; }
        input[type=range]::-moz-range-track { height: 4px; background: ${T.rule}; }
        input[type=range]::-moz-range-thumb { width: 14px; height: 14px; background: ${T.navy}; border: 2px solid #fff; }
      `}</style>

      {intro && <Intro onDismiss={() => setIntro(false)} />}
      <CoverageDrawer open={coverage} onClose={() => setCoverage(false)} onGo={go} />
      <AskModal open={state.askOpen} state={state} set={set} go={go} onClose={() => set({ askOpen: false })} />

      <div className="gct-chrome">
        <TopChrome
          stage={state.stage}
          selectedCell={state.selectedCell}
          onPickHero={(c) => { set({ selectedCell: { brand: c.brand, market: c.market } }); if (state.stage === 1) go(2); }}
          onReset={reset}
          onOpenCoverage={() => setCoverage(true)}
          onAsk={() => set({ askOpen: true })}
        />
      </div>

      <div className="flex" style={{ alignItems: 'stretch', minHeight: 'calc(100vh - 92px)' }}>
        <StageRail stage={state.stage} onGo={go} flags={flags} />
        <main className="gct-main flex-1" style={{ padding: '14px 16px 76px', overflowX: 'auto', minWidth: 0 }}>
          <div style={{ minWidth: 940 }}>
            {state.stage === 1 && <SenseView {...common} />}
            {state.stage === 2 && <DiagnoseView {...common} />}
            {state.stage === 3 && <PrioritiseView {...common} />}
            {state.stage === 4 && <SimulateView {...common} />}
            {state.stage === 5 && <OrchestrateView {...common} />}
            {state.stage === 6 && <ReplicateView {...common} />}
            {state.stage === 7 && <OptimiseView {...common} />}
            {state.stage === 8 && <LearnView {...common} />}
          </div>
        </main>
      </div>

      {/* footer chrome: coverage, reset, and the chained primary action */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-between flex-wrap gct-chrome"
        style={{ background: 'rgba(237,240,245,0.96)', borderTop: `1px solid ${T.rule}`, padding: '8px 16px', gap: 10, zIndex: 30 }}
      >
        <div className="flex items-center flex-wrap" style={{ gap: 12 }}>
          <button
            type="button" onClick={() => setCoverage(true)}
            className="inline-flex items-center focus:outline-none focus:ring-2"
            style={{ gap: 5, fontFamily: FU, fontSize: 11.5, color: T.ink60, background: 'transparent', border: 'none', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            <FileText size={12} /> Requirement coverage · {COVERAGE.length} FRs · {CLIENT_FEEDBACK.length} feedback items
          </button>
          <button
            type="button" onClick={reset}
            className="inline-flex items-center focus:outline-none focus:ring-2"
            style={{ gap: 5, fontFamily: FU, fontSize: 11.5, color: T.ink60, background: 'transparent', border: 'none', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            <RotateCcw size={12} /> Reset session
          </button>
          <span style={{ fontFamily: FU, fontSize: 11, color: T.ink40 }}>
            Synthetic data · rule-based and lookup logic · no live integrations
          </span>
          <span className="inline-flex items-center" style={{ gap: 6, fontFamily: FU, fontSize: 10.5, color: T.ink40 }}>
            Built by <CognizantMark height={13} />
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 10 }}>
          <span style={{ fontFamily: FU, fontSize: 11, color: T.ink60, textAlign: 'right' }}>
            {STAGES[state.stage - 1].q}
          </span>
          <Btn tone="navy" size="lg" onClick={pa.run}>
            {pa.label}
            <ChevronRight size={15} />
          </Btn>
        </div>
      </div>

      {toast && (
        <div
          className="fixed"
          style={{
            bottom: 64, right: 16, zIndex: 40, maxWidth: 380,
            background: T.brand, color: '#fff', padding: '10px 13px',
            borderLeft: `4px solid ${toast.kind === 'reset' ? T.ink40 : T.accentLite}`,
            animation: reduced ? undefined : 'gctToast 240ms ease-out',
            boxShadow: '0 8px 24px rgba(36,24,18,0.28)',
          }}
          role="status"
        >
          <div className="flex items-start" style={{ gap: 8 }}>
            <Check size={14} color={T.accentLite} style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontFamily: FU, fontSize: 12, lineHeight: 1.5 }}>{toast.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
