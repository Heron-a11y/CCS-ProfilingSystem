import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import AssignScheduleModal from './AssignScheduleModal';
import EditScheduleModal from './EditScheduleModal';
import { useDarkMode } from '../../context/DarkModeContext';

const SchedulingModule = () => {
  const dark = useDarkMode();
  const card     = dark ? 'bg-slate-900 border-slate-700/60'  : 'bg-white border-slate-100';
  const boldText = dark ? 'text-slate-100' : 'text-slate-800';
  const subText  = dark ? 'text-slate-400' : 'text-slate-500';
  const tableBar = dark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50/50 border-slate-100';
  const thead    = dark ? 'bg-slate-800 border-slate-700/60'  : 'bg-slate-50 border-slate-200';
  const thText   = dark ? 'text-slate-400 border-slate-700/60' : 'text-slate-500 border-slate-200';
  const tbDivide = dark ? 'divide-slate-700/60' : 'divide-slate-100';
  const trHover  = dark ? 'hover:bg-slate-800' : 'hover:bg-slate-50';
  const loadBg   = dark ? 'bg-slate-900/80' : 'bg-white/80';
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

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

  const handleDeleteSchedule = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await api.schedules.delete(id);
        fetchSchedules();
      } catch (err) {
        alert(err.message || 'Failed to delete schedule');
      }
    }
  };

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
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
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-2xl p-6 shadow-sm border flex items-center transition-colors duration-300 ${card}`}>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 ${dark ? 'bg-brand-900/40 text-brand-400' : 'bg-brand-50 text-brand-600'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p className={`text-sm font-medium ${subText}`}>Active Daily Schedules</p>
            <h3 className={`text-3xl font-bold ${boldText}`}>{schedules.length}</h3>
          </div>
        </div>
        <div className={`rounded-2xl p-6 shadow-sm border flex items-center transition-colors duration-300 ${card}`}>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 ${dark ? 'bg-teal-900/40 text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <p className={`text-sm font-medium ${subText}`}>Rooms Utilized</p>
            <h3 className={`text-3xl font-bold ${boldText}`}>{new Set(schedules.map(s => s.room)).size}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`rounded-2xl shadow-sm border overflow-hidden flex flex-col h-[calc(100vh-280px)] transition-colors duration-300 ${card}`}>
        <div className={`p-6 border-b flex justify-between items-center transition-colors duration-300 ${tableBar}`}>
          <div>
            <h2 className={`text-xl font-bold ${boldText}`}>Master Timetable</h2>
            <p className={`text-sm mt-1 ${subText}`}>Manage professor and section classroom schedules.</p>
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
            <div className={`absolute inset-0 flex items-center justify-center z-10 ${loadBg}`}>
              <div className="w-10 h-10 border-4 border-slate-700 border-t-brand-500 rounded-full animate-spin"></div>
            </div>
          ) : schedules.length > 0 ? (
             <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
               <tr className={`sticky top-0 z-10 shadow-sm ${thead}`}>
                 <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b ${thText}`}>Day & Time</th>
                 <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b ${thText}`}>Subject</th>
                 <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b ${thText}`}>Faculty</th>
                 <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b ${thText}`}>Section</th>
                 <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b ${thText}`}>Room</th>
                 <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b text-right ${thText}`}>Actions</th>
               </tr>
             </thead>
             <tbody className={`divide-y ${tbDivide}`}>
               {schedules.map((schedule) => (
                 <tr key={schedule.id} className={`transition-colors ${trHover}`}>
                   <td className="p-4">
                     <div className="flex flex-col">
                       <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold w-fit mb-1 ${getDayColor(schedule.day_of_week)}`}>{schedule.day_of_week}</span>
                       <span className={`text-sm font-medium font-mono ${subText}`}>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
                     </div>
                   </td>
                   <td className="p-4">
                     <div className="flex flex-col">
                       <span className={`font-bold ${boldText}`}>{schedule.subject?.subject_code}</span>
                       <span className={`text-xs truncate max-w-[200px] ${subText}`}>{schedule.subject?.descriptive_title}</span>
                     </div>
                   </td>
                   <td className="p-4">
                     <div className="flex items-center">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mr-3 ${dark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                         {schedule.faculty?.first_name[0]}{schedule.faculty?.last_name[0]}
                       </div>
                       <span className={`font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{schedule.faculty?.first_name} {schedule.faculty?.last_name}</span>
                     </div>
                   </td>
                   <td className="p-4">
                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${dark ? 'border-slate-600 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>{schedule.section?.section_name}</span>
                   </td>
                   <td className="p-4">
                     <div className={`flex items-center ${subText}`}>
                       <svg className="w-4 h-4 mr-1.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       <span className="font-medium">{schedule.room}</span>
                     </div>
                   </td>
                   <td className="p-4 text-right">
                     <div className="flex justify-end space-x-1">
                       <button onClick={() => openEditModal(schedule)} className={`p-2 rounded-lg transition-colors hover:bg-brand-500/10 ${dark ? 'text-slate-400 hover:text-brand-400' : 'text-slate-400 hover:text-brand-600'}`}>
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                       </button>
                       <button onClick={() => handleDeleteSchedule(schedule.id)} className={`p-2 rounded-lg transition-colors hover:bg-red-500/10 ${dark ? 'text-slate-400 hover:text-red-400' : 'text-slate-400 hover:text-red-600'}`}>
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                     </div>
                   </td>
                </tr>
              ))}
             </tbody>
           </table>
          ) : (
            <div className={`flex flex-col items-center justify-center h-full py-12 ${subText}`}>
              <svg className={`w-16 h-16 mb-4 ${dark ? 'text-slate-700' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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

      {isEditModalOpen && selectedSchedule && (
        <EditScheduleModal
          isOpen={isEditModalOpen}
          initialData={selectedSchedule}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSchedule(null);
          }}
          onSuccess={fetchSchedules}
        />
      )}
    </div>
  );
};

export default SchedulingModule;
