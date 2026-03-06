import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import AddFacultyModal from './AddFacultyModal';

const FacultyModule = () => {
  const [faculties, setFaculties] = useState([]);
  const [stats, setStats] = useState({ total: 0, fullTime: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setIsLoading(true);
        const data = await api.faculties.getAll();
        setFaculties(data);
        
        // Calculate basic stats
        const fullTimeCount = data.filter(f => f.employment_status === 'Full-Time').length;
        setStats({ total: data.length, fullTime: fullTimeCount });
      } catch (error) {
        console.error("Failed to load faculties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Module Header & Actions */}
      <div className="flex justify-between items-end mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Faculty Information</h1>
          <p className="text-slate-500">Manage faculty directory, employment details, and department assignments.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-brand-500/30"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Faculty
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Faculty Directory</h3>
              <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</button>
            </div>
            
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                </div>
              ) : faculties.length === 0 ? (
                <div className="py-8 text-center text-slate-500">No faculty members found.</div>
              ) : (
                faculties.map((faculty) => (
                  <div key={faculty.id} className="py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50 -mx-4 px-4 rounded-lg transition-colors">
                     <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
                         {faculty.first_name[0]}{faculty.last_name[0]}
                       </div>
                       <div>
                         <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                           {faculty.first_name} {faculty.middle_name ? faculty.middle_name[0] + '. ' : ''}{faculty.last_name}
                         </p>
                         <p className="text-xs text-slate-500 flex items-center mt-1">
                           <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                           {faculty.position} • {faculty.department?.department_name || 'N/A'}
                         </p>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${faculty.employment_status === 'Full-Time' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                         {faculty.employment_status}
                       </span>
                       <p className="text-xs font-medium text-slate-400 mt-2 flex items-center justify-end">
                         <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                         {faculty.email}
                       </p>
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Faculty Stats</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center text-slate-600">
                     <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center mr-3 text-brand-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                     </div>
                     <span className="text-sm font-medium">Total Faculties</span>
                   </div>
                   <span className="text-lg font-bold text-slate-800">
                     {isLoading ? '...' : stats.total}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center text-slate-600">
                     <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-3 text-green-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <span className="text-sm font-medium">Full-Time</span>
                   </div>
                   <span className="text-lg font-bold text-slate-800">
                     {isLoading ? '...' : stats.fullTime}
                   </span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddFacultyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onFacultyAdded={() => {
          const fetchFaculties = async () => {
            try {
              setIsLoading(true);
              const data = await api.faculties.getAll();
              setFaculties(data);
              const fullTimeCount = data.filter(f => f.employment_status === 'Full-Time').length;
              setStats({ total: data.length, fullTime: fullTimeCount });
            } catch (error) {
              console.error("Failed to reload faculties:", error);
            } finally {
              setIsLoading(false);
            }
          };
          fetchFaculties();
        }} 
      />
    </div>
  );
};

export default FacultyModule;
