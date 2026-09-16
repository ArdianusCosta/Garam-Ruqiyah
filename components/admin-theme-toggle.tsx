'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const themeCookie = 'admin-theme'

export function AdminThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = document.cookie.split('; ').find((item) => item.startsWith(`${themeCookie}=`))?.split('=')[1]
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const nextDark = saved ? saved === 'dark' : prefersDark
    document.documentElement.classList.toggle('dark', nextDark)
    setDark(nextDark)
  }, [])

  const toggleTheme = () => {
    const nextDark = !dark
    document.documentElement.classList.toggle('dark', nextDark)
    document.cookie = `${themeCookie}=${nextDark ? 'dark' : 'light'}; path=/; max-age=31536000; samesite=lax`
    setDark(nextDark)
  }

  return <button type="button" onClick={toggleTheme} aria-label={dark ? 'Gunakan light mode' : 'Gunakan dark mode'} title={dark ? 'Light mode' : 'Dark mode'} className="grid size-10 place-items-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground">
    {dark ? <Sun size={17} /> : <Moon size={17} />}
  </button>
}
