import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export const Dropzone = ({ onFileUpload, label = "Upload Vendor Quotation PDF or Excel", accept = ".pdf,.xlsx,.csv" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(0); // 0: idle, 1: extracting, 2: AI parsing, 3: completed

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    setUploading(true);
    setStep(1);

    // Simulate AI parsing pipeline step sequence
    setTimeout(() => {
      setStep(2);
      setTimeout(() => {
        setStep(3);
        setUploading(false);
        if (onFileUpload) {
          onFileUpload(selectedFile);
        }
      }, 1200);
    }, 1200);
  };

  return (
    <div style={{ width: '100%' }}>
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed #6366F1' : '2px dashed var(--border-color)',
          background: dragActive ? 'rgba(99, 102, 241, 0.1)' : 'rgba(15, 23, 42, 0.6)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <input 
          type="file" 
          accept={accept} 
          onChange={handleChange} 
          style={{ display: 'none' }} 
          id="file-dropzone-input"
        />

        <label htmlFor="file-dropzone-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.85rem'
          }}>
            <Upload size={24} color="#818CF8" />
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '0.2rem' }}>
            {label}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Drag and drop your file here, or <span style={{ color: '#818CF8', fontWeight: 600 }}>browse file</span>
          </p>
        </label>
      </div>

      {/* Upload & AI Extraction Progress Bar */}
      {file && (
        <div className="glass-panel" style={{ padding: '1rem', marginTop: '1rem', background: 'rgba(15, 23, 42, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FileText size={20} color="#818CF8" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFF' }}>{file.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{(file.size / 1024).toFixed(1)} KB</div>
            </div>
            {step === 3 && <span className="badge badge-emerald"><CheckCircle2 size={12} /> AI Extraction Complete</span>}
          </div>

          {uploading && (
            <div>
              <div style={{
                height: '6px',
                background: 'rgba(30, 41, 59, 0.8)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  height: '100%',
                  width: step === 1 ? '35%' : step === 2 ? '75%' : '100%',
                  background: 'linear-gradient(90deg, #6366F1 0%, #10B981 100%)',
                  transition: 'width 0.4s ease'
                }}></div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#818CF8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} />
                {step === 1 && "Extracting raw text & line items from PDF..."}
                {step === 2 && "Running OpenAI commercial risk & payment terms evaluation..."}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
