export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const RESEARCH_ONLY_REFUSAL =
  'Our products are sold strictly for in-vitro laboratory research use only. I am not able to answer questions about dosage, injections, administration, cycles, stacking, or human/animal use. For research context, please consult peer-reviewed literature or your institution. For product, shipping, or COA questions, I am happy to help.';

const RESEARCH_ONLY_PATTERNS: RegExp[] = [
  /dosage/i,
  /\bdose\b/i,
  /\bdosing\b/i,
  /how (much|many|to (use|take|inject|administer|dose|run|cycle|mix|reconstitute))/i,
  /how do i (use|take|inject|administer|dose|run|cycle|mix|reconstitute)/i,
  /\binject/i,
  /injection/i,
  /\bim\b/i,
  /\bsubq\b/i,
  /\bsub-?cutaneous/i,
  /intramuscular/i,
  /\bsyringe/i,
  /\bneedle/i,
  /reconstitut/i,
  /\bmix(ing)?\b/i,
  /bacteriostatic/i,
  /\bbac\s?water/i,
  /\bml\b.*(dose|inject|take)/i,
  /\biu\b/i,
  /\bmcg\b/i,
  /micrograms?/i,
  /milligrams?.*(dose|take|inject)/i,
  /\bcycle\b/i,
  /\bstack(ing)?\b/i,
  /protocol/i,
  /regimen/i,
  /\btaper/i,
  /pct\b/i,
  /post cycle/i,
  /side effect/i,
  /\bsides\b/i,
  /recommend.*(dose|dosage|protocol|cycle|amount|stack)/i,
  /what.*(dose|dosage|protocol|cycle|amount).*(should|do|can) i/i,
  /safe.*(dose|dosage|amount|to take|to use|to inject)/i,
  /how (often|frequently).*(take|inject|use|dose|administer)/i,
  /best.*(dose|dosage|protocol|cycle|stack|way to take|way to use)/i,
  /for (weight loss|muscle|bulking|cutting|fat loss|healing|recovery|sleep|libido|ed|erectile|tanning|hair)/i,
  /human use/i,
  /on (myself|me|my body)/i,
  /take it/i,
  /administer/i,
];

const FAQ: { patterns: RegExp[]; answer: string }[] = [
  {
    patterns: [/bpc.?157/i, /bpc/i],
    answer:
      'BPC-157 is one of our most popular research peptides. We carry it in 10mg and 20mg vials, both ≥99% purity with COA on every batch. Navigate to the "Gut / Healing" category to view both options.',
  },
  {
    patterns: [/ship/i, /deliver/i, /how long/i, /arrive/i],
    answer:
      'We typically ship within 1–2 business days. Domestic orders usually arrive in 3–5 business days. All orders include a tracking number sent to your email.',
  },
  {
    patterns: [/purity/i, /quality/i, /test/i, /coa/i, /certificate/i],
    answer:
      'Every batch is third-party tested and ships with a Certificate of Analysis (COA). Our compounds are guaranteed ≥99% purity.',
  },
  {
    patterns: [/price/i, /cost/i, /discount/i, /coupon/i, /promo/i],
    answer:
      'Our pricing is competitive and displayed on each product page. We occasionally run promotions — keep an eye on the banner at the top of the site.',
  },
  {
    patterns: [/payment/i, /pay/i, /card/i, /crypto/i, /bitcoin/i],
    answer:
      'We accept major credit/debit cards and select cryptocurrencies. Payment details are shown at checkout.',
  },
  {
    patterns: [/return/i, /refund/i, /exchange/i],
    answer:
      'If there is an issue with your order, please contact us within 7 days of receipt and we will make it right.',
  },
  {
    patterns: [/stock/i, /available/i, /back in stock/i, /out of stock/i],
    answer:
      'All products shown on the site are in stock and ready to ship. If a product is out of stock it will be marked accordingly.',
  },
  {
    patterns: [/contact/i, /email/i, /phone/i, /reach/i, /support/i],
    answer:
      'You can reach our support team via email at support@helixamino.com. We respond within one business day.',
  },
  {
    patterns: [/prescription/i, /legal/i, /fda/i, /human use/i],
    answer:
      'All products are intended for research purposes only and are not approved for human use. They are not intended to diagnose, treat, cure, or prevent any disease.',
  },
  {
    patterns: [/igf/i],
    answer:
      'We carry IGF-1 LR3, IGF-1 DES, and several IGF variants. Browse the "Growth Factors" or "IGF" categories to find the right compound for your research.',
  },
  {
    patterns: [/tb.?500/i, /thymosin/i],
    answer:
      'TB-500 (Thymosin Beta-4) is available in our catalog. Search "TB" or browse the "Healing" category.',
  },
  {
    patterns: [/semaglutide/i, /tirzepatide/i, /glp/i, /ozempic/i],
    answer:
      'We carry Semaglutide and Tirzepatide for research use. Browse the "Weight / Metabolic" category for full details and pricing.',
  },
  {
    patterns: [/hello/i, /hi\b/i, /hey\b/i, /greetings/i],
    answer:
      'Hello! Welcome to Helix Amino. I can help you with product questions, shipping info, COA requests, and more. What can I assist you with today?',
  },
  {
    patterns: [/thank/i, /thanks/i, /appreciate/i],
    answer:
      'You are welcome! Feel free to ask if you have any other questions. Happy researching!',
  },
];

const FALLBACK_RESPONSES = [
  "That's a great question. For the most accurate answer, please email us at support@helixamino.com and our team will respond within one business day.",
  "I'm not sure about the specifics of that. You can reach our support team at support@helixamino.com for detailed assistance.",
  "I don't have an immediate answer for that. Please contact support@helixamino.com and we'll get back to you quickly.",
];

let fallbackIndex = 0;

export function getBotResponse(userText: string): string {
  const normalised = userText.trim().toLowerCase();

  if (RESEARCH_ONLY_PATTERNS.some((p) => p.test(normalised))) {
    return RESEARCH_ONLY_REFUSAL;
  }

  for (const entry of FAQ) {
    if (entry.patterns.some((p) => p.test(normalised))) {
      return entry.answer;
    }
  }

  const response = FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length];
  fallbackIndex++;
  return response;
}
