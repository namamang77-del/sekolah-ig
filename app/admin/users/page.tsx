import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UserClient from './client'

export default async function UsersPage() {
  const supabase = await createClient()

  // Cek user login & pastikan dia admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('users').select('role').eq('id', user.id).single()

  if (profile?.role !== 'admin') {
    return <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">Akses Ditolak. Hanya admin yang bisa mengakses halaman ini.</div>
  }

  // Ambil semua daftar user
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Manajemen Pengguna</h2>
        <p className="text-gray-500 text-sm">Atur siapa saja yang bisa mengakses aplikasi dan siapa yang menjadi admin.</p>
      </div>
      <UserClient initialUsers={users || []} currentUserId={user.id} />
    </div>
  )
}