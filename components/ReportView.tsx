
import React from 'react';
import { DesignReport } from '../types';

interface SectionProps {
  title: string;
  content: string;
  index: number;
}

const ReportSection: React.FC<SectionProps> = ({ title, content, index }) => (
  <section className="bg-white p-6 border-l-4 border-slate-900 shadow-sm mb-6 academic-serif">
    <div className="flex items-start gap-4">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm border border-slate-200">
        {index}
      </span>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">{title}</h3>
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  </section>
);

const ReportView: React.FC<{ report: DesignReport }> = ({ report }) => {
  return (
    <div className="space-y-8 pb-12">
      <div className="bg-slate-900 text-white p-8 rounded-lg mb-10 text-center">
        <h2 className="text-3xl vtu-heading mb-2">Design Critique Report</h2>
        <p className="opacity-80 font-medium">Academic Standards Review for VTU Preparation Materials</p>
      </div>

      <ReportSection 
        index={1} 
        title="Overall Visual Tone" 
        content={report.visualTone} 
      />
      
      <ReportSection 
        index={2} 
        title="Color Usage" 
        content={report.colorUsage} 
      />
      
      <ReportSection 
        index={3} 
        title="Typography & Font Style" 
        content={report.typography} 
      />
      
      <ReportSection 
        index={4} 
        title="Boxes, Cards & Layout Structure" 
        content={report.layoutStructure} 
      />
      
      <ReportSection 
        index={5} 
        title="Icons, Emojis & Decorative Elements" 
        content={report.iconsAndEmojis} 
      />
      
      <ReportSection 
        index={6} 
        title="Memory Tricks Section Styling" 
        content={report.memoryTricks} 
      />
      
      <ReportSection 
        index={7} 
        title="Spacing, Margins & Print Readiness" 
        content={report.spacingAndMargins} 
      />

      <div className="mt-12 bg-amber-50 border-2 border-amber-200 p-8 rounded-lg academic-serif">
        <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Final Style Transformation Summary
        </h3>
        <div className="text-slate-800 leading-relaxed italic whitespace-pre-wrap border-l-4 border-amber-300 pl-4">
          {report.finalSummary}
        </div>
        <div className="mt-6 pt-6 border-t border-amber-200 text-sm text-amber-700 font-medium">
          Target Outcome: A document that feels like a trusted academic resource, encouraging focused revision without the distractions of modern AI-aesthetic tropes.
        </div>
      </div>
      
      <div className="flex justify-center mt-12">
        <button 
          onClick={() => window.print()}
          className="flex items-center px-8 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-md font-bold hover:bg-slate-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Print Design Guidelines
        </button>
      </div>
    </div>
  );
};

export default ReportView;
