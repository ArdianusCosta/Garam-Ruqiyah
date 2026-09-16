'use client'

import { useActionState } from 'react'
import { Leaf, ArrowRight, LockKeyhole } from 'lucide-react'
import { loginAction } from '@/lib/auth'

export default function AdminLoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-5">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Leaf size={28} />
          </span>
          <h1 className="mt-6 font-serif text-3xl font-semibold">Admin Workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masukkan kata sandi untuk masuk ke dashboard Garam Mandi.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <form action={action} className="flex flex-col gap-5">
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <LockKeyhole size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-input bg-background py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              {state?.error && (
                <p className="mt-2 text-sm text-red-500">{state.error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-70"
            >
              {isPending ? 'Memverifikasi...' : 'Masuk Dashboard'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Garam Mandi Ruqiyah. Akses dibatasi.
        </p>
      </div>
    </div>
  )
}
