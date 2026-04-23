import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users, ArrowRight, MessageCircle, Plus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AgendaScreen({ 
  voiceRequestedCalendarEvent 
}: { 
  voiceRequestedCalendarEvent?: { title?: string, startTimeIso?: string, endTimeIso?: string, attendees?: string } | null;
}) {
  const [events, setEvents] = useState([
    { id: '1', title: 'Legal Review: Horizon Contract', timeDisplay: '14:00', attendees: 'Claire Dubois' },
    { id: '2', title: 'Project Apollo Kickoff', timeDisplay: '15:00', attendees: 'Global Engineering Team' },
    { id: '3', title: 'Weekly Exec Board Standup', timeDisplay: '17:00', attendees: 'C-Suite' },
    { id: '4', title: 'Dinner w/ Angel Investors', timeDisplay: '19:00', attendees: 'Balthazar, SoHo' }
  ]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (voiceRequestedCalendarEvent && voiceRequestedCalendarEvent.title) {
      setSyncing(true);
      
      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: voiceRequestedCalendarEvent.title,
        timeDisplay: voiceRequestedCalendarEvent.startTimeIso 
          ? new Date(voiceRequestedCalendarEvent.startTimeIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : 'Pending Time',
        attendees: voiceRequestedCalendarEvent.attendees || 'No attendees specified',
        isNew: true
      };

      // Add to local state sequentially after 1.5s
      setTimeout(() => {
        setEvents(prev => {
          const newEvents = [...prev, newEvent];
          // sort implicitly happens naturally, but we'll just push to bottom for UI demo
          return newEvents;
        });

        // Trigger Google Calendar Sync if token exists
        const token = localStorage.getItem('google_access_token');
        if (token && voiceRequestedCalendarEvent.startTimeIso && voiceRequestedCalendarEvent.endTimeIso) {
          fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              summary: voiceRequestedCalendarEvent.title,
              start: { dateTime: voiceRequestedCalendarEvent.startTimeIso },
              end: { dateTime: voiceRequestedCalendarEvent.endTimeIso },
              attendees: voiceRequestedCalendarEvent.attendees ? voiceRequestedCalendarEvent.attendees.split(',').map(email => ({ email: email.trim() })) : []
            })
          }).then(res => res.json())
            .then(data => console.log('Synced to Google Calendar', data))
            .catch(err => console.error('Failed to sync to GC', err))
            .finally(() => setSyncing(false));
        } else {
          setSyncing(false);
        }
      }, 1500);
    }
  }, [voiceRequestedCalendarEvent]);

  return (
    <div className="flex flex-col h-full px-4 pt-4 gap-6 overflow-y-auto hide-scrollbar pb-20">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="font-serif text-2xl tracking-tight text-white/90">Agenda</h2>
        <div className="flex items-center gap-2">
          {syncing && <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Clock size={12} className="text-[#D4AF37]" /></motion.span>}
          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37]">Today, 15 Oct</span>
        </div>
      </div>

      {/* Up Next Card */}
      <div className="glass-panel-heavy rounded-3xl p-6 relative overflow-hidden border-[#D4AF37]/20 shrink-0">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CalendarIcon size={100} />
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-medium">Up Next</span>
        </div>
        
        <h3 className="font-serif text-2xl leading-tight mb-2">French Team Sync</h3>
        
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 text-white/60">
            <Clock size={12} />
            <span className="text-xs font-light tracking-wide">11:00 AM — 12:00 PM</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Users size={12} />
            <span className="text-xs font-light tracking-wide">Jean-Luc, Marie, Paul</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-white/50 leading-relaxed font-light mb-4">
            Beatrice notes: The primary objective is to review the Q3 projections. Jean-Luc expressed concerns about the marketing budget in yesterday's email.
          </p>
          <button className="w-full glass-panel py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border-white/5 text-[#D4AF37]">
            <MessageCircle size={14} />
            <span>"Prépare-moi pour cette réunion"</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 px-1 border-b border-white/10 pb-2 mb-1 shrink-0">
        <h3 className="text-[10px] uppercase tracking-widest text-white/40">Upcoming</h3>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-0 relative shrink-0">
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/10" />
        
        <AnimatePresence mode="popLayout">
          {events.map((evt, idx) => (
            <motion.div 
              key={evt.id}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: (evt as any).isNew ? 0 : idx * 0.1 }}
              className="flex items-start gap-4 relative py-3"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                (evt as any).isNew ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'glass-panel text-white/50 border-white/20'
              }`}>
                {(evt as any).isNew ? <CheckCircle2 size={12} /> : <span className="text-[9px]">{evt.timeDisplay.split(':')[0]}h</span>}
              </div>
              <div className={`flex-1 rounded-xl p-4 transition-colors ${
                (evt as any).isNew ? 'glass-panel-heavy border-[#D4AF37]/50 border' : 'glass-panel'
              }`}>
                <h4 className="text-sm font-medium mb-1">{evt.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-white/40 font-light truncate flex-1 pr-2">{evt.attendees}</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest shrink-0">{evt.timeDisplay}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
