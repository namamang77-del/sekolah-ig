'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Anda belum login')

      // 1. Upload gambar ke Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Dapatkan URL publik gambar
      const { data: { publicUrl } } = supabase.storage
        .from('submissions')
        .getPublicUrl(fileName)

      // 3. Simpan data ke tabel submissions
      const { error: dbError } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          caption: caption,
          status: 'pending'
        })

      if (dbError) throw dbError

      // 4. Kembali ke dashboard
      router.push('/dashboard')
      router.refresh()

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Kirim Hasil Desain</h2>
      <p className="text-sm text-gray-500 mb-6">
        Unggah gambar JPG yang sudah Anda edit dari Canva.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File Gambar (JPG/PNG)
          </label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Caption Instagram
          </label>
          <textarea
            required
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Tulis caption untuk postingan Instagram..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Mengunggah...' : 'Kirim ke Admin'}
        </button>
      </form>
    </div>
  )
}