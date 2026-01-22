import type { CueCard } from '../types/ielts';

export const cueCards: CueCard[] = [
  {
    id: 'person_1',
    topic: 'Describe a person you admire',
    bulletPoints: [
      'Who this person is',
      'What this person does',
      'Why you admire this person',
      'How this person has influenced you'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'place_1',
    topic: 'Describe a place you would like to visit',
    bulletPoints: [
      'Where this place is',
      'When you would like to go there',
      'What you would do there',
      'Why you want to visit this place'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'event_1',
    topic: 'Describe a memorable event in your life',
    bulletPoints: [
      'When and where the event happened',
      'Who was involved in the event',
      'What exactly happened',
      'Why this event was memorable for you'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'object_1',
    topic: 'Describe something you own that is important to you',
    bulletPoints: [
      'What the object is',
      'How you got this object',
      'Why this object is important to you',
      'How often you use this object'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'experience_1',
    topic: 'Describe a challenging experience you have had',
    bulletPoints: [
      'What the challenge was',
      'When and where it happened',
      'How you dealt with the challenge',
      'What you learned from the experience'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'achievement_1',
    topic: 'Describe an achievement you are proud of',
    bulletPoints: [
      'What the achievement was',
      'How you accomplished it',
      'What difficulties you faced',
      'Why you are proud of this achievement'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'hobby_1',
    topic: 'Describe a hobby you enjoy',
    bulletPoints: [
      'What the hobby is',
      'When you started doing this hobby',
      'How often you do this hobby',
      'Why you enjoy this hobby'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'book_1',
    topic: 'Describe a book you have read that you enjoyed',
    bulletPoints: [
      'What the book was about',
      'When you read this book',
      'Why you decided to read this book',
      'What you liked about this book'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'movie_1',
    topic: 'Describe a film you have watched that you liked',
    bulletPoints: [
      'What the film was about',
      'When you watched this film',
      'Why you chose to watch this film',
      'What you particularly liked about this film'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'journey_1',
    topic: 'Describe a journey you have taken',
    bulletPoints: [
      'Where you were going',
      'Who you travelled with',
      'How long the journey took',
      'What was memorable about this journey'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'decision_1',
    topic: 'Describe an important decision you had to make',
    bulletPoints: [
      'What the decision was',
      'When you had to make this decision',
      'What choices you had',
      'How you felt about the decision afterwards'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'building_1',
    topic: 'Describe an important building in your hometown',
    bulletPoints: [
      'What the building is',
      'Where it is located',
      'What it looks like',
      'Why it is important to your town or city'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'skill_1',
    topic: 'Describe a skill you would like to learn',
    bulletPoints: [
      'What the skill is',
      'Why you want to learn this skill',
      'How you would learn this skill',
      'How having this skill would benefit you'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'weather_1',
    topic: 'Describe your favourite type of weather',
    bulletPoints: [
      'What type of weather it is',
      'When this weather usually occurs in your country',
      'What you usually do during this weather',
      'Why you like this type of weather'
    ],
    preparation: 60,
    speaking: 120
  },
  {
    id: 'tradition_1',
    topic: 'Describe a tradition in your country',
    bulletPoints: [
      'What the tradition is',
      'When this tradition is celebrated',
      'What people do during this tradition',
      'Why this tradition is important in your country'
    ],
    preparation: 60,
    speaking: 120
  }
];

export const getRandomCueCard = (): CueCard => {
  return cueCards[Math.floor(Math.random() * cueCards.length)];
};