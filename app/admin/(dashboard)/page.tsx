'use client'

import { useState } from 'react'
import { CircleDollarSign, ClipboardList, PackageCheck, Truck, ChevronRight, Search } from 'lucide-react'

const orders = [
  { id: '#GRM-20260913-001', customer: 'Alya Putri', city: 'Samarinda', total: 'Rp89.000', status: 'Dalam pengiriman', tone: 'bg-primary/10 text-primary' },
  { id: '#GRM-20260912-008', customer: 'Raka Pratama', city: 'Balikpapan', total: 'Rp49.000', status: 'Menunggu pembayaran', tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-300' },
  { id: '#GRM-20260912-007', customer: 'Nadia Safitri', city: 'Jakarta Selatan', total: 'Rp129.000', status: 'Selesai', tone: 'bg-blue-500/10 text-blue-700 dark:text-blue-300' },
  { id: '#GRM-20260911-004', customer: 'Fajar Hadi', city: 'Samarinda', total: 'Rp49.000', status: 'Diproses', tone: 'bg-secondary text-secondary-foreground' },
]

const stats = [
  ['Pendapatan hari ini', 'Rp1.284.000', '+18,4%', CircleDollarSign],
  ['Pesanan baru', '24', '+6 hari ini', ClipboardList],
  ['Perlu diproses', '8', '3 prioritas', PackageCheck],
  ['Dalam pengiriman', '16', 'J&T Express', Truck],
]

export default function AdminDashboard() {
  const [query, setQuery] = useState('')
  const filteredOrders = orders.filter((order) => `${order.id} ${order.customer} ${order.city}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <main className="mx-auto max-w-7xl p-5 lg:p-10">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, detail, Icon]) => (
          <div className="rounded-2xl border border-border bg-card p-5" key={label as string}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label as string}</p>
              <Icon className="text-primary" size={19} />
            </div>
            <p className="mt-5 font-serif text-3xl font-semibold">{value as string}</p>
            <p className="mt-2 text-xs text-primary">{detail as string}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_.6fr]">
        <section className="rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-6">
            <div>
              <h2 className="text-lg font-semibold">Pesanan terbaru</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pantau pesanan yang masuk hari ini.</p>
            </div>
            <a href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-primary">Lihat semua <ChevronRight size={16} /></a>
          </div>
          <div className="border-b border-border p-4">
            <label className="flex items-center gap-3 rounded-xl border border-input px-3 py-2 text-sm">
              <Search size={16} className="text-muted-foreground" />
              <span className="sr-only">Cari pesanan</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none" placeholder="Cari nomor order, nama, atau kota" />
            </label>
          </div>
          <div className="divide-y divide-border">
            {filteredOrders.map((order) => (
              <a href={`/admin/orders/${order.id.slice(1)}`} key={order.id} className="flex flex-wrap items-center gap-4 p-5 hover:bg-muted/50 sm:flex-nowrap">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{order.id}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{order.customer} · {order.city}</p>
                </div>
                <p className="text-sm font-medium">{order.total}</p>
                <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${order.tone}`}>{order.status}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </a>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Ringkasan toko</h2>
          <p className="mt-1 text-sm text-muted-foreground">Performa 7 hari terakhir</p>
          <div className="mt-8 flex h-40 items-end gap-2">
            {[42, 58, 48, 72, 64, 88, 76].map((height, index) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={height + index}>
                <div className="w-full rounded-t-lg bg-primary/80" style={{ height: `${height}%` }} />
                <span className="text-[10px] text-muted-foreground">{['Rab','Kam','Jum','Sab','Min','Sen','Sel'][index]}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-border pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Konversi checkout</span>
              <strong>68,4%</strong>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div className="h-2 w-[68%] rounded-full bg-primary" />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
