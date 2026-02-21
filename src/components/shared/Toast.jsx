import { useUiStore } from '../../stores/uiStore'

export default function Toast() {
  const toast = useUiStore(s => s.toast)
  if (!toast) return null

  const colors = {
    info: 'bg-dark-card border-dark-border',
    success: 'bg-dark-card border-success',
    error: 'bg-dark-card border-error',
  }

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fadeIn px-4 py-2 rounded-lg border text-sm ${colors[toast.type]}`}>
      {toast.message}
    </div>
  )
}
