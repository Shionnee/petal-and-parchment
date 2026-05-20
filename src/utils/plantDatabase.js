// Premium offline database of popular houseplants and their common health conditions.
// Provides structured metadata, diagnosis details, treatment protocols, and fallback data.

export const PLANTS_DB = {
  monstera: {
    id: "monstera",
    name: "Monstera Deliciosa",
    botanicalName: "Monstera deliciosa",
    family: "Araceae",
    difficulty: "Easy to Moderate",
    origin: "Tropical rainforests of Southern Mexico & Central America",
    description: "Famous for its dramatic leaf fenestrations (natural splits), the Swiss Cheese Plant is an iconic addition to any interior garden. It thrives on climbing supports and filtered light.",
    light: "Bright, indirect light. Direct hot sun will scorch the leaves, while deep shade slows growth.",
    water: "Water thoroughly when the top 2-3 inches of soil feel completely dry. Prefers well-draining soil.",
    humidity: "High (50%+ preferred). Appreciates misting or a gravel tray.",
    temperature: "65°F - 85°F (18°C - 29°C). Keep away from drafty windows and AC units.",
    toxicity: "Toxic to cats and dogs due to calcium oxalate crystals.",
    conditions: {
      healthy: {
        id: "healthy",
        name: "Perfectly Healthy",
        severity: "healthy", // healthy, warning, critical
        healthScore: 98,
        description: "Your Monstera is displaying excellent vitality. Stems are turgid, and the glossy green foliage is free of pest signatures or mineral deficiencies. Excellent job!",
        symptoms: ["Lush green leaves", "Consistent fenestrations", "Firm upright stems", "New growth unfurling"],
        causes: ["Consistent watering schedule", "Optimal indirect bright light", "Adequate humidity and warm air flow"],
        treatment: [
          "Maintain current care parameters.",
          "Wipe dust off leaves once a month with a soft, damp cloth to support photosynthesis.",
          "Rotate the pot 90 degrees monthly to ensure balanced growth."
        ]
      },
      overwatered: {
        id: "overwatered",
        name: "Root Rot & Saturation (Overwatering)",
        severity: "critical",
        healthScore: 45,
        description: "Severe water logging has restricted oxygen flow to the root system, causing anaerobic decay (root rot). The yellowing and droopy posture of lower leaves is a clear distress signal.",
        symptoms: ["Lower leaves turning uniform pale yellow", "Soft, mushy stems near base", "Soil smells sour or earthy-decayed", "Brown, soggy root endings"],
        causes: ["Pot lacking drainage holes", "Watering too frequently without checking soil dryness", "Using heavy, non-aerated potting mix"],
        treatment: [
          "Cease watering immediately and allow the rootball to aerate.",
          "Carefully unpot the plant and inspect roots. Trim off black, mushy, or slimy roots with sterilized shears.",
          "Repot in dry, airy soil (mix standard soil with 30% perlite and orchid bark).",
          "Ensure the pot has drainage holes. Only water when the top 3 inches of soil are dry."
        ]
      },
      underwatered: {
        id: "underwatered",
        name: "Dehydration & Soil Hydrophobia (Underwatering)",
        severity: "warning",
        healthScore: 68,
        description: "The root system is experiencing prolonged moisture drought. Cellular turgor pressure has dropped, causing the leaves to droop and dry up at the edges to prevent moisture loss.",
        symptoms: ["Crispy brown edges or leaf tips", "Drooping, papery leaves", "Soil shrinking away from pot edges", "Slow growth rate"],
        causes: ["Infrequent watering", "Extremely dry indoor air or direct drafts", "Soil has become hydrophobic (repels water due to long dry spell)"],
        treatment: [
          "Give the plant a thorough soak. Submerge the entire pot in a tub of tepid water for 15-20 minutes ('bottom watering') to break soil hydrophobicity.",
          "Let excess water drain completely; do not let the pot sit in standing water afterwards.",
          "Increase misting or place near a humidifier to restore moisture in surrounding air.",
          "Establish a consistent check-by-touch schedule every 7 days."
        ]
      },
      pest_spider_mites: {
        id: "pest_spider_mites",
        name: "Spider Mite Infestation",
        severity: "critical",
        healthScore: 55,
        description: "A colonies of Tetranychidae (spider mites) has colonized the undersides of the leaves, piercing plant cells to suck out vital sap. This results in stippling damage and leaf decline.",
        symptoms: ["Fine, silky webbing near leaf joints and undersides", "Tiny yellow or bronze speckling (stippling) on leaves", "Leaves feeling dusty or gritty to the touch", "Premature leaf fall"],
        causes: ["Dry, warm indoor air (ideal breeding conditions for mites)", "Lack of regular foliage washing or dust clearing", "Intro from a new infected houseplant"],
        treatment: [
          "Isolate the plant immediately to prevent the infestation from spreading to other foliage.",
          "Take the plant to the shower and blast the undersides of leaves thoroughly with lukewarm water to dislodge mites and webs.",
          "Spray the plant extensively with an organic neem oil solution or insecticidal soap, paying close attention to leaf undersides and stem joints.",
          "Repeat the spraying treatment every 5-7 days for 3 consecutive weeks to disrupt the mite egg cycle."
        ]
      }
    }
  },
  fiddle_leaf: {
    id: "fiddle_leaf",
    name: "Fiddle Leaf Fig",
    botanicalName: "Ficus lyrata",
    family: "Moraceae",
    difficulty: "Challenging",
    origin: "Lowland tropical rainforests of Western Africa",
    description: "Known for its bold, violin-shaped leaves and sculptural growth, the Fiddle Leaf Fig is a premium statement plant. It is notoriously sensitive to changes in its microenvironment.",
    light: "Demands highly consistent, very bright indirect light. Requires rotating to grow straight.",
    water: "Extremely sensitive to moisture levels. Water heavily only when the top 2 inches of soil are dry, then let drain fully.",
    humidity: "Moderate to high. Avoid dry heating vents.",
    temperature: "60°F - 85°F (16°C - 29°C). Extremely prone to leaf drop in cold drafts.",
    toxicity: "Toxic to pets due to irritating milky sap (latex).",
    conditions: {
      healthy: {
        id: "healthy",
        name: "Vibrant & Thriving",
        severity: "healthy",
        healthScore: 95,
        description: "Your Fiddle Leaf Fig is in prime health! Leaves are upright, rigid, leather-textured, and exhibit a rich forest green hue. The node structure is solid and compact.",
        symptoms: ["Tough, leathery, upright leaves", "Waxy, glossy leaf surfaces", "Healthy light-green bud at crown", "No brown markings"],
        causes: ["Impeccable location constancy", "Excellent deep watering balance", "Dust-free leaves receiving rich indirect light"],
        treatment: [
          "Do not move the plant! They thrive on routine.",
          "Wipe leaves carefully with a damp cloth every fortnight to maximize light absorption.",
          "Apply liquid fertilizer once a month during spring and summer at half-strength."
        ]
      },
      overwatered_edema: {
        id: "overwatered_edema",
        name: "Edema (Cellular Rupture & Root Rot)",
        severity: "critical",
        healthScore: 50,
        description: "The plant is absorbing water faster than it can transpire. The excess water pressure causes the cells on the underside of the leaves to swell and burst, creating unsightly rust-colored scar tissue.",
        symptoms: ["Small reddish-brown spots speckled across new leaves", "Older leaves turning yellow and dropping off", "Soggy soil medium that doesn't dry", "Stagnant, stunted growth"],
        causes: ["Overwatering during low-light winter months", "Highly compacted soil retaining moisture too long", "Poor root drainage or high ambient humidity with zero airflow"],
        treatment: [
          "Reduce watering frequency significantly. Let the soil dry much deeper before watering again.",
          "Boost ambient airflow near the plant using a small fan (do not blow dry air directly on it).",
          "Increase indirect light exposure to speed up transpiration rates.",
          "Inspect drainage. Consider adding a coco-coir aeration layer in the pot."
        ]
      },
      underwatered: {
        id: "underwatered",
        name: "Drought & Heat Stress",
        severity: "warning",
        healthScore: 70,
        description: "The soil is bone dry, leading to dehydration. The large leaves are losing moisture faster than the roots can extract it, causing them to lose rigidity and droop.",
        symptoms: ["Whole plant droop (leaves pointing downward)", "Cracking edges and dry brown patches in leaf centers", "Dry soil cracking and separating from the pot"],
        causes: ["Neglected watering schedule", "Placement near direct sunlight or heat vents", "Rootball has shrunk, allowing water to run down the sides without absorbing"],
        treatment: [
          "Perform a deep drench. Water multiple times slowly until water flows out the bottom, or bottom-water for 20 minutes.",
          "Check soil dryness with a wooden skewer or moisture meter before watering.",
          "Trim off heavily ruined lower leaves with sanitized shears to reduce moisture strain on the root system.",
          "Move away from drafty radiators or hot spots."
        ]
      }
    }
  },
  snake_plant: {
    id: "snake_plant",
    name: "Snake Plant (Laurentii)",
    botanicalName: "Sansevieria trifasciata",
    family: "Asparagaceae",
    difficulty: "Super Easy",
    origin: "Tropical West Africa",
    description: "An incredibly hardy plant featuring upright sword-like leaves with striking yellow margins. An exceptional air-purifier that thrives on neglect and tolerates low-light environments.",
    light: "Highly adaptable. Will thrive in bright light but easily handles deep shade. Keep out of scorching direct mid-day sun.",
    water: "Extremely low water requirements. Allow the soil to dry out 100% between waterings. Typically once every 3-4 weeks is plenty.",
    humidity: "Low. Enjoys dry indoor conditions.",
    temperature: "55°F - 85°F (13°C - 29°C). Protect from frost or freezing temperatures.",
    toxicity: "Toxic to cats and dogs.",
    conditions: {
      healthy: {
        id: "healthy",
        name: "Sturdy & Strong",
        severity: "healthy",
        healthScore: 99,
        description: "Your Snake Plant is in excellent shape! The variegated blades are stiff, vertical, and boast strong, bold color contrasts. This is a model of resilient health.",
        symptoms: ["Rock-solid vertical blades", "Vivid yellow borders and green bands", "Dry, clean soil base", "Pest-free crown"],
        causes: ["Appropriate dry spells", "No water accumulated in the central leaf rosette", "Bright, indirect light"],
        treatment: [
          "Continue to leave the plant alone. Neglect is its best friend.",
          "Never water if the soil feels even slightly cool or damp.",
          "Repot only when the roots physically crack the pot; they prefer being rootbound."
        ]
      },
      root_rot: {
        id: "root_rot",
        name: "Mushy Leaf Decay (Overwatering & Root Rot)",
        severity: "critical",
        healthScore: 35,
        description: "The ultimate killer of Snake Plants. Excess water has caused fungal root decay, which is travelling up the leaf blades, turning them into a mushy, waterlogged mess that collapses.",
        symptoms: ["Leaves turning soft, wrinkled, and mushy near the soil", "Leaves falling over sideways, snapping at base", "Foul, damp smell from pot", "Dark, slimy root decay"],
        causes: ["Watering too frequently (e.g. weekly)", "Potting soil that holds water (non-draining clay-like soil)", "Water trapped directly inside the central leaf rosette"],
        treatment: [
          "Immediately cut away all soft, mushy leaf blades right down to the soil level.",
          "Unpot the plant. Wash away old soil, prune all rotted roots, and treat remaining rhizome with a dash of powdered cinnamon (natural fungicide).",
          "Repot in a terracotta pot using a sandy succulent/cactus mix.",
          "Wait at least 2 weeks before giving the plant a tiny sip of water. In the winter, do not water more than once a month."
        ]
      }
    }
  },
  peace_lily: {
    id: "peace_lily",
    name: "Peace Lily",
    botanicalName: "Spathiphyllum",
    family: "Araceae",
    difficulty: "Easy",
    origin: "Tropical regions of the Americas and Southeastern Asia",
    description: "A gorgeous lush foliage plant with glossy green leaves and pristine white spathes (flowers). Famous for its communicative nature: it dramaticially collapses when dry, and revives within hours.",
    light: "Medium to low indirect light. Perfect for offices. Direct sunlight will bleach and burn the leaves.",
    water: "Prefers consistently damp but not soggy soil. Will droop dramatically to let you know it's thirsty.",
    humidity: "High. Loves bathrooms or daily leaf misting.",
    temperature: "65°F - 80°F (18°C - 27°C). Keep away from cold drafts.",
    toxicity: "Toxic due to calcium oxalate crystals.",
    conditions: {
      healthy: {
        id: "healthy",
        name: "Elegant & Glossy",
        severity: "healthy",
        healthScore: 97,
        description: "Your Peace Lily is thriving! The leaves are glossy emerald green and spreading outwards elegantly. A white spathe may be growing or fully open.",
        symptoms: ["Lush, deep green glossy leaves", "Firm, upright leaf stalks", "Pristine white blooms (seasonal)", "Clean, damp soil environment"],
        causes: ["Regular moisture replenishment", "Shaded, low-stress location", "Warm ambient temperature"],
        treatment: [
          "Keep up the excellent balance of moisture.",
          "Gently wash the large glossy leaves to prevent dust blockages.",
          "Cut back spent blooms at the base of the stalk once they turn green or brown."
        ]
      },
      underwatered_dramatic: {
        id: "underwatered_dramatic",
        name: "Dehydration & Droop Distress",
        severity: "warning",
        healthScore: 60,
        description: "Your Peace Lily is expressing extreme thirst. Because it is highly communicative, it has completely collapsed to conserve water. Although dramatic, it is highly recoverable if caught early.",
        symptoms: ["Severe drooping of all stalks (flat against the pot)", "Leaves feeling soft, limp, and thin", "Dry, dusty soil surface"],
        causes: ["Skipped watering by a few days", "Extremely low room humidity", "Small root system bound in a tiny pot"],
        treatment: [
          "Do not panic! Water the soil deeply until water runs out of the drainage holes.",
          "Alternatively, place the pot in a basin of water for 15 minutes to bottom-water.",
          "Mist the leaves to increase immediate hydration.",
          "The plant should rebound and stand fully upright within 3 to 6 hours."
        ]
      },
      chlorine_burn: {
        id: "chlorine_burn",
        name: "Fluoride/Chlorine Sensitivity (Tap Water Toxins)",
        severity: "warning",
        healthScore: 75,
        description: "Peace Lilies are chemically sensitive to tap water chemicals (chlorine, fluoride, hard minerals). The roots accumulate these compounds, leading to chemical burn at the furthest points of the leaf tips.",
        symptoms: ["Uniform, dark brown or black tips on almost all leaves", "Thin yellow halo separating the green leaf from the brown tip", "Otherwise upright and healthy structure"],
        causes: ["Watering directly with fresh, cold chlorinated municipal tap water", "Accumulation of fertilizer salts in soil"],
        treatment: [
          "Switch to using distilled water, rainwater, or tap water that has sat out in an open container for 24 hours (allowing chlorine to dissipate).",
          "Flush the soil thoroughly with distilled water to wash away built-up salts and minerals.",
          "Trim off only the dead brown tips using sharp scissors, leaving a tiny margin of brown so you don't cut into live green tissue (which triggers fresh browning)."
        ]
      }
    }
  }
};

// Generates a mock scan result based on user selections or random profiles
export function getMockDiagnosis(plantId, conditionId) {
  const plant = PLANTS_DB[plantId] || PLANTS_DB.monstera;
  const condition = plant.conditions[conditionId] || plant.conditions.healthy;

  return {
    plantId: plant.id,
    plantName: plant.name,
    botanicalName: plant.botanicalName,
    family: plant.family,
    difficulty: plant.difficulty,
    origin: plant.origin,
    description: plant.description,
    light: plant.light,
    water: plant.water,
    humidity: plant.humidity,
    temperature: plant.temperature,
    toxicity: plant.toxicity,
    conditionId: condition.id,
    conditionName: condition.name,
    severity: condition.severity,
    healthScore: condition.healthScore,
    diagnosisDescription: condition.description,
    symptoms: condition.symptoms,
    causes: condition.causes,
    treatment: condition.treatment,
    timestamp: new Date().toISOString(),
    id: `scan_${Math.random().toString(36).substring(2, 9)}`
  };
}

// Full list of available options for simulation mode setup
export const SIMULATOR_SELECTIONS = [
  {
    plantId: "monstera",
    plantName: "Monstera Deliciosa",
    conditions: [
      { id: "healthy", name: "Healthy & Thriving" },
      { id: "overwatered", name: "Yellow Leaves (Overwatering)" },
      { id: "underwatered", name: "Crispy Brown Edges (Underwatering)" },
      { id: "pest_spider_mites", name: "Fine Webbing (Spider Mites)" }
    ]
  },
  {
    plantId: "fiddle_leaf",
    plantName: "Fiddle Leaf Fig",
    conditions: [
      { id: "healthy", name: "Healthy & Thriving" },
      { id: "overwatered_edema", name: "Red/Brown Spots (Edema & Overwatering)" },
      { id: "underwatered", name: "Drooping & Cracking (Underwatering)" }
    ]
  },
  {
    plantId: "snake_plant",
    plantName: "Snake Plant",
    conditions: [
      { id: "healthy", name: "Healthy & Thriving" },
      { id: "root_rot", name: "Mushy Yellow Base (Root Rot)" }
    ]
  },
  {
    plantId: "peace_lily",
    plantName: "Peace Lily",
    conditions: [
      { id: "healthy", name: "Healthy & Thriving" },
      { id: "underwatered_dramatic", name: "Collapsed/Severely Drooping" },
      { id: "chlorine_burn", name: "Black Leaf Tips (Tap Water Chemical Burn)" }
    ]
  }
];
