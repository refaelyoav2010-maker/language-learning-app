import { useState } from 'react';

// Props for the Lesson screen
interface LessonScreenProps {
  language?: string;
  level?: string;
  onExit?: () => void;
}

// Sample question structure for beginner-friendly learning
interface Question {
  id: number;
  promptText: string;
  targetWord: string;
  options: string[];
  correctAnswer: string;
  translationHint: string;
}

// Beginner vocabulary by language
const LESSON_QUESTIONS: Record<string, Question[]> = {
  english: [
    {
      id: 1,
      promptText: 'בחר את התרגום הנכון למילה:',
      targetWord: 'Hello',
      options: ['שלום', 'תודה', 'להתראות', 'בבקשה'],
      correctAnswer: 'שלום',
      translationHint: 'ברכת פתיחה נפוצה',
    },
    {
      id: 2,
      promptText: 'בחר את התרגום הנכון למילה:',
      targetWord: 'Thank you',
      options: ['סליחה', 'תודה', 'בוקר טוב', 'לילה טוב'],
      correctAnswer: 'תודה',
      translationHint: 'מילת הוקרה ונימוס',
    },
  ],
  arabic: [
    {
      id: 1,
      promptText: 'בחר את התרגום הנכון למילה:',
      targetWord: 'مرحباً (Marhaban)',
      options: ['שלום', 'תודה', 'בוקר טוב', 'להתראות'],
      correctAnswer: 'שלום',
      translationHint: 'ברכת שלום',
    },
  ],
  spanish: [
    {
      id: 1,
      promptText: 'בחר את התרגום הנכון למילה:',
      targetWord: 'Hola',
      options: ['שלום', 'תודה', 'בבקשה', 'כן'],
      correctAnswer: 'שלום',
      translationHint: 'ברכת שלום בספרדית',
    },
  ],
  french: [
    {
      id: 1,
      promptText: 'בחר את התרגום הנכון למילה:',
      targetWord: 'Bonjour',
      options: ['שלום / יום טוב', 'לילה טוב', 'תודה', 'להתראות'],
      correctAnswer: 'שלום / יום טוב',
      translationHint: 'ברכת יום טוב בצרפתית',
    },
  ],
};

export default function LessonScreen({ language = 'english', level = 'beginner', onExit }: LessonScreenProps) {
  // Current questions list for the selected language (fallback to english)
  const questions = LESSON_QUESTIONS[language] || LESSON_QUESTIONS.english;

  // Active question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // User's selected option index
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Status of the answered question: null (not submitted), 'correct', 'wrong'
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'wrong' | null>(null);

  // Hearts / Lives system (start with 3 lives)
  const [lives, setLives] = useState(3);

  // Accumulated score
  const [score, setScore] = useState(0);

  // Current question data
  const currentQ = questions[currentQuestionIndex];

  // Calculate progress percentage
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  // Check the answer
  const handleCheckAnswer = () => {
    if (!selectedOption || answerStatus !== null) return;

    if (selectedOption === currentQ.correctAnswer) {
      setAnswerStatus('correct');
      setScore((prev) => prev + 10);
    } else {
      setAnswerStatus('wrong');
      setLives((prev) => Math.max(0, prev - 1));
    }
  };

  // Move to next question or complete lesson
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswerStatus(null);
    } else {
      alert(`כל הכבוד! סיימת את השיעור עם ${score + (answerStatus === 'correct' ? 10 : 0)} נקודות!`);
      if (onExit) onExit();
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col" dir="rtl">
      <div className="relative flex h-auto min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-background-dark shadow-xl overflow-x-hidden">
        
        {/* Top Bar: Exit button, Progress bar, and Hearts indicator */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-background-dark/95 backdrop-blur border-b border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between gap-3">
          {/* Exit lesson button */}
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit lesson"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>

          {/* Lesson Progress Bar */}
          <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Hearts / Lives indicator */}
          <div className="flex items-center gap-1 text-red-500 font-bold text-sm shrink-0">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            <span>{lives}</span>
          </div>
        </header>

        {/* Main Lesson Content */}
        <main className="flex-1 px-5 py-6 flex flex-col justify-between pb-32">
          
          <div className="flex flex-col gap-6">
            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                <span className="material-symbols-outlined text-[14px]">school</span>
                <span>
                  תרגול: {language.toUpperCase()} • רמה: {level}
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {currentQ.promptText}
              </h1>
            </div>

            {/* Target Word Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
              <span className="text-3xl font-bold text-primary tracking-wide block" dir="ltr">
                {currentQ.targetWord}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                רמז: {currentQ.translationHint}
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="flex flex-col gap-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (answerStatus === null) setSelectedOption(option);
                    }}
                    className={`w-full p-4 rounded-xl border text-right font-medium text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary shadow-sm font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{option}</span>
                    <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs">
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback banner shown after checking answer */}
          {answerStatus && (
            <div
              className={`p-4 rounded-xl mt-4 flex items-center gap-3 ${
                answerStatus === 'correct'
                  ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {answerStatus === 'correct' ? 'check_circle' : 'cancel'}
              </span>
              <div>
                <p className="font-bold text-sm">
                  {answerStatus === 'correct' ? 'תשובה נכונה! (+10 נקודות)' : 'תשובה שגויה!'}
                </p>
                {answerStatus === 'wrong' && (
                  <p className="text-xs mt-0.5">
                    התשובה הנכונה היא: <span className="font-bold">{currentQ.correctAnswer}</span>
                  </p>
                )}
              </div>
            </div>
          )}

        </main>

        {/* Bottom Action Footer */}
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
          {answerStatus === null ? (
            <button
              type="button"
              onClick={handleCheckAnswer}
              disabled={!selectedOption}
              className={`w-full h-12 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                selectedOption
                  ? 'bg-primary text-white shadow-md active:scale-98'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>בדוק תשובה</span>
              <span className="material-symbols-outlined text-[20px]">check</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="w-full h-12 bg-success hover:bg-success/90 text-white rounded-xl font-bold text-base shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>{currentQuestionIndex + 1 < questions.length ? 'המשך לשאלה הבאה' : 'סיום השיעור'}</span>
              <span className="material-symbols-outlined text-[20px] rotate-180">arrow_forward</span>
            </button>
          )}
        </footer>

      </div>
    </div>
  );
}

