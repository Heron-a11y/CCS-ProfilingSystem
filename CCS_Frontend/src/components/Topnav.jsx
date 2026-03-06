import React from 'react';

const Topnav = ({ currentModule, userName = "Admin User" }) => {
  const getModuleTitle = (moduleId) => {
    const titles = {
      'student': 'Student Information System',
      'faculty': 'Faculty Management',
      'instruction': 'Instruction & Curriculum',
      'scheduling': 'Course Scheduling',
      'events': 'Events & Curriculars',
      'search': 'Comprehensive Search'
    };
    return titles[moduleId] || 'Dashboard';
  };

  return (
    <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0 relative">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          {getModuleTitle(currentModule)}
        </h2>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Quick search..." 
            className="w-64 pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium text-slate-700 placeholder-slate-400"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

      </div>
    </header>
  );
};

export default Topnav;
