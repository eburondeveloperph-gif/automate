import React, { useState } from 'react';
import { UploadCloud, File, Trash2, CheckCircle2, Search } from 'lucide-react';

export default function DocsScreen() {
  const [docs] = useState([
    { id: 1, name: 'Q3_Financial_Projections.pdf', status: 'indexed', type: 'PDF' },
    { id: 2, name: 'Partnership_Agreement_Draft.docx', status: 'indexed', type: 'DOCX' },
    { id: 3, name: 'Employee_Handbook_2026.pdf', status: 'cross-referencing', type: 'PDF' },
    { id: 4, name: 'Vendor_NDA_Archived.txt', status: 'indexed', type: 'TXT' },
    { id: 5, name: 'Q4_Marketing_Strategy.docx', status: 'processing', type: 'DOCX' },
    { id: 6, name: 'Paris_Office_Lease.pdf', status: 'indexed', type: 'PDF' },
    { id: 7, name: 'Cybersecurity_Audit.pdf', status: 'indexed', type: 'PDF' },
    { id: 8, name: 'Global_Compliance_Guidelines.docx', status: 'indexed', type: 'DOCX' },
    { id: 9, name: 'Q1_Executive_Summary.pdf', status: 'indexed', type: 'PDF' },
    { id: 10, name: 'Investor_Update_Deck.pdf', status: 'cross-referencing', type: 'PDF' },
  ]);

  return (
    <div className="flex flex-col h-full px-4 pt-4 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl tracking-tight text-white/90">Intelligence</h2>
        <span className="text-[10px] uppercase tracking-wider text-white/40">{docs.length} Docs Active</span>
      </div>

      <div className="glass-panel border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:bg-white/[0.08] transition-colors shrink-0">
        <div className="w-12 h-12 rounded-full glass-panel-heavy flex items-center justify-center relative">
          <UploadCloud size={20} className="text-[#D4AF37]" />
        </div>
        <div>
          <p className="text-sm font-medium text-white/90">Upload Document</p>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">PDF, DOCX, TXT max 50mb</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2 shrink-0">
        <h3 className="text-[10px] uppercase tracking-widest text-white/40 px-1 border-b border-white/10 pb-2">Indexed Knowledge</h3>
        
        {docs.map(doc => (
          <div key={doc.id} className="glass-panel rounded-xl p-4 flex flex-col gap-3 group relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="p-2 glass-panel-heavy rounded-lg text-white/70">
                <File size={16} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate text-white/80 group-hover:text-white transition-colors">{doc.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 size={10} className={`text-emerald-400 ${doc.status !== 'indexed' && 'opacity-50 animate-pulse'}`} />
                  <span className={`text-[9px] uppercase tracking-wider ${doc.status !== 'indexed' ? 'text-amber-400' : 'text-emerald-400/80'}`}>{doc.status}</span>
                  <span className="text-[9px] uppercase tracking-wider text-white/30">• {doc.type}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 glass-panel-heavy py-2 rounded-lg text-[10px] uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 border border-white/5">
                <Search size={12} className="text-[#D4AF37]" />
                <span className="text-[#D4AF37]">Analyze Concept</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
