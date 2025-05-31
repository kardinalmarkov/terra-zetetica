// components/Viewer.js
import dynamic from 'next/dynamic'
export const Viewer = dynamic(
  () =>
    import('react-svg-pan-zoom').then((m) => {
      const { UncontrolledReactSVGPanZoom } = m

      // Оборачиваем, чтобы настроить хоткеи и поведение
      return (props) => (
        <UncontrolledReactSVGPanZoom
          {...props}
          toolbarPosition="none"
          miniaturePosition="none"
          detectAutoPan={false}
          onWheel={e => {
            // ➟ Зум только с Ctrl / ⌘
            if (!e.ctrlKey && !e.metaKey) {
              e.preventDefault()
            }
          }}
          customToolbar={(ToolBar) => (
            <div className="toolbar">
              <ToolBar.ZoomIn />
              <ToolBar.ZoomOut />
              <ToolBar.FitToViewer />
            </div>
          )}
        />
      )
    }),
  { ssr: false }
)
