'use client'

import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function AdminModal({ title, description, children, onClose }: { title: string; description?: string; children: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
    <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div><h2 id="admin-modal-title" className="text-xl font-semibold">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div>
        <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Tutup popup"><X size={18} /></button>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  </div>
}

export function ModalField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="flex flex-col gap-2 text-sm font-medium"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-primary/30" /></label>
}

export function ModalActions({ onCancel, submitLabel = 'Simpan', danger = false }: { onCancel: () => void; submitLabel?: string; danger?: boolean }) {
  return <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onCancel} className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">Batal</button><button type="submit" className={`rounded-xl px-4 py-2.5 text-sm font-medium text-primary-foreground ${danger ? 'bg-destructive' : 'bg-primary'}`}>{submitLabel}</button></div>
}

export function ConfirmModal({ title, description, onClose, onConfirm }: { title: string; description: string; onClose: () => void; onConfirm: () => void }) {
  return <AdminModal title={title} description={description} onClose={onClose}><div className="flex justify-end gap-3"><button onClick={onClose} className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium">Batal</button><button onClick={onConfirm} className="rounded-xl bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground">Hapus</button></div></AdminModal>
}
