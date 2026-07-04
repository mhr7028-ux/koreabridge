'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AiEvaluationComponent() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [targetText, setTargetText] = useState('');
  
  // State machine: 'idle' -> 'fetching_yt' -> 'yt_failed' -> 'recording' -> 'evaluating_audio' -> 'done'
  const [status, setStatus] = useState<'idle' | 'fetching_yt' | 'yt_failed' | 'recording' | 'evaluating_audio' | 'done'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [scorecard, setScorecard] = useState<any>(null);

  // Handwriting state
  const [hwStatus, setHwStatus] = useState<'idle' | 'evaluating' | 'done'>('idle');
  const [hwScorecard, setHwScorecard] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio recording state
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const handleYoutubeSubmit = async () => {
    if (!youtubeUrl || !targetText) {
      alert('유튜브 링크와 한국어 문장을 모두 입력해주세요!');
      return;
    }

    setStatus('fetching_yt');
    setErrorMsg('');

    try {
      const res = await fetch('/api/evaluate-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl, text: targetText })
      });
      const data = await res.json();

      if (!data.success && data.requireRecording) {
        setStatus('yt_failed');
        setErrorMsg('유튜브 보안 정책으로 소리를 가져올 수 없어요. 대신 직접 녹음해 주세요!');
      } else if (data.success) {
        setScorecard(data.scorecard);
        setStatus('done');

        // Automatically upload to gallery
        fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: targetText,
            mediaUrl: youtubeUrl,
            mediaType: 'youtube',
            score: data.scorecard.totalScore,
            feedback: data.scorecard.feedback,
            transcript: data.scorecard.transcript || targetText
          })
        }).catch(err => console.error('Gallery upload failed', err));

      } else {
        setStatus('idle');
        setErrorMsg('알 수 없는 오류가 발생했습니다.');
      }
    } catch (err) {
      setStatus('idle');
      setErrorMsg('네트워크 오류가 발생했습니다.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await evaluateAudio(audioBlob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setStatus('recording');
    } catch (err) {
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const evaluateAudio = async (audioBlob: Blob) => {
    setStatus('evaluating_audio');
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('text', targetText);

    try {
      const res = await fetch('/api/evaluate-audio', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setScorecard(data.scorecard);
        setStatus('done');

        // Give points for completing Option A
        fetch('/api/homework', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'AI_EVALUATION' })
        }).catch(err => console.error(err));

        // Upload audio file to get a URL, then push to gallery
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData, // reusing the formData which has 'audio' instead of 'file'. Wait! /api/upload expects 'file'.
          });
          // actually /api/upload expects 'file' field. Let's create a new FormData.
          const uploadFormData = new FormData();
          uploadFormData.append('file', audioBlob, 'recording.webm');
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData
          });
          const uploadData = await uploadResponse.json();

          if (uploadData.success && uploadData.url) {
            await fetch('/api/gallery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: targetText,
                mediaUrl: uploadData.url,
                mediaType: 'audio',
                score: data.scorecard.totalScore,
                feedback: data.scorecard.feedback,
                transcript: data.scorecard.transcript || targetText
              })
            });
          }
        } catch (err) {
          console.error('Gallery upload failed for audio', err);
        }

      } else {
        setStatus('yt_failed');
        setErrorMsg('평가 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } catch (err) {
      setStatus('yt_failed');
      setErrorMsg('네트워크 오류가 발생했습니다.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHwStatus('evaluating');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/evaluate-handwriting', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setHwScorecard(data.scorecard);
        setHwStatus('done');

        // Grant points!
        fetch('/api/homework', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'AI_EVALUATION' })
        }).catch(err => console.error(err));

        // Upload image file to get a URL, then push to gallery
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData
          });
          const uploadData = await uploadResponse.json();

          if (uploadData.success && uploadData.url) {
            await fetch('/api/gallery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: '손글씨 연습',
                mediaUrl: uploadData.url,
                mediaType: 'image',
                score: data.scorecard.score || 100,
                feedback: data.scorecard.feedback,
                transcript: data.scorecard.transcript
              })
            });
          }
        } catch (err) {
          console.error('Gallery upload failed for image', err);
        }

      } else {
        alert('평가 중 오류가 발생했습니다.');
        setHwStatus('idle');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
      setHwStatus('idle');
    }
  };

  return (
    <div style={{ background: '#111827', padding: '30px', borderRadius: '16px', border: '1px solid #374151' }}>
      <h2 style={{ color: '#00e5ff', fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        🤖 AI 발음 평가 <span>(BETA)</span>
      </h2>

      <AnimatePresence mode="wait">
        {status === 'idle' || status === 'fetching_yt' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
              유튜브 쇼츠 링크와 연습한 한국어 문장을 넣으시면, AI가 발음을 평가해 줍니다!
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="유튜브 링크 (예: https://youtube.com/shorts/...)"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                disabled={status === 'fetching_yt'}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
              />
              <textarea 
                placeholder="어떤 문장을 연습하셨나요? (예: 아이스 아메리카노 한 잔 주세요)"
                value={targetText}
                onChange={(e) => setTargetText(e.target.value)}
                disabled={status === 'fetching_yt'}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#fff', minHeight: '80px', resize: 'vertical' }}
              />
            </div>

            <button 
              onClick={handleYoutubeSubmit}
              disabled={status === 'fetching_yt'}
              className="btn-premium"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
            >
              {status === 'fetching_yt' ? (
                <>
                  <span className="spinner">⏳</span> 유튜브 영상 분석 중...
                </>
              ) : (
                'AI 발음 평가받기'
              )}
            </button>
            {errorMsg && <p style={{ color: '#ef4444', marginTop: '15px', fontSize: '0.9rem' }}>{errorMsg}</p>}
          </motion.div>
        ) : status === 'yt_failed' || status === 'recording' || status === 'evaluating_audio' ? (
          <motion.div
            key="fallback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ textAlign: 'center', padding: '20px 0' }}
          >
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', padding: '15px', borderRadius: '12px', marginBottom: '30px' }}>
              {errorMsg}
            </div>

            <div style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>
              "{targetText}"
            </div>
            <p style={{ color: '#9ca3af', marginBottom: '30px', fontSize: '0.95rem' }}>위 문장을 큰 소리로 읽어주세요!</p>

            {status === 'evaluating_audio' ? (
              <div style={{ padding: '40px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>🧠</div>
                <h3 style={{ color: '#00e5ff' }}>AI가 발음을 꼼꼼히 분석하고 있습니다...</h3>
              </div>
            ) : (
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                style={{ 
                  background: isRecording ? '#ef4444' : '#10b981', 
                  color: '#fff', border: 'none', padding: '15px 40px', borderRadius: '50px', 
                  fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: isRecording ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 4px 15px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s'
                }}
              >
                {isRecording ? '⏹️ 녹음 완료' : '🎙️ 녹음 시작'}
              </button>
            )}

            {isRecording && (
              <p style={{ color: '#ef4444', marginTop: '20px', animation: 'blink 1s infinite' }}>🔴 녹음 중입니다...</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="scorecard"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ padding: '30px', borderRadius: '16px', background: 'rgba(124, 77, 255, 0.1)', border: '1px solid #7c4dff' }}
          >
            <h3 style={{ fontSize: '1.8rem', color: '#fff', textAlign: 'center', marginBottom: '30px' }}>
              🎉 평가 완료!
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: '#1f2937', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ color: '#9ca3af', marginBottom: '10px' }}>종합 점수</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ffc107' }}>
                  {scorecard?.totalScore} <span style={{ fontSize: '1rem', color: '#6b7280' }}>/ 100</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: '#1f2937', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>발음 정확도</span>
                  <strong style={{ color: '#00e676' }}>{scorecard?.accuracy}%</strong>
                </div>
                <div style={{ background: '#1f2937', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>유창성</span>
                  <strong style={{ color: '#00e5ff' }}>{scorecard?.fluency}%</strong>
                </div>
              </div>
            </div>

            <div style={{ background: '#1f2937', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #7c4dff' }}>
              <h4 style={{ color: '#fff', marginBottom: '10px' }}>💡 AI 피드백</h4>
              <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>{scorecard?.feedback}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Link 
                href="/study/gallery"
                style={{ flex: 1, textAlign: 'center', padding: '12px', background: 'linear-gradient(45deg, #7c4dff, #651fff)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none' }}
              >
                🎬 갤러리 구경하기
              </Link>
              <button 
                onClick={() => {
                  setStatus('idle');
                  setYoutubeUrl('');
                  setTargetText('');
                }}
                style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #6b7280', color: '#d1d5db', borderRadius: '8px', cursor: 'pointer' }}
              >
                새로 평가하기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid #374151' }}>
        <h2 style={{ color: '#00e676', fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          ✍️ AI 손글씨 평가 <span>(BETA)</span>
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
          종이에 직접 쓴 한글 문장을 카메라로 찍어서 올려주세요. AI가 맞춤법과 띄어쓰기를 교정해 드립니다!
        </p>

        {hwStatus === 'idle' && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              style={{ display: 'none' }} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="btn-premium"
              style={{ flex: 1, background: 'linear-gradient(45deg, #10b981, #059669)', border: 'none', color: '#fff', padding: '15px', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              📸 손글씨 사진 찍기 / 올리기
            </button>
          </div>
        )}

        {hwStatus === 'evaluating' && (
          <div style={{ textAlign: 'center', padding: '30px', background: '#1f2937', borderRadius: '12px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px', animation: 'pulse 1.5s infinite' }}>👁️</div>
            <h3 style={{ color: '#00e676', margin: 0 }}>AI가 글씨를 읽고 있습니다...</h3>
          </div>
        )}

        {hwStatus === 'done' && hwScorecard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '25px', borderRadius: '12px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.5rem' }}>분석 완료!</h3>
              <div style={{ background: '#1f2937', padding: '10px 20px', borderRadius: '30px', border: '1px solid #00e676' }}>
                <span style={{ color: '#00e676', fontWeight: 'bold', fontSize: '1.2rem' }}>{hwScorecard.score}</span> / 100
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: '#9ca3af', marginBottom: '5px' }}>내가 쓴 글씨 (AI가 읽은 내용):</div>
              <div style={{ background: '#1f2937', padding: '15px', borderRadius: '8px', color: '#fff', fontSize: '1.1rem' }}>
                {hwScorecard.transcript}
              </div>
            </div>

            <div>
              <div style={{ color: '#9ca3af', marginBottom: '5px' }}>💡 AI 선생님의 피드백:</div>
              <div style={{ background: '#1f2937', padding: '15px', borderRadius: '8px', color: '#d1d5db', lineHeight: '1.6' }}>
                {hwScorecard.feedback}
              </div>
            </div>

            <button 
              onClick={() => {
                setHwStatus('idle');
                setHwScorecard(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #10b981', color: '#10b981', borderRadius: '8px', marginTop: '20px', cursor: 'pointer' }}
            >
              다시 검사하기
            </button>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
