import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useDarkMode } from '../../context/DarkModeContext';

const EditScheduleModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const dark = useDarkMode();
  const [formData, setFormData] = useState({
    day_of_week: 'Monday', start_time: '08:00', end_time: '10:00',
    room: '', subject_id: '', faculty_id: '', section_id: ''
  });
  const [options, setOptions] = useState({ subjects: [], faculties: [], sections: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (isOpen) fetchOptions(); }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialData && !isLoading && options.subjects.length > 0) {
      setFormData({
        day_of_week: initialData.day_of_week || 'Monday',
        start_time: initialData.start_time ? initialData.start_time.slice(0, 5) : '08:00',
        end_time: initialData.end_time ? initialData.end_time.slice(0, 5) : '10:00',
        room: initialData.room || '',
        subject_id: initialData.subject_id || '',
        faculty_id: initialData.faculty_id || '',
        section_id: initialData.section_id || ''
      });
    }
  }, [isOpen, initialData, isLoading, options]);

  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      const [subjects, faculties, sections] = await Promise.all([
        api.subjects.getAll(), api.faculties.getAll(), api.sections.getAll()
      ]);
      setOptions({ subjects, faculties, sections });
      if (!initialData) {
        setFormData(prev => ({
          ...prev,
          subject_id: subjects.length ? subjects[0].id : '',
          faculty_id: faculties.length ? faculties[0].id : '',
          section_id: sections.length ? sections[0].id : ''
        }));
      }
    } catch {
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
      await api.schedules.update(initialData.id, { ...formData });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Dark mode tokens
  const modalBg   = dark ? 'bg-slate-900'        : 'bg-white';
  const headerBg  = dark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50/50 border-slate-100';
  const titleClr  = dark ? 'text-slate-100'       : 'text-slate-800';
  const closeBtn  = dark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100';
  const labelClr  = dark ? 'text-slate-300'       : 'text-slate-700';
  const secHead   = dark ? 'text-slate-500'        : 'text-slate-500';
  const inputCls  = dark
    ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-brand-400/50'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-brand-500/50';
  const selectCls = dark
    ? 'bg-slate-800 border-slate-600 text-slate-100 focus:ring-brand-400/50'
    : 'bg-white border-slate-200 text-slate-800 focus:ring-brand-500/50';
  const divider   = dark ? 'border-slate-700/60'  : 'border-slate-100';
  const cancelBtn = dark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100';
  const errBox    = dark ? 'bg-red-900/30 border-red-800/50 text-red-300' : 'bg-red-50 border-red-100 text-red-600';
  const spinBorder= dark ? 'border-slate-700 border-t-brand-500' : 'border-slate-200 border-t-brand-600';

  const Field = ({ label, required, children }) => (
    <div>
      <label className={`block text-sm font-semibold mb-1 ${labelClr}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${modalBg} rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden`}>

        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${headerBg}`}>
          <h2 className={`text-xl font-bold ${titleClr}`}>Edit Schedule</h2>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${closeBtn}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className={`w-10 h-10 border-4 rounded-full animate-spin ${spinBorder}`} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className={`p-4 border rounded-xl text-sm flex items-start ${errBox}`}>
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assignment Details */}
              <div className="space-y-4">
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${secHead}`}>Assignment Details</h3>
                <Field label="Subject" required>
                  <select name="subject_id" value={formData.subject_id} onChange={handleChange} required
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium ${selectCls}`}>
                    {options.subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.subject_code} - {s.descriptive_title}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Faculty Member" required>
                  <select name="faculty_id" value={formData.faculty_id} onChange={handleChange} required
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium ${selectCls}`}>
                    {options.faculties.map(f => (
                      <option key={f.id} value={f.id}>{f.first_name} {f.last_name} ({f.department?.department_name})</option>
                    ))}
                  </select>
                </Field>
                <Field label="Section" required>
                  <select name="section_id" value={formData.section_id} onChange={handleChange} required
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium ${selectCls}`}>
                    {options.sections.map(s => (
                      <option key={s.id} value={s.id}>{s.section_name} - {s.course?.course_code}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Time & Location */}
              <div className="space-y-4">
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${secHead}`}>Time & Location</h3>
                <Field label="Day of Week" required>
                  <select name="day_of_week" value={formData.day_of_week} onChange={handleChange} required
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium ${selectCls}`}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  {[['start_time', 'Start Time'], ['end_time', 'End Time']].map(([name, label]) => (
                    <Field key={name} label={label} required>
                      <input type="time" name={name} value={formData[name]} onChange={handleChange} required
                        className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium ${inputCls}`} />
                    </Field>
                  ))}
                </div>
                <Field label="Classroom" required>
                  <input type="text" name="room" value={formData.room} onChange={handleChange}
                    placeholder="e.g. IT Lb 1, Room 302" required
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium ${inputCls}`} />
                </Field>
              </div>
            </div>

            <div className={`flex justify-end space-x-3 pt-6 border-t ${divider}`}>
              <button type="button" onClick={onClose} disabled={isSubmitting}
                className={`px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 ${cancelBtn}`}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/30 disabled:opacity-50 flex items-center">
                {isSubmitting ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Saving...</>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditScheduleModal;
