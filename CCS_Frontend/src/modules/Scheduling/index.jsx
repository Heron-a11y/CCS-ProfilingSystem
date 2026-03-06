import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import AssignScheduleModal from './AssignScheduleModal';

const SchedulingModule = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await api.schedules.getAll();
      setSchedules(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load schedules.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDayColor = (day) => {
    const colors = {
      'Monday': 'bg-blue-100 text-blue-700',
      'Tuesday': 'bg-green-100 text-green-700',
      'Wednesday': 'bg-yellow-100 text-yellow-700',
      'Thursday': 'bg-purple-100 text-purple-700',
      'Friday': 'bg-pink-100 text-pink-700',
      'Saturday': 'bg-orange-100 text-orange-700'
    };
    return colors[day] || 'bg-slate-100 text-slate-700';
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 || 12;
    return `${hr}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
          <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Daily Schedules</p>
            <h3 className="text-3xl font-bold text-slate-800">{schedules.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
          <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Rooms Utilized</p>
            <h3 className="text-3xl font-bold text-slate-800">
              {new Set(schedules.map(s => s.room)).size}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-280px)]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Master Timetable</h2>
            <p className="text-sm text-slate-500 mt-1">Manage professor and section classroom schedules.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-brand-500/30 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Assign Schedule
          </button>
        </div>

        {error && (
          <div className="m-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-x-auto relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin"></div>
            </div>
          ) : schedules.length > 0 ? (
             <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
               <tr className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Day & Time</th>
                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Subject</th>
                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Faculty</th>
                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Section</th>
                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Room</th>
                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {schedules.map((schedule) => (
                 <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
                   <td className="p-4">
                     <div className="flex flex-col">
                       <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold w-fit mb-1 ${getDayColor(schedule.day_of_week)}`}>
                         {schedule.day_of_week}
                       </span>
                       <span className="text-sm font-medium text-slate-600 font-mono">
                         {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                       </span>
                     </div>
                   </td>
                   <td className="p-4">
                     <div className="flex flex-col">
                       <span className="font-bold text-slate-800">{schedule.subject?.subject_code}</span>
                       <span className="text-xs text-slate-500 truncate max-w-[200px]">{schedule.subject?.descriptive_title}</span>
                     </div>
                   </td>
                   <td className="p-4">
                     <div className="flex items-center">
                       <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mr-3">
                         {schedule.faculty?.first_name[0]}{schedule.faculty?.last_name[0]}
                       </div>
                       <span className="font-medium text-slate-700">
                         {schedule.faculty?.first_name} {schedule.faculty?.last_name}
                       </span>
                     </div>
                   </td>
                   <td className="p-4">
                     <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600">
                       {schedule.section?.section_name}
                     </span>
                   </td>
                   <td className="p-4">
                     <div className="flex items-center text-slate-600">
                        <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">{schedule.room}</span>
                     </div>
                   </td>
                   <td className="p-4 text-right">
                     <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors rounded-lg hover:bg-brand-50" title="Edit Schedule">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                       </svg>
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
              <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">No schedules assigned</p>
              <p className="text-sm">Click "Assign Schedule" to create timetable assignments.</p>
            </div>
          )}
        </div>
      </div>

      <AssignScheduleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchSchedules} 
      />
    </div>
  );
};

export default SchedulingModule;
