import { useState } from 'react';

// Define the supported language types and levels
export type TargetLanguage = 'english' | 'arabic' | 'spanish' | 'french';
export type Level = 'מתחיל' | 'בינוני' | 'מתקדם';

interface LanguageSelectionScreenProps {
  // Callback when user confirms selection to start learning
  onStartLearning?: (language: TargetLanguage, level: Level) => void;
  // Callback to return to previous screen
  onBack?: () => void;
}

export default function LanguageSelectionScreen({ onStartLearning, onBack }: LanguageSelectionScreenProps) {
  // Active selected language state (defaults to english)
  const [selectedLanguage, setSelectedLanguage] = useState<TargetLanguage>('english');

  // Active selected level state (defaults to beginner / מתחיל)
  const [selectedLevel, setSelectedLevel] = useState<Level>('מתחיל');

  // Handle starting the lesson
  const handleStart = () => {
    if (onStartLearning) {
      onStartLearning(selectedLanguage, selectedLevel);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col" dir="rtl">
      <div className="relative flex h-auto min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-background-dark shadow-xl overflow-x-hidden">
        
        {/* TopAppBar */}
        <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
          <div
            className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            onClick={onBack}
            role="button"
            aria-label="Back"
          >
            <span className="material-symbols-outlined">menu</span>
          </div>
          <h2 className="text-primary text-lg font-bold leading-tight tracking-tight flex-1 text-center">EduTrack</h2>
          <div className="flex w-10 items-center justify-end">
            <button
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full size-10 bg-transparent text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>

        {/* Main Header */}
        <header className="px-6 pt-8 pb-4">
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight text-center">בחר שפה ללמידה</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mt-2">בחר את השפה שברצונך לכבוש היום</p>
        </header>

        {/* Language Cards Container */}
        <main className="flex-1 px-4 py-2 space-y-4 pb-32">
          
          {/* 1. English Card */}
          <div
            onClick={() => setSelectedLanguage('english')}
            className={`rounded-xl p-5 shadow-lg border transition-all cursor-pointer ${
              selectedLanguage === 'english'
                ? 'bg-blue-50/50 dark:bg-slate-800 border-primary ring-2 ring-primary/20 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-12 bg-cover bg-center rounded-lg shadow-sm"
                  data-alt="Flag of the United Kingdom and USA"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLBKWqIb3Azk3fyertl4j6A4RhOA978gRd1fRuDTzkI43iSjYnzC8DZddF9AgD68-5yuhr7N0qdQJKJe91uFsky2XR2MOP37ufe93y-40XaEMzIMrYl73Ygm3rlAirXKJzXOucxYulJ3fFq6_zvkBFAa0_TnskN_69cccgpYHVCIvpjhLLF-DqSvHWxeVgyf34Eo0RRvYqiCSBGZnplt647DwtYkwC8p_dmn22WIWhCceEBfA6SeT1QmAeGbyfehPZ2qWz-kC0cA')",
                  }}
                ></div>
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white text-lg font-bold">אנגלית</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">שפה בינלאומית</span>
                </div>
              </div>
              {selectedLanguage === 'english' && (
                <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
              )}
            </div>

            {/* Segmented Level Selector */}
            <div className="flex h-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 p-1 gap-1">
              {(['מתחיל', 'בינוני', 'מתקדם'] as Level[]).map((level) => {
                const isSelected = selectedLanguage === 'english' && selectedLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLanguage('english');
                      setSelectedLevel(level);
                    }}
                    className={`flex-1 h-full rounded-md text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-success text-white shadow-sm font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Arabic Card */}
          <div
            onClick={() => setSelectedLanguage('arabic')}
            className={`rounded-xl p-5 shadow-lg border transition-all cursor-pointer ${
              selectedLanguage === 'arabic'
                ? 'bg-blue-50/50 dark:bg-slate-800 border-primary ring-2 ring-primary/20 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-12 bg-cover bg-center rounded-lg shadow-sm"
                  data-alt="Arabic calligraphy or regional symbols"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZ6vcr2C2iq4oOpragRPKaHZnB_glrDnY0eP8ietcsVoVcezm3qFoVqqAKQQPZHixEity_nyMRpEheljVC9UQfWarqgMOc_I6OmsdtfNqXg0NrQg3qwR0hPLDFplJuPMtjHqgXa3OlyTEZsd8z9jACTcn-58CqcjOM5wiNED6ssJk2j6WAdZcXItk-ABkDYHGIyJtszQUvgAaIeppxAcFdQPs0b9vaQpfRSU_6TrtbtrfzbgwFiCaMCSEJk15xCKFRbO330Ux2Bg')",
                  }}
                ></div>
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white text-lg font-bold">ערבית</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">שפת האזור</span>
                </div>
              </div>
              {selectedLanguage === 'arabic' && (
                <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
              )}
            </div>

            {/* Segmented Level Selector */}
            <div className="flex h-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 p-1 gap-1">
              {(['מתחיל', 'בינוני', 'מתקדם'] as Level[]).map((level) => {
                const isSelected = selectedLanguage === 'arabic' && selectedLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLanguage('arabic');
                      setSelectedLevel(level);
                    }}
                    className={`flex-1 h-full rounded-md text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-success text-white shadow-sm font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Spanish Card */}
          <div
            onClick={() => setSelectedLanguage('spanish')}
            className={`rounded-xl p-5 shadow-lg border transition-all cursor-pointer ${
              selectedLanguage === 'spanish'
                ? 'bg-blue-50/50 dark:bg-slate-800 border-primary ring-2 ring-primary/20 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-12 bg-cover bg-center rounded-lg shadow-sm"
                  data-alt="Flag of Spain"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkmJoaSrG9Ipzk0vvY0Y16M98qHQP32JiIOgva5oUdpG5MpWm6W2k5JOrZXt8S4wV0EqWIwuGnqFplJYVtfzhzLVbRiQJwzqF53IWX0iiFBAibLrEu3Ma5_8OSv0D2GPuutXpCqz1UJ0x2xEE8dfXgn5m3nsXoWPlviwPAj9T0cftjV4oYGSqTx-nJjugUubuyh9G_OSAJY3xXIHoYjN-R7sgolhlbUrKBfbWp9Aj1YkShqepLMFv26sZh7vH7KKGNUhzFdTFpKg')",
                  }}
                ></div>
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white text-lg font-bold">ספרדית</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">שפה תוססת</span>
                </div>
              </div>
              {selectedLanguage === 'spanish' && (
                <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
              )}
            </div>

            {/* Segmented Level Selector */}
            <div className="flex h-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 p-1 gap-1">
              {(['מתחיל', 'בינוני', 'מתקדם'] as Level[]).map((level) => {
                const isSelected = selectedLanguage === 'spanish' && selectedLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLanguage('spanish');
                      setSelectedLevel(level);
                    }}
                    className={`flex-1 h-full rounded-md text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-success text-white shadow-sm font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. French Card */}
          <div
            onClick={() => setSelectedLanguage('french')}
            className={`rounded-xl p-5 shadow-lg border transition-all cursor-pointer ${
              selectedLanguage === 'french'
                ? 'bg-blue-50/50 dark:bg-slate-800 border-primary ring-2 ring-primary/20 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-12 bg-cover bg-center rounded-lg shadow-sm"
                  data-alt="Flag of France"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4zk7N1aP97XHXUn6nsn6Jr2l1Taj5T_VQDWFjVsWAf2afIiktbbvhsRj1Zbajzf6Upif5odD6Pz5a-MirpbublknN2kMOO_BBLtDi0tnsKiH6Z-w86Dn52VJ6T9YnnRO8hwNoGWBYIy7HN38OsvuI9hI4LLgdr8IitjN9wZI7YQTRTScmWWCPNKMJnb0tTboslIDnXD_mSj52EtIcJ8MmwgkwC2020yzbGwYxDdLWAIOelCyoDdWnkc-xXaUwxbPl7uo8zdg37Q')",
                  }}
                ></div>
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white text-lg font-bold">צרפתית</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">שפת האהבה</span>
                </div>
              </div>
              {selectedLanguage === 'french' && (
                <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
              )}
            </div>

            {/* Segmented Level Selector */}
            <div className="flex h-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 p-1 gap-1">
              {(['מתחיל', 'בינוני', 'מתקדם'] as Level[]).map((level) => {
                const isSelected = selectedLanguage === 'french' && selectedLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLanguage('french');
                      setSelectedLevel(level);
                    }}
                    className={`flex-1 h-full rounded-md text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-success text-white shadow-sm font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

        </main>

        {/* Bottom Action Button */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
          <button
            className="w-full h-14 bg-google-blue hover:bg-google-blue/90 text-white text-lg font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            onClick={handleStart}
            type="button"
          >
            <span>התחל ללמוד!</span>
            <span className="material-symbols-outlined">rocket_launch</span>
          </button>
        </div>

      </div>
    </div>
  );
}
