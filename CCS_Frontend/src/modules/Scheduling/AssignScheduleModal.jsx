import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const AssignScheduleModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    day_of_week: 'Monday',
    start_time: '08:00',
    end_time: '10:00',
    room: '',
    subject_id: '',
    faculty_id: '',
    section_id: ''
  });

  const [options, setOptions] = useState({
    subjects: [],
    faculties: [],
    sections: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      const [subjects, faculties, sections] = await Promise.all([
        api.subjects.getAll(),
        api.faculties.getAll(),
        api.sections.getAll()
      ]);
      setOptions({ subjects, faculties, sections });

      // Set defaults if data exists
      setFormData(prev => ({
        ...prev,
        subject_id: subjects.length ? subjects[0].id : '',
        faculty_id: faculties.length ? faculties[0].id : '',
        section_id: sections.length ? sections[0].id : ''
      }));
    } catch (err) {
      setError('Failed to load form options.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = { ...formData };
      await api.schedules.create(payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to assign schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Assign New Schedule</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assignment Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Assignment Details</h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Subject <span className="text-red-500">*</span></label>
                  <select name="subject_id" value={formData.subject_id} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium bg-white" required>
                    {options.subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.subject_code} - {s.descriptive_title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Faculty Member <span className="text-red-500">*</span></label>
                  <select name="faculty_id" value={formData.faculty_id} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium bg-white" required>
                    {options.faculties.map(f => (
                      <option key={f.id} value={f.id}>{f.first_name} {f.last_name} ({f.department?.department_name})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Section <span className="text-red-500">*</span></label>
                  <select name="section_id" value={formData.section_id} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium bg-white" required>
                    {options.sections.map(s => (
                      <option key={s.id} value={s.id}>{s.section_name} - {s.course?.course_code}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Timing Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Time & Location</h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Day of Week <span className="text-red-500">*</span></label>
                  <select name="day_of_week" value={formData.day_of_week} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium bg-white" required>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Start Time <span className="text-red-500">*</span></label>
                    <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">End Time <span className="text-red-500">*</span></label>
                    <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Classroom <span className="text-red-500">*</span></label>
                  <input type="text" name="room" value={formData.room} onChange={handleChange} placeholder="e.g. IT Lb 1, Room 302" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium" required />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/30 disabled:opacity-50 flex items-center">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : 'Assign Schedule'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignScheduleModal;
