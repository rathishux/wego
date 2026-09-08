// Simple keyword match against genuinely serious warning signs for
// semaglutide (Wegovy/Ozempic), sourced from FDA/manufacturer safety
// information. Deliberately broad and non-diagnostic — this never guesses
// *which* condition it might be, it just flags "this sounds serious, talk
// to your doctor." A plain keyword match will have false positives and
// negatives; it's a safety net, not a medical assessment.
const SERIOUS_SIDE_EFFECT_PHRASES = [
  // Pancreatitis
  "severe pain",
  "severe abdominal",
  "severe stomach pain",
  "pain won't go away",
  "pain that won't stop",
  "pain radiating to my back",
  "unbearable pain",
  // Gallbladder
  "jaundice",
  "yellowing skin",
  "yellow skin",
  "yellow eyes",
  "clay-colored stool",
  "clay colored stool",
  "gallbladder",
  "gallstone",
  // Thyroid
  "lump in my neck",
  "neck lump",
  "swelling in my neck",
  "hoarseness",
  "hoarse voice",
  "trouble swallowing",
  "difficulty swallowing",
  // Allergic reaction
  "face swelling",
  "swelling of my face",
  "throat swelling",
  "swelling throat",
  "can't breathe",
  "cant breathe",
  "difficulty breathing",
  "trouble breathing",
  "severe rash",
  "fainting",
  "passed out",
  "rapid heartbeat",
  "anaphylaxis",
  // Dehydration / kidney (from severe GI symptoms)
  "can't keep anything down",
  "cant keep anything down",
  "severe diarrhea",
  "severe vomiting",
  "vomiting a lot",
  "throwing up constantly",
  "dehydrated",
  "dehydration",
  // Vision
  "vision changes",
  "blurry vision",
  "vision loss",
  "losing my vision",
  // Mood / suicidal thoughts
  "suicidal",
  "hurt myself",
  "self harm",
  "self-harm",
  "want to end it",
  // Hypoglycemia
  "low blood sugar",
  "hypoglycemia",
  "very dizzy",
  "confused and shaky",
  "slurred speech",
];

export function isSeriousSideEffect(text: string): boolean {
  const lower = text.toLowerCase();
  return SERIOUS_SIDE_EFFECT_PHRASES.some((phrase) => lower.includes(phrase));
}
