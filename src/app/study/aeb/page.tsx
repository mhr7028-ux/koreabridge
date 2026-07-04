'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './AebStudy.module.css';
import AiEvaluationComponent from './AiEvaluationComponent';

interface StudyMethod {
  id: string;
  title: string;
  content: string;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  audioUrl?: string | null;
  pptUrl?: string | null;
  createdAt: string;
}

export default function AebStudyPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';

  const [methods, setMethods] = useState<StudyMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [pptUrl, setPptUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingState, setUploadingState] = useState({ pdf: false, audio: false, ppt: false });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'audio' | 'ppt') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingState(prev => ({ ...prev, [type]: true }));
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (type === 'pdf') setPdfUrl(data.url);
        if (type === 'audio') setAudioUrl(data.url);
        if (type === 'ppt') setPptUrl(data.url);
      } else {
        alert('파일 업로드에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setUploadingState(prev => ({ ...prev, [type]: false }));
    }
  };

  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text
      .replace(/</g, '&lt;') // Prevent XSS
      .replace(/>/g, '&gt;')
      .replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline;">${url}</a>`)
      .replace(/\n/g, '<br/>');
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const res = await fetch('/api/study-methods');
      if (res.ok) {
        const data = await res.json();
        setMethods(data);
      }
    } catch (error) {
      console.error('Failed to fetch methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert('제목과 내용을 모두 입력해주세요.');
    setIsSubmitting(true);
    try {
      const url = '/api/study-methods';
      const method = editingId ? 'PUT' : 'POST';
      const body = JSON.stringify({ id: editingId, title, content, videoUrl, pdfUrl, audioUrl, pptUrl });

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (res.ok) {
        alert(editingId ? '학습 자료가 수정되었습니다.' : '학습 자료가 등록되었습니다.');
        setEditingId(null);
        setTitle('');
        setContent('');
        setVideoUrl('');
        setPdfUrl('');
        setAudioUrl('');
        setPptUrl('');
        fetchMethods(); // Refresh the list
      } else {
        alert('등록에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 학습 자료를 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/study-methods?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchMethods();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleEdit = (method: StudyMethod) => {
    setEditingId(method.id);
    setTitle(method.title);
    setContent(method.content);
    setVideoUrl(method.videoUrl || '');
    setPdfUrl(method.pdfUrl || '');
    setAudioUrl(method.audioUrl || '');
    setPptUrl(method.pptUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper function to convert YouTube link to embed link
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        return url.replace('watch?v=', 'embed/');
      } else if (url.includes('youtu.be/')) {
        return url.replace('youtu.be/', 'youtube.com/embed/');
      }
      return url; // Return as-is if it's already an embed link or not youtube
    } catch {
      return url;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="gradient-text">AEB 학습 가이드</h1>
        <p className={styles.subtitle}>
          이곳에서 KoreaBridge가 제공하는 최고의 학습 방법(AEB)을 숙지하고 따라와 주세요.
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <AiEvaluationComponent />
      </div>

      {isAdmin && (
        <div className={styles.adminSection}>
          <div className={styles.adminHeader}>
            <span>🛡️</span>
            <h3>관리자 전용: 학습 자료 {editingId ? '수정' : '등록'}</h3>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setTitle(''); setContent(''); setVideoUrl(''); setPdfUrl(''); setAudioUrl(''); setPptUrl('');
                }}
                style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: '100px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                취소
              </button>
            )}
          </div>
          <form className={styles.adminForm} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="자료 제목 (예: 기초 발성법 1강)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="url"
              placeholder="유튜브 영상 링크 (선택사항)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className={styles.input}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.9rem', color: '#a0aec0' }}>PDF 파일 첨부 {uploadingState.pdf && '(업로드 중...)'}</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e, 'pdf')}
                className={styles.input}
              />
              {pdfUrl && <span style={{ fontSize: '0.8rem', color: '#4ade80' }}>✓ PDF 업로드 완료</span>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.9rem', color: '#a0aec0' }}>음성 파일 첨부 {uploadingState.audio && '(업로드 중...)'}</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileUpload(e, 'audio')}
                className={styles.input}
              />
              {audioUrl && <span style={{ fontSize: '0.8rem', color: '#4ade80' }}>✓ 음성 파일 업로드 완료</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.9rem', color: '#a0aec0' }}>PPT 파일 첨부 {uploadingState.ppt && '(업로드 중...)'}</label>
              <input
                type="file"
                accept=".ppt,.pptx"
                onChange={(e) => handleFileUpload(e, 'ppt')}
                className={styles.input}
              />
              {pptUrl && <span style={{ fontSize: '0.8rem', color: '#4ade80' }}>✓ PPT 업로드 완료</span>}
            </div>
            <textarea
              placeholder="학습 방법 및 설명 내용..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
              required
              rows={5}
            />
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? '처리 중...' : editingId ? '학습 자료 수정하기' : '학습 자료 등록하기'}
            </button>
          </form>
        </div>
      )}

      <div className={styles.list}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#a0aec0', padding: '40px' }}>불러오는 중...</p>
        ) : methods.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#a0aec0', padding: '40px' }}>등록된 학습 자료가 없습니다.</p>
        ) : (
          methods.map((method) => (
            <div key={method.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>{method.title}</h3>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(method)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      수정
                    </button>
                    <button onClick={() => handleDelete(method.id)} className={styles.deleteBtn}>
                      삭제
                    </button>
                  </div>
                )}
              </div>
              
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                {new Date(method.createdAt).toLocaleDateString('ko-KR')}
              </div>

              {method.videoUrl && (
                <div className={styles.videoWrapper}>
                  <iframe
                    src={getEmbedUrl(method.videoUrl)}
                    title={method.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.iframe}
                  />
                </div>
              )}
              
              {/* 첨부 링크 표시 버튼들 */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {method.pdfUrl && (
                  <a href={method.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderRadius: '100px', fontSize: '0.9rem', textDecoration: 'none' }}>
                    📄 PDF 보기
                  </a>
                )}
                {method.audioUrl && (
                  <a href={method.audioUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: 'rgba(59,130,246,0.1)', color: '#93c5fd', borderRadius: '100px', fontSize: '0.9rem', textDecoration: 'none' }}>
                    🎵 음성 듣기
                  </a>
                )}
                {method.pptUrl && (
                  <a href={method.pptUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: 'rgba(245,158,11,0.1)', color: '#fcd34d', borderRadius: '100px', fontSize: '0.9rem', textDecoration: 'none' }}>
                    📊 PPT 열기
                  </a>
                )}
              </div>

              <div className={styles.content} dangerouslySetInnerHTML={{ __html: linkify(method.content) }} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
