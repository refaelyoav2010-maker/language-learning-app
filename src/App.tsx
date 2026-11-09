import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from './firebase';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import LanguageSelectionScreen, { type TargetLanguage, type Level } from './LanguageSelectionScreen';
import LessonScreen from './LessonScreen';
import ProgressScreen from './ProgressScreen';

// All available screens in the prototype
type Screen = 'register' | 'login' | 'languages' | 'lesson' | 'progress';

function App() {
  // Screen state - default to 'register'
  const [currentScreen, setCurrentScreen] = useState<Screen>('register');

  // Firebase authenticated user state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Selected language and level to pass to the Lesson screen
  const [activeLanguage, setActiveLanguage] = useState<TargetLanguage>('english');
  const [activeLevel, setActiveLevel] = useState<Level>('מתחיל');

  // Listen to Firebase Authentication state changes
  useEffect(() => {
    // onAuthStateChanged triggers whenever user logs in or logs out
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && (currentScreen === 'login' || currentScreen === 'register')) {
        // When successfully authenticated, take the user to their Progress Dashboard
        setCurrentScreen('progress');
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [currentScreen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentScreen('login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Transition to lesson with the chosen language & level
  const handleStartLearning = (lang: TargetLanguage, lvl: Level) => {
    setActiveLanguage(lang);
    setActiveLevel(lvl);
    setCurrentScreen('lesson');
  };

  return (
    <div className="relative min-h-screen">
      
      {/* Top Bar showing User Auth Status & Quick Navigation */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/95 text-white text-xs px-3 py-1.5 rounded-full shadow-2xl backdrop-blur border border-slate-700/60 max-w-[95vw] overflow-x-auto">
        {currentUser ? (
          <div className="flex items-center gap-1.5 pr-1 border-r border-slate-700 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span className="text-slate-300 font-medium truncate max-w-[120px]">{currentUser.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 font-bold ml-1 hover:underline cursor-pointer"
            >
              התנתק
            </button>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px] px-1 font-medium">לא מחובר</span>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentScreen('register')}
            className={`px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer ${
              currentScreen === 'register' ? 'bg-primary text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            הרשמה
          </button>
          <button
            type="button"
            onClick={() => setCurrentScreen('login')}
            className={`px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer ${
              currentScreen === 'login' ? 'bg-primary text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            התחברות
          </button>
          <button
            type="button"
            onClick={() => setCurrentScreen('languages')}
            className={`px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer ${
              currentScreen === 'languages' ? 'bg-primary text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            שפות
          </button>
          <button
            type="button"
            onClick={() => setCurrentScreen('lesson')}
            className={`px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer ${
              currentScreen === 'lesson' ? 'bg-primary text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            שיעור
          </button>
          <button
            type="button"
            onClick={() => setCurrentScreen('progress')}
            className={`px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer ${
              currentScreen === 'progress' ? 'bg-primary text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            התקדמות
          </button>
        </div>
      </div>

      {/* Render active screen */}
      {currentScreen === 'register' && (
        <RegisterScreen
          onNavigateToLogin={() => setCurrentScreen('login')}
          onRegisterSuccess={() => setCurrentScreen('progress')}
        />
      )}
      {currentScreen === 'login' && (
        <LoginScreen
          onNavigateToRegister={() => setCurrentScreen('register')}
          onLoginSuccess={() => setCurrentScreen('progress')}
        />
      )}
      {currentScreen === 'languages' && (
        <LanguageSelectionScreen
          onBack={() => setCurrentScreen('progress')}
          onStartLearning={handleStartLearning}
        />
      )}
      {currentScreen === 'lesson' && (
        <LessonScreen
          language={activeLanguage}
          level={activeLevel}
          onExit={() => setCurrentScreen('progress')}
        />
      )}
      {currentScreen === 'progress' && (
        <ProgressScreen
          user={currentUser}
          onResumeLesson={() => setCurrentScreen('lesson')}
          onSwitchCourse={() => setCurrentScreen('languages')}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
