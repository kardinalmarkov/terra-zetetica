export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #e5e7eb',
      padding: '2rem 1rem',
      textAlign: 'center',
      fontSize: '.9rem',
      color: '#6b7280'
    }}>
      <div style={{ marginBottom: '.5rem' }}>
        <a href="/terms-and-conditions">Terms &amp; conditions</a> &nbsp;|&nbsp;
        <a href="/privacy-policy">Privacy policy</a>
      </div>
      <div>© {new Date().getFullYear()} Terra Zetetica. All rights reserved.</div>
    </footer>
  )
}
