/**
 * Rule-based Food–Drug Interaction Engine
 * No API required. Based on well-documented pharmacological data.
 */

const INTERACTION_RULES = [
  // ── WARFARIN ──────────────────────────────────────────
  {
    drugKeywords: ["warfarin", "coumadin", "warf"],
    foodKeywords: ["spinach", "kale", "broccoli", "cabbage", "lettuce", "greens", "leafy"],
    riskLevel: "HIGH",
    summary: "Leafy greens are rich in Vitamin K, which directly reduces Warfarin's blood-thinning effect.",
    explanation: "Warfarin works by blocking Vitamin K-dependent clotting factors. Leafy green vegetables are extremely high in Vitamin K, which counteracts the drug and makes your blood clot more easily than intended, raising your risk of dangerous clots.",
    precautions: "Do not suddenly increase or decrease your intake of leafy greens. Keep your diet consistent and inform your doctor if you change your eating habits.",
    timing: "No specific timing helps — it is about keeping intake consistent day-to-day.",
  },
  {
    drugKeywords: ["warfarin", "coumadin"],
    foodKeywords: ["grapefruit", "grapefruit juice"],
    riskLevel: "MODERATE",
    summary: "Grapefruit can increase Warfarin levels in your blood, raising bleeding risk.",
    explanation: "Grapefruit contains compounds that block a liver enzyme (CYP3A4) responsible for breaking down Warfarin. This causes the drug to accumulate at higher-than-intended levels.",
    precautions: "Limit or avoid grapefruit. If you consume it, keep the amount consistent and monitor for unusual bruising or bleeding.",
    timing: "Avoid grapefruit within 4 hours of taking Warfarin.",
  },
  {
    drugKeywords: ["warfarin", "coumadin"],
    foodKeywords: ["alcohol", "beer", "wine", "whiskey", "vodka", "liquor", "drinking"],
    riskLevel: "HIGH",
    summary: "Alcohol significantly increases bleeding risk when combined with Warfarin.",
    explanation: "Alcohol inhibits the same liver enzymes that break down Warfarin, causing it to stay in your body longer at higher concentrations. Even moderate drinking can lead to dangerous internal bleeding.",
    precautions: "Avoid alcohol entirely while on Warfarin. If you drink occasionally, inform your doctor as your dose may need adjustment.",
    timing: "No safe timing — avoid alcohol altogether.",
  },

  // ── STATINS ───────────────────────────────────────────
  {
    drugKeywords: ["atorvastatin", "simvastatin", "lovastatin", "statin", "lipitor", "zocor", "crestor", "rosuvastatin"],
    foodKeywords: ["grapefruit", "grapefruit juice", "pomelo"],
    riskLevel: "HIGH",
    summary: "Grapefruit blocks the enzyme that breaks down statins, causing dangerously high drug levels.",
    explanation: "Grapefruits contain furanocoumarins which permanently block CYP3A4, a liver enzyme your body uses to metabolize statins. Without this breakdown, statins accumulate and can cause severe muscle damage (rhabdomyolysis) and kidney failure.",
    precautions: "Avoid grapefruit and grapefruit juice completely while on statins. Pomelo and Seville oranges have a similar effect.",
    timing: "Even consuming grapefruit 24 hours before your dose is unsafe. Avoid it entirely.",
  },
  {
    drugKeywords: ["atorvastatin", "simvastatin", "lovastatin", "statin", "lipitor", "zocor"],
    foodKeywords: ["alcohol", "beer", "wine", "whiskey", "vodka", "liquor"],
    riskLevel: "MODERATE",
    summary: "Alcohol combined with statins increases the risk of liver damage.",
    explanation: "Both statins and alcohol are processed by your liver. Using them together increases strain on liver cells and can cause liver inflammation or injury over time.",
    precautions: "Limit alcohol to 1–2 drinks occasionally. Avoid heavy or regular drinking. Get periodic liver function tests.",
    timing: "Avoid alcohol on the same day you take your statin if possible.",
  },

  // ── METFORMIN ─────────────────────────────────────────
  {
    drugKeywords: ["metformin", "glucophage", "fortamet"],
    foodKeywords: ["alcohol", "beer", "wine", "whiskey", "vodka", "liquor", "drinking"],
    riskLevel: "HIGH",
    summary: "Alcohol with Metformin can cause a dangerous condition called lactic acidosis.",
    explanation: "Metformin reduces glucose production in the liver. Alcohol interferes with this and also reduces lactate clearance. Together, they can cause lactic acid to build up in your blood — a rare but life-threatening condition.",
    precautions: "Avoid alcohol while taking Metformin. If you drink occasionally, never do so on an empty stomach and limit to 1 drink.",
    timing: "No safe timing with alcohol. Avoid it completely.",
  },
  {
    drugKeywords: ["metformin", "glucophage"],
    foodKeywords: ["sugar", "sugary", "soda", "candy", "sweets", "dessert", "cake", "chocolate"],
    riskLevel: "LOW",
    summary: "High-sugar foods reduce Metformin's effectiveness at controlling blood sugar.",
    explanation: "Metformin helps manage blood sugar levels, but large amounts of sugar directly counteract this. Your blood glucose will spike, making the medication less effective over time.",
    precautions: "Follow a low-sugar, balanced diet to maximise Metformin's effectiveness. Consult a dietician for a diabetes-friendly meal plan.",
    timing: "Take Metformin with or after meals to reduce stomach upset.",
  },

  // ── ACE INHIBITORS ────────────────────────────────────
  {
    drugKeywords: ["lisinopril", "enalapril", "ramipril", "captopril", "perindopril"],
    foodKeywords: ["banana", "bananas", "avocado", "orange", "potato", "tomato", "spinach", "dried fruit"],
    riskLevel: "MODERATE",
    summary: "High-potassium foods can raise potassium to dangerous levels with ACE inhibitors.",
    explanation: "ACE inhibitors cause your kidneys to retain more potassium. Eating a lot of high-potassium foods like bananas and avocados can cause potassium to build up (hyperkalemia), leading to abnormal heart rhythms.",
    precautions: "Moderate your intake of high-potassium foods. Do not take potassium supplements. Get regular blood tests to monitor potassium levels.",
    timing: "No special timing — it is about limiting daily potassium intake overall.",
  },
  {
    drugKeywords: ["lisinopril", "enalapril", "ramipril", "captopril"],
    foodKeywords: ["salt substitute", "low sodium salt", "potassium chloride"],
    riskLevel: "HIGH",
    summary: "Salt substitutes contain potassium chloride which can cause dangerously high potassium with ACE inhibitors.",
    explanation: "Most salt substitutes replace sodium with potassium chloride. Since ACE inhibitors already raise potassium levels, adding a potassium-rich salt substitute can push levels dangerously high, causing heart arrhythmias.",
    precautions: "Avoid potassium-based salt substitutes entirely. Use regular salt in moderation or ask your doctor for alternatives.",
    timing: "Avoid completely — no safe timing.",
  },

  // ── ANTIBIOTICS ───────────────────────────────────────
  {
    drugKeywords: ["ciprofloxacin", "cipro", "levofloxacin", "ofloxacin"],
    foodKeywords: ["milk", "dairy", "cheese", "yogurt", "calcium"],
    riskLevel: "HIGH",
    summary: "Dairy products bind to Ciprofloxacin and prevent it from being absorbed.",
    explanation: "Calcium in dairy forms an insoluble complex with ciprofloxacin in your gut, blocking up to 40% of the drug from entering your bloodstream. This means the antibiotic may not reach effective levels to fight your infection.",
    precautions: "Do not take ciprofloxacin with milk, cheese, or calcium-fortified foods or drinks.",
    timing: "Take Ciprofloxacin at least 2 hours before or 6 hours after consuming dairy products.",
  },
  {
    drugKeywords: ["tetracycline", "doxycycline", "minocycline", "vibramycin"],
    foodKeywords: ["milk", "dairy", "cheese", "yogurt", "iron"],
    riskLevel: "HIGH",
    summary: "Dairy and iron block tetracycline antibiotics from being absorbed properly.",
    explanation: "Calcium and iron in food bind to tetracycline molecules in the stomach, forming complexes that cannot pass through the gut wall. This can reduce antibiotic effectiveness by up to 50–80%.",
    precautions: "Take tetracycline on an empty stomach. Avoid all dairy and iron-rich foods around your dose.",
    timing: "Take at least 1 hour before meals or 2 hours after meals. Avoid dairy for 3 hours around each dose.",
  },
  {
    drugKeywords: ["amoxicillin", "ampicillin", "penicillin", "augmentin"],
    foodKeywords: ["alcohol", "beer", "wine", "whiskey", "vodka"],
    riskLevel: "MODERATE",
    summary: "Alcohol weakens your immune system and can slow recovery while on antibiotics.",
    explanation: "While alcohol does not directly interact with penicillin-type antibiotics chemically, it dehydrates you, disrupts sleep, and suppresses your immune system — all of which slow recovery from the infection being treated.",
    precautions: "Avoid alcohol for the full duration of your antibiotic course. Stay well hydrated.",
    timing: "Avoid alcohol entirely while on antibiotics.",
  },

  // ── SSRIs / ANTIDEPRESSANTS ───────────────────────────
  {
    drugKeywords: ["fluoxetine", "sertraline", "paroxetine", "citalopram", "escitalopram", "prozac", "zoloft"],
    foodKeywords: ["alcohol", "beer", "wine", "whiskey", "vodka", "liquor"],
    riskLevel: "HIGH",
    summary: "Alcohol intensifies SSRI side effects and worsens depression and anxiety.",
    explanation: "Both SSRIs and alcohol affect serotonin and dopamine in the brain. Alcohol is a depressant that counteracts antidepressants and amplifies side effects like drowsiness, dizziness, and impaired coordination. It can also increase suicidal thoughts.",
    precautions: "Avoid alcohol completely while on antidepressants. If you choose to drink, do so with extreme caution and never drive.",
    timing: "No safe timing — the interaction persists throughout the drug's active period.",
  },
  {
    drugKeywords: ["maoi", "phenelzine", "tranylcypromine", "selegiline", "isocarboxazid"],
    foodKeywords: ["cheese", "aged cheese", "cheddar", "brie", "wine", "beer", "cured meat", "salami", "soy sauce", "miso", "fermented", "tyramine"],
    riskLevel: "HIGH",
    summary: "Tyramine-rich foods with MAOIs can trigger a potentially fatal blood pressure spike.",
    explanation: "MAO inhibitors block the enzyme that breaks down tyramine (found in aged/fermented foods). When tyramine builds up, it triggers a massive release of norepinephrine, causing hypertensive crisis — extremely high blood pressure that can cause stroke or death.",
    precautions: "Strictly avoid all aged cheeses, cured meats, fermented foods, and alcohol while on MAOIs. This is a medical emergency-level interaction.",
    timing: "Avoid tyramine-rich foods during and for 2 weeks after stopping MAOI treatment.",
  },

  // ── ASPIRIN / NSAIDs ──────────────────────────────────
  {
    drugKeywords: ["aspirin", "ibuprofen", "naproxen", "nsaid", "advil", "brufen", "combiflam"],
    foodKeywords: ["alcohol", "beer", "wine", "whiskey", "vodka", "liquor"],
    riskLevel: "HIGH",
    summary: "Alcohol and NSAIDs together greatly increase the risk of stomach bleeding.",
    explanation: "NSAIDs like aspirin and ibuprofen irritate the stomach lining by reducing protective mucus. Alcohol does the same. Together they dramatically increase the risk of ulcers and internal gastrointestinal bleeding.",
    precautions: "Avoid alcohol while taking NSAIDs. Always take NSAIDs with food. Seek medical attention for stomach pain, black stools, or vomiting blood.",
    timing: "Do not combine — no safe timing window.",
  },
  {
    drugKeywords: ["aspirin", "ibuprofen", "naproxen"],
    foodKeywords: ["coffee", "caffeine", "tea", "energy drink"],
    riskLevel: "LOW",
    summary: "Caffeine can slightly increase stomach irritation caused by NSAIDs.",
    explanation: "Both caffeine and NSAIDs increase stomach acid production. When combined there is a slightly higher risk of stomach upset and acid reflux, though generally minor for most people.",
    precautions: "Take your NSAID with food or a glass of milk to reduce irritation. Limit excessive caffeine.",
    timing: "Avoid taking NSAIDs on an empty stomach, especially with coffee.",
  },

  // ── THYROID ───────────────────────────────────────────
  {
    drugKeywords: ["levothyroxine", "synthroid", "thyroxine", "eltroxin"],
    foodKeywords: ["coffee", "milk", "dairy", "calcium", "iron", "soy", "tofu", "fiber", "oats", "bran"],
    riskLevel: "HIGH",
    summary: "Several foods interfere with levothyroxine absorption, making thyroid treatment less effective.",
    explanation: "Levothyroxine is extremely sensitive to absorption interference. Calcium, iron, and compounds in coffee and soy bind to the medication in your gut and prevent it from entering your bloodstream, even small reductions significantly affect thyroid levels.",
    precautions: "Take levothyroxine on a completely empty stomach first thing in the morning. Do not eat, drink coffee, or take any supplements for at least 30–60 minutes after taking it.",
    timing: "Take on empty stomach 30–60 minutes before breakfast. Avoid calcium and iron within 4 hours.",
  },

  // ── CALCIUM CHANNEL BLOCKERS ──────────────────────────
  {
    drugKeywords: ["amlodipine", "nifedipine", "felodipine", "verapamil", "diltiazem"],
    foodKeywords: ["grapefruit", "grapefruit juice", "pomelo"],
    riskLevel: "HIGH",
    summary: "Grapefruit blocks the breakdown of calcium channel blockers, causing blood pressure to drop dangerously.",
    explanation: "Grapefruit inhibits CYP3A4, the enzyme responsible for metabolizing these blood pressure medications. This causes the drug to accumulate to much higher levels, leading to excessive blood pressure drops, dizziness, and fainting.",
    precautions: "Avoid grapefruit and grapefruit juice completely while on calcium channel blockers.",
    timing: "Even consuming grapefruit 24 hours before the dose can have an effect. Avoid it entirely.",
  },

  // ── PARACETAMOL ───────────────────────────────────────
  {
    drugKeywords: ["paracetamol", "acetaminophen", "tylenol", "crocin", "dolo", "calpol"],
    foodKeywords: ["alcohol", "beer", "wine", "whiskey", "vodka", "liquor"],
    riskLevel: "HIGH",
    summary: "Alcohol combined with paracetamol can cause severe and potentially fatal liver damage.",
    explanation: "The liver processes both alcohol and paracetamol. Alcohol induces liver enzymes that convert paracetamol into a toxic by-product (NAPQI). When alcohol is present, more of this toxin is produced and less is neutralised, leading to liver cell death.",
    precautions: "Never take paracetamol for a hangover. Avoid alcohol when taking paracetamol. If you drink regularly, consult a doctor before using paracetamol.",
    timing: "Wait at least 24 hours after drinking before taking paracetamol.",
  },

  // ── DIGOXIN ───────────────────────────────────────────
  {
    drugKeywords: ["digoxin", "lanoxin"],
    foodKeywords: ["fiber", "oats", "bran", "high fiber", "whole grain"],
    riskLevel: "MODERATE",
    summary: "High-fiber foods can reduce how much Digoxin your body absorbs.",
    explanation: "Dietary fiber binds to digoxin in the digestive tract and reduces its absorption. Since digoxin has a very narrow therapeutic window, even small changes in absorption are clinically significant.",
    precautions: "Take digoxin consistently — always with food or always without. Do not suddenly change your diet dramatically.",
    timing: "Take digoxin at the same time each day relative to meals. Avoid large high-fiber meals immediately before or after your dose.",
  },
];

/**
 * Find interaction between a drug and food using keyword matching.
 */
function findInteraction(drugName, foodItem) {
  const drugQ = drugName.toLowerCase().trim();
  const foodQ = foodItem.toLowerCase().trim();

  for (const rule of INTERACTION_RULES) {
    const drugMatch = rule.drugKeywords.some((k) => drugQ.includes(k));
    const foodMatch = rule.foodKeywords.some((k) => foodQ.includes(k));

    if (drugMatch && foodMatch) {
      return {
        riskLevel: rule.riskLevel,
        interactionExists: rule.riskLevel !== "NO_INTERACTION",
        summary: rule.summary,
        explanation: rule.explanation,
        precautions: rule.precautions,
        timing: rule.timing,
      };
    }
  }

  // No match — return safe default
  return {
    riskLevel: "NO_INTERACTION",
    interactionExists: false,
    summary: `No known significant interaction found between ${drugName} and ${foodItem}.`,
    explanation: "Based on available pharmacological data, there is no well-documented interaction between this drug and food. However, always follow your doctor's dietary advice.",
    precautions: "Continue your normal diet. If you notice unusual symptoms after eating certain foods with this medication, consult your doctor.",
    timing: "No special timing required.",
  };
}

module.exports = { findInteraction, INTERACTION_RULES };
