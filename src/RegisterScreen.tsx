import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// RegisterScreen component with Firebase Auth and Firestore support
interface RegisterScreenProps {
  // Callback to navigate back to the Login screen
  onNavigateToLogin?: () => void;
  // Callback when registration is successfully completed in Firebase
  onRegisterSuccess?: () => void;
}

export default function RegisterScreen({ onNavigateToLogin, onRegisterSuccess }: RegisterScreenProps) {
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('28');
  const [phone, setPhone] = useState('052-784-9120');
  const [country, setCountry] = useState('il');
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'arabic' | 'spanish' | 'french'>('english');

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle registration with Firebase Authentication & Firestore
  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email || !password) {
      setErrorMessage('נא למלא כתובת אימייל וסיסמה.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('הסיסמה חייבת להכיל לפחות 6 תווים.');
      return;
    }

    // Parse age (all ages are allowed)
    const numericAge = age ? Number(age) : null;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // 1. Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Save additional user profile and preferences to Cloud Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        age: numericAge,
        phone: phone.trim(),
        country: country,
        targetLanguage: selectedLanguage,
        createdAt: serverTimestamp(),
        points: 0,
        hearts: 3,
        level: 'מתחיל',
      });

      setSuccessMessage('החשבון נוצר בהצלחה! מעביר אותך להמשך...');

      // Notify parent component of success
      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      }, 1200);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('כתובת אימייל זו כבר קיימת במערכת. נסה להתחבר.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('כתובת האימייל אינה תקינה.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('הסיסמה חלשה מדי. בחר סיסמה באורך 6 תווים לפחות.');
      } else {
        setErrorMessage(error.message || 'שגיאה ביצירת החשבון. נסה שוב.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen">
      {/* Header with back button, EduTrack branding, and status indicator */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <button
              aria-label="Go back"
              className="w-11 h-11 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
              onClick={onNavigateToLogin || (() => window.history.back())}
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="flex items-center gap-space-xs">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">school</span>
              </div>
              <span className="font-bold text-lg text-on-surface tracking-tight">EduTrack</span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="text-xs text-on-surface-variant font-medium">Create Account</span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface">
        <div className="flex flex-col w-full px-margin py-space-md max-w-[480px] mx-auto" dir="rtl">
          
          {/* Top Stepper Bar & Progress Indicator */}
          <div className="flex flex-col gap-space-sm mb-space-md">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                <span className="text-xs font-semibold">שלב 2 מתוך 3</span>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface-variant text-xs">
                <span>התאמה אישית של התוכן</span>
                <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
              </div>
            </div>

            {/* 3-Segment Progressive Indicator */}
            <div className="grid grid-cols-3 gap-2 mt-1">
              {/* Step 1: Completed */}
              <div className="flex flex-col gap-1">
                <div className="h-2 rounded-full bg-secondary transition-all"></div>
                <div className="flex items-center justify-between text-on-surface-variant text-xs">
                  <span className="flex items-center gap-0.5 text-secondary font-medium">
                    <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    אישי
                  </span>
                  <span className="text-secondary font-semibold">100%</span>
                </div>
              </div>

              {/* Step 2: Active */}
              <div className="flex flex-col gap-1">
                <div className="h-2 rounded-full bg-primary relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between text-primary text-xs font-semibold">
                  <span>פרטי קשר</span>
                  <span>פעיל</span>
                </div>
              </div>

              {/* Step 3: Upcoming */}
              <div className="flex flex-col gap-1">
                <div className="h-2 rounded-full bg-surface-container-highest"></div>
                <div className="flex items-center justify-between text-outline text-xs">
                  <span>אימות</span>
                  <span>שלב הבא</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header Branding & Text Motif */}
          <div className="flex items-start gap-space-md mb-space-lg">
            <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <div className="flex flex-col flex-grow">
              <div className="flex items-center gap-space-xs">
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">יצירת חשבון והרשמה</h1>
              </div>
              <p className="text-sm text-on-surface-variant mt-1 leading-snug">
                בוא נכיר אותך טוב יותר כדי להתאים את תוכנית הלמידה האישית שלך ב-EduTrack.
              </p>
              <span className="text-xs text-primary mt-1 font-medium" dir="ltr">Create account &amp; set personalized learning path</span>
            </div>
          </div>

          {/* Form wrapper */}
          <form onSubmit={handleRegister} className="flex flex-col gap-space-lg">
            
            {/* Feedback Banners */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3.5 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Section 1 (Collapsed / Completed Summary Card) */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <div>
                    <span className="text-sm text-on-surface font-semibold block">פרטים אישיים (הושלם)</span>
                    <span className="text-xs text-on-surface-variant">יונתן כהן • גיל 28 • ת.ז מאומתת</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high transition-colors" type="button">
                  עריכה
                </button>
              </div>

              {/* Compact preview chips */}
              <div className="mt-space-sm pt-space-xs flex flex-wrap gap-space-xs">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px] text-primary">person</span>
                  <span>יונתן כהן (Jonathan Cohen)</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px] text-primary">cake</span>
                  <span>גיל: {age || '—'}</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-xs text-secondary font-medium">
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  <span>ת.ז שמורה בהצפנה</span>
                </div>
              </div>
            </div>

            {/* Section 2 (Active Step Form Container) */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h2 className="text-base text-on-surface font-bold">פרטי התקשרות ומיקום</h2>
                    <p className="text-xs text-on-surface-variant">Contact &amp; Location Details</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary text-xs font-semibold">
                  חובה
                </span>
              </div>

              {/* Field: אימייל (Email Address) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface flex items-center justify-between" htmlFor="reg-email">
                  <span className="flex items-center gap-1 font-semibold">
                    <span>כתובת אימייל</span>
                    <span className="text-error">*</span>
                  </span>
                  <span className="text-xs text-on-surface-variant" dir="ltr">Email Address</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute right-3.5 flex items-center pointer-events-none text-primary">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <input
                    className="w-full h-12 pr-11 pl-10 rounded-xl bg-surface-container-low text-on-surface text-sm focus:bg-surface-container-lowest focus:shadow-md outline-none transition-all"
                    id="reg-email"
                    placeholder="name@domain.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute left-3.5 flex items-center text-secondary">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </div>
                <span className="text-xs text-on-surface-variant px-1">נשמר בבטחה בענן של Firebase</span>
              </div>

              {/* Field: סיסמה (Password for Firebase Auth) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface flex items-center justify-between" htmlFor="reg-password">
                  <span className="flex items-center gap-1 font-semibold">
                    <span>סיסמה</span>
                    <span className="text-error">*</span>
                  </span>
                  <span className="text-xs text-on-surface-variant" dir="ltr">Password (min 6 chars)</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute right-3.5 flex items-center pointer-events-none text-primary">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input
                    className="w-full h-12 pr-11 pl-10 rounded-xl bg-surface-container-low text-on-surface text-sm focus:bg-surface-container-lowest focus:shadow-md outline-none transition-all"
                    id="reg-password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <span className="text-xs text-on-surface-variant px-1">לפחות 6 תווים</span>
              </div>

              {/* Field: גיל (Age - all ages allowed) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface flex items-center justify-between" htmlFor="reg-age">
                  <span className="flex items-center gap-1 font-semibold">
                    <span>גיל</span>
                  </span>
                  <span className="text-xs text-on-surface-variant" dir="ltr">Age</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute right-3.5 flex items-center pointer-events-none text-primary">
                    <span className="material-symbols-outlined text-[20px]">cake</span>
                  </div>
                  <input
                    className="w-full h-12 pr-11 pl-10 rounded-xl bg-surface-container-low text-on-surface text-sm focus:bg-surface-container-lowest focus:shadow-md outline-none transition-all border border-transparent focus:border-primary"
                    id="reg-age"
                    placeholder="הזן גיל (למשל: 12, 18, 25)"
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  {age !== '' && Number(age) > 0 && (
                    <div className="absolute left-3.5 flex items-center text-secondary">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Field: מספר טלפון (Phone Number) with Country Code */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface flex items-center justify-between" htmlFor="reg-phone">
                  <span className="flex items-center gap-1 font-semibold">
                    <span>מספר טלפון נייד</span>
                    <span className="text-error">*</span>
                  </span>
                  <span className="text-xs text-on-surface-variant" dir="ltr">Mobile Phone</span>
                </label>
                <div className="flex gap-2" dir="ltr">
                  {/* Country Dial Code Pill */}
                  <div className="h-12 px-3 rounded-xl bg-surface-container-high flex items-center gap-1.5 text-on-surface text-xs font-bold flex-shrink-0 cursor-pointer">
                    <span className="text-[18px]">🇮🇱</span>
                    <span>+972</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
                  </div>
                  {/* Phone Number Input */}
                  <div className="relative flex-grow flex items-center">
                    <input
                      className="w-full h-12 px-3 rounded-xl bg-surface-container-low text-on-surface text-sm focus:bg-surface-container-lowest focus:shadow-md outline-none transition-all tracking-wider"
                      id="reg-phone"
                      placeholder="050-000-0000"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <div className="absolute right-3 flex items-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">phone_android</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Field: ארץ / מדינה (Country Selector) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface flex items-center justify-between" htmlFor="reg-country">
                  <span className="flex items-center gap-1 font-semibold">
                    <span>ארץ / מדינת מגורים</span>
                    <span className="text-error">*</span>
                  </span>
                  <span className="text-xs text-on-surface-variant" dir="ltr">Country / Region</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute right-3.5 flex items-center pointer-events-none text-primary">
                    <span className="material-symbols-outlined text-[20px]">public</span>
                  </div>
                  <select
                    className="w-full h-12 pr-11 pl-10 rounded-xl bg-surface-container-low text-on-surface text-sm focus:bg-surface-container-lowest focus:shadow-md outline-none appearance-none transition-all font-medium"
                    id="reg-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="il">ישראל (Israel) 🇮🇱</option>
                    <option value="us">ארצות הברית (United States) 🇺🇸</option>
                    <option value="uk">בריטניה (United Kingdom) 🇬🇧</option>
                    <option value="ca">קנדה (Canada) 🇨🇦</option>
                    <option value="fr">צרפת (France) 🇫🇷</option>
                    <option value="other">מדינה אחרת (Other)</option>
                  </select>
                  <div className="absolute left-3.5 pointer-events-none flex items-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">unfold_more</span>
                  </div>
                </div>
              </div>

              {/* Interactive Micro-delight: Target Language Preference Selector */}
              <div className="flex flex-col gap-2 pt-space-xs">
                <span className="text-xs text-on-surface font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">translate</span>
                  <span>שפת ממשק ולימוד עיקרית (תישמר בפרופיל שלך)</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* Language 1: English */}
                  <button
                    onClick={() => setSelectedLanguage('english')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                      selectedLanguage === 'english'
                        ? 'bg-surface-container-high border-primary text-on-surface shadow-sm'
                        : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container'
                    }`}
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇺🇸</span>
                      <div>
                        <p className="text-xs font-bold leading-tight">English</p>
                        <p className="text-[11px] text-on-surface-variant">אנגלית</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      {selectedLanguage === 'english' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </button>

                  {/* Language 2: Arabic */}
                  <button
                    onClick={() => setSelectedLanguage('arabic')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                      selectedLanguage === 'arabic'
                        ? 'bg-surface-container-high border-primary text-on-surface shadow-sm'
                        : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container'
                    }`}
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇸🇦</span>
                      <div>
                        <p className="text-xs font-bold leading-tight">العربية</p>
                        <p className="text-[11px] text-on-surface-variant">ערבית</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      {selectedLanguage === 'arabic' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </button>

                  {/* Language 3: Spanish */}
                  <button
                    onClick={() => setSelectedLanguage('spanish')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                      selectedLanguage === 'spanish'
                        ? 'bg-surface-container-high border-primary text-on-surface shadow-sm'
                        : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container'
                    }`}
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇪🇸</span>
                      <div>
                        <p className="text-xs font-bold leading-tight">Español</p>
                        <p className="text-[11px] text-on-surface-variant">ספרדית</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      {selectedLanguage === 'spanish' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </button>

                  {/* Language 4: French */}
                  <button
                    onClick={() => setSelectedLanguage('french')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                      selectedLanguage === 'french'
                        ? 'bg-surface-container-high border-primary text-on-surface shadow-sm'
                        : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container'
                    }`}
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇫🇷</span>
                      <div>
                        <p className="text-xs font-bold leading-tight">Français</p>
                        <p className="text-[11px] text-on-surface-variant">צרפתית</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      {selectedLanguage === 'french' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </button>
                </div>
              </div>

            </div>

            {/* Primary Action CTA Button */}
            <div className="flex flex-col gap-space-sm mt-space-xs">
              <button
                className="w-full h-14 rounded-xl bg-primary text-on-primary text-base font-bold flex items-center justify-center gap-space-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-75 cursor-pointer"
                id="continue-step-btn"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
                    <span>יוצר חשבון ב-Firebase...</span>
                  </>
                ) : (
                  <>
                    <span>צור חשבון והמשך</span>
                    <span className="material-symbols-outlined text-[22px] rotate-180">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Secondary Back / Login link */}
              <div className="flex items-center justify-center gap-1.5 py-1">
                <span className="text-xs text-on-surface-variant">כבר יש לך חשבון קיים?</span>
                <button
                  className="text-xs text-primary font-bold hover:underline"
                  onClick={onNavigateToLogin}
                  type="button"
                >
                  התחבר כאן
                </button>
              </div>
            </div>

            {/* Security & Trust Badge Footer */}
            <div className="mt-space-xs p-space-sm rounded-xl bg-surface-container-high/60 flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-lg bg-surface-container-lowest text-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface font-semibold">אבטחת מידע ופרטיות מובטחת</span>
                <p className="text-[11px] text-on-surface-variant leading-tight">
                  המידע שלך מאובטח ומוגן על פי תקני פרטיות מחמירים (GDPR / תקן חינוך ארצי) ולעולם לא יועבר לגורם שלישי.
                </p>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
