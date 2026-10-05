export const FISH_AUDIO_VOICES = [
  {
    id: "55206da8a48d4c849df1677cfe370288",
    name: "Michael B. Jordin",
    description: "Deep, intense, cinematic"
  },
  {
    id: "498f6b2cb8104c4583690d1dffefa8bb",
    name: "Leon Musk",
    description: "Methodical, quirky, futuristic"
  },
  {
    id: "949b8e0190e64650a7566015fa179267",
    name: "Chef Gordan",
    description: "Passionate, sharp, commanding"
  },
  {
    id: "aaca6b1640b048feb3682eb45fdd5fe7",
    name: "Zendayah",
    description: "Cool, confident, youthful"
  },
  {
    id: "ed2f0fe411dd4362bf9dfbd71544b258",
    name: "Neil deGrass",
    description: "Educator, booming, wonderous"
  },
  {
    id: "hip",
    name: "Chloe (Standard)",
    description: "Casual, modern & energetic"
  }
] as const;

export type VoicePersonaId = typeof FISH_AUDIO_VOICES[number]["id"];
