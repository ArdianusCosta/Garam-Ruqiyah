'use client'

import { useState, useRef, useEffect } from 'react'
import { LogOut, User } from 'lucide-react'
import { logoutAction } from '@/lib/auth'

export function AdminProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="grid size-10 place-items-center rounded-full bg-primary/10 font-semibold text-primary outline-none transition-transform hover:scale-105 focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        AR
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-2xl border border-border bg-background shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-medium">Admin Workspace</p>
            <p className="text-xs text-muted-foreground">admin@garammandi.com</p>
          </div>
          <div className="p-2">
            <a href="/admin/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <User size={16} /> Profil Saya
            </a>
            <form action={logoutAction}>
              <button type="submit" className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <LogOut size={16} /> Keluar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
