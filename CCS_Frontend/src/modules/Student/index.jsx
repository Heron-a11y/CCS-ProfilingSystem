import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import AddStudentModal from './AddStudentModal';
import StudentProfileTabs from './StudentProfileTabs';

const StudentModule = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, enrolled: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data = await api.students.getAll();
        setStudents(data);

        // Calculate basic stats
        const enrolledCount = data.filter(s => s.enrollment_status === 'Enrolled').length;
        setStats({ total: data.length, enrolled: enrolledCount });
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleStudentClick = async (id) => {
    try {
      setIsLoading(true);
      const data = await api.students.get(id);
      setSelectedStudent(data);
      setActiveTab('personal');
    } catch (error) {
      console.error("Failed to load student details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'personal', label: 'Personal Details' },
    { id: 'academic', label: 'Academic History' },
    { id: 'medical', label: 'Medical History' },
    { id: 'skills', label: 'Skills & Certifications' },
    { id: 'violations', label: 'Violations' },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      {/* Module Header & Actions */}
      <div className="flex justify-between items-end mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Student Information</h1>
          <p className="text-slate-500">Manage student profiles, academic records, and personal histories.</p>
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
            Add Student
          </button>
        </div>
      </div>

      {/* Main Content Area with Navigation Tabs */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'overview') {
                  setSelectedStudent(null);
                }
                setActiveTab(tab.id);
              }}
              className={`px-6 py-4 text-sm font-medium transition-all relative ${activeTab === tab.id
                  ? 'text-brand-600'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-t-lg'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 shadow-[0_-2px_8px_rgba(37,99,235,0.4)]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50/20">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Recent Students</h3>
                  <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</button>
                </div>

                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-2">
                  {isLoading ? (
                    <div className="py-8 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                    </div>
                  ) : students.length === 0 ? (
                    <div className="py-8 text-center text-slate-500">No students found.</div>
                  ) : (
                    students.map((student) => (
                      <div
                        key={student.id}
                        onClick={() => handleStudentClick(student.id)}
                        className="py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50 -mx-4 px-4 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {student.first_name[0]}{student.last_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                              {student.first_name} {student.middle_name ? student.middle_name[0] + '. ' : ''}{student.last_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {student.course?.course_code || 'N/A'} - {student.year_level || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {student.enrollment_status === 'Enrolled' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {student.enrollment_status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              {student.enrollment_status}
                            </span>
                          )}

                          <p className="text-xs text-slate-400 mt-1">ID: {student.id}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center mr-3 text-brand-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <span className="text-sm font-medium">Total Students</span>
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
                        <span className="text-sm font-medium">Currently Enrolled</span>
                      </div>
                      <span className="text-lg font-bold text-slate-800">
                        {isLoading ? '...' : stats.enrolled}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && !selectedStudent && (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 min-h-[400px]">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">No Student Selected</h3>
              <p>Please select a student from the Overview tab to view their detailed profile.</p>
              <button
                onClick={() => setActiveTab('overview')}
                className="mt-6 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Return to Overview
              </button>
            </div>
          )}

          {activeTab !== 'overview' && selectedStudent && (
            <StudentProfileTabs activeTab={activeTab} student={selectedStudent} />
          )}
        </div>
      </div>

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStudentAdded={() => {
          // Re-fetch students when a new one is added
          const fetchStudents = async () => {
            try {
              setIsLoading(true);
              const data = await api.students.getAll();
              setStudents(data);
              const enrolledCount = data.filter(s => s.enrollment_status === 'Enrolled').length;
              setStats({ total: data.length, enrolled: enrolledCount });
            } catch (error) {
              console.error("Failed to reload students:", error);
            } finally {
              setIsLoading(false);
            }
          };
          fetchStudents();
        }}
      />
    </div>
  );
};

export default StudentModule;
