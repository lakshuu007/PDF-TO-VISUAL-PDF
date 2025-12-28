
import React, { useState } from 'react';
import { redesignDocument } from './geminiService';
import { RedesignData, FileData } from './types';
import RedesignPreview from './components/RedesignPreview';

// Added Window augmentation to inform TypeScript about the html2pdf global library
declare global {
  interface Window {
    html2pdf: any;
  }
}

const App: React.FC = () => {
  const [file, setFile] = useState<FileData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [redesign, setRedesign] = useState<RedesignData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFile({
          base64: base64String,
          mimeType: selectedFile.type,
          name: selectedFile.name,
        });
        setError(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const startRedesign = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await redesignDocument(file);
      setRedesign(result);
    } catch (err: any) {
      console.error(err);
      setError("Document redesign failed. Please ensure the upload is a clear academic document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!redesign) return;
    setIsDownloading(true);
    
    // Short delay to ensure final layout settles
    await new Promise(r => setTimeout(r, 500));

    const element = document.getElementById('pdf-content');
    if (!element) {
      setIsDownloading(false);
      return;
    }

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${redesign.documentTitle.replace(/\s+/g, '_')}_NammaVtuBros.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 3, 
        useCORS: true,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // Accessing html2pdf on window now works with the interface augmentation above
      await window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF Export Failure:", err);
      setError("Direct download failed. Use 'Ctrl + P' as a backup.");
    } finally {
      setIsDownloading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setRedesign(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-6">
      <div className="max-w-4xl w-full text-center mb-16 no-print">
        <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-4 uppercase">
          Namma Vtu Bros
        </h1>
        <p className="text-slate-500 font-bold tracking-widest text-sm uppercase">
          Structural Redesign & Examination Optimization
        </p>
      </div>

      <main className="max-w-4xl w-full">
        {!redesign && !isProcessing && (
          <div className="bg-white p-16 rounded-[2rem] border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] no-print">
            <div className="flex flex-col items-center justify-center space-y-12">
              <label className="flex flex-col items-center justify-center w-full h-80 border-4 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 transition-all group">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                     <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
                    {file ? file.name : "LOAD SOURCE FILE"}
                  </p>
                  <p className="text-slate-400 font-bold text-[10px] tracking-[0.3em] uppercase">PDF • PNG • JPG • VERBATIM EXTRACTION</p>
                </div>
                <input type="file" className="hidden" accept="application/pdf,image/*" onChange={handleFileChange} />
              </label>

              {file && (
                <button
                  onClick={startRedesign}
                  className="w-full py-6 px-12 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-[6px_6px_0px_0px_rgba(51,65,85,1)] flex items-center justify-center gap-4 text-2xl uppercase tracking-tighter"
                >
                  START REDESIGN
                </button>
              )}

              {error && (
                <div className="w-full p-6 bg-red-50 border-4 border-red-900 text-red-900 font-black rounded-2xl text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="flex flex-col items-center justify-center space-y-12 py-40 no-print">
            <div className="w-32 h-32 border-[12px] border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Redesigning Structure...</h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs">Transforming data into academic excellence</p>
            </div>
          </div>
        )}

        {redesign && (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-center no-print p-8 bg-white rounded-2xl shadow-xl border-2 border-slate-100">
              <button onClick={reset} className="font-black text-slate-400 hover:text-slate-900 tracking-[0.2em] text-[10px] uppercase">
                ← RESET PROJECT
              </button>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => window.print()}
                  className="bg-white text-slate-900 px-8 py-3 rounded-xl font-black hover:bg-slate-50 border-4 border-slate-900 text-sm uppercase tracking-tighter"
                >
                  PRINT PREVIEW
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black hover:bg-black transition-all shadow-xl disabled:opacity-50 text-sm uppercase tracking-tighter"
                >
                  {isDownloading ? "BUILDING PDF..." : "DOWNLOAD FINAL FILE"}
                </button>
              </div>
            </div>
            
            <RedesignPreview data={redesign} />
          </div>
        )}
      </main>

      <footer className="mt-32 border-t-4 border-slate-200 pt-10 w-full max-w-4xl text-center text-slate-300 text-[10px] tracking-[0.5em] uppercase font-black no-print">
        Namma Vtu Bros • 2024
      </footer>
    </div>
  );
};

export default App;
