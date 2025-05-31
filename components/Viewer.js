// components/Viewer.js
import dynamic from 'next/dynamic'

// Динамический импорт UncontrolledReactSVGPanZoom, чтобы
// на сервере (при сборке) не было ошибок (нет window).
export const Viewer = dynamic(
  () =>
    import('react-svg-pan-zoom').then(mod => mod.UncontrolledReactSVGPanZoom),
  { ssr: false }
)
