'use client';
import { useState, useRef } from 'react';
import { updateMeetLink, addMaterial, deleteMaterial } from '@/app/actions';

export default function AdminClassesClient({ initialClassInfo, initialMaterials }: any) {
  const [meetLink, setMeetLink] = useState(initialClassInfo.meetLink);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveLink = async () => {
    const res = await updateMeetLink(meetLink);
    if (res.success) alert('Meet Link updated successfully!');
  };

  const handleAddUrlLink = async () => {
    const title = prompt('Enter the link title (e.g. YouTube Video):');
    if (!title) return;
    const url = prompt('Enter the full URL (http://...):');
    if (!url) return;
    
    await addMaterial(title, 'Link', url, '🔗');
    alert('Link added successfully!');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        // Determine type and icon
        let type = 'File';
        let icon = '📁';
        if (file.name.endsWith('.pdf')) { type = 'PDF Document'; icon = '📄'; }
        if (file.name.endsWith('.mp3')) { type = 'MP3 Audio'; icon = '🎧'; }
        
        await addMaterial(file.name, type, data.url, icon);
        alert('File uploaded and saved to database successfully!');
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      alert('Upload error occurred.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      await deleteMaterial(id);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Manage Classes & Materials</h1>
      
      {/* Edit Meet Link Section */}
      <section style={{ background: '#111827', padding: '24px', borderRadius: '12px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#ffc107' }}>Next Live Class Link</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={meetLink}
            onChange={(e) => setMeetLink(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: 'white' }}
          />
          <button onClick={handleSaveLink} style={{ padding: '10px 20px', background: '#00e676', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            Update Link
          </button>
        </div>
      </section>

      {/* Materials List Section */}
      <section style={{ background: '#111827', padding: '24px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', color: '#00e5ff' }}>Current Materials</h2>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* 1. Add URL Link Button */}
            <button onClick={handleAddUrlLink} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff', borderRadius: '8px', cursor: 'pointer' }}>
              + Add URL Link
            </button>
            
            {/* 2. Upload File Button */}
            <div style={{ position: 'relative' }}>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                disabled={isUploading}
              />
              <button style={{ padding: '8px 16px', background: '#00e5ff', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isUploading ? 'Uploading...' : '↑ Upload File'}
              </button>
            </div>
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {initialMaterials.map((mat: any) => (
            <li key={mat.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#1f2937', marginBottom: '10px', borderRadius: '8px' }}>
              <div>
                <strong>{mat.icon} {mat.title}</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#9ca3af' }}>{mat.type} • {mat.url}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleDelete(mat.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
              </div>
            </li>
          ))}
          {initialMaterials.length === 0 && (
            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No materials uploaded yet.</p>
          )}
        </ul>
      </section>
    </div>
  );
}
