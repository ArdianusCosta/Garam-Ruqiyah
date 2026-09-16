'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { ArrowUpRight, Check, Eye, FileText, LayoutTemplate, Leaf, Menu, Save, Settings2, ShoppingBag, Truck, X } from 'lucide-react'
import { AdminThemeToggle } from '@/components/admin-theme-toggle'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

type Field = { key: string; label: string; value: string; type?: 'textarea' }
type Panel = { id: string; label: string; group: string; icon: typeof LayoutTemplate; fields: Field[] }

const initialPanels: Panel[] = [
  { id: 'navigation', label: 'Navigasi & brand', group: 'Global', icon: Settings2, fields: [{ key: 'brand', label: 'Nama brand', value: 'Garam Mandi Ruqiyah' }, { key: 'about', label: 'Label Tentang', value: 'Tentang' }, { key: 'product', label: 'Label Produk', value: 'Produk' }, { key: 'tracking', label: 'Label Tracking', value: 'Lacak Pesanan' }, { key: 'headerCta', label: 'Tombol header', value: 'Pesan Sekarang' }] },
  { id: 'hero', label: 'Hero utama', group: 'Halaman depan', icon: LayoutTemplate, fields: [{ key: 'eyebrow', label: 'Label kecil', value: 'Garam Mandi Ruqiyah' }, { key: 'headline', label: 'Headline utama', value: 'Pesan mudah, kirim langsung ke rumah.', type: 'textarea' }, { key: 'description', label: 'Deskripsi hero', value: 'Garam mandi pilihan untuk menemani rutinitas perawatan diri yang tenang dan bermakna.', type: 'textarea' }, { key: 'primaryCta', label: 'Tombol utama', value: 'Pesan Sekarang' }, { key: 'secondaryCta', label: 'Tombol kedua', value: 'Lacak Pesanan' }, { key: 'price', label: 'Harga hero', value: 'Rp40.000' }] },
  { id: 'about', label: 'Tentang produk', group: 'Halaman depan', icon: FileText, fields: [{ key: 'label', label: 'Label section', value: 'Tentang produk' }, { key: 'title', label: 'Judul section', value: 'Ritual sederhana untuk ruang yang lebih tenang.', type: 'textarea' }, { key: 'body', label: 'Cerita brand', value: 'Garam Mandi Ruqiyah dirancang sebagai bagian dari jeda kecil di tengah hari.', type: 'textarea' }, { key: 'benefit1', label: 'Keunggulan 1', value: 'Dipilih dengan baik' }, { key: 'benefit2', label: 'Keunggulan 2', value: 'Mudah digunakan' }, { key: 'benefit3', label: 'Keunggulan 3', value: 'Kirim ke rumah' }] },
  { id: 'product', label: 'Produk pilihan', group: 'Halaman depan', icon: ShoppingBag, fields: [{ key: 'label', label: 'Label section', value: 'Produk pilihan' }, { key: 'name', label: 'Nama produk', value: 'Garam Mandi Ruqiyah' }, { key: 'price', label: 'Harga produk', value: 'Rp40.000' }, { key: 'description', label: 'Deskripsi produk', value: 'Satu produk, satu ritual sederhana. Pilih jumlah yang kamu perlukan.', type: 'textarea' }, { key: 'shipping', label: 'Info pengiriman', value: 'J&T Express · Regular · 2–5 hari' }, { key: 'payment', label: 'Info pembayaran', value: 'Pembayaran COD atau QRIS' }] },
  { id: 'checkout', label: 'Checkout', group: 'Halaman depan', icon: ShoppingBag, fields: [{ key: 'label', label: 'Label section', value: 'Checkout' }, { key: 'title', label: 'Judul checkout', value: 'Selesaikan pesananmu.' }, { key: 'description', label: 'Deskripsi checkout', value: 'Isi data singkat di bawah. Tidak perlu membuat akun.' }, { key: 'paymentTitle', label: 'Judul metode bayar', value: 'Metode pembayaran' }, { key: 'submit', label: 'Tombol pesanan', value: 'Buat Pesanan' }] },
  { id: 'tracking', label: 'Lacak pesanan', group: 'Halaman depan', icon: Truck, fields: [{ key: 'label', label: 'Label section', value: 'Pesananmu' }, { key: 'title', label: 'Judul tracking', value: 'Lacak pesanan.' }, { key: 'description', label: 'Deskripsi tracking', value: 'Pantau status order dan perjalanan paket dalam satu tempat.', type: 'textarea' }, { key: 'placeholder', label: 'Placeholder nomor', value: '#GRM-20260913-001' }, { key: 'status', label: 'Status contoh', value: 'Dalam pengiriman' }, { key: 'courier', label: 'Nama kurir', value: 'J&T Express' }] },
  { id: 'footer', label: 'CTA & footer', group: 'Global', icon: FileText, fields: [{ key: 'ctaTitle', label: 'Judul CTA bawah', value: 'Sudah melakukan pemesanan?' }, { key: 'ctaDescription', label: 'Deskripsi CTA', value: 'Simpan nomor pesanan untuk memantau pengiriman.' }, { key: 'tagline', label: 'Tagline footer', value: 'Ritual kecil untuk jeda yang lebih berarti.' }, { key: 'copyright', label: 'Copyright', value: '© 2026 Garam Mandi Ruqiyah' }] },
]

export default function CmsPage() {
  const [panels, setPanels] = useState(initialPanels)
  const [activeTab, setActiveTab] = useState(initialPanels[0].id)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          const updatedPanels = initialPanels.map(panel => ({
            ...panel,
            fields: panel.fields.map(field => ({
              ...field,
              value: data[`${panel.id}.${field.key}`] !== undefined ? data[`${panel.id}.${field.key}`] : field.value
            }))
          }))
          setPanels(updatedPanels)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const activePanel = panels.find((panel) => panel.id === activeTab)

  const handleFieldChange = (panelId: string, fieldKey: string, newValue: string) => {
    setPanels(current => current.map(panel => {
      if (panel.id !== panelId) return panel
      return {
        ...panel,
        fields: panel.fields.map(f => f.key === fieldKey ? { ...f, value: newValue } : f)
      }
    }))
  }

  const saveAllPanels = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSaving(true)
    const payload: Record<string, string> = {}

    // We send all panels' data to ensure the entire DB is updated
    panels.forEach(panel => {
      panel.fields.forEach(field => {
        payload[`${panel.id}.${field.key}`] = field.value
      })
    })

    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        setSaved(true)
        window.setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Gagal menyimpan ke database')
      }
    } catch (error) {
      console.error(error)
      alert('Gagal menyimpan perubahan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-5 lg:p-10 pb-32">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">Website editor</p>
          <h2 className="mt-3 font-serif text-4xl">Semua konten, satu tempat.</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">Edit navigasi, hero, tentang, produk, checkout, tracking, CTA, dan footer langsung di halaman ini.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          <Check className="text-primary" size={16} /> Data tersimpan di Database
        </div>
      </div>

      <div className="mt-8 flex overflow-x-auto gap-2 border-b border-border pb-4 no-scrollbar">
        {panels.map((panel) => (
          <button 
            key={panel.id} 
            type="button"
            onClick={() => setActiveTab(panel.id)} 
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${activeTab === panel.id ? 'bg-primary text-primary-foreground shadow-md' : 'border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            {panel.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-3">
           <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
           Memuat konten...
        </div>
      ) : (
        <form onSubmit={saveAllPanels} className="mt-6 flex flex-col gap-8 relative">
          {activePanel && (
            <section key={activePanel.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-3xl border border-border bg-card p-6 md:p-8">
              <div className="flex items-center gap-4 border-b border-border pb-5 mb-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <activePanel.icon size={20} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[.16em] text-muted-foreground">{activePanel.group}</p>
                  <h3 className="mt-1 font-semibold text-xl">{activePanel.label}</h3>
                </div>
              </div>
              
              <div className="grid gap-6 grid-cols-1">
                {activePanel.fields.map((field) => (
                  <div key={field.key} className="flex flex-col gap-2 text-sm font-medium">
                    <span>{field.label}</span>
                    {field.type === 'textarea' ? (
                      <div className="bg-background rounded-2xl overflow-hidden border border-input focus-within:ring-2 focus-within:ring-primary/30">
                        <ReactQuill 
                          theme="snow"
                          value={field.value} 
                          onChange={(val) => handleFieldChange(activePanel.id, field.key, val)}
                          className="border-none [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-b-border [&_.ql-container]:border-none [&_.ql-editor]:min-h-[120px] [&_.ql-editor]:text-base"
                        />
                      </div>
                    ) : (
                      <input 
                        type="text" 
                        value={field.value} 
                        onChange={(e) => handleFieldChange(activePanel.id, field.key, e.target.value)}
                        className="w-full rounded-2xl border border-input bg-background px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-primary/30" 
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="fixed bottom-6 right-6 z-40 sm:bottom-10 sm:right-10 flex flex-col items-end gap-3">
            {saved && (
              <div className="animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-primary shadow-lg backdrop-blur-md">
                <Save size={16} /> Perubahan berhasil disimpan.
              </div>
            )}
            <button type="submit" disabled={saving} className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-primary pl-6 pr-8 py-4 font-medium text-primary-foreground shadow-[0_10px_40px_-10px_rgba(42,130,81,0.5)] transition-all hover:scale-105 hover:shadow-[0_10px_40px_-5px_rgba(42,130,81,0.6)] disabled:opacity-70 disabled:hover:scale-100">
               <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0" />
               <Save size={20} className="relative z-10" />
               <span className="relative z-10 text-base">{saving ? "Menyimpan..." : "Simpan Semua Perubahan"}</span>
            </button>
          </div>
        </form>
      )}
    </main>
  )
}
