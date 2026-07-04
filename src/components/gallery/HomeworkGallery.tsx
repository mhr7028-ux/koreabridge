'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './HomeworkGallery.module.css';

interface GalleryItem {
  id: string;
  userName: string;
  userImage: string | null;
  title: string;
  score: number;
  feedback: string;
  transcript: string;
  mediaUrl: string;
  mediaType: string;
  likes: number;
  createdAt: string;
}

export default function HomeworkGallery() {
  const { data: session } = useSession();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingItem, setEditingItem] = useState<{ id: string, title: string, mediaUrl: string } | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title.trim() || !editingItem.mediaUrl.trim()) return;
    
    try {
      const res = await fetch(`/api/gallery/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: editingItem.title.trim(),
          mediaUrl: editingItem.mediaUrl.trim()
        }),
      });
      if (res.ok) {
        alert('수정되었습니다.');
        setEditingItem(null);
        fetchGallery();
      } else {
        alert('수정 권한이 없거나 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (confirm('이 기록을 정말 삭제하시겠습니까?')) {
      try {
        const res = await fetch(`/api/gallery/${item.id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          alert('삭제되었습니다.');
          fetchGallery();
        } else {
          alert('삭제 권한이 없거나 실패했습니다.');
        }
      } catch (error) {
        alert('오류가 발생했습니다.');
      }
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        return url.replace('watch?v=', 'embed/');
      } else if (url.includes('youtu.be/')) {
        return url.replace('youtu.be/', 'youtube.com/embed/');
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className={styles.gallerySection}>
      <div className={styles.header}>
        <h2 className="gradient-text">Korean Speaking Gallery 🎬</h2>
        <p className={styles.subtitle}>다른 학생들의 한국어 말하기 영상을 구경해보세요!</p>
      </div>

      <div className={styles.galleryGrid}>
        {loading ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#a0aec0' }}>갤러리를 불러오는 중입니다...</p>
        ) : items.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#a0aec0' }}>아직 등록된 숙제가 없습니다. 첫 번째로 등록해보세요!</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className={styles.galleryCard}>
              <div className={styles.userInfo}>
                {item.userImage ? (
                  <img src={item.userImage} alt={item.userName} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarPlaceholder}>👤</div>
                )}
                <div>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>{item.userName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                {editingItem?.id === item.id ? (
                  <form onSubmit={handleEditSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                    <input 
                      type="text" 
                      value={editingItem.title} 
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} 
                      placeholder="제목 수정" 
                      className={styles.input} 
                    />
                    <input 
                      type="text" 
                      value={editingItem.mediaUrl} 
                      onChange={(e) => setEditingItem({ ...editingItem, mediaUrl: e.target.value })} 
                      placeholder="유튜브 링크 수정" 
                      className={styles.input} 
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>저장</button>
                      <button type="button" onClick={() => setEditingItem(null)} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>취소</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className={styles.title} style={{ margin: 0 }}>{item.title}</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {session?.user && (session.user.name === item.userName || (session.user as any).role === 'admin') && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => setEditingItem({ id: item.id, title: item.title, mediaUrl: item.mediaUrl })} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>수정</button>
                          <button onClick={() => handleDelete(item)} style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#fca5a5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>삭제</button>
                        </div>
                      )}
                      <div className={styles.scoreBadge} style={{ position: 'relative', top: 'auto', right: 'auto', background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', padding: '4px 12px', borderRadius: '100px', fontWeight: 'bold' }}>
                        {item.score}점
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!editingItem || editingItem.id !== item.id ? (
                <div className={styles.cardContent}>
                  
                  <div className={styles.videoWrapper}>
                    {item.mediaType === 'audio' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#111827', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎤</div>
                        <audio controls src={item.mediaUrl} style={{ width: '100%' }} />
                      </div>
                    ) : item.mediaType === 'image' ? (
                      <img src={item.mediaUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
                    ) : (
                      <iframe
                        src={getEmbedUrl(item.mediaUrl)}
                        title={item.title}
                        frameBorder="0"
                        allowFullScreen
                        className={styles.iframe}
                      />
                    )}
                  </div>

                  <div className={styles.feedbackBox}>
                    <p style={{ fontStyle: 'italic', color: '#fbbf24', fontSize: '0.9rem', marginBottom: '8px' }}>
                      "{item.transcript}"
                    </p>
                    <p style={{ color: '#d1d5db', fontSize: '0.85rem' }}>
                      AI 피드백 보기: {item.feedback}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className={styles.cardActions}>
                <button className={styles.actionBtn}>👍 좋아요</button>
                <button className={styles.actionBtn}>💬 댓글</button>
                <button className={styles.actionBtn}>🔗 링크 복사</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
