'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

type Mission = {
  id: string;
  title: string;
  location: string;
  description: string;
  rewardPoints: number;
};

type MissionProof = {
  missionId: string;
  status: string;
};

export default function AdventureClient({ 
  missions, 
  locations, 
  userProofs, 
  isLoggedIn 
}: { 
  missions: Mission[], 
  locations: string[], 
  userProofs: MissionProof[], 
  isLoggedIn: boolean 
}) {
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredMissions = selectedLocation === 'All' 
    ? missions 
    : missions.filter(m => m.location === selectedLocation);

  const handleMissionClick = (mission: Mission) => {
    if (!isLoggedIn) {
      alert("Please sign in to participate in missions!");
      signIn();
      return;
    }
    setSelectedMission(mission);
    setProofUrl('');
  };

  const getMissionStatus = (missionId: string) => {
    const proof = userProofs.find(p => p.missionId === missionId);
    if (!proof) return 'AVAILABLE';
    return proof.status; // 'PENDING' or 'APPROVED'
  };

  const submitProof = async () => {
    if (!proofUrl) return alert("Please provide a link to your photo!");
    if (!selectedMission) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/missions/proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: selectedMission.id,
          imageUrl: proofUrl
        })
      });
      if (res.ok) {
        alert("Mission proof submitted! We will review it shortly.");
        window.location.reload(); // Simple reload to get updated proofs
      } else {
        alert("Failed to submit proof");
      }
    } catch (e) {
      alert("Error submitting proof");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
        <button 
          onClick={() => setSelectedLocation('All')}
          style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: selectedLocation === 'All' ? '#3b82f6' : '#374151', color: '#fff' }}
        >
          All Locations
        </button>
        {locations.map(loc => (
          <button 
            key={loc}
            onClick={() => setSelectedLocation(loc)}
            style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: selectedLocation === loc ? '#3b82f6' : '#374151', color: '#fff' }}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Mission Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredMissions.map(mission => {
          const status = getMissionStatus(mission.id);
          let statusBadge = null;
          let cardOpacity = 1;

          if (status === 'APPROVED') {
            statusBadge = <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>✅ Completed</span>;
            cardOpacity = 0.6;
          } else if (status === 'PENDING') {
            statusBadge = <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>⏳ In Review</span>;
            cardOpacity = 0.8;
          }

          return (
            <div 
              key={mission.id} 
              onClick={() => status === 'AVAILABLE' ? handleMissionClick(mission) : null}
              style={{ background: '#1f2937', padding: '24px', borderRadius: '16px', border: '1px solid #374151', cursor: status === 'AVAILABLE' ? 'pointer' : 'default', opacity: cardOpacity, transition: 'transform 0.2s', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>📍 {mission.location}</span>
                {statusBadge}
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>{mission.title}</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5' }}>
                {mission.description}
              </p>
              <div style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                🎁 Reward: {mission.rewardPoints} Points
              </div>
            </div>
          );
        })}
      </div>

      {filteredMissions.length === 0 && (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
          No missions available in this location yet.
        </div>
      )}

      {/* Upload Proof Modal */}
      {selectedMission && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1f2937', padding: '40px', borderRadius: '20px', maxWidth: '500px', width: '100%', border: '1px solid #374151' }}>
            <h2 style={{ color: '#fff', marginBottom: '10px' }}>Complete Mission</h2>
            <h3 style={{ color: '#60a5fa', marginBottom: '20px' }}>{selectedMission.title}</h3>
            <p style={{ color: '#d1d5db', marginBottom: '30px', fontSize: '0.95rem' }}>
              Upload your photo to Google Drive or Instagram, and paste the public link below to prove you completed the mission!
            </p>
            
            <input 
              type="text" 
              placeholder="Paste Photo URL here..." 
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '10px', background: '#374151', border: 'none', color: '#fff', marginBottom: '20px' }}
            />
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => setSelectedMission(null)}
                style={{ flex: 1, padding: '15px', background: 'transparent', border: '1px solid #6b7280', color: '#d1d5db', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={submitProof}
                disabled={isSubmitting}
                style={{ flex: 1, padding: '15px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Proof'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
