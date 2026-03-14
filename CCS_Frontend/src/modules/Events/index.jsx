import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import AddEventModal from './AddEventModal';
import EditEventModal from './EditEventModal';
import { useDarkMode } from '../../context/DarkModeContext';

const EventsModule = () => {
  const dark = useDarkMode();
  const card      = dark ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-100';
  const boldText  = dark ? 'text-slate-100' : 'text-slate-800';
  const subText   = dark ? 'text-slate-400' : 'text-slate-500';
  const tableBar  = dark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50/50 border-slate-100';
  const evCard    = dark ? 'bg-slate-800 border-slate-700/60' : 'bg-white border-slate-200';
  const infoBox   = dark ? 'bg-slate-700/50 border-slate-600 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600';
  const footerBdr = dark ? 'border-slate-700' : 'border-slate-100';
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await api.events.getAll();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load events.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.events.delete(id);
        fetchEvents();
      } catch (err) {
        alert(err.message || 'Failed to delete event');
      }
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status) => {
    if (dark) {
      const c = { 'Upcoming':'bg-blue-500/15 text-blue-400','Ongoing':'bg-brand-500/15 text-brand-400','Completed':'bg-green-500/15 text-green-400','Cancelled':'bg-red-500/15 text-red-400' };
      return c[status] || 'bg-slate-700 text-slate-300';
    }
    const c = { 'Upcoming':'bg-blue-100 text-blue-700','Ongoing':'bg-brand-100 text-brand-700','Completed':'bg-green-100 text-green-700','Cancelled':'bg-red-100 text-red-700' };
    return c[status] || 'bg-slate-100 text-slate-700';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Academic': return 'bg-indigo-50 text-indigo-500';
      case 'Sports': return 'bg-orange-50 text-orange-500';
      case 'Cultural': return 'bg-purple-50 text-purple-500';
      case 'CommunityService': return 'bg-teal-50 text-teal-500';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-2xl p-6 shadow-sm border flex items-center transition-colors duration-300 ${card}`}>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 ${dark ? 'bg-brand-900/40 text-brand-400' : 'bg-brand-50 text-brand-600'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p className={`text-sm font-medium ${subText}`}>Total Events Hosted</p>
            <h3 className={`text-3xl font-bold ${boldText}`}>{events.length}</h3>
          </div>
        </div>

        <div className={`rounded-2xl p-6 shadow-sm border flex items-center transition-colors duration-300 ${card}`}>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 ${dark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
          </div>
          <div>
            <p className={`text-sm font-medium ${subText}`}>Upcoming Activities</p>
            <h3 className={`text-3xl font-bold ${boldText}`}>{events.filter(e => e.status === 'Upcoming').length}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`rounded-2xl shadow-sm border overflow-hidden flex flex-col h-[calc(100vh-280px)] transition-colors duration-300 ${card}`}>
        <div className={`p-6 border-b flex justify-between items-center transition-colors duration-300 ${tableBar}`}>
          <div>
            <h2 className={`text-xl font-bold ${boldText}`}>Events Dashboard</h2>
            <p className={`text-sm mt-1 ${subText}`}>Track departmental activities and student participation.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-brand-500/30 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Event
          </button>
        </div>

        {error && (
          <div className="m-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <div className={`flex-1 overflow-y-auto p-6 ${dark ? 'bg-slate-950/30' : 'bg-slate-50/30'}`}>
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-slate-700 border-t-brand-500 rounded-full animate-spin"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className={`border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group relative ${evCard}`}>
                  
                  {/* Status Badge */}
                  <div className="absolute top-5 right-5">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>

                  <div className="flex items-start mb-4 pr-20">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 ${getTypeIcon(event.eventType)}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg leading-tight mb-1 group-hover:text-brand-500 transition-colors ${boldText}`}>{event.eventName}</h3>
                      <p className={`text-xs font-medium uppercase tracking-wider ${subText}`}>{event.eventType}</p>
                    </div>
                  </div>
                  <p className={`text-sm mb-5 line-clamp-2 min-h-[40px] ${subText}`}>{event.description || 'No description provided.'}</p>
                  <div className={`space-y-3 p-4 rounded-xl border ${infoBox}`}>
                    <div className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium truncate" title={event.location}>{event.location}</span>
                    </div>
                  </div>
                  
                  <div className={`mt-4 pt-4 border-t flex justify-between items-center ${footerBdr}`}>
                    <button className="text-sm font-semibold text-brand-500 hover:text-brand-400 flex items-center">
                      View Attendees <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="flex space-x-1">
                      <button onClick={() => openEditModal(event)} className={`p-1.5 rounded-md transition-colors hover:bg-brand-500/10 ${dark ? 'text-slate-400 hover:text-brand-400' : 'text-slate-400 hover:text-brand-600'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDeleteEvent(event.id)} className={`p-1.5 rounded-md transition-colors hover:bg-red-500/10 ${dark ? 'text-slate-400 hover:text-red-400' : 'text-slate-400 hover:text-red-600'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
              <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <p className="text-lg font-medium">No events logged</p>
              <p className="text-sm">Click "Add Event" to schedule an activity.</p>
            </div>
          )}
        </div>
      </div>

      <AddEventModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchEvents} 
      />

      {isEditModalOpen && selectedEvent && (
        <EditEventModal
          isOpen={isEditModalOpen}
          initialData={selectedEvent}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEvent(null);
          }}
          onSuccess={fetchEvents}
        />
      )}
    </div>
  );
};

export default EventsModule;
