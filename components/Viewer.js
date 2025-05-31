// components/Viewer.js
import dynamic from 'next/dynamic'

export const ReactSVGPanZoom = dynamic(
  () => import('react-svg-pan-zoom').then(mod => mod.UncontrolledReactSVGPanZoom),
  { ssr: false }
)
