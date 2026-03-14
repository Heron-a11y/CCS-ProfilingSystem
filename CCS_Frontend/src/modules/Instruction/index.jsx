import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import AddSubjectModal from './AddSubjectModal';
import EditSubjectModal from './EditSubjectModal';
import { useDarkMode } from '../../context/DarkModeContext';

const InstructionModule = () => {
  const dark = useDarkMode();
  const card    = dark ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-100';
  const boldText = dark ? 'text-slate-100' : 'text-slate-800';
  const subText  = dark ? 'text-slate-400' : 'text-slate-500';
  const thead    = dark ? 'bg-slate-800 border-slate-700/60' : 'bg-slate-50 border-slate-200';
  const thText   = dark ? 'text-slate-400 border-slate-700/60' : 'text-slate-500 border-slate-200';
  const tbDivide = dark ? 'divide-slate-700/60' : 'divide-slate-100';
  const trHover  = dark ? 'hover:bg-slate-800' : 'hover:bg-slate-50';
  const tableBar = dark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50/50 border-slate-100';
  const loadBg   = dark ? 'bg-slate-900/80' : 'bg-white/80';
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const data = await api.subjects.getAll();
      setSubjects(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load curriculum/subjects.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.subjects.delete(id);
        fetchSubjects();
      } catch (err) {
        alert(err.message || 'Failed to delete subject');
      }
    }
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject);
    setIsEditModalOpen(true);
  };

  const totalUnits = subjects.reduce((sum, sub) => sum + (sub.total_units || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-2xl p-6 shadow-sm border flex items-center transition-colors duration-300 ${card}`}>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 ${dark ? 'bg-brand-900/40 text-brand-400' : 'bg-brand-50 text-brand-600'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <p className={`text-sm font-medium ${subText}`}>Total Subjects</p>
            <h3 className={`text-3xl font-bold ${boldText}`}>{subjects.length}</h3>
          </div>
        </div>
        <div className={`rounded-2xl p-6 shadow-sm border flex items-center transition-colors duration-300 ${card}`}>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 ${dark ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-50 text-amber-500'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <div>
            <p className={`text-sm font-medium ${subText}`}>Total Curriculum Units</p>
            <h3 className={`text-3xl font-bold ${boldText}`}>{totalUnits}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`rounded-2xl shadow-sm border overflow-hidden flex flex-col h-[calc(100vh-280px)] transition-colors duration-300 ${card}`}>
        <div className={`p-6 border-b flex justify-between items-center transition-colors duration-300 ${tableBar}`}>
          <div>
            <h2 className={`text-xl font-bold transition-colors duration-300 ${boldText}`}>Curriculum Dashboard</h2>
            <p className={`text-sm mt-1 ${subText}`}>Manage departmental subjects, descriptive titles, and prerequisites.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-brand-500/30 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Subject
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
              <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-500 rounded-full animate-spin"></div>
            </div>
          ) : subjects.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`sticky top-0 z-10 shadow-sm ${thead}`}>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b ${thText}`}>Subject Code</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b ${thText}`}>Descriptive Title</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b text-center ${thText}`}>Lec Units</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b text-center ${thText}`}>Lab Units</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b text-center ${thText}`}>Total Units</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b ${thText}`}>Pre-requisite</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider border-b text-right ${thText}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${tbDivide}`}>
                {subjects.map((subject) => (
                  <tr key={subject.id} className={`transition-colors ${trHover}`}>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-brand-500/15 text-brand-400">{subject.subject_code}</span>
                    </td>
                    <td className="p-4">
                      <p className={`font-semibold ${boldText}`}>{subject.descriptive_title}</p>
                    </td>
                    <td className={`p-4 text-center font-medium ${subText}`}>{subject.lec_units}</td>
                    <td className={`p-4 text-center font-medium ${subText}`}>{subject.lab_units}</td>
                    <td className={`p-4 text-center font-bold ${boldText}`}>{subject.total_units}</td>
                    <td className="p-4">
                      {subject.pre_requisites ? (
                        <span className={`text-sm font-medium px-2 py-1 rounded-md ${dark ? 'text-slate-300 bg-slate-800' : 'text-slate-600 bg-slate-100'}`}>{subject.pre_requisites}</span>
                      ) : (
                        <span className={`text-sm italic ${subText}`}>None</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-1">
                        <button onClick={() => openEditModal(subject)} className={`p-2 transition-colors rounded-lg hover:bg-brand-500/10 ${dark ? 'text-slate-400 hover:text-brand-400' : 'text-slate-400 hover:text-brand-600'}`} title="Edit Subject">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDeleteSubject(subject.id)} className={`p-2 transition-colors rounded-lg hover:bg-red-500/10 ${dark ? 'text-slate-400 hover:text-red-400' : 'text-slate-400 hover:text-red-600'}`} title="Delete Subject">
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
              <svg className={`w-16 h-16 mb-4 ${dark ? 'text-slate-700' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <p className="text-lg font-medium">No subjects found</p>
              <p className="text-sm">Click "Add Subject" to define your curriculum.</p>
            </div>
          )}
        </div>
      </div>

      <AddSubjectModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchSubjects} 
      />

      {isEditModalOpen && selectedSubject && (
        <EditSubjectModal
          isOpen={isEditModalOpen}
          initialData={selectedSubject}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSubject(null);
          }}
          onSuccess={fetchSubjects}
        />
      )}
    </div>
  );
};

export default InstructionModule;
