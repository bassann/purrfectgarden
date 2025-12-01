
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VocabularyWord, WordPair, PodcastEpisode } from "../types";
import { GOGOLINK_LEVELS, PODCAST_SCRIPTS } from "./staticData";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';
const ttsModel = 'gemini-2.5-flash-preview-tts';

// --- Vocabulary Garden (Keep Dynamic) ---

export const fetchNewWord = async (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<VocabularyWord> => {
  const seed = Date.now();
  
  const prompt = `Generate a single Finnish language exercise suitable for a ${difficulty} level learner.
  
  Seed: ${seed} (Ensure high entropy and uniqueness. Do NOT repeat previous words).

  Randomly select one of the following types (distribute evenly):
  
  1. **Locative Cases (Missä/Mistä/Mihin)**: 
     - Give a sentence with a missing location word.
     - Target words: *koulu, kauppa, tori, asema, metsä, järvi, laukku, pöytä, hylly, Helsinki, Turku, Tampere*.

  2. **KPT Consonant Gradation**: 
     - Ask the user to conjugate a word that triggers a specific KPT change.
     - Types: nk-ng, lt-ll, rt-rr, pp-p, nt-nn.

  3. **Vocabulary / Context Fill-in**: 
     - Topics: Technology, Emotions, Nature, Household, Work life.

  Constraints:
  - **Context is key**: The "definition" is the question.
  - **Hints**: Very helpful hints suitable for learners.

  Output JSON format:
  - word: The correct answer.
  - definition: The question/instruction.
  - hint: A helpful hint.
  - example: Example sentence.
  - difficulty: Level (Helppo, Keskitaso, Vaikea).
  - category: Exercise category.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          definition: { type: Type.STRING },
          hint: { type: Type.STRING },
          example: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          category: { type: Type.STRING }
        },
        required: ["word", "definition", "hint", "example", "difficulty", "category"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as VocabularyWord;
  }
  
  throw new Error("Failed to generate word");
};

// --- Gogolink (Static Data for Speed) ---

export const fetchGogolinkPairs = async (level: number): Promise<WordPair[]> => {
    // Simulate async for consistency, but return static data immediately
    const levelData = GOGOLINK_LEVELS.find(l => l.level === level);
    if (!levelData) throw new Error("Level not found");

    // Add IDs dynamically
    const pairs: WordPair[] = levelData.pairs.map((p, idx) => ({
        id: `pair-${level}-${idx}`,
        finnish: p.finnish,
        match: p.emoji,
        type: 'emoji'
    }));

    return pairs;
}

// --- Suomicast (Static Data + TTS) ---

export const fetchPodcastScript = async (): Promise<PodcastEpisode> => {
    // Pick topic based on date to keep it consistent for the "day"
    const today = new Date();
    const index = today.getDate() % PODCAST_SCRIPTS.length;
    return PODCAST_SCRIPTS[index];
};

export const fetchPodcastAudio = async (transcript: Array<{speaker: string, text: string}>): Promise<ArrayBuffer> => {
    // Combine transcript into a single string for TTS
    
    // Map speakers to Voice Names
    const distinctSpeakers = Array.from(new Set(transcript.map(t => t.speaker)));
    const voices = ['Kore', 'Puck', 'Fenrir', 'Charon']; // Available voices
    const speakerMap: Record<string, string> = {};
    
    distinctSpeakers.forEach((s, i) => {
        speakerMap[s] = voices[i % voices.length];
    });

    const conversationPrompt = transcript.map(line => `${line.speaker}: ${line.text}`).join('\n');
    
    // Construct speaker configs
    const speakerConfigs = distinctSpeakers.map(s => ({
        speaker: s,
        voiceConfig: { prebuiltVoiceConfig: { voiceName: speakerMap[s] } }
    }));

    // If only 1 speaker, standard config, otherwise multispeaker
    const speechConfig = distinctSpeakers.length > 1 
        ? { multiSpeakerVoiceConfig: { speakerVoiceConfigs: speakerConfigs } }
        : { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } };

    const response = await ai.models.generateContent({
        model: ttsModel,
        contents: [{ parts: [{ text: conversationPrompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: speechConfig
        }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data received");

    // Convert Base64 string to ArrayBuffer (PCM)
    return base64ToArrayBuffer(base64Audio);
};

// --- Audio Helpers ---

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
