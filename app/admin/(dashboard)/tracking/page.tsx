'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminThemeToggle } from '@/components/admin-theme-toggle'
import { ArrowLeft, Check, Leaf, PackageCheck, Search, Truck } from 'lucide-react'

type Order = {
  id: string
  trackingNumber: string
  customerName: string
  address: string
  city: string
  province: string
  status: string
  createdAt: string
}

export default function TrackingPage() {
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

  // Show PROCESSING and SHIPPED orders
  const activeOrders = orders.filter((order) => order.status === 'PROCESSING' || order.status === 'SHIPPED')
  
  const filteredOrders = activeOrders.filter((order) => {
    const searchString = `${order.trackingNumber} ${order.customerName} ${order.city}`.toLowerCase()
    return searchString.includes(query.toLowerCase())
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ trackingNumber, status }: { trackingNumber: string, status: string }) => {
      const res = await fetch(`/api/orders/${encodeURIComponent(trackingNumber)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
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
            <h1 className="mt-3 font-serif text-4xl">Tracking Pengiriman</h1>
            <p className="mt-2 text-muted-foreground">Kirim pesanan dan pantau status logistik.</p>
          </div>
          <label className="flex w-full items-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-sm sm:w-80">
            <Search size={16} className="text-muted-foreground" />
            <span className="sr-only">Cari pesanan</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none" placeholder="Cari resi / nama..." />
          </label>
        </div>
        
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {isLoading ? (
             <div className="col-span-full p-8 text-center text-sm text-muted-foreground">Memuat data logistik...</div>
          ) : filteredOrders.length === 0 ? (
             <div className="col-span-full p-12 text-center text-sm text-muted-foreground border border-border rounded-2xl bg-card">
               <PackageCheck size={32} className="mx-auto mb-4 opacity-50" />
               Belum ada paket yang perlu dikirim.
             </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{order.trackingNumber}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-600' : 'bg-primary/10 text-primary'}`}>
                      {order.status === 'PROCESSING' ? 'Siap Dikirim' : 'Sedang Dikirim'}
                    </span>
                  </div>
                  <div className="mt-5 rounded-xl bg-muted/50 p-4 text-sm">
                    <p className="font-medium text-foreground">{order.address}</p>
                    <p className="mt-1 text-muted-foreground">{order.city}, {order.province}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  {order.status === 'PROCESSING' ? (
                    <button 
                      onClick={() => updateStatusMutation.mutate({ trackingNumber: order.trackingNumber, status: 'SHIPPED' })}
                      disabled={updateStatusMutation.isPending}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-70"
                    >
                      <Truck size={16} /> Tandai Sudah Dikirim
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateStatusMutation.mutate({ trackingNumber: order.trackingNumber, status: 'DELIVERED' })}
                      disabled={updateStatusMutation.isPending}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary text-primary px-4 py-2.5 text-sm font-medium hover:bg-primary/5 disabled:opacity-70"
                    >
                      <Check size={16} /> Tandai Paket Diterima
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
    </main>
  )
}
