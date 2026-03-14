import { useState } from 'react';

const FacultyDashboard = ({ user, onLogout }) => {
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'FC';

  const quickLinks = [
    { label: 'My Profile',    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'from-brand-500 to-amber-400' },
    { label: 'My Subjects',   icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'from-blue-500 to-indigo-500' },
    { label: 'My Schedule',   icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'from-emerald-500 to-teal-500' },
    { label: 'My Students',   icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'from-violet-500 to-purple-500' },
  ];

  const stats = [
    { label: 'Subjects Handled', value: '4',  icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { label: 'Total Students',   value: '120', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Sections',         value: '6',  icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { label: 'Upcoming Events',  value: '2',  icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  ];

  const recentActivity = [
    { text: 'Mid-term grades submission deadline — March 22, 2026', type: 'deadline' },
    { text: 'Faculty meeting scheduled for March 16, 2026 at 2PM', type: 'meeting' },
    { text: 'New section "BSIT-3A" added to your schedule', type: 'update' },
  ];

  const typeColors = { deadline: 'text-red-400 bg-red-500/10', meeting: 'text-blue-400 bg-blue-500/10', update: 'text-emerald-400 bg-emerald-500/10' };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(242,101,34,0.4)]">
            <img src="/ccs_logo.jpg" alt="CCS" className="w-7 h-7 object-contain rounded-lg" onError={(e) => { e.target.style.display='none'; }} />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-amber-400 leading-none">Profile Hub</h1>
            <p className="text-xs text-slate-500 leading-none mt-0.5">Faculty Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/50 px-3 py-2 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-slate-200 leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-xs font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8 max-w-5xl mx-auto space-y-8">

        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 p-6">
          <div className="absolute right-0 top-0 w-48 h-48 bg-blue-500/10 rounded-full -translate-y-1/4 translate-x-1/4 blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-slate-400 text-sm">Welcome back,</p>
              <h2 className="text-2xl font-bold text-white leading-tight">{user?.name} 👋</h2>
              <p className="text-slate-400 text-sm mt-0.5">CCS Faculty Member · Profile Hub</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <section>
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} />
                </svg>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickLinks.map((item) => (
              <button
                key={item.label}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg shrink-0 capitalize ${typeColors[a.type]}`}>{a.type}</span>
                <p className="text-sm text-slate-300">{a.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FacultyDashboard;
