// components/Viewer.js
import dynamic from 'next/dynamic';

// ⬇️ forwardRef:true — ключ к доступу к методам экземпляра
export const Viewer = dynamic(
  () => import('react-svg-pan-zoom')
          .then(mod => mod.UncontrolledReactSVGPanZoom),
  { ssr: false, forwardRef: true }
);
