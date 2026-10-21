import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-bold text-gray-800">
              Poster Sekolah
            </Link>
            <nav className="flex gap-4 text-sm font-medium text-gray-600">
              <Link href="/admin" className="hover:text-blue-600">Persetujuan</Link>
              <Link href="/admin/users" className="hover:text-blue-600">Pengguna</Link>
            </nav>
          </div>
          <Link 
            href="/dashboard" 
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Kembali ke Guru
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}