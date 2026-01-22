import type { Question } from '../types/ielts';

export const part1Questions: Question[] = [
  // Work & Studies
  {
    id: 'work_1',
    category: 'Work',
    question: 'What do you do for a living?',
    followUp: [
      'Do you enjoy your job? Why or why not?',
      'What is the most interesting aspect of your work?',
      'Would you like to change your career in the future?'
    ]
  },
  {
    id: 'studies_1',
    category: 'Studies',
    question: 'What are you studying?',
    followUp: [
      'Why did you choose that subject?',
      'Do you find your studies challenging?',
      'What do you plan to do after you graduate?'
    ]
  },
  
  // Home & Hometown
  {
    id: 'home_1',
    category: 'Home',
    question: 'Where do you live?',
    followUp: [
      'How long have you lived there?',
      'What do you like about your neighbourhood?',
      'Would you prefer to live in a different type of area?'
    ]
  },
  {
    id: 'hometown_1',
    category: 'Hometown',
    question: 'Tell me about your hometown.',
    followUp: [
      'What is your hometown known for?',
      'How has your hometown changed over the years?',
      'Do you think you will always live in your hometown?'
    ]
  },
  
  // Hobbies & Free Time
  {
    id: 'hobbies_1',
    category: 'Hobbies',
    question: 'What do you do in your free time?',
    followUp: [
      'How did you become interested in these activities?',
      'How much time do you spend on your hobbies?',
      'Would you like to try any new hobbies?'
    ]
  },
  {
    id: 'weekend_1',
    category: 'Weekend',
    question: 'What do you usually do on weekends?',
    followUp: [
      'Do you prefer weekends to weekdays? Why?',
      'How do you usually relax on weekends?',
      'Describe your ideal weekend.'
    ]
  },
  
  // Food & Cooking
  {
    id: 'food_1',
    category: 'Food',
    question: 'What is your favourite food?',
    followUp: [
      'How often do you eat your favourite food?',
      'Can you cook your favourite dish?',
      'Is food from your country popular internationally?'
    ]
  },
  {
    id: 'cooking_1',
    category: 'Cooking',
    question: 'Do you enjoy cooking?',
    followUp: [
      'What kind of dishes can you cook?',
      'Who taught you to cook?',
      'Do you prefer eating at home or in restaurants?'
    ]
  },
  
  // Travel & Holidays
  {
    id: 'travel_1',
    category: 'Travel',
    question: 'Do you like to travel?',
    followUp: [
      'What countries would you like to visit?',
      'What was your most memorable travel experience?',
      'Do you prefer travelling alone or with others?'
    ]
  },
  {
    id: 'holidays_1',
    category: 'Holidays',
    question: 'How do you usually spend your holidays?',
    followUp: [
      'What was your best holiday ever?',
      'Do you prefer active or relaxing holidays?',
      'Where would you like to go for your next holiday?'
    ]
  },
  
  // Technology & Internet
  {
    id: 'technology_1',
    category: 'Technology',
    question: 'How often do you use the internet?',
    followUp: [
      'What do you use the internet for most?',
      'Has technology made your life better?',
      'Could you live without the internet?'
    ]
  },
  {
    id: 'socialmedia_1',
    category: 'Social Media',
    question: 'Do you use social media?',
    followUp: [
      'Which social media platforms do you prefer?',
      'How much time do you spend on social media?',
      'Do you think social media is beneficial for society?'
    ]
  }
];

export const getRandomPart1Questions = (count: number = 2): Question[] => {
  // Get questions from different categories
  const categories = [...new Set(part1Questions.map(q => q.category))];
  const selectedCategories = categories.sort(() => 0.5 - Math.random()).slice(0, count);
  
  return selectedCategories.map(category => {
    const categoryQuestions = part1Questions.filter(q => q.category === category);
    return categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
  });
};