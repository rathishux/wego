const ADJECTIVES = [
  "Calm", "Steady", "Bright", "Gentle", "Quiet", "Brave", "Warm", "Kind",
  "Sunny", "Patient", "Hopeful", "Mighty", "Radiant", "Peaceful", "Resolute",
  "Cheerful", "Grounded", "Vivid", "Earnest", "Lively",
];

const NOUNS = [
  "River", "Meadow", "Harbor", "Summit", "Willow", "Ember", "Comet", "Garden",
  "Horizon", "Maple", "Pebble", "Lantern", "Compass", "Orchard", "Trail",
  "Canyon", "Breeze", "Cedar", "Aurora", "Bloom",
];

export function generatePseudonym(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 90) + 10;
  return `${adjective} ${noun} ${number}`;
}

export function generateAvatarSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
