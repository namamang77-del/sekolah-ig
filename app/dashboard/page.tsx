import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/')
  }

  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .eq('aktif', true)
    .order('urutan', { ascending: true })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Pilih Template</h2>
          <p className="text-gray-500 text-sm">
            Pilih desain yang ingin Anda gunakan, lalu edit di Canva
          </p>
        </div>
        <a
          href="/upload"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors whitespace-nowrap"
        >
          + Kirim Hasil Desain
        </a>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
          Error memuat template: {error.message}
        </div>
      )}

      {!templates || templates.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-400 mb-2">Belum ada template tersedia</p>
          <p className="text-xs text-gray-400">
            Hubungi admin sekolah untuk menambahkan template
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <a
              key={template.id}
              href={template.canva_link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {template.thumbnail_url ? (
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={template.thumbnail_url}
                    alt={template.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Tanpa preview</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {template.nama}
                </h3>
                {template.deskripsi && (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {template.deskripsi}
                  </p>
                )}
                <div className="mt-3 text-xs text-blue-600 font-medium">
                  Buka di Canva →
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}