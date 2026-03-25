import React, { useState } from 'react';
import {
  UserIcon, UsersIcon, BookOpenIcon, CalendarIcon,
  StarIcon, MagnifyingGlassIcon, Bars3Icon,
  ArrowRightOnRectangleIcon, ChevronLeftIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ currentModule, setCurrentModule, isOpen, setIsOpen, user, onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isVisible = isOpen || isHovered;
  const modules = [
    { id: 'student',     label: 'Student Information',  Icon: UserIcon },
    { id: 'faculty',     label: 'Faculty Information',  Icon: UsersIcon },
    { id: 'instruction', label: 'Instruction',          Icon: BookOpenIcon },
    { id: 'scheduling',  label: 'Scheduling',           Icon: CalendarIcon },
    { id: 'events',      label: 'Events',               Icon: StarIcon },
    { id: 'search',      label: 'Comprehensive Search', Icon: MagnifyingGlassIcon },
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
              <Bars3Icon className="w-5 h-5" />
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
              <module.Icon className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isVisible ? 'mr-3' : 'mr-0'} ${currentModule === module.id ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
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
            <ArrowRightOnRectangleIcon className={`w-5 h-5 shrink-0 transition-colors duration-300 group-hover:text-red-400 ${isVisible ? 'mr-3' : 'mr-0'}`} />
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
