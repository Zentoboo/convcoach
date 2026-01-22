import type { Question } from '../types/ielts';

export const part3Questions: { [key: string]: Question[] } = {
  // For Person topic
  'person': [
    {
      id: 'person_q1',
      category: 'People in Society',
      question: 'What qualities do you think are important for people to have in society?'
    },
    {
      id: 'person_q2', 
      category: 'Role Models',
      question: 'Do you think celebrities make good role models for young people?'
    },
    {
      id: 'person_q3',
      category: 'Leadership',
      question: 'What makes a good leader in today\'s world?'
    },
    {
      id: 'person_q4',
      category: 'Social Influence',
      question: 'How has social media changed the way we view successful people?'
    }
  ],
  
  // For Place topic
  'place': [
    {
      id: 'place_q1',
      category: 'Tourism',
      question: 'What are the advantages and disadvantages of international tourism?'
    },
    {
      id: 'place_q2',
      category: 'Urban Development',
      question: 'How do you think cities will change in the future?'
    },
    {
      id: 'place_q3',
      category: 'Cultural Heritage',
      question: 'Why is it important to preserve historical places?'
    },
    {
      id: 'place_q4',
      category: 'Travel Impact',
      question: 'How does travel affect a person\'s perspective on life?'
    }
  ],
  
  // For Event topic
  'event': [
    {
      id: 'event_q1',
      category: 'Life Changes',
      question: 'How do significant life events shape a person\'s character?'
    },
    {
      id: 'event_q2',
      category: 'Celebrations',
      question: 'Why are celebrations and traditions important in society?'
    },
    {
      id: 'event_q3',
      category: 'Memory',
      question: 'How do people decide which events are worth remembering?'
    },
    {
      id: 'event_q4',
      category: 'Modern Life',
      question: 'Do you think people experience fewer memorable events in the digital age?'
    }
  ],
  
  // For Object topic
  'object': [
    {
      id: 'object_q1',
      category: 'Materialism',
      question: 'Do you think people are too materialistic in modern society?'
    },
    {
      id: 'object_q2',
      category: 'Technology',
      question: 'How has technology changed the value we place on physical objects?'
    },
    {
      id: 'object_q3',
      category: 'Minimalism',
      question: 'What are the benefits of owning fewer possessions?'
    },
    {
      id: 'object_q4',
      category: 'Sentimental Value',
      question: 'Why do some objects become more valuable over time?'
    }
  ],
  
  // For Experience topic
  'experience': [
    {
      id: 'experience_q1',
      category: 'Personal Growth',
      question: 'How do challenging experiences contribute to personal development?'
    },
    {
      id: 'experience_q2',
      category: 'Education',
      question: 'What role should challenging experiences play in education?'
    },
    {
      id: 'experience_q3',
      category: 'Resilience',
      question: 'Why is resilience important in today\'s world?'
    },
    {
      id: 'experience_q4',
      category: 'Risk Taking',
      question: 'Should people actively seek out challenging experiences?'
    }
  ],
  
  // For Achievement topic
  'achievement': [
    {
      id: 'achievement_q1',
      category: 'Success Definition',
      question: 'How do different cultures define success?'
    },
    {
      id: 'achievement_q2',
      category: 'Ambition',
      question: 'Is ambition always a positive quality?'
    },
    {
      id: 'achievement_q3',
      category: 'Recognition',
      question: 'Why is recognition important for human motivation?'
    },
    {
      id: 'achievement_q4',
      category: 'Modern Society',
      question: 'How has the definition of achievement changed in modern times?'
    }
  ],
  
  // For Hobby topic
  'hobby': [
    {
      id: 'hobby_q1',
      category: 'Work-Life Balance',
      question: 'How important is it for people to have hobbies outside of work?'
    },
    {
      id: 'hobby_q2',
      category: 'Modern Life',
      question: 'Have hobbies become less common in the digital age?'
    },
    {
      id: 'hobby_q3',
      category: 'Social Connection',
      question: 'What role do hobbies play in bringing people together?'
    },
    {
      id: 'hobby_q4',
      category: 'Mental Health',
      question: 'How can hobbies contribute to good mental health?'
    }
  ],
  
  // For Book topic
  'book': [
    {
      id: 'book_q1',
      category: 'Reading Culture',
      question: 'Is reading becoming less popular in the digital age?'
    },
    {
      id: 'book_q2',
      category: 'Education',
      question: 'What is the role of books in education today?'
    },
    {
      id: 'book_q3',
      category: 'Digital vs Physical',
      question: 'Do you think e-books will completely replace physical books?'
    },
    {
      id: 'book_q4',
      category: 'Knowledge',
      question: 'How important is reading for personal development?'
    }
  ],
  
  // For Movie topic
  'movie': [
    {
      id: 'movie_q1',
      category: 'Cultural Influence',
      question: 'How do movies influence popular culture?'
    },
    {
      id: 'movie_q2',
      category: 'Entertainment',
      question: 'What makes a movie successful in today\'s market?'
    },
    {
      id: 'movie_q3',
      category: 'Social Impact',
      question: 'Can movies be a force for positive social change?'
    },
    {
      id: 'movie_q4',
      category: 'Future of Cinema',
      question: 'How do you think the movie industry will evolve in the future?'
    }
  ],
  
  // For Journey topic
  'journey': [
    {
      id: 'journey_q1',
      category: 'Transportation',
      question: 'How has modern transportation changed the way we travel?'
    },
    {
      id: 'journey_q2',
      category: 'Environmental Impact',
      question: 'What are the environmental consequences of modern travel?'
    },
    {
      id: 'journey_q3',
      category: 'Cultural Exchange',
      question: 'How does travel contribute to cultural understanding?'
    },
    {
      id: 'journey_q4',
      category: 'Future Travel',
      question: 'Do you think virtual travel will replace physical travel in the future?'
    }
  ],
  
  // For Decision topic
  'decision': [
    {
      id: 'decision_q1',
      category: 'Decision Making',
      question: 'What factors should people consider when making important life decisions?'
    },
    {
      id: 'decision_q2',
      category: 'Risk Assessment',
      question: 'How do people learn to make better decisions?'
    },
    {
      id: 'decision_q3',
      category: 'Modern Choices',
      question: 'Do people have too many choices in modern society?'
    },
    {
      id: 'decision_q4',
      category: 'Technology Impact',
      question: 'How has technology changed the decision-making process?'
    }
  ],
  
  // For Building topic
  'building': [
    {
      id: 'building_q1',
      category: 'Architecture',
      question: 'What makes good architecture in modern cities?'
    },
    {
      id: 'building_q2',
      category: 'Urban Planning',
      question: 'How should cities balance modernization with historical preservation?'
    },
    {
      id: 'building_q3',
      category: 'Sustainability',
      question: 'What role should sustainability play in modern construction?'
    },
    {
      id: 'building_q4',
      category: 'Community Spaces',
      question: 'What makes public buildings important for communities?'
    }
  ],
  
  // For Skill topic
  'skill': [
    {
      id: 'skill_q1',
      category: 'Education System',
      question: 'How well do traditional education systems prepare people with practical skills?'
    },
    {
      id: 'skill_q2',
      category: 'Lifelong Learning',
      question: 'Why is continuous learning important in today\'s world?'
    },
    {
      id: 'skill_q3',
      category: 'Technology Skills',
      question: 'What digital skills will be most important in the future?'
    },
    {
      id: 'skill_q4',
      category: 'Traditional vs Modern',
      question: 'How do traditional skills compare to modern technological skills in value?'
    }
  ],
  
  // For Weather topic
  'weather': [
    {
      id: 'weather_q1',
      category: 'Climate Change',
      question: 'How is climate change affecting weather patterns globally?'
    },
    {
      id: 'weather_q2',
      category: 'Weather Impact',
      question: 'How does weather influence people\'s daily lives and activities?'
    },
    {
      id: 'weather_q3',
      category: 'Seasonal Changes',
      question: 'Do you think traditional seasons are becoming less predictable?'
    },
    {
      id: 'weather_q4',
      category: 'Weather Technology',
      question: 'How has modern technology improved weather forecasting?'
    }
  ],
  
  // For Tradition topic
  'tradition': [
    {
      id: 'tradition_q1',
      category: 'Cultural Preservation',
      question: 'How can traditional cultures be preserved in a globalized world?'
    },
    {
      id: 'tradition_q2',
      category: 'Modern vs Traditional',
      question: 'Should traditions adapt to modern values or remain unchanged?'
    },
    {
      id: 'tradition_q3',
      category: 'Global Culture',
      question: 'Is globalization making local traditions less important?'
    },
    {
      id: 'tradition_q4',
      category: 'Cultural Identity',
      question: 'What role do traditions play in maintaining cultural identity?'
    }
  ]
};

export const getPart3Questions = (cueCardTopic: string): Question[] => {
  // Extract the base topic from cue card ID
  const topic = cueCardTopic.split('_')[0];
  const questions = part3Questions[topic] || part3Questions['person']; // fallback to person questions
  
  // Return 4-5 questions for the discussion
  return questions.slice(0, 4 + Math.floor(Math.random() * 2));
};