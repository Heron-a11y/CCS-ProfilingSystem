import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useDarkMode } from '../../context/DarkModeContext';

const SearchModule = () => {
  const dark = useDarkMode();
  const card     = dark ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-100';
  const boldText = dark ? 'text-slate-100' : 'text-slate-800';
  const subText  = dark ? 'text-slate-400' : 'text-slate-500';
  const inputBg  = dark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-brand-400' : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400 focus:border-brand-500';
  const tabBg    = dark ? 'bg-slate-800' : 'bg-slate-100';
  const tabActive = dark ? 'bg-slate-700 text-brand-400' : 'bg-white text-brand-600';
  const tabInact  = dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700';
  const filterBg  = dark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200';
  const filterBtn = (active) => active
    ? (dark ? 'bg-indigo-900/40 text-indigo-400 border-indigo-600' : 'bg-indigo-100 text-indigo-700 border-indigo-200')
    : (dark ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100');
  const resultCard = dark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-slate-50/50 border-slate-100 hover:border-slate-300';
  const emptyCard  = dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100';
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState({
    students: [],
    faculties: [],
    subjects: [],
    events: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    skills: [],
    affiliations: [],
    events: [],
    violations: false
  });
  const [advancedResults, setAdvancedResults] = useState([]);
  
  // Available filter options (simulated for UI purposes, ideally fetched from API)
  const availableSkills = [
    { id: 1, name: 'Programming' },
    { id: 2, name: 'Web Development' },
    { id: 3, name: 'Database Management' },
    { id: 4, name: 'Networking' },
    { id: 5, name: 'Basketball' },
    { id: 6, name: 'Volleyball' }
  ];

  const availableAffiliations = [
    'Student Council',
    'Programming Club',
    'Sports Society',
    'Debate Team'
  ];

  const availableEvents = [
    { id: 1, name: 'Basketball Tryouts 2026' },
    { id: 2, name: 'Hackathon 2026' },
  ];

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (!isAdvancedMode) {
      if (debouncedQuery.trim().length >= 2) {
        performSearch(debouncedQuery);
      } else {
        setResults({ students: [], faculties: [], subjects: [], events: [] });
      }
    }
  }, [debouncedQuery, isAdvancedMode]);

  const performSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.search.query(query);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to perform search.');
    } finally {
      setIsLoading(false);
    }
  };

  const performAdvancedSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Build payload for advanced search API
      const payload = {
        searchQuery: searchQuery, // Optional text match
        skills: advancedFilters.skills,
        affiliations: advancedFilters.affiliations,
        events: advancedFilters.events,
        ... (advancedFilters.violations ? { violations: false } : {}) // Example logic if toggle true = MUST have NO violations
      };

      // In real scenario, mapping toggle to DB logic based on requirements. 
      // Assuming requirement: "Clean Record" toggle to exclude those with violations.
      if(advancedFilters.violations) payload.violations = false; 

      const data = await api.students.advancedSearch(payload);
      setAdvancedResults(data);
    } catch (err) {
      setError(err.message || 'Failed to perform advanced search.');
    } finally {
      setIsLoading(false);
    }
  };

  const hasStandardResults = Object.values(results).some(arr => arr?.length > 0);
  const isSearchEmpty = debouncedQuery.trim().length < 2 && !isAdvancedMode;

  const toggleSkillFilter = (id) => {
    setAdvancedFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(id) 
        ? prev.skills.filter(sId => sId !== id)
        : [...prev.skills, id]
    }));
  };

  const toggleAffiliationFilter = (name) => {
    setAdvancedFilters(prev => ({
      ...prev,
      affiliations: prev.affiliations.includes(name) 
        ? prev.affiliations.filter(a => a !== name)
        : [...prev.affiliations, name]
    }));
  };

  const renderResultSection = (title, items, type, icon, colorClass, bgClass) => {
    if (!items || items.length === 0) return null;
    return (
      <div className={`rounded-2xl p-6 shadow-sm border mb-6 transition-colors duration-300 ${card}`}>
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 ${bgClass} ${colorClass} rounded-lg flex items-center justify-center mr-3`}>{icon}</div>
          <h3 className={`text-lg font-bold ${boldText}`}>{title} <span className={`text-sm font-medium ml-2 ${subText}`}>({items.length})</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className={`p-4 rounded-xl border transition-colors ${resultCard}`}>
              <div className="flex items-start">
                <div className={`w-8 h-8 rounded-full ${bgClass} ${colorClass} flex items-center justify-center font-bold text-xs mr-3 shrink-0`}>
                  {type === 'student' || type === 'faculty' ? item.first_name[0] : type === 'subject' ? item.subject_code[0] : item.eventName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm truncate ${boldText}`}>
                    {type === 'student' || type === 'faculty' ? `${item.first_name} ${item.last_name}` : type === 'subject' ? item.subject_code : item.eventName}
                  </h4>
                  <p className={`text-xs truncate mt-0.5 ${subText}`}>
                    {type === 'student' ? item.email : type === 'faculty' ? item.position : type === 'subject' ? item.descriptive_title : item.eventType}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className={`rounded-2xl p-8 shadow-sm border relative overflow-hidden transition-all duration-300 ${card}`}>
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 opacity-40 ${dark ? 'bg-brand-900' : 'bg-brand-50'}`}></div>
        <div className={`absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl -ml-10 -mb-10 opacity-40 ${dark ? 'bg-blue-900' : 'bg-blue-50'}`}></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className={`text-3xl font-bold mb-3 tracking-tight ${boldText}`}>System-Wide Search</h2>
            <p className={`mb-4 max-w-md mx-auto ${subText}`}>Quickly locate students, faculty members, academic subjects, and scheduled events, or generate comprehensive profiling reports.</p>
            <div className="flex justify-center mb-6">
              <div className={`p-1 rounded-xl inline-flex shadow-inner ${tabBg}`}>
                <button onClick={() => setIsAdvancedMode(false)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${!isAdvancedMode ? tabActive : tabInact}`}>Global Search</button>
                <button onClick={() => setIsAdvancedMode(true)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${isAdvancedMode ? tabActive : tabInact}`}>Advanced Profiling Report</button>
              </div>
            </div>
          </div>
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className={`w-6 h-6 ${isLoading ? 'text-brand-500' : 'text-slate-400'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAdvancedMode ? "Search by name (must match filters below)..." : "Search by name, email, subject code, or event title..."}
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium shadow-sm ${inputBg}`}
              autoFocus />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5 bg-slate-100 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          
          {isAdvancedMode && (
            <div className={`mt-6 p-6 border rounded-2xl text-left shadow-inner ${filterBg}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map(skill => (
                      <button key={skill.id} onClick={() => toggleSkillFilter(skill.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${filterBtn(advancedFilters.skills.includes(skill.id))}`}>
                        {skill.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Affiliations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availableAffiliations.map(affil => (
                      <button key={affil} onClick={() => toggleAffiliationFilter(affil)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${filterBtn(advancedFilters.affiliations.includes(affil))}`}>
                        {affil}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row items-center justify-between border-t border-slate-200 pt-6">
                <label className="flex items-center space-x-3 cursor-pointer group mb-4 md:mb-0">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={advancedFilters.violations}
                      onChange={() => setAdvancedFilters(prev => ({...prev, violations: !prev.violations}))}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${advancedFilters.violations ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${advancedFilters.violations ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    Clean Record Only (No Violations)
                  </div>
                </label>
                
                <button
                  onClick={performAdvancedSearch}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center min-w-[160px]"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Generate Report
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Area */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-start shadow-sm">
          <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className={`flex flex-col items-center justify-center py-20 ${emptyCard} rounded-2xl border`}>
          <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className={`font-medium animate-pulse ${subText}`}>Running rigorous queries...</p>
        </div>
      ) : isAdvancedMode ? (
        // Advanced Search Results Output
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {advancedResults.length > 0 ? (
             <div className={`rounded-2xl p-6 shadow-sm border mb-6 transition-colors duration-300 ${card}`}>
               <div className="flex items-center justify-between mb-6 border-b pb-4 ${dark ? 'border-slate-700' : 'border-slate-100'}">
                 <div>
                   <h3 className={`text-xl font-bold flex items-center ${boldText}`}>
                     <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     Filtered Profiling Report
                   </h3>
                   <p className={`text-sm mt-1 ${subText}`}>Found {advancedResults.length} matching student profiles based on selected criteria.</p>
                 </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                       <th className="py-3 px-4 font-semibold rounded-tl-lg">Student Profile</th>
                       <th className="py-3 px-4 font-semibold">Course & Dept</th>
                       <th className="py-3 px-4 font-semibold">Matched Skills</th>
                       <th className="py-3 px-4 font-semibold rounded-tr-lg">Matched Stats</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {advancedResults.map(student => (
                       <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                                {student.first_name[0]}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800">{student.first_name} {student.last_name}</div>
                                <div className="text-xs text-slate-500">{student.email}</div>
                              </div>
                            </div>
                         </td>
                         <td className="py-4 px-4 text-sm text-slate-600">
                            {student.course ? `${student.course.course_code} - ${student.year_level}` : 'N/A'}
                         </td>
                         <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1">
                              {student.skills?.slice(0, 3).map(s => <span key={s.id} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs border border-blue-100">{s.skill_name}</span>)}
                              {student.skills?.length > 3 && <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-xs">+{student.skills.length - 3}</span>}
                              {(!student.skills || student.skills.length === 0) && <span className="text-slate-400 text-xs italic">No skills recorded</span>}
                            </div>
                         </td>
                         <td className="py-4 px-4">
                            <div className="flex flex-col gap-1 text-xs">
                              <span className={`${student.violations?.length > 0 ? 'text-red-600' : 'text-emerald-600'} font-medium flex items-center`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${student.violations?.length > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                {student.violations?.length > 0 ? `${student.violations.length} Violations` : 'Clean Record'}
                              </span>
                              <span className="text-slate-500 flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></div>
                                {student.affiliations?.length || 0} Affiliations
                              </span>
                            </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-white rounded-2xl border border-slate-100">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
               </div>
               <p className="text-lg font-medium text-slate-800">No profiles match exactly</p>
               <p className="text-sm mt-1 text-slate-500">Try loosening your filter criteria (e.g. fewer skills required).</p>
             </div>
          )}
        </div>
      ) : isSearchEmpty ? (
        // Standard Search Empty State
        <div className={`flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed ${emptyCard}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${dark ? 'bg-slate-800 text-slate-600' : 'bg-slate-50 text-slate-300'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className={`text-lg font-medium ${boldText}`}>Enter a search term to begin</p>
          <p className={`text-sm mt-1 max-w-sm text-center ${subText}`}>Type at least 2 characters to search across Students, Faculty, Subjects, and Events.</p>
        </div>
      ) : !hasStandardResults ? (
        // Standard Search No Results
        <div className={`flex flex-col items-center justify-center py-24 rounded-2xl border ${emptyCard}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${dark ? 'bg-slate-800 text-slate-600' : 'bg-slate-50 text-slate-300'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className={`text-lg font-medium ${boldText}`}>No matches found</p>
          <p className={`text-sm mt-1 ${subText}`}>We couldn't find anything matching "{debouncedQuery}". Try adjusting your search query.</p>
        </div>
      ) : (
        // Standard Search Results
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderResultSection(
            "Students", 
            results.students, 
            'student', 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
            "text-brand-600", 
            "bg-brand-50"
          )}
          
          {renderResultSection(
            "Faculty", 
            results.faculties, 
            'faculty', 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            "text-emerald-600", 
            "bg-emerald-50"
          )}
          
          {renderResultSection(
            "Subjects", 
            results.subjects, 
            'subject', 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
            "text-amber-600", 
            "bg-amber-50"
          )}
          
          {renderResultSection(
            "Events", 
            results.events, 
            'event', 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
            "text-purple-600", 
            "bg-purple-50"
          )}
        </div>
      )}
    </div>
  );
};

export default SearchModule;
