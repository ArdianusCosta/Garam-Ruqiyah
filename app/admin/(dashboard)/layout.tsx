'use client'

import { useState } from 'react'
import { AdminThemeToggle } from '@/components/admin-theme-toggle'
import { AdminProfileMenu } from '@/components/admin-profile-menu'
import { ArrowUpRight, Box, CircleDollarSign, ClipboardList, LayoutTemplate, Leaf, Menu, PackageCheck, Search, Truck, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: ClipboardList, badge: null },
    { name: 'CMS Landing Page', href: '/admin/cms', icon: LayoutTemplate, badge: null },
    { name: 'Pesanan', href: '/admin/orders', icon: Box, badge: '24' },
    { name: 'Pembayaran', href: '/admin/payments', icon: CircleDollarSign, badge: null },
    { name: 'Tracking', href: '/admin/tracking', icon: Truck, badge: null },
    { name: 'Produk', href: '/admin/products', icon: PackageCheck, badge: null },
  ]

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-border bg-background p-6 transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Leaf size={18} />
            </span>
            <span className="font-serif text-lg font-semibold">Garam Mandi</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden" aria-label="Tutup menu"><X /></button>
        </div>
        
        <p className="mt-12 text-xs font-semibold uppercase tracking-[.2em] text-muted-foreground">Workspace</p>
        
        <nav className="mt-4 flex flex-col gap-1 text-sm">
          {navItems.map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 ${isActive ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted'}`}
              >
                <item.icon size={18} /> 
                {item.name}
                {item.badge && <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{item.badge}</span>}
              </Link>
            )
          })}
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-primary p-4 text-primary-foreground">
          <p className="text-xs text-primary-foreground/70">Toko aktif</p>
          <p className="mt-1 font-medium">Garam Mandi Ruqiyah</p>
          <Link className="mt-3 inline-flex items-center gap-1 text-xs text-primary-foreground/80" href="/">
            Lihat storefront <ArrowUpRight size={13} />
          </Link>
        </div>
      </aside>
      
      {mobileOpen && <button className="fixed inset-0 z-20 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Tutup navigasi" />}
      
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur lg:px-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden" aria-label="Buka navigasi"><Menu /></button>
            <div>
              <p className="text-xs text-muted-foreground">Selasa, 13 September 2026</p>
              <h1 className="mt-1 font-serif text-2xl">Selamat pagi, Admin.</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AdminThemeToggle />
            <div className="hidden items-center gap-2 rounded-full border border-input bg-background px-3 py-2 text-sm text-muted-foreground sm:flex">
              <Search size={16} /><span>Cari apa saja...</span>
            </div>
            <AdminProfileMenu />
          </div>
        </header>
        
        {children}
        
      </div>
    </div>
  )
}
