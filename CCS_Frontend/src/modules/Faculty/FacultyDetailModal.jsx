import { useDarkMode } from '../../context/DarkModeContext';

const FacultyDetailModal = ({ isOpen, onClose, faculty, onEditClick, onDeleteClick }) => {
  const dark = useDarkMode();

  if (!isOpen || !faculty) return null;

  const modalBg  = dark ? 'bg-slate-900 border-slate-700/60'  : 'bg-white border-slate-100';
  const headerBg = dark ? 'bg-slate-900 border-slate-700/60'  : 'bg-white border-slate-100';
  const footerBg = dark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-100';
  const titleClr = dark ? 'text-slate-100' : 'text-slate-900';
  const boldText = dark ? 'text-slate-100' : 'text-slate-800';
  const subText  = dark ? 'text-slate-400' : 'text-slate-500';
  const divider  = dark ? 'border-slate-700/60' : 'border-slate-100';
  const closeBtn = dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-500';
  const editBtn  = dark ? 'text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-slate-100' : 'text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900';
  const delBtn   = dark ? 'text-red-400 bg-red-900/30 hover:bg-red-900/50 hover:text-red-300' : 'text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700';
  const sectionHead = dark ? 'text-brand-400 border-brand-800/50' : 'text-brand-600 border-brand-100';
  const closeFootBtn = dark
    ? 'bg-slate-700 text-slate-200 ring-slate-600 hover:bg-slate-600'
    : 'bg-white text-slate-900 ring-slate-300 hover:bg-slate-50';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className={`relative transform overflow-hidden rounded-2xl text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border ${modalBg}`}>

          {/* Header bar */}
          <div className={`px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b ${headerBg}`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-xl font-bold leading-6 ${titleClr}`}>Faculty Details</h3>
              <button onClick={onClose} className={`transition-colors ${closeBtn}`}>
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 overflow-y-auto max-h-[70vh]">

            {/* Faculty identity + action buttons */}
            <div className={`flex justify-between items-start mb-8 pb-6 border-b ${divider}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shrink-0 ${dark ? 'bg-brand-900/50 text-brand-300' : 'bg-brand-100 text-brand-600'}`}>
                  {faculty.first_name[0]}{faculty.last_name[0]}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${boldText}`}>
                    {faculty.first_name} {faculty.middle_name ? faculty.middle_name[0] + '. ' : ''}{faculty.last_name}
                  </h2>
                  <p className={`font-medium ${dark ? 'text-brand-400' : 'text-brand-600'}`}>{faculty.position}</p>
                  <p className={`text-sm ${subText}`}>{faculty.department?.department_name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => onEditClick(faculty)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center ${editBtn}`}>
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button onClick={() => onDeleteClick(faculty.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center ${delBtn}`}>
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Contact Information */}
              <div>
                <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 border-b pb-2 ${sectionHead}`}>
                  Contact Information
                </h4>
                <div className="space-y-4">
                  {[
                    ['Email Address', faculty.email],
                    ['Contact Number', faculty.contact_number],
                    ['Office Location', faculty.office_location || 'N/A'],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className={`text-xs uppercase font-semibold ${subText}`}>{label}</p>
                      <p className={`font-medium ${boldText}`}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employment Details */}
              <div>
                <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 border-b pb-2 ${sectionHead}`}>
                  Employment Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className={`text-xs uppercase font-semibold ${subText}`}>Employment Status</p>
                    <p className="font-medium mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        faculty.employment_status === 'Full-Time'
                          ? (dark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700')
                          : (dark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700')
                      }`}>
                        {faculty.employment_status}
                      </span>
                    </p>
                  </div>
                  {[
                    ['Date Hired', faculty.hire_date ? new Date(faculty.hire_date).toLocaleDateString() : 'N/A'],
                    ['Faculty ID', faculty.id],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className={`text-xs uppercase font-semibold ${subText}`}>{label}</p>
                      <p className={`font-medium ${boldText}`}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className={`px-6 py-3 sm:flex sm:flex-row-reverse border-t ${footerBg}`}>
            <button
              type="button"
              className={`inline-flex w-full justify-center rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto transition-colors ${closeFootBtn}`}
              onClick={onClose}
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FacultyDetailModal;
