import { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Props for the Progress & Dashboard screen
interface ProgressScreenProps {
  user?: User | null;
  onResumeLesson?: () => void;
  onSwitchCourse?: () => void;
  onLogout?: () => void;
}

// User profile data retrieved from Firestore
interface UserProfileData {
  points?: number;
  hearts?: number;
  level?: string;
  targetLanguage?: string;
  age?: number;
}

export default function ProgressScreen({ user, onResumeLesson, onSwitchCourse, onLogout }: ProgressScreenProps) {
  // Active bottom navigation tab: 'home' | 'courses' | 'achievements' | 'profile'
  const [activeTab, setActiveTab] = useState<'home' | 'courses' | 'achievements' | 'profile'>('home');

  // Profile data from Firestore
  const [profile, setProfile] = useState<UserProfileData>({
    points: 120,
    hearts: 3,
    level: 'מתחיל',
    targetLanguage: 'english',
  });

  // Fetch real user data from Cloud Firestore if authenticated
  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfileData;
          setProfile((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (err) {
        console.error('Error fetching user profile from Firestore:', err);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Language display mapping
  const languageNames: Record<string, { name: string; flag: string }> = {
    english: { name: 'אנגלית', flag: '🇺🇸' },
    arabic: { name: 'ערבית', flag: '🇸🇦' },
    spanish: { name: 'ספרדית', flag: '🇪🇸' },
    french: { name: 'צרפתית', flag: '🇫🇷' },
  };

  const currentLang = languageNames[profile.targetLanguage || 'english'] || languageNames.english;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col" dir="rtl">
      {/* Centered container constrained to standard mobile width for consistent UI */}
      <div className="relative flex flex-col min-h-screen w-full max-w-[480px] mx-auto bg-white dark:bg-background-dark shadow-xl pb-24">
        
        {/* Top App Header */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-background-dark/95 backdrop-blur border-b border-slate-100 dark:border-slate-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 dark:text-slate-100 block leading-tight">EduTrack</span>
              <span className="text-[11px] text-slate-400">לוח התקדמות ומעקב</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              רמה: {profile.level || 'מתחיל'}
            </span>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                aria-label="התנתק"
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="התנתק"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area based on Active Tab */}
        <main className="flex-1 px-5 py-5 flex flex-col gap-5">
          
          {activeTab === 'home' && (
            <>
              {/* User Welcome & Improvement Notification Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-l from-primary/15 to-primary/5 border border-primary/20 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow">
                  <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    שלום, {user?.email ? user.email.split('@')[0] : 'תלמיד'}! 👋
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    <strong>טיפ לשיפור:</strong> תרגול עקבי של 5 דקות ביום משפר את זיכרון המילים ב-70%!
                  </p>
                </div>
              </div>

              {/* Statistics Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* 1. Total Points */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-amber-500 text-[24px] mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                    hotel_class
                  </span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {profile.points ?? 0}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">נקודות</span>
                </div>

                {/* 2. Daily Streak */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-orange-500 text-[24px] mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_fire_department
                  </span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    3 ימים
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">רצף למידה</span>
                </div>

                {/* 3. Hearts / Lives */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-red-500 text-[24px] mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {profile.hearts ?? 3}/3
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">חיים</span>
                </div>
              </div>

              {/* Active Course Card & Resume Button */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">קורס פעיל</span>
                  {onSwitchCourse && (
                    <button
                      type="button"
                      onClick={onSwitchCourse}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      החלף קורס
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl shadow-inner">
                    {currentLang.flag}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">{currentLang.name}</h2>
                      <span className="text-xs text-primary font-bold">45% הושלם</span>
                    </div>
                    {/* Course Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Resume Lesson CTA Button */}
                <button
                  type="button"
                  onClick={onResumeLesson}
                  className="w-full h-12 mt-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md shadow-primary/25 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  <span>המשך שיעור מהנקודה האחרונה</span>
                </button>
              </div>

              {/* Achievements Showcase */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-accent text-[18px]">emoji_events</span>
                  <span>הישגים ותגים</span>
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {/* Badge 1: Completed */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-1">
                      <span className="material-symbols-outlined text-[20px]">military_tech</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">צעד ראשון</span>
                    <span className="text-[10px] text-success font-medium mt-0.5">הושלם ✓</span>
                  </div>

                  {/* Badge 2: Completed */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center mb-1">
                      <span className="material-symbols-outlined text-[20px]">whatshot</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">רצף 3 ימים</span>
                    <span className="text-[10px] text-success font-medium mt-0.5">הושלם ✓</span>
                  </div>

                  {/* Badge 3: Locked */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 text-center flex flex-col items-center opacity-60">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center mb-1">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">אלוף מילים</span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">20/50 מילים</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">הקורסים שלך</h2>
              <p className="text-xs text-slate-500">בחר שפה כדי ללמוד או להחליף מסלול:</p>

              {Object.entries(languageNames).map(([key, item]) => {
                const isCurrent = key === (profile.targetLanguage || 'english');
                return (
                  <div
                    key={key}
                    onClick={() => onSwitchCourse && onSwitchCourse()}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.flag}</span>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.name}</p>
                        <p className="text-xs text-slate-400">רמה: {profile.level || 'מתחיל'}</p>
                      </div>
                    </div>
                    {isCurrent ? (
                      <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 shadow-sm">פעיל</span>
                    ) : (
                      <span className="material-symbols-outlined text-slate-400 text-[20px] rotate-180">arrow_forward</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">כל ההישגים והפרסים</h2>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                השלם שיעורים יומיומיים כדי לצבור תגים ולפתוח תעודת סיום קורס! 🎓
              </div>
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-3">
                  <span className="text-2xl">🥇</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">שיעור ראשון הושלם</p>
                    <p className="text-xs text-slate-400">התחלת את הצעד הראשון בלמידה</p>
                  </div>
                  <span className="text-xs text-success font-bold">100%</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">רצף 7 ימים</p>
                    <p className="text-xs text-slate-400">למד 7 ימים ברציפות (3/7)</p>
                  </div>
                  <span className="text-xs text-primary font-bold">42%</span>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">פרופיל אישי</h2>
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">אימייל</span>
                  <span className="text-xs font-bold" dir="ltr">{user?.email || 'לא מחובר'}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">גיל</span>
                  <span className="text-xs font-bold">{profile.age || 28}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">שפת לימוד</span>
                  <span className="text-xs font-bold">{currentLang.name} {currentLang.flag}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">סך נקודות שנצברו</span>
                  <span className="text-xs font-bold text-primary">{profile.points ?? 0}</span>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full h-11 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300 font-bold text-xs border border-red-200 dark:border-red-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>התנתק מהחשבון</span>
                </button>
              )}
            </div>
          )}

        </main>

        {/* Fixed Bottom Navigation Menu (Home, Courses, Achievements, Profile) */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around z-30 shadow-lg">
          
          {/* 1. Home Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'home' ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={activeTab === 'home' ? { fontVariationSettings: "'FILL' 1" } : {}}>
              home
            </span>
            <span className="text-[11px]">בית</span>
          </button>

          {/* 2. Courses Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'courses' ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={activeTab === 'courses' ? { fontVariationSettings: "'FILL' 1" } : {}}>
              menu_book
            </span>
            <span className="text-[11px]">קורסים</span>
          </button>

          {/* 3. Achievements Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('achievements')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'achievements' ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={activeTab === 'achievements' ? { fontVariationSettings: "'FILL' 1" } : {}}>
              emoji_events
            </span>
            <span className="text-[11px]">הישגים</span>
          </button>

          {/* 4. Profile Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile' ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={activeTab === 'profile' ? { fontVariationSettings: "'FILL' 1" } : {}}>
              person
            </span>
            <span className="text-[11px]">פרופיל</span>
          </button>

        </nav>

      </div>
    </div>
  );
}
