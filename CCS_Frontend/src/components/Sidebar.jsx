import React, { useState } from 'react';

const Sidebar = ({ currentModule, setCurrentModule, isOpen, setIsOpen, user, onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isVisible = isOpen || isHovered;
  const modules = [
    { id: 'student', label: 'Student Information', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'faculty', label: 'Faculty Information', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'instruction', label: 'Instruction', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'scheduling', label: 'Scheduling', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'events', label: 'Events', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { id: 'search', label: 'Comprehensive Search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  ];

  return (
    <>
      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out ${isVisible ? 'w-64 shadow-2xl shadow-slate-900/50' : 'w-16'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`flex items-center border-b border-slate-800 h-20 overflow-hidden shrink-0 transition-all duration-300 ${isVisible ? 'px-4 justify-between' : 'px-0 justify-center'}`}>
          <div className="flex items-center">
            <img
              src="/ccs_logo.jpg"
              alt="CCS"
              className={`h-10 object-contain drop-shadow-[0_0_10px_rgba(242,101,34,0.5)] transition-all duration-300 ${isVisible ? 'w-10 mr-3' : 'w-10 mr-0'}`}
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = document.getElementById('fallback-logo');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div id="fallback-logo" className={`hidden items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xl shadow-[0_0_15px_rgba(242,101,34,0.5)] transition-all duration-300 ${isVisible ? 'w-10 h-10 mr-3' : 'w-8 h-8 mr-0 text-sm'}`}>
              CCS
            </div>

            <div className={`flex flex-col whitespace-nowrap transition-all duration-300 ${isVisible ? 'opacity-100 w-auto inline-block' : 'opacity-0 w-0 hidden'}`}>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-amber-400 leading-tight">
                Profile Hub
              </h1>
            </div>
          </div>

          {isVisible && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1.5 rounded-lg transition-colors focus:outline-none shrink-0 ${isOpen ? 'bg-slate-800 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title={isOpen ? "Unpin Sidebar" : "Pin Sidebar"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-2 overflow-x-hidden">
          <p className={`px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 transition-all duration-300 whitespace-nowrap ${isVisible ? 'opacity-100' : 'opacity-0 h-0 hidden'}`}>
            Modules
          </p>

          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setCurrentModule(module.id)}
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 group relative ${isVisible ? 'px-4' : 'px-0 justify-center'
                } ${currentModule === module.id
                  ? 'bg-brand-600/10 text-brand-400 ring-1 ring-brand-500/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              title={!isVisible ? module.label : ''}
            >
              {currentModule === module.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-brand-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              )}

              <svg className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isVisible ? 'mr-3' : 'mr-0'} ${currentModule === module.id ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={module.icon} />
              </svg>
              <span className={`font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${isVisible ? 'opacity-100 w-auto inline-block' : 'opacity-0 w-0 hidden'}`}>
                {module.label}
              </span>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-slate-800 space-y-2">
          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Log Out"
            className={`w-full flex items-center rounded-xl transition-all duration-300 group text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 ${isVisible ? 'px-4 py-3' : 'px-0 py-3 justify-center'}`}
          >
            <svg
              className={`w-5 h-5 shrink-0 transition-colors duration-300 group-hover:text-red-400 ${isVisible ? 'mr-3' : 'mr-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className={`font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${isVisible ? 'opacity-100 w-auto inline-block' : 'opacity-0 w-0 hidden'}`}>
              Log Out
            </span>
          </button>

          {/* User Card */}
          <div className={`flex items-center rounded-xl bg-slate-800/50 border border-slate-700/50 transition-all duration-300 ${isVisible ? 'p-3' : 'p-2 justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0">
              {user ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className={`whitespace-nowrap transition-all duration-300 ${isVisible ? 'ml-3 opacity-100 w-auto block' : 'ml-0 opacity-0 w-0 hidden'}`}>
              <p className="text-sm font-medium text-slate-200 leading-none">{user?.name ?? 'Admin User'}</p>
              <p className="text-xs text-slate-500 mt-1">{user?.role ?? 'Administrator'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
