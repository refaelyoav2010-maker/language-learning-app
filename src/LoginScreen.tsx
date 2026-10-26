// LoginScreen component based directly on the provided login screen mockup source
export default function LoginScreen() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <div className="relative flex h-full min-h-screen w-full flex-col max-w-[480px] mx-auto bg-white dark:bg-background-dark overflow-x-hidden shadow-2xl">
        {/* Top bar with back button */}
        <div className="flex items-center p-4 justify-between">
          <div className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center cursor-pointer" data-icon="arrow_back">
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <div className="w-12 h-1 bg-primary/10 rounded-full"></div>
        </div>

        {/* Header & Logo */}
        <div className="flex flex-col items-center justify-center pt-8 pb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-5xl" data-icon="school">school</span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-[32px] font-bold leading-tight tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Sign in to continue your journey</p>
        </div>

        {/* Input fields */}
        <div className="px-6 py-4 space-y-5">
          {/* Email input field */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold px-1">Email Address</label>
            <div className="flex w-full items-stretch rounded-xl group transition-all duration-200">
              <div className="text-slate-400 group-focus-within:text-primary flex border-y border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 items-center justify-center pl-4 rounded-l-xl">
                <span className="material-symbols-outlined text-[22px]">mail</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 border-y border-x-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-0 focus:border-slate-200 dark:focus:border-slate-700 h-14 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 px-3 text-base"
                placeholder="name@example.com"
                type="email"
              />
              <div className="flex border-y border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 items-center pr-4 rounded-r-xl"></div>
            </div>
          </div>

          {/* Password input field */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Password</label>
              <button type="button" className="text-accent text-sm font-medium hover:underline">Forgot?</button>
            </div>
            <div className="flex w-full items-stretch rounded-xl group transition-all duration-200">
              <div className="text-slate-400 group-focus-within:text-primary flex border-y border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 items-center justify-center pl-4 rounded-l-xl">
                <span className="material-symbols-outlined text-[22px]">lock</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 border-y border-x-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-0 focus:border-slate-200 dark:focus:border-slate-700 h-14 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 px-3 text-base"
                placeholder="••••••••"
                type="password"
              />
              <div className="text-slate-400 hover:text-slate-600 cursor-pointer flex border-y border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 items-center pr-4 rounded-r-xl">
                <span className="material-symbols-outlined text-[22px]">visibility</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons & OAuth */}
        <div className="px-6 py-8">
          <button
            type="button"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Login to EduTrack</span>
            <span className="material-symbols-outlined">login</span>
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-background-dark text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-5 h-5 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pb-10 text-center px-6">
          <p className="text-slate-600 dark:text-slate-400">
            New to the platform?{' '}
            <button type="button" className="text-primary font-bold hover:underline ml-1">
              Create Account
            </button>
          </p>
          <div className="mt-8 flex justify-center items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <p className="text-xs text-slate-400 font-medium">Verified Educational Partner</p>
          </div>
        </div>

        {/* Decorative blur elements */}
        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-accent/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>
    </div>
  );
}
