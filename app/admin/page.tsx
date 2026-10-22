import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UserClient from './client'

export default async function UsersPage() {
  const supabase = await createClient()

  // 1. Cek user login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // 2. Cek apakah user ini admin
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  // Jika bukan admin, kembalikan ke dashboard
  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // 3. Ambil semua daftar user
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
      
      {/* PERHATIKAN BARIS INI: initialUsers dan currentUserId */}
      <UserClient initialUsers={users || []} currentUserId={user.id} />
    </div>
  )
}