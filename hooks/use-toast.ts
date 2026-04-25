'use client'

import * as React from "react"

type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

type ToastContextType = {
  toast: (toast: Omit<Toast, "id">) => void
  toasts: Toast[]
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = (toastData: Omit<Toast, "id">) => {
    const id = Math.random().toString(36)
    setToasts((prev) => [...prev, { id, ...toastData }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}

      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className="bg-black text-white p-3 rounded">
            {t.title && <div className="font-bold">{t.title}</div>}
            {t.description && <div>{t.description}</div>}
            {t.action && <div>{t.action}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)

  if (context === null) {
    throw new Error("useToast must be used within ToastProvider")
  }

  return context
}
