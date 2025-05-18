// =======================================
// 1. components/Modal.js
// =======================================
import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <header style={header}>
          <h2>{title}</h2>
          <button onClick={onClose} style={closeBtn}>×</button>
        </header>
        <div style={body}>{children}</div>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed', top:0, left:0, right:0, bottom:0,
  background: 'rgba(0,0,0,0.5)', display:'flex',
  alignItems:'center', justifyContent:'center', zIndex:1000
};
const modal = {
  background:'#fff', borderRadius:8, width:'90%', maxWidth:500,
  boxShadow:'0 5px 15px rgba(0,0,0,0.3)', overflow:'hidden'
};
const header = {
  display:'flex', justifyContent:'space-between', alignItems:'center',
  padding:'1rem', borderBottom:'1px solid #eee'
};
const closeBtn = {
  background:'none', border:'none', fontSize:24, cursor:'pointer'
};
const body = { padding:'1rem' };