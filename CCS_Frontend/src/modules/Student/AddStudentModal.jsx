import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
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
    alternate_contact_number: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zip_code: '',
    year_level: '1st Year',
    section: '',
    student_type: 'Regular',
    enrollment_status: 'Enrolled',
    date_enrolled: new Date().toISOString().split('T')[0],
    department_id: '',
    course_id: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    try {
      const [deptData, courseData] = await Promise.all([
        api.departments.getAll(),
        api.courses.getAll()
      ]);
      setDepartments(deptData);
      setCourses(courseData);
      
      // Set defaults if available
      if (deptData.length > 0 && !formData.department_id) {
        setFormData(prev => ({ ...prev, department_id: deptData[0].id }));
      }
      if (courseData.length > 0 && !formData.course_id) {
        setFormData(prev => ({ ...prev, course_id: courseData[0].id }));
      }
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
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
      await api.students.create(formData);
      onStudentAdded(); 
      onClose(); // Close modal on success
      
      // Reset form
      setFormData({...formData, first_name: '', last_name: '', email: ''}); 
    } catch (err) {
      setError(err.message || 'Failed to create student. Please check all required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-slate-100">
          
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold leading-6 text-slate-900">
                Register New Student
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 overflow-y-auto max-h-[70vh]">
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h4 className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4 border-b pb-2">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                    <input required type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Middle Name</label>
                    <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                    <input required type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Suffix (e.g. Jr)</label>
                    <input type="text" name="suffix" value={formData.suffix} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                  
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Birth Date *</label>
                    <input required type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Place of Birth *</label>
                    <input required type="text" name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4 border-b pb-2">Contact & Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Primary Contact *</label>
                    <input required type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h4 className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4 border-b pb-2">Academic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
                    <select required name="department_id" value={formData.department_id} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white">
                      <option value="">Select Department</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.department_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Course *</label>
                    <select required name="course_id" value={formData.course_id} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white">
                      <option value="">Select Course</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Year Level</label>
                    <select name="year_level" value={formData.year_level} onChange={handleChange} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white">
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-8 -mx-6 -mb-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full justify-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 sm:ml-3 sm:w-auto transition-colors disabled:opacity-50 relative"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Register Student'
                )}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
