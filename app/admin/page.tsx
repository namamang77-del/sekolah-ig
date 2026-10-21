import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminClient from './client'

export default async function AdminPage() {
  const supabase = await createClient()

  // 1. Cek user login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // 2. Ambil data pengajuan (TANPA JOIN, TANPA FILTER STATUS DULU)
  // Kita ambil semua data untuk memastikan koneksi database berhasil.
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Persetujuan Admin</h2>
          <p className="text-gray-500 text-sm">
            Tinjau gambar dari guru sebelum diposting ke Instagram sekolah.
          </p>
        </div>
        <a
          href="/admin/users"
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
        >
          Kelola Pengguna
        </a>
      </div>

      {/* JIKA ADA ERROR DATABASE, AKAN MUNCUL DI SINI */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg mb-4 border border-red-200">
          <strong>Error Database:</strong> {error.message}
        </div>
      )}

      {/* JIKA TIDAK ADA DATA */}
      {!submissions || submissions.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-400">Tidak ada data pengajuan sama sekali di database.</p>
        </div>
      ) : (
        // JIKA ADA DATA, TAMPILKAN
        <AdminClient initialData={submissions} />
      )}
    </div>
  )
}