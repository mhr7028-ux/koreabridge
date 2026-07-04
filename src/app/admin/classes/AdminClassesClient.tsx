'use client';
import { useState, useRef } from 'react';
import { updateClassInfo, addMaterial, deleteMaterial } from '@/app/actions';

export default function AdminClassesClient({ initialClassInfo, initialMaterials }: any) {
  const [classInfo, setClassInfo] = useState({
    date: initialClassInfo.date,
    time: initialClassInfo.time,
    topic: initialClassInfo.topic,
    teacher: initialClassInfo.teacher,
    meetLink: initialClassInfo.meetLink
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveInfo = async () => {
    const res = await updateClassInfo(classInfo);
    if (res.success) alert('클래스 정보가 성공적으로 업데이트되었습니다!');
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
      
      {/* Edit Class Info Section */}
      <section style={{ background: '#111827', padding: '24px', borderRadius: '12px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#ffc107' }}>다음 라이브 클래스 정보</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#9ca3af', marginBottom: '5px', fontSize: '14px' }}>날짜 (Date)</label>
              <input type="text" value={classInfo.date} onChange={(e) => setClassInfo({...classInfo, date: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#9ca3af', marginBottom: '5px', fontSize: '14px' }}>시간 (Time)</label>
              <input type="text" value={classInfo.time} onChange={(e) => setClassInfo({...classInfo, time: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: 'white' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', color: '#9ca3af', marginBottom: '5px', fontSize: '14px' }}>주제 (Topic)</label>
              <input type="text" value={classInfo.topic} onChange={(e) => setClassInfo({...classInfo, topic: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#9ca3af', marginBottom: '5px', fontSize: '14px' }}>선생님 (Teacher)</label>
              <input type="text" value={classInfo.teacher} onChange={(e) => setClassInfo({...classInfo, teacher: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: 'white' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '5px', fontSize: '14px' }}>구글 미트 링크 (Meet Link)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={classInfo.meetLink}
                onChange={(e) => setClassInfo({...classInfo, meetLink: e.target.value})}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: 'white' }}
              />
              <button onClick={handleSaveInfo} style={{ padding: '10px 20px', background: '#00e676', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                정보 저장하기
              </button>
            </div>
          </div>
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
