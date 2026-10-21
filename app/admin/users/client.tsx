'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function UserClient({ initialUsers, currentUserId }: { initialUsers: any[], currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function toggleRole(id: string, currentRole: string) {
    setLoadingId(id)
    const newRole = currentRole === 'admin' ? 'guru' : 'admin'

    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', id)

    if (error) {
      alert('Gagal mengubah role: ' + error.message)
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
      router.refresh()
    }
    setLoadingId(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 border-b border-gray-200 text-gray-800">
          <tr>
            <th className="px-6 py-3 font-semibold">Email</th>
            <th className="px-6 py-3 font-semibold">Nama</th>
            <th className="px-6 py-3 font-semibold">Role</th>
            <th className="px-6 py-3 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{u.email}</td>
              <td className="px-6 py-4">{u.name || '-'}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {u.role}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {u.id === currentUserId ? (
                  <span className="text-xs text-gray-400 italic">Akun Anda</span>
                ) : (
                  <button
                    onClick={() => toggleRole(u.id, u.role)}
                    disabled={loadingId === u.id}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      u.role === 'admin' 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    {loadingId === u.id ? '...' : (u.role === 'admin' ? 'Jadikan Guru' : 'Jadikan Admin')}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="p-8 text-center text-gray-500">Belum ada pengguna yang terdaftar.</div>
      )}
    </div>
  )
}
