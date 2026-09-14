import { AlertTriangle } from 'lucide-react';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div className="modal-content" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{title || "Confirm Action"}</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.4' }}>{message || "Are you sure?"}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={onClose} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmModal;
