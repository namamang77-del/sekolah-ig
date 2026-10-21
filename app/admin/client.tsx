'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminClient({ initialData }: { initialData: any[] }) {
  const [submissions, setSubmissions] = useState(initialData)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function handleAction(id: string, newStatus: 'approved' | 'rejected') {
    setLoadingId(id)
    
    // Update database
    const { error } = await supabase
      .from('submissions')
      .update({ 
        status: newStatus,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      alert('Gagal update status: ' + error.message)
    } else {
      // Hapus dari layar (karena statusnya sudah bukan 'pending' lagi)
      setSubmissions((prev) => prev.filter((item) => item.id !== id))
      router.refresh()
    }
    setLoadingId(null)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {submissions.map((sub) => (
        <div key={sub.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {/* Gambar */}
          <div className="aspect-square bg-gray-100">
            <img 
              src={sub.image_url} 
              alt="Poster" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Info & Tombol */}
          <div className="p-3 flex flex-col flex-1">
            <div className="mb-2">
              <p className="text-[10px] text-gray-500 mb-0.5">Dikirim oleh:</p>
              <p className="text-xs font-medium text-gray-800">Guru</p>
            </div>
            
            <div className="mb-3 flex-1">
              <p className="text-[10px] text-gray-500 mb-0.5">Caption:</p>
              <p className="text-xs text-gray-700 line-clamp-2 bg-gray-50 p-1.5 rounded border">
                {sub.caption || '-'}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sub.caption || '')
                  alert('Caption berhasil disalin!')
                }}
                className="text-[10px] text-blue-600 hover:underline mt-1 block"
              >
                Salin Caption
              </button>
            </div>

            <div className="flex gap-1.5 mt-auto">
              <button
                onClick={() => handleAction(sub.id, 'rejected')}
                disabled={loadingId === sub.id}
                className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 font-medium py-1.5 rounded text-xs transition-colors disabled:opacity-50"
              >
                Tolak
              </button>
              
              <a
                href={sub.image_url}
                download={`Poster-IG-${sub.id}.jpg`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleAction(sub.id, 'approved')}
                className="flex-1 bg-green-600 text-white hover:bg-green-700 font-medium py-1.5 rounded text-xs transition-colors text-center"
              >
                Unduh
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}