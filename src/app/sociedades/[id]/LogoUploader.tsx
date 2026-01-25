'use client'

import { useState, useRef } from 'react'

interface Props {
  currentLogo: string | null
  onLogoChange: (url: string | null) => void
}

export default function LogoUploader({ currentLogo, onLogoChange }: Props) {
  const [preview, setPreview] = useState<string | null>(currentLogo)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Preview local inmediato
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    // Upload al servidor
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      if (data.url) {
        onLogoChange(data.url)
        setPreview(data.url)
      } else {
        setError(data.error || 'Error al subir el logo')
        setPreview(currentLogo) // Revertir preview
      }
    } catch {
      setError('Error de conexión al subir el logo')
      setPreview(currentLogo) // Revertir preview
    } finally {
      setUploading(false)
    }
  }

  function handleRemove() {
    setPreview(null)
    onLogoChange(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleClick() {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zebra-dark">
        Logo de la sociedad
      </label>

      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative">
            <div className="w-32 h-32 border-2 border-zebra-border rounded-xl overflow-hidden bg-white flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold shadow-md transition-colors"
              title="Eliminar logo"
            >
              ×
            </button>
            {uploading && (
              <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-zebra-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="w-32 h-32 border-2 border-dashed border-zebra-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zebra-primary hover:bg-zebra-light/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-8 h-8 text-zebra-gray mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-zebra-gray text-sm text-center px-2">
              {uploading ? 'Subiendo...' : 'Subir logo'}
            </span>
          </button>
        )}

        <div className="text-sm text-zebra-gray space-y-1">
          <p>Formatos: JPG, PNG, WebP</p>
          <p>Tamaño máximo: 5MB</p>
          {preview && !uploading && (
            <button
              type="button"
              onClick={handleClick}
              className="text-zebra-primary hover:text-zebra-primary-dark font-medium"
            >
              Cambiar imagen
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  )
}
