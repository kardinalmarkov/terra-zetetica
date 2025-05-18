import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <header style={styles.header}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </header>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    background: '#fff', borderRadius: '8px', width: '90%', maxWidth: '500px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', overflow: 'hidden',
  },
  header: {
    padding: '1rem', borderBottom: '1px solid #eee',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer',
  },
  body: {
    padding: '1rem',
  },
};
