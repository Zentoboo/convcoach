import type { ExaminerScript } from '../types/ielts';

export const examinerScript: ExaminerScript = {
  introduction: [
    "Good morning/afternoon. My name is Examiner and I'll be conducting your IELTS Speaking test today.",
    "First, I'd like to check your identification. Could you please show me your ID or passport?",
    "Thank you. Now, in the first part of the test, I'm going to ask you some questions about yourself."
  ],
  
  partTransitions: {
    toPart2: "Alright then. Now we're going to move on to Part 2 of the test. I'm going to give you a topic card and you have one minute to prepare. You can make some notes if you wish. You'll then have between one to two minutes to speak about the topic. Don't worry if I stop you, that's normal. Here's your topic.",
    
    toPart3: "Thank you. Now, let's move on to Part 3. I'm going to ask you some more general questions related to the topic we discussed in Part 2.",
    
    conclusion: "Thank you very much. That is the end of the speaking test. You may now leave the room."
  },
  
  prompts: {
    startSpeaking: "You can begin speaking now.",
    continueSpeaking: "Please continue.",
    timeUp: "Thank you. Your time is up."
  }
};

export const examinerPhrases = {
  acknowledgments: [
    "I see.",
    "That's interesting.",
    "Right.",
    "I understand.",
    "Thank you for sharing that."
  ],
  
  transitions: [
    "Now I'd like to ask you about...",
    "Let's talk about...",
    "Moving on to the next topic...",
    "I'd like to discuss..."
  ],
  
  encouragements: [
    "Could you tell me more about that?",
    "Would you like to add anything else?",
    "How did you feel about that?",
    "In what way exactly?"
  ]
};

export const getRandomExaminerPhrase = (category: keyof typeof examinerPhrases): string => {
  const phrases = examinerPhrases[category];
  return phrases[Math.floor(Math.random() * phrases.length)];
};