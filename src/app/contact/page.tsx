'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to submit inquiry');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3rem', color: '#fff', marginBottom: '20px' }}>📞 Contact Us</h1>
        <p style={{ color: '#9ca3af', fontSize: '1.2rem', lineHeight: '1.6' }}>
          Have a question about our classes, Busan buddies, or festivals?<br />
          Send us a message and we will get back to you via email!
        </p>
      </div>

      {isSuccess ? (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '50px 30px', borderRadius: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✨</div>
          <h2 style={{ color: '#10b981', marginBottom: '15px' }}>Message Sent Successfully!</h2>
          <p style={{ color: '#d1d5db', fontSize: '1.1rem', marginBottom: '30px' }}>
            Thank you for reaching out to KoreaBridge.<br/>
            Our team will review your inquiry and reply to your email soon.
          </p>
          <button 
            onClick={() => setIsSuccess(false)}
            style={{ padding: '12px 30px', borderRadius: '12px', background: '#374151', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: '#1f2937', padding: '40px', borderRadius: '24px', border: '1px solid #374151', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 calc(50% - 10px)' }}>
              <label style={{ display: 'block', color: '#d1d5db', marginBottom: '10px', fontWeight: 'bold' }}>Your Name *</label>
              <input 
                type="text" required
                value={name} onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#374151', color: '#fff', border: '1px solid #4b5563', fontSize: '1rem' }}
                placeholder="John Doe"
              />
            </div>
            <div style={{ flex: '1 1 calc(50% - 10px)' }}>
              <label style={{ display: 'block', color: '#d1d5db', marginBottom: '10px', fontWeight: 'bold' }}>Email Address *</label>
              <input 
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#374151', color: '#fff', border: '1px solid #4b5563', fontSize: '1rem' }}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#d1d5db', marginBottom: '10px', fontWeight: 'bold' }}>Subject *</label>
            <input 
              type="text" required
              value={subject} onChange={e => setSubject(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#374151', color: '#fff', border: '1px solid #4b5563', fontSize: '1rem' }}
              placeholder="How can we help you?"
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#d1d5db', marginBottom: '10px', fontWeight: 'bold' }}>Message *</label>
            <textarea 
              required
              value={message} onChange={e => setMessage(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#374151', color: '#fff', border: '1px solid #4b5563', minHeight: '180px', fontSize: '1rem', resize: 'vertical' }}
              placeholder="Write your detailed inquiry here..."
            />
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            style={{ 
              width: '100%', padding: '16px', borderRadius: '12px', background: isSubmitting ? '#4b5563' : '#3b82f6', 
              color: '#fff', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', 
              marginTop: '10px', transition: 'background 0.3s' 
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message 🚀'}
          </button>
        </form>
      )}
    </div>
  );
}
