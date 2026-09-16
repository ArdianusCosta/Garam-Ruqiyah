'use client'

import { Mail, Shield, User } from 'lucide-react'

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-4xl p-5 lg:p-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold">Profil Saya</h1>
        <p className="mt-2 text-muted-foreground">Informasi akun administrator Garam Mandi.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="border-b border-border bg-muted/30 p-8 sm:p-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="grid size-24 shrink-0 place-items-center rounded-full bg-primary font-serif text-4xl text-primary-foreground shadow-lg">
              AR
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold">Admin Ruqiyah</h2>
              <p className="text-muted-foreground">Administrator Utama</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <Shield size={14} /> Akses Penuh
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <h3 className="mb-6 text-lg font-medium">Informasi Kontak</h3>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-background p-5">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                <p className="mt-1 font-medium">Admin Ruqiyah</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-background p-5">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alamat Email</p>
                <p className="mt-1 font-medium">admin@garammandi.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-sm text-blue-600 dark:text-blue-400">
            <p><strong>Catatan:</strong> Karena ini adalah sistem Administrator tunggal (Single Admin) yang menggunakan otentikasi kata sandi pusat, fitur untuk mengubah data profil secara dinamis tidak diperlukan saat ini.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
