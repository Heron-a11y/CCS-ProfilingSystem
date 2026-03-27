import React, { useState } from 'react';
import { api } from '../../utils/api';
import { useDarkMode } from '../../context/DarkModeContext';

const YEAR_PREFIX = { '1st Year': '1', '2nd Year': '2', '3rd Year': '3', '4th Year': '4' };
const PROGRAM_CODE = { 'Information Technology': 'IT', 'Computer Science': 'CS' };
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const getSectionOptions = (program, yearLevel) => {
  const yr = YEAR_PREFIX[yearLevel];
  const code = PROGRAM_CODE[program];
  if (!yr || !code) return [];
  return SECTIONS.map(s => `${yr}${code}-${s}`);
};

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const dark = useDarkMode();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Dark-aware class helpers
  const modalBg  = dark ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-100';
  const headerBg = dark ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-100';
  const footerBg = dark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-100';
  const inp = `w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${dark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-brand-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-brand-500'}`;
  const sel = `w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${dark ? 'bg-slate-800 border-slate-600 text-slate-100 focus:border-brand-400' : 'bg-white border-slate-300 text-slate-900 focus:border-brand-500'}`;
  const lbl = `block text-sm font-medium mb-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`;
  const boldText = dark ? 'text-slate-100' : 'text-slate-900';
  const sectionHead = `text-sm font-semibold uppercase tracking-wider mb-4 border-b pb-2 ${dark ? 'text-brand-400 border-slate-700' : 'text-brand-600 border-slate-200'}`;

  const [formData, setFormData] = useState({
    student_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    gender: 'Male',
    birth_date: '',
    place_of_birth: '',
    nationality: 'Filipino',
    civil_status: 'Single',
    religion: 'Roman Catholic',
    email: '',
    contact_number: '',
    city: '',
    year_level: '1st Year',
    section: '',
    student_type: 'Regular',
    enrollment_status: 'Enrolled',
    date_enrolled: new Date().toISOString().split('T')[0],
    program: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await api.students.create(formData);
      onStudentAdded();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create student. Please check all required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto admin-modal-scroll">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
        <div className={`relative transform overflow-hidden rounded-2xl text-left shadow-xl sm:my-8 w-full sm:max-w-4xl border ${modalBg}`}>

          {/* Header */}
          <div className={`px-6 py-5 border-b flex justify-between items-center ${headerBg}`}>
            <h3 className={`text-xl font-bold ${boldText}`}>Register New Student</h3>
            <button onClick={onClose} className={`transition-colors ${dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto max-h-[70vh] space-y-8 admin-modal-scroll">

            {error && (
              <div className={`border-l-4 border-red-500 p-4 rounded-lg text-sm ${dark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700'}`}>
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h4 className={sectionHead}>Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className={lbl}>Student Number * <span className={`text-xs normal-case font-normal ${dark ? 'text-slate-500' : 'text-slate-400'}`}>(e.g. 2201509)</span></label>
                  <input required type="text" name="student_number" value={formData.student_number} onChange={handleChange} placeholder="22XXXXX / 23XXXXX / 24XXXXX" className={inp} />
                </div>
                <div className="md:col-span-2">
                  <label className={lbl}>Birth Date * <span className={`text-xs normal-case font-normal ${dark ? 'text-slate-500' : 'text-slate-400'}`}>(used as temp password)</span></label>
                  <input required type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className={inp} />
                </div>
                <div className="md:col-span-1">
                  <label className={lbl}>First Name *</label>
                  <input required type="text" name="first_name" value={formData.first_name} onChange={handleChange} className={inp} />
                </div>
                <div className="md:col-span-1">
                  <label className={lbl}>Middle Name</label>
                  <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} className={inp} />
                </div>
                <div className="md:col-span-1">
                  <label className={lbl}>Last Name *</label>
                  <input required type="text" name="last_name" value={formData.last_name} onChange={handleChange} className={inp} />
                </div>
                <div className="md:col-span-1">
                  <label className={lbl}>Suffix</label>
                  <input type="text" name="suffix" value={formData.suffix} onChange={handleChange} placeholder="e.g. Jr" className={inp} />
                </div>
                <div className="md:col-span-1">
                  <label className={lbl}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={sel}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className={lbl}>Place of Birth *</label>
                  <input required type="text" name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} className={inp} />
                </div>
              </div>
            </div>

            {/* Contact & Address */}
            <div>
              <h4 className={sectionHead}>Contact & Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Email Address *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Primary Contact *</label>
                  <input required type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className={inp} />
                </div>
                <div>
                  <label className={lbl}>City *</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} className={inp} />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h4 className={sectionHead}>Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Course / Program *</label>
                  <select required name="program" value={formData.program} onChange={handleChange} className={sel}>
                    <option value="">Select Course / Program</option>
                    <option value="Information Technology">BSIT - Information Technology</option>
                    <option value="Computer Science">BSCS - Computer Science</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Year Level</label>
                  <select name="year_level" value={formData.year_level} onChange={handleChange} className={sel}>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Section</label>
                  <select name="section" value={formData.section} onChange={handleChange} className={sel}>
                    <option value="">Select Section</option>
                    {getSectionOptions(formData.program, formData.year_level).map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Student Type</label>
                  <select name="student_type" value={formData.student_type} onChange={handleChange} className={sel}>
                    <option>Regular</option><option>Irregular</option><option>Returnee</option>
                    <option>Shiftee</option><option>Transferee</option><option>Graduated</option>
                    <option>Dropped</option><option>LOA</option><option>Suspended</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Enrollment Status</label>
                  <select name="enrollment_status" value={formData.enrollment_status} onChange={handleChange} className={sel}>
                    <option>Enrolled</option>
                    <option>Not Enrolled</option>
                  </select>
                </div>
              </div>
            </div>

          </form>

          {/* Footer */}
          <div className={`px-6 py-4 flex flex-row-reverse gap-3 border-t ${footerBg}`}>
            <button type="button" onClick={handleSubmit} disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 transition-colors disabled:opacity-50 min-w-[140px]">
              {isSubmitting
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Register Student'}
            </button>
            <button type="button" onClick={onClose}
              className={`inline-flex justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm ring-1 transition-colors ${dark ? 'bg-slate-700 text-slate-200 ring-slate-600 hover:bg-slate-600' : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'}`}>
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
