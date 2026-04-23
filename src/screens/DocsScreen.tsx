import React, { useState } from 'react';
import { UploadCloud, File, Trash2, CheckCircle2, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_CONTENT: Record<number, string> = {
  1: "Q3 FINANCIAL PROJECTIONS SUMMARY:\n\n- Q3 Revenue targets exceeded by 14.5% ($4.2M surplus).\n- Primary growth vectors: Enterprise AI integrations (up 32% YoY) and automated legal auditing tools.\n- Operational costs stabilized following Q2 server migrations.\n- Forecast for Q4 adjusted strictly upwards; expected momentum into European markets.",
  2: "PARTNERSHIP AGREEMENT (DRAFT)\n\nThis Partnership Agreement is entered into by and between Horizon Tech and Eburon AI.\n\n1. TERM: The initial term shall be twenty-four (24) months.\n2. GOVERNANCE: A joint steering committee will be established, meeting quarterly.\n3. CONFIDENTIALITY: Both parties agree to mutual non-disclosure of proprietary algorithms.",
};

export default function DocsScreen({ 
  voiceRequestedDocPreview,
  voiceRequestedDocSearch
}: { 
  voiceRequestedDocPreview?: string | null;
  voiceRequestedDocSearch?: string | null;
}) {
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

  const [previewDocId, setPreviewDocId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle voice-driven document preview requests
  React.useEffect(() => {
    if (voiceRequestedDocPreview) {
      const match = docs.find(d => d.name.toLowerCase().includes(voiceRequestedDocPreview.toLowerCase()));
      if (match) {
        setPreviewDocId(match.id);
      }
    }
  }, [voiceRequestedDocPreview, docs]);

  // Handle voice-driven document searches
  React.useEffect(() => {
    if (voiceRequestedDocSearch !== null && voiceRequestedDocSearch !== undefined) {
      setSearchQuery(voiceRequestedDocSearch);
      
      // If we are opening a search result, let's close the preview overlay if open to reveal the list
      setPreviewDocId(null);
    }
  }, [voiceRequestedDocSearch]);

  const getPreviewText = (id: number, name: string) => {
    return MOCK_CONTENT[id] || `[System Extract]\n\nDocument: ${name}\nStatus: Actively monitored by Beatrice.\n\nExtracting primary context variables... The full unstructured matrix is stored in the cold layer. Please ask Beatrice specific questions about this document's contents.`;
  };

  const previewDoc = docs.find(d => d.id === previewDocId);
  
  const filteredDocs = docs.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full px-4 pt-4 gap-6 relative">
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
        <div className="flex items-center justify-between px-1 border-b border-white/10 pb-2 mb-1">
          <h3 className="text-[10px] uppercase tracking-widest text-white/40">Indexed Knowledge</h3>
        </div>
        
        {/* Search Bar */}
        <div className="relative shrink-0 mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search documents by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-8 text-sm font-medium text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        {filteredDocs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-xs text-white/40 text-center py-8 border border-dashed border-white/10 rounded-2xl"
          >
            No documents match your search.
          </motion.div>
        ) : (
          filteredDocs.map(doc => (
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
              <button 
                onClick={() => setPreviewDocId(doc.id)}
                className="flex-1 glass-panel-heavy py-2 rounded-lg text-[10px] uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 border border-white/5"
              >
                <Search size={12} className="text-[#D4AF37]" />
                <span className="text-[#D4AF37]">Preview / Analyze</span>
              </button>
            </div>
          </div>
        )))}
      </div>

      {/* Document Preview Overlay */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 top-0 z-40 bg-[#0A0A0B] p-4 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37] shrink-0">
                  <File size={16} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h3 className="text-sm font-medium text-white/90 truncate">{previewDoc.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37]">Active Memory</span>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDocId(null)}
                className="p-2 glass-panel-heavy rounded-full text-white/50 hover:text-white transition-colors shrink-0 border border-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 glass-panel rounded-2xl p-6 overflow-y-auto hide-scrollbar border border-white/10 relative">
              <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-[0.03]">
                <File size={120} />
              </div>
              <pre className="text-xs text-white/80 font-mono whitespace-pre-wrap leading-relaxed relative z-10">
                {getPreviewText(previewDoc.id, previewDoc.name)}
              </pre>
            </div>
            
            <button 
              className="mt-4 w-full py-3 rounded-xl bg-[#D4AF37] text-black text-xs uppercase tracking-wider font-bold hover:bg-[#D4AF37]/90 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)] shrink-0"
              onClick={() => setPreviewDocId(null)}
            >
              Close Context
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
