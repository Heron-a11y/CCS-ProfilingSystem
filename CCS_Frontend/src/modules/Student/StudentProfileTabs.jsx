import React from 'react';

const StudentProfileTabs = ({ activeTab, student }) => {
  if (!student) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[500px]">
      
      {/* Student Header Summary */}
      <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-slate-100">
        <div className="w-20 h-20 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-2xl shrink-0">
          {student.first_name[0]}{student.last_name[0]}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {student.first_name} {student.middle_name ? student.middle_name + ' ' : ''}{student.last_name} {student.suffix || ''}
          </h2>
          <div className="flex space-x-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
              {student.id}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              {student.course?.course_code || 'N/A'} - {student.year_level}
            </span>
            <span className="flex items-center font-medium">
              <span className={`w-2 h-2 rounded-full mr-2 ${student.enrollment_status === 'Enrolled' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
              {student.enrollment_status}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Content Renderers */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Basic Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-slate-500 text-sm">Gender</span><span className="font-medium text-sm text-slate-800">{student.gender}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 text-sm">Birth Date</span><span className="font-medium text-sm text-slate-800">{student.birth_date}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 text-sm">Place of Birth</span><span className="font-medium text-sm text-slate-800">{student.place_of_birth}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 text-sm">Nationality</span><span className="font-medium text-sm text-slate-800">{student.nationality}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 text-sm">Civil Status</span><span className="font-medium text-sm text-slate-800">{student.civil_status}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 text-sm">Religion</span><span className="font-medium text-sm text-slate-800">{student.religion}</span></div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4 border-b pb-2">Contact Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-slate-500 text-sm">Email Address</span><span className="font-medium text-sm text-brand-600">{student.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 text-sm">Contact Number</span><span className="font-medium text-sm text-slate-800">{student.contact_number}</span></div>
              {student.alternate_contact_number && (
                <div className="flex justify-between"><span className="text-slate-500 text-sm">Alt. Number</span><span className="font-medium text-sm text-slate-800">{student.alternate_contact_number}</span></div>
              )}
            </div>
          </div>
          <div>
             <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Address</h3>
             <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-800"><span className="text-slate-500 block text-xs uppercase mb-1">Street</span> {student.street || 'N/A'}</p>
                <p className="text-sm text-slate-800"><span className="text-slate-500 block text-xs uppercase mb-1">Barangay</span> {student.barangay || 'N/A'}</p>
                <div className="grid grid-cols-2 gap-4">
                  <p className="text-sm text-slate-800"><span className="text-slate-500 block text-xs uppercase mb-1">City</span> {student.city}</p>
                  <p className="text-sm text-slate-800"><span className="text-slate-500 block text-xs uppercase mb-1">Province</span> {student.province || 'N/A'}</p>
                </div>
                <p className="text-sm text-slate-800"><span className="text-slate-500 block text-xs uppercase mb-1">Zip Code</span> {student.zip_code || 'N/A'}</p>
             </div>

             <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4 border-b pb-2">Guardians</h3>
             {student.guardians && student.guardians.length > 0 ? (
               <div className="space-y-4">
                 {student.guardians.map(g => (
                   <div key={g.id} className="bg-white border text-sm border-slate-200 p-3 rounded-lg shadow-sm">
                     <p className="font-bold text-slate-800">{g.full_name} <span className="font-normal text-xs text-slate-500">({g.relationship})</span></p>
                     <p className="text-slate-600 text-xs mt-1">{g.contact_number}</p>
                     <p className="text-slate-600 text-xs">{g.email}</p>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-sm text-slate-500 italic">No guardians recorded.</p>
             )}
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Academic History</h3>
          {student.academic_histories && student.academic_histories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500">
                    <th className="p-3 font-semibold rounded-tl-lg">School Year</th>
                    <th className="p-3 font-semibold">Semester</th>
                    <th className="p-3 font-semibold text-center">GPA</th>
                    <th className="p-3 font-semibold">Standing</th>
                    <th className="p-3 font-semibold text-right rounded-tr-lg">Completed/Total Units</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.academic_histories.map(ah => (
                    <tr key={ah.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-800">{ah.school_year}</td>
                      <td className="p-3 text-slate-800">{ah.semester}</td>
                      <td className="p-3 text-center font-bold text-brand-600">{ah.gpa}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${ah.academic_standing === 'Good Standing' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {ah.academic_standing}
                        </span>
                      </td>
                      <td className="p-3 text-right text-slate-600">{ah.completed_units} / {ah.total_units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No academic history recorded.</p>
          )}

          <h3 className="text-lg font-bold text-slate-800 mt-10 mb-4 border-b pb-2">Affiliations & Organizations</h3>
          {student.affiliations && student.affiliations.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.affiliations.map(aff => (
                   <div key={aff.id} className="border border-slate-200 p-4 rounded-xl flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 text-sm">{aff.organization_name}</h4>
                         <p className="text-xs text-slate-500 mb-1">{aff.position} • {aff.status}</p>
                         <p className="text-xs text-slate-400">Joined: {aff.date_joined} {aff.date_ended ? `- Ended: ${aff.date_ended}` : ''}</p>
                      </div>
                   </div>
                ))}
             </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No affiliations recorded.</p>
          )}
        </div>
      )}

      {activeTab === 'medical' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Medical Records</h3>
            {student.medical_histories && student.medical_histories.length > 0 ? (
              <div className="space-y-4">
                {student.medical_histories.map(mh => (
                  <div key={mh.id} className="bg-red-50/50 border border-red-100 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-red-100">
                      <span className="font-semibold text-slate-700 text-sm">Blood Type</span>
                      <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded text-sm">{mh.bloodtype || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Existing Conditions / Allergies</span>
                      <p className="text-sm text-slate-800">{mh.existing_conditions || 'None reported'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No medical history recorded.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Emergency Contacts</h3>
            {student.medical_histories && student.medical_histories.length > 0 ? (
               <div className="space-y-3">
                 {student.medical_histories.map(mh => (
                    <div key={mh.id} className="flex items-center space-x-4 bg-slate-50 p-4 rounded-lg">
                       <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                       </div>
                       <div>
                         <p className="font-bold text-sm text-slate-800">{mh.emergency_contact_name}</p>
                         <p className="text-sm text-brand-600 font-medium">{mh.emergency_contact_number}</p>
                       </div>
                    </div>
                 ))}
               </div>
            ) : (
               <p className="text-sm text-slate-500 italic">No emergency contacts recorded.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Skills & Certifications</h3>
          {student.skills && student.skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {student.skills.map(skill => (
                <div key={skill.id} className="border border-slate-200 p-4 rounded-xl">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-white bg-brand-500 px-2 py-0.5 rounded uppercase tracking-wider">{skill.skill_category}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{skill.skill_name}</h4>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{skill.description}</p>
                  
                  <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-600 border border-slate-200 px-2 py-1 rounded">Level: {skill.pivot?.skill_level || 'N/A'}</span>
                    {skill.pivot?.certification && (
                      <span className="text-xs text-green-600 flex items-center font-medium">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Certified
                      </span>
                    )}
                  </div>
                  {skill.pivot?.certification && (
                    <div className="mt-2 text-xs text-slate-500">
                       <p className="font-semibold">{skill.pivot.certification_name}</p>
                       <p>Date: {skill.pivot.certification_date}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No skills recorded.</p>
          )}
        </div>
      )}

      {activeTab === 'violations' && (
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Violations / Disciplinary Records</h3>
          {student.violations && student.violations.length > 0 ? (
            <div className="space-y-4">
              {student.violations.map(v => (
                <div key={v.id} className={`border p-4 rounded-xl ${v.severity_level === 'High' ? 'border-red-200 bg-red-50/30' : v.severity_level === 'Medium' ? 'border-yellow-200 bg-yellow-50/30' : 'border-slate-200'}`}>
                   <div className="flex justify-between items-start mb-2">
                      <div>
                         <h4 className="font-bold text-slate-800 text-sm">{v.violation_type}</h4>
                         <p className="text-xs text-slate-500 mt-1">Reported: {v.date_reported} by {v.reported_by}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${v.severity_level === 'High' ? 'bg-red-100 text-red-700' : v.severity_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
                         {v.severity_level}
                      </span>
                   </div>
                   <p className="text-sm text-slate-700 mt-3 mb-3">{v.description}</p>
                   
                   <div className="bg-white p-3 rounded border border-slate-100 text-sm">
                      <p className="font-semibold text-slate-800 text-xs uppercase mb-1">Action Taken</p>
                      <p className="text-slate-600 mb-2">{v.action_taken || 'Pending'}</p>
                      <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-50 pt-2">
                         <span>Status: <strong className={v.status === 'Resolved' ? 'text-green-600' : 'text-yellow-600'}>{v.status}</strong></span>
                         <span>Resolution Date: {v.resolution_date || 'N/A'}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-100 p-6 rounded-xl text-center">
               <svg className="w-12 h-12 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <h4 className="text-lg font-bold text-green-800 mb-1">Clean Record</h4>
               <p className="text-green-600 text-sm">This student has no recorded violations.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'events' && (
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Event Participation</h3>
          {student.events && student.events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.events.map(event => (
                <div key={event.id} className="border border-slate-200 p-4 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {event.eventType}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      event.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      event.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-slate-800 mb-1 leading-tight">{event.eventName}</h4>
                  
                  <div className="space-y-1 mt-3 mb-3 text-sm text-slate-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="truncate" title={event.location}>{event.location}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Role</span>
                    <span className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
                      {event.pivot?.role || 'Participant'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No event participation recorded.</p>
          )}
        </div>
      )}

    </div>
  );
};

export default StudentProfileTabs;
