import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topnav from './components/Topnav';
import StudentModule from './modules/Student';
import FacultyModule from './modules/Faculty';
import InstructionModule from './modules/Instruction';
import SchedulingModule from './modules/Scheduling';
import EventsModule from './modules/Events';
import SearchModule from './modules/Search';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import FacultyDashboard from './pages/dashboards/FacultyDashboard';
import { DarkModeContext } from './context/DarkModeContext';

function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState('login');
  const [currentModule, setCurrentModule] = useState('student');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('adminDarkMode') === 'true');

  const handleLogin  = (userData) => setUser(userData);
  const handleSignUp = (userData) => setUser(userData);
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setAuthPage('login');
  };
  const handleToggleDark = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('adminDarkMode', next);
      return next;
    });
  };

  // ── Auth screens ─────────────────────────────────────────────
  if (!user) {
    return authPage === 'signup' ? (
      <SignUp onSignUp={handleSignUp} onGoToLogin={() => setAuthPage('login')} />
    ) : (
      <Login onLogin={handleLogin} onGoToSignUp={() => setAuthPage('signup')} />
    );
  }

  // ── Student dashboard ─────────────────────────────────────────
  if (user.role === 'student') {
    return <StudentDashboard user={user} onLogout={handleLogout} />;
  }

  // ── Faculty dashboard ─────────────────────────────────────────
  if (user.role === 'faculty') {
    return <FacultyDashboard user={user} onLogout={handleLogout} />;
  }

  // ── Admin dashboard (full sidebar) ───────────────────────────
  return (
    <DarkModeContext.Provider value={darkMode}>
    <div className={`flex h-screen w-screen overflow-hidden font-sans relative transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar
        currentModule={currentModule}
        setCurrentModule={setCurrentModule}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      <div className={`flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Topnav
          currentModule={currentModule}
          darkMode={darkMode}
          onToggleDark={handleToggleDark}
        />

        <main className={`flex-1 overflow-x-hidden overflow-y-auto p-8 transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <div className="max-w-7xl mx-auto space-y-6 h-full">

            {currentModule === 'student' ? (
              <StudentModule />
            ) : currentModule === 'faculty' ? (
              <FacultyModule />
            ) : currentModule === 'instruction' ? (
              <InstructionModule />
            ) : currentModule === 'scheduling' ? (
              <SchedulingModule />
            ) : currentModule === 'events' ? (
              <EventsModule />
            ) : currentModule === 'search' ? (
              <SearchModule />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Development in Progress</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  The {currentModule} module is currently being built.
                </p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
    </DarkModeContext.Provider>
  );
}

export default App;
