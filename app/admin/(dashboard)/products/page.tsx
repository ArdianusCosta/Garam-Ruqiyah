'use client'

import { ArrowLeft, LayoutTemplate } from 'lucide-react'

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-3xl p-5 lg:p-10 pt-20">
      <a href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Dashboard
      </a>
      
      <div className="mt-8 rounded-3xl border border-border bg-card p-10 text-center flex flex-col items-center">
        <div className="grid size-20 place-items-center rounded-full bg-primary/10 text-primary mb-6">
           <LayoutTemplate size={32} />
        </div>
        <h1 className="font-serif text-3xl font-medium">Manajemen Produk Dinamis</h1>
        <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
          Karena website ini menggunakan arsitektur produk tunggal yang sangat terfokus, produk diatur sepenuhnya melalui CMS Landing Page.
        </p>
        <p className="mt-2 text-muted-foreground max-w-md leading-relaxed">
          Kamu tidak perlu menambah produk manual. Cukup edit nama, harga, deskripsi, dan keunggulan produk langsung di tampilan depan.
        </p>
        
        <a href="/admin/cms" className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-medium text-primary-foreground shadow-lg hover:opacity-90">
           Ke Halaman CMS Sekarang
        </a>
      </div>
    </main>
  )
}
