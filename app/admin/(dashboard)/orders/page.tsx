'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AdminThemeToggle } from '@/components/admin-theme-toggle'
import { ArrowLeft, ChevronRight, Leaf, Search } from 'lucide-react'

// Define Order type
type Order = {
  id: string
  trackingNumber: string
  customerName: string
  province: string
  city: string
  totalPrice: number
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const [query, setQuery] = useState('')

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders')
      if (!res.ok) throw new Error('Failed to fetch orders')
      return res.json()
    }
  })

  const filteredOrders = orders.filter((order) => {
    const searchString = `${order.trackingNumber} ${order.customerName} ${order.province} ${order.city} ${order.status}`.toLowerCase()
    return searchString.includes(query.toLowerCase())
  })

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  return (
    <main className="mx-auto max-w-7xl p-5 lg:p-10">
        <a href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Dashboard
        </a>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">Workspace</p>
            <h1 className="mt-3 font-serif text-4xl">Semua pesanan</h1>
            <p className="mt-2 text-muted-foreground">Kelola order masuk, pembayaran, dan pengiriman.</p>
          </div>
          <label className="flex w-full items-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-sm sm:w-80">
            <Search size={16} className="text-muted-foreground" />
            <span className="sr-only">Cari pesanan</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none" placeholder="Cari pesanan..." />
          </label>
        </div>
        
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="hidden grid-cols-[1.3fr_1fr_1fr_1fr_1fr_24px] gap-4 border-b border-border px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
            <span>Order</span>
            <span>Pelanggan</span>
            <span>Lokasi</span>
            <span>Total</span>
            <span>Status</span>
            <span />
          </div>
          
          {isLoading ? (
             <div className="p-8 text-center text-sm text-muted-foreground">Memuat pesanan...</div>
          ) : filteredOrders.length === 0 ? (
             <div className="p-8 text-center text-sm text-muted-foreground">Tidak ada pesanan ditemukan.</div>
          ) : (
            filteredOrders.map((order) => (
              <a href={`/admin/orders/${order.trackingNumber}`} key={order.id} className="grid gap-2 border-b border-border p-5 last:border-0 hover:bg-muted/50 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr_24px] md:items-center md:gap-4 md:px-6 transition-colors">
                <div>
                  <p className="font-medium">{order.trackingNumber}</p>
                  <p className="mt-1 text-sm text-muted-foreground md:hidden">{order.customerName} · {order.city}</p>
                </div>
                <span className="hidden text-sm md:block">{order.customerName}</span>
                <span className="hidden text-sm text-muted-foreground md:block">{order.city}</span>
                <span className="text-sm font-medium">{formatRupiah(order.totalPrice)}</span>
                <span className="w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">{order.status}</span>
                <ChevronRight size={16} className="hidden text-muted-foreground md:block" />
              </a>
            ))
          )}
        </div>
    </main>
  )
}
