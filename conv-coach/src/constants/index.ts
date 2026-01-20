import type { LanguageConfig } from '../types';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en-US', name: 'English (US)', defaultFillers: ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'ummm', 'uhh', 'well'] },
  { code: 'es-ES', name: 'Spanish (Spain)', defaultFillers: ['este', 'eh', 'pues', 'bueno', 'sabes', 'tipo', 'vale', 'este', 'aquello'] },
  { code: 'fr-FR', name: 'French', defaultFillers: ['euh', 'ben', 'tu sais', 'en fait', 'alors', 'quoi', 'hein', 'bon'] },
  { code: 'de-DE', name: 'German', defaultFillers: ['äh', 'ähm', 'also', 'genau', 'quasi', 'halt', 'eigentlich', 'sozusagen'] },
  { code: 'it-IT', name: 'Italian', defaultFillers: ['ehm', 'allora', 'tipo', 'cioè', 'diciamo', 'insomma', 'praticamente', 'vabbè'] },
];

export const SESSIONS_PER_PAGE = 3;