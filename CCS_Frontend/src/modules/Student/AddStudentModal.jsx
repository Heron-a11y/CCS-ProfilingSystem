import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useDarkMode } from '../../context/DarkModeContext';

const YEAR_PREFIX = { '1st Year': '1', '2nd Year': '2', '3rd Year': '3', '4th Year': '4' };
const PROGRAM_CODE = { 'Information Technology': 'IT', 'Computer Science': 'CS' };
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];
const getSectionOptions = (program, yearLevel) => {
  const yr = YEAR_PREFIX[yearLevel]; const code = PROGRAM_CODE[program];
  if (!yr || !code) return [];
  return SECTIONS.map(s => `${yr}${code}-${s}`);
};

const emptyAffil    = () => ({ organization: '', role: '', year: '' });
const emptyActivity = () => ({ activity: '', description: '', year: '' });
const emptyAcadHist = () => ({ school: '', year: '', gpa: '' });
const emptyViolation= () => ({ offense: '', date: '', sanction: '' });

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const dark = useDarkMode();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]               = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);

  // Dark-aware helpers
  const modalBg     = dark ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-100';
  const headerBg    = dark ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-100';
  const footerBg    = dark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-100';
  const sectionCard = dark ? 'bg-slate-800/50 border-slate-700/60 rounded-2xl border p-5' : 'bg-white border-slate-200 rounded-2xl border p-5 shadow-sm';
  const inp = `w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${dark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-brand-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white'}`;
  const sel = `w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${dark ? 'bg-slate-800 border-slate-600 text-slate-100 focus:border-brand-400' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-brand-500 focus:bg-white'}`;
  const lbl = `block text-xs font-bold uppercase tracking-wider mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`;
  const boldText    = dark ? 'text-slate-100' : 'text-slate-900';
  const sectionHead = `text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2 ${dark ? 'text-brand-400 border-slate-700' : 'text-brand-500 border-brand-100'}`;
  const addRowBtn   = `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all mt-3 ${dark ? 'border-brand-500/40 text-brand-400 hover:bg-brand-500/10' : 'border-brand-300 text-brand-600 hover:bg-brand-50'}`;
  const delBtn      = `p-2 rounded-lg border transition-all ${dark ? 'border-slate-600 text-slate-400 hover:bg-red-900/20 hover:border-red-500/40 hover:text-red-400' : 'border-brand-200 text-brand-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500'}`;

  // ── Core fields ──
  const [form, setForm] = useState({
    student_number: '', first_name: '', last_name: '',
    email: '', contact_number: '', birth_date: '',
    gender: '', city: '',
    program: '', year_level: '1st Year', section: '',
    enrollment_status: 'Enrolled', student_type: 'Regular',
    date_enrolled: new Date().toISOString().split('T')[0],
    nationality: 'Filipino', civil_status: 'Single',
    gender_val: '',
  });

  // ── Dynamic sections ──
  const [skillsText,  setSkillsText]  = useState('');
  const [affiliations, setAffiliations] = useState([emptyAffil()]);
  const [activities,   setActivities]   = useState([emptyActivity()]);
  const [acadHistories,setAcadHistories]= useState([emptyAcadHist()]);
  const [violations,   setViolations]   = useState([emptyViolation()]);

  useEffect(() => {
    if (isOpen) api.skills.getAll().then(setAvailableSkills).catch(() => {});
  }, [isOpen]);

  const ch = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  // Row helpers
  const updRow = (setter, i, field, val) => setter(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const addRow = (setter, empty) => setter(prev => [...prev, empty()]);
  const delRow = (setter, i) => setter(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setError(null);
    try {
      // 1. Create student
      const student = await api.students.create({
        student_number:   form.student_number,
        first_name:       form.first_name,
        last_name:        form.last_name,
        middle_name:      '',
        email:            form.email,
        contact_number:   form.contact_number,
        birth_date:       form.birth_date,
        gender:           form.gender || 'Male',
        city:             form.city || 'N/A',
        place_of_birth:   form.city || 'N/A',
        nationality:      form.nationality,
        civil_status:     form.civil_status,
        program:          form.program,
        year_level:       form.year_level,
        section:          form.section,
        enrollment_status:form.enrollment_status,
        student_type:     form.student_type,
        date_enrolled:    form.date_enrolled,
      });

      const sid = student.id;

      // 2. Skills — match by name
      const skillNames = skillsText.split(',').map(s => s.trim()).filter(Boolean);
      if (skillNames.length > 0) {
        const matched = availableSkills.filter(s => skillNames.some(n => s.skill_name.toLowerCase() === n.toLowerCase()));
        if (matched.length > 0) {
          await api.students.syncSkills(sid, matched.map(s => ({ skill_id: s.id, skill_level: '', certification: false })));
        }
      }

      // 3. Affiliations
      for (const a of affiliations.filter(a => a.organization)) {
        await api.students.addAffiliation(sid, {
          organization_name: a.organization, position: a.role || 'Member',
          date_joined: a.year ? `${a.year}-01-01` : new Date().toISOString().split('T')[0],
          status: 'Active',
        });
      }

      // 4. Academic histories
      for (const h of acadHistories.filter(h => h.school || h.year)) {
        await api.students.addAcademicHistory(sid, {
          school_year: h.year || '', semester: '1st Semester',
          gpa: h.gpa || null, academic_standing: 'Good Standing',
          total_units: 0, completed_units: 0,
        });
      }

      // 5. Violations
      for (const v of violations.filter(v => v.offense)) {
        await api.students.addViolation(sid, {
          violation_type: v.offense, description: v.sanction || '',
          date_reported: v.date || new Date().toISOString().split('T')[0],
          reported_by: 'Administration',
          severity_level: 'Low', status: 'Pending',
        });
      }

      onStudentAdded(); onClose();
    } catch (err) {
      setError(err.message || 'Failed to create student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
        <div className={`relative transform overflow-hidden rounded-2xl text-left shadow-2xl sm:my-8 w-full sm:max-w-4xl border ${modalBg}`}>

          {/* Header */}
          <div className={`px-6 py-5 border-b flex justify-between items-center ${headerBg}`}>
            <h3 className={`text-xl font-bold ${boldText}`}>Register New Student</h3>
            <button onClick={onClose} className={`transition-colors ${dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto max-h-[72vh] space-y-5">

            {error && <div className={`border-l-4 border-red-500 p-4 rounded-lg text-sm ${dark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700'}`}>{error}</div>}

            {/* ── PERSONAL INFORMATION ── */}
            <div className={sectionCard}>
              <h4 className={sectionHead}>Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className={lbl}>Student ID *</label>
                  <input required name="student_number" value={form.student_number} onChange={ch} placeholder="e.g. 2201509" className={inp} /></div>
                <div><label className={lbl}>First Name *</label>
                  <input required name="first_name" value={form.first_name} onChange={ch} className={inp} /></div>
                <div><label className={lbl}>Last Name *</label>
                  <input required name="last_name" value={form.last_name} onChange={ch} className={inp} /></div>
                <div><label className={lbl}>Email *</label>
                  <input required type="email" name="email" value={form.email} onChange={ch} className={inp} /></div>
                <div><label className={lbl}>Phone</label>
                  <input name="contact_number" value={form.contact_number} onChange={ch} className={inp} /></div>
                <div><label className={lbl}>Date of Birth</label>
                  <input type="date" name="birth_date" value={form.birth_date} onChange={ch} className={inp} /></div>
                <div><label className={lbl}>Gender</label>
                  <select name="gender" value={form.gender} onChange={ch} className={sel}>
                    <option value="">Select...</option>
                    <option>Male</option><option>Female</option>
                  </select></div>
                <div><label className={lbl}>Address</label>
                  <input name="city" value={form.city} onChange={ch} placeholder="City / Address" className={inp} /></div>
              </div>
            </div>

            {/* ── ACADEMIC INFORMATION ── */}
            <div className={sectionCard}>
              <h4 className={sectionHead}>Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className={lbl}>Course *</label>
                  <select required name="program" value={form.program} onChange={ch} className={sel}>
                    <option value="">Select...</option>
                    <option value="Information Technology">BSIT - Information Technology</option>
                    <option value="Computer Science">BSCS - Computer Science</option>
                  </select></div>
                <div><label className={lbl}>Year Level *</label>
                  <select name="year_level" value={form.year_level} onChange={ch} className={sel}>
                    <option value="">Select...</option>
                    <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                  </select></div>
                <div><label className={lbl}>Section</label>
                  <select name="section" value={form.section} onChange={ch} className={sel}>
                    <option value="">Select Section</option>
                    {getSectionOptions(form.program, form.year_level).map(s => <option key={s}>{s}</option>)}
                  </select></div>
              </div>
            </div>

            {/* ── SKILLS ── */}
            <div className={sectionCard}>
              <h4 className={sectionHead}>Skills</h4>
              <input value={skillsText} onChange={e => setSkillsText(e.target.value)}
                placeholder="e.g. Programming, Basketball, Leadership"
                className={inp} />
              <p className={`text-xs mt-1.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Separate multiple skills with commas</p>
            </div>

            {/* ── AFFILIATIONS ── */}
            <div className={sectionCard}>
              <h4 className={sectionHead}>Affiliations</h4>
              {affiliations.map((a, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 mb-3 items-end">
                  <div><label className={lbl}>Organization</label>
                    <input value={a.organization} onChange={e => updRow(setAffiliations, i, 'organization', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Role</label>
                    <input value={a.role} onChange={e => updRow(setAffiliations, i, 'role', e.target.value)} className={inp} /></div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1"><label className={lbl}>Year</label>
                      <input value={a.year} onChange={e => updRow(setAffiliations, i, 'year', e.target.value)} placeholder="e.g. 2024" className={inp} /></div>
                    {affiliations.length > 1 && <button type="button" onClick={() => delRow(setAffiliations, i)} className={delBtn}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>}
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addRow(setAffiliations, emptyAffil)} className={addRowBtn}>+ Add Row</button>
            </div>

            {/* ── NON-ACADEMIC ACTIVITIES ── */}
            <div className={sectionCard}>
              <h4 className={sectionHead}>Non-Academic Activities</h4>
              {activities.map((a, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 mb-3 items-end">
                  <div><label className={lbl}>Activity</label>
                    <input value={a.activity} onChange={e => updRow(setActivities, i, 'activity', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Description</label>
                    <input value={a.description} onChange={e => updRow(setActivities, i, 'description', e.target.value)} className={inp} /></div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1"><label className={lbl}>Year</label>
                      <input value={a.year} onChange={e => updRow(setActivities, i, 'year', e.target.value)} placeholder="e.g. 2024" className={inp} /></div>
                    {activities.length > 1 && <button type="button" onClick={() => delRow(setActivities, i)} className={delBtn}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>}
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addRow(setActivities, emptyActivity)} className={addRowBtn}>+ Add Row</button>
            </div>

            {/* ── ACADEMIC HISTORY ── */}
            <div className={sectionCard}>
              <h4 className={sectionHead}>Academic History</h4>
              {acadHistories.map((h, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 mb-3 items-end">
                  <div><label className={lbl}>School</label>
                    <input value={h.school} onChange={e => updRow(setAcadHistories, i, 'school', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Year</label>
                    <input value={h.year} onChange={e => updRow(setAcadHistories, i, 'year', e.target.value)} placeholder="e.g. 2022-2023" className={inp} /></div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1"><label className={lbl}>GPA</label>
                      <input value={h.gpa} onChange={e => updRow(setAcadHistories, i, 'gpa', e.target.value)} placeholder="e.g. 1.50" className={inp} /></div>
                    {acadHistories.length > 1 && <button type="button" onClick={() => delRow(setAcadHistories, i)} className={delBtn}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>}
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addRow(setAcadHistories, emptyAcadHist)} className={addRowBtn}>+ Add Row</button>
            </div>

            {/* ── VIOLATIONS ── */}
            <div className={sectionCard}>
              <h4 className={sectionHead}>Violations</h4>
              {violations.map((v, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 mb-3 items-end">
                  <div><label className={lbl}>Offense</label>
                    <input value={v.offense} onChange={e => updRow(setViolations, i, 'offense', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Date</label>
                    <input type="date" value={v.date} onChange={e => updRow(setViolations, i, 'date', e.target.value)} className={inp} /></div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1"><label className={lbl}>Sanction</label>
                      <input value={v.sanction} onChange={e => updRow(setViolations, i, 'sanction', e.target.value)} className={inp} /></div>
                    {violations.length > 1 && <button type="button" onClick={() => delRow(setViolations, i)} className={delBtn}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>}
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addRow(setViolations, emptyViolation)} className={addRowBtn}>+ Add Row</button>
            </div>

          </form>

          {/* Footer */}
          <div className={`px-6 py-4 flex flex-row-reverse gap-3 border-t ${footerBg}`}>
            <button type="button" onClick={handleSubmit} disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 transition-colors disabled:opacity-50 min-w-[150px]">
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Register Student'}
            </button>
            <button type="button" onClick={onClose}
              className={`inline-flex justify-center rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm ring-1 transition-colors ${dark ? 'bg-slate-700 text-slate-200 ring-slate-600 hover:bg-slate-600' : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'}`}>
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
