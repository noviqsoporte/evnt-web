'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      onChange(data.secure_url);
    } catch {
      setError('Error al subir. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) uploadFile(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  if (uploading) {
    return (
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px dashed #2A2A2A',
          borderRadius: '6px',
          padding: '32px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            border: '2px solid #2A2A2A',
            borderTopColor: 'var(--color-accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }}
        />
        <div
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
          }}
        >
          Subiendo imagen...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (value) {
    return (
      <div>
        <div
          style={{
            backgroundColor: '#111111',
            borderRadius: '6px',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            padding: '12px',
          }}
        >
          <img
            src={value}
            alt="Preview"
            style={{ maxHeight: '200px', objectFit: 'contain', borderRadius: '4px' }}
          />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '13px',
            cursor: 'pointer',
            marginTop: '8px',
            padding: 0,
          }}
        >
          Cambiar foto
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          backgroundColor: '#111111',
          border: `1px dashed ${dragOver ? 'var(--color-accent)' : '#2A2A2A'}`,
          borderRadius: '6px',
          padding: '32px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '14px',
            color: 'var(--color-text-muted)',
            marginBottom: '4px',
          }}
        >
          Arrastra una foto aquí
        </div>
        <div
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}
        >
          o haz click para seleccionar
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {error && (
        <div
          style={{
            color: '#E05555',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '13px',
            marginTop: '8px',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
