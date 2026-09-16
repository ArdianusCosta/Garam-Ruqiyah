'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminThemeToggle } from '@/components/admin-theme-toggle'
import { ArrowLeft, Check, CircleDollarSign, Leaf, Search } from 'lucide-react'

type Order = {
  id: string
  trackingNumber: string
  customerName: string
  paymentMethod: string
  totalPrice: number
  status: string
  createdAt: string
}

export default function PaymentsPage() {
  const [query, setQuery] = useState('')
  const queryClient = useQueryClient()

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders')
      if (!res.ok) throw new Error('Failed to fetch orders')
      return res.json()
    }
  })

  // We only show pending payments here
  const pendingOrders = orders.filter((order) => order.status === 'PENDING')
  
  const filteredOrders = pendingOrders.filter((order) => {
    const searchString = `${order.trackingNumber} ${order.customerName} ${order.paymentMethod}`.toLowerCase()
    return searchString.includes(query.toLowerCase())
  })

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  const verifyMutation = useMutation({
    mutationFn: async (trackingNumber: string) => {
      const res = await fetch(`/api/orders/${encodeURIComponent(trackingNumber)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PROCESSING' })
      })
      if (!res.ok) throw new Error('Update failed')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  return (
    <main className="mx-auto max-w-7xl p-5 lg:p-10">
        <a href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Dashboard
        </a>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">Workspace</p>
            <h1 className="mt-3 font-serif text-4xl">Pembayaran</h1>
            <p className="mt-2 text-muted-foreground">Verifikasi pembayaran pesanan yang masuk.</p>
          </div>
          <label className="flex w-full items-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-sm sm:w-80">
            <Search size={16} className="text-muted-foreground" />
            <span className="sr-only">Cari pesanan</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none" placeholder="Cari pesanan..." />
          </label>
        </div>
        
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
             <div className="col-span-full p-8 text-center text-sm text-muted-foreground">Memuat data...</div>
          ) : filteredOrders.length === 0 ? (
             <div className="col-span-full p-12 text-center text-sm text-muted-foreground border border-border rounded-2xl bg-card">
               <CircleDollarSign size={32} className="mx-auto mb-4 opacity-50" />
               Semua pembayaran sudah diverifikasi!
             </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{order.trackingNumber}</p>
                      <h3 className="mt-1 font-semibold">{order.customerName}</h3>
                    </div>
                    <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-600">Pending</span>
                  </div>
                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Metode</span><span className="font-medium">{order.paymentMethod}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Transfer</span><span className="font-semibold text-primary">{formatRupiah(order.totalPrice)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Waktu</span><span>{new Date(order.createdAt).toLocaleDateString('id-ID')}</span></div>
                  </div>
                </div>
                
                <button 
                  onClick={() => { if (window.confirm(`Yakin ingin memverifikasi pembayaran dari ${order.customerName}? Pastikan dana sudah masuk ke rekening.`)) { verifyMutation.mutate(order.trackingNumber) } }}
                  disabled={verifyMutation.isPending && verifyMutation.variables === order.trackingNumber}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-70"
                >
                  <Check size={16} /> 
                  {verifyMutation.isPending && verifyMutation.variables === order.trackingNumber ? 'Memverifikasi...' : 'Verifikasi & Proses'}
                </button>
              </div>
            ))
          )}
        </div>
    </main>
  )
}
