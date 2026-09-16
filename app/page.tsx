'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, ChevronUp, Clock3, Copy, Leaf, Menu, Moon, Package, Search, ShieldCheck, Sun, Truck, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { CmsProvider, useCms } from '@/components/cms-provider'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import dynamic from 'next/dynamic'
const TrackingMap = dynamic(() => import("@/components/tracking-map"), { ssr: false })
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const formatRupiah = (value: number) => `Rp${value.toLocaleString('id-ID')}`



const formSchema = z.object({
  customerName: z.string().min(2, 'Nama terlalu pendek'),
  whatsapp: z.string().min(10, 'Nomor tidak valid'),
  province: z.string().min(1, 'Pilih provinsi'),
  city: z.string().min(1, 'Pilih kota/kabupaten'),
  address: z.string().min(10, 'Alamat terlalu pendek'),
})

export default function Page() {
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'QRIS'>('QRIS')
  const [copied, setCopied] = useState(false)
  const [searchTracking, setSearchTracking] = useState('')
  
  // Dialog state
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [newTrackingNumber, setNewTrackingNumber] = useState('')

  const subtotal = useMemo(() => quantity * 40000, [quantity])
  const shippingCost = 15000

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      whatsapp: '',
      province: '',
      city: '',
      address: '',
    },
  })

  // Create Order Mutation
  const checkoutMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Gagal membuat pesanan')
      return res.json()
    },
    onSuccess: (data) => {
      if (data.checkout_url) {
        window.location.href = data.checkout_url
        return
      }

      setNewTrackingNumber(data.trackingNumber)
      setSuccessDialogOpen(true)
      form.reset()
      setQuantity(1)
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    checkoutMutation.mutate({
      ...values,
      quantity,
      paymentMethod,
    })
  }

  // Tracking Query
  const trackingQuery = useQuery({
    queryKey: ['order', searchTracking],
    queryFn: async () => {
      if (!searchTracking) return null
      const res = await fetch(`/api/orders/${encodeURIComponent(searchTracking)}`)
      if (!res.ok) throw new Error('Pesanan tidak ditemukan')
      return res.json()
    },
    enabled: !!searchTracking,
  })

  // CMS Query
  const cmsQuery = useQuery({
    queryKey: ['cms'],
    queryFn: async () => {
      const res = await fetch('/api/cms')
      if (!res.ok) throw new Error('Gagal memuat CMS')
      return res.json() as Promise<Record<string, string>>
    }
  })

  const t = (key: string, fallback: string) => cmsQuery.data?.[key] ?? fallback

  const copyResi = async (text: string) => {
    await navigator.clipboard?.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const handleTrackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setSearchTracking(fd.get('tracking') as string)
  }

  return (
    <div className={dark ? 'dark min-h-screen' : 'min-h-screen'}>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
            <a href="#home" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"><Leaf size={18} /></span>
              <span className="font-serif text-lg font-semibold tracking-tight text-primary">{t('navigation.brand', 'Garam Mandi Ruqiyah')}</span>
            </a>
            <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
              <a href="#home" className="hover:text-foreground">Beranda</a><a href="#about" className="hover:text-foreground">{t('navigation.about', 'Tentang')}</a><a href="#product" className="hover:text-foreground">{t('navigation.product', 'Produk')}</a><a href="#tracking" className="hover:text-foreground">{t('navigation.tracking', 'Lacak Pesanan')}</a>
            </nav>
            <div className="flex items-center gap-2">
              <button aria-label="Ganti tema" onClick={() => setDark(!dark)} className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground hover:bg-muted">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
              <a href="#checkout" className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 sm:block">{t('navigation.headerCta', 'Pesan Sekarang')}</a>
              <button aria-label="Buka menu" onClick={() => setMenuOpen(!menuOpen)} className="grid size-10 place-items-center rounded-full border border-border md:hidden">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
            </div>
          </div>
          {menuOpen && <nav className="flex flex-col gap-4 border-t border-border px-5 py-5 text-sm md:hidden"><a href="#home" onClick={() => setMenuOpen(false)}>Beranda</a><a href="#about" onClick={() => setMenuOpen(false)}>{t('navigation.about', 'Tentang')}</a><a href="#product" onClick={() => setMenuOpen(false)}>{t('navigation.product', 'Produk')}</a><a href="#tracking" onClick={() => setMenuOpen(false)}>{t('navigation.tracking', 'Lacak Pesanan')}</a><a href="#checkout" onClick={() => setMenuOpen(false)} className="font-medium text-primary">{t('navigation.headerCta', 'Pesan Sekarang')} <ArrowRight className="ml-1 inline" size={15} /></a></nav>}
        </header>

        <main>
          {/* HOME SECTION */}
          <section id="home" className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-24">
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[.24em] text-primary">{t('hero.eyebrow', 'Garam Mandi Ruqiyah')}</p>
              <div className="max-w-2xl font-serif text-5xl leading-[1.04] tracking-[-.04em] sm:text-6xl lg:text-7xl [&_p]:m-0" dangerouslySetInnerHTML={{ __html: t('hero.headline', 'Pesan mudah,<br/>kirim langsung<br/>ke rumah.') }} />
              <div className="mt-7 max-w-lg text-base leading-7 text-muted-foreground [&_p]:m-0" dangerouslySetInnerHTML={{ __html: t('hero.description', 'Garam mandi pilihan untuk menemani rutinitas perawatan diri yang tenang dan bermakna. Pesan tanpa akun, kami siapkan dengan penuh perhatian.') }} />
              <div className="mt-9 flex flex-wrap items-center gap-3"><a href="#checkout" className="rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90">{t('hero.primaryCta', 'Pesan Sekarang')} <ArrowRight className="ml-2 inline" size={16} /></a><a href="#tracking" className="rounded-full border border-border px-6 py-3.5 text-sm font-medium hover:bg-muted">{t('hero.secondaryCta', 'Lacak Pesanan')}</a></div>
              <div className="mt-12 grid max-w-lg grid-cols-2 gap-y-4 text-sm text-muted-foreground sm:grid-cols-4"><span><Check className="mr-2 inline text-primary" size={15} />{t('hero.price', 'Rp40.000')}</span><span><Check className="mr-2 inline text-primary" size={15} />J&T Express</span><span><Check className="mr-2 inline text-primary" size={15} />COD tersedia</span><span><Check className="mr-2 inline text-primary" size={15} />QRIS tersedia</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-xl"><div className="aspect-[4/4.5] overflow-hidden rounded-[2rem] bg-[#d9e2d3] dark:bg-[#27352d]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.7),transparent_35%)]" /><div className="absolute bottom-[12%] left-1/2 h-[62%] w-[44%] -translate-x-1/2 rounded-[1.8rem] bg-[#f9f7f0] shadow-[0_25px_45px_rgba(28,48,34,.2)] dark:bg-[#e9eee4]"><div className="absolute left-[9%] right-[9%] top-[16%] h-[52%] rounded-xl bg-[#335342] p-4 text-center text-[#f6f3e6] shadow-inner"><div className="mx-auto mb-5 grid size-10 place-items-center rounded-full border border-[#c4d2b6]"><Leaf size={18} /></div><p className="text-[9px] uppercase tracking-[.22em]">Garam Mandi</p><p className="mt-2 font-serif text-xl">Ruqiyah</p><div className="mx-auto mt-4 h-px w-10 bg-[#c4d2b6]" /><p className="mt-4 text-[8px] uppercase tracking-[.14em]">Ritual • Natural • Calm</p></div><div className="absolute bottom-[8%] left-1/2 h-2 w-1/2 -translate-x-1/2 rounded-full bg-[#d9d9cf]" /></div><div className="absolute bottom-[7%] left-[10%] size-20 rounded-full bg-[#b8c9ac]/70 blur-xl" /><div className="absolute right-[9%] top-[13%] size-28 rounded-full border border-white/40" /></div><div className="absolute -bottom-5 -left-3 rounded-2xl border border-border bg-card p-4 shadow-xl sm:left-5"><p className="text-xs text-muted-foreground">Harga satu produk</p><p className="mt-1 font-serif text-2xl font-semibold">{t('hero.price', 'Rp40.000')}</p></div></div>
          </section>

          {/* ABOUT SECTION */}
          <section id="about" className="border-y border-border bg-muted/40"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">{t('about.label', 'Tentang produk')}</p><div className="mt-4 max-w-md font-serif text-4xl leading-tight sm:text-5xl [&_p]:m-0" dangerouslySetInnerHTML={{ __html: t('about.title', 'Ritual sederhana untuk ruang yang lebih tenang.') }} /></div><div className="max-w-xl text-muted-foreground"><div className="text-lg leading-8 [&_p]:m-0" dangerouslySetInnerHTML={{ __html: t('about.body', 'Garam Mandi Ruqiyah dirancang sebagai bagian dari jeda kecil di tengah hari. Gunakan dengan air hangat, tarik napas, dan beri ruang untuk diri sendiri.') }} /><div className="mt-9 grid gap-6 sm:grid-cols-3"><div><ShieldCheck className="text-primary" /><h3 className="mt-3 font-medium text-foreground">{t('about.benefit1', 'Dipilih dengan baik')}</h3><p className="mt-2 text-sm leading-6">Bahan dan proses yang kami jaga dengan penuh perhatian.</p></div><div><Clock3 className="text-primary" /><h3 className="mt-3 font-medium text-foreground">{t('about.benefit2', 'Mudah digunakan')}</h3><p className="mt-2 text-sm leading-6">Teman praktis untuk rutinitas mandi harian.</p></div><div><Truck className="text-primary" /><h3 className="mt-3 font-medium text-foreground">{t('about.benefit3', 'Kirim ke rumah')}</h3><p className="mt-2 text-sm leading-6">Pengiriman aman melalui J&T Express.</p></div></div></div></div></section>

          {/* PRODUCT SECTION */}
          <section id="product" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="grid gap-12 lg:grid-cols-2 lg:items-center"><div className="rounded-[1.5rem] bg-[#edf1e8] p-8 dark:bg-[#202b25]"><div className="mx-auto flex aspect-square max-w-md items-center justify-center rounded-full border border-primary/20 bg-[#e1e9dc] dark:bg-[#2d3b32]"><Package className="text-primary" size={100} strokeWidth={1} /></div></div><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">{t('product.label', 'Produk pilihan')}</p><h2 className="mt-4 font-serif text-4xl">{t('product.name', 'Garam Mandi Ruqiyah')}</h2><p className="mt-3 text-2xl font-medium">{t('product.price', 'Rp40.000')}</p><div className="mt-6 max-w-lg leading-7 text-muted-foreground [&_p]:m-0" dangerouslySetInnerHTML={{ __html: t('product.description', 'Satu produk, satu ritual sederhana. Pilih jumlah yang kamu perlukan dan kami kirimkan dengan J&T Express.') }} /><div className="mt-7 flex items-center gap-4"><div className="flex items-center rounded-full border border-border"><button aria-label="Kurangi jumlah" className="grid size-11 place-items-center" onClick={() => setQuantity(Math.max(1, quantity - 1))}><ChevronDown size={16} /></button><span className="w-8 text-center text-sm">{quantity}</span><button aria-label="Tambah jumlah" className="grid size-11 place-items-center" onClick={() => setQuantity(quantity + 1)}><ChevronUp size={16} /></button></div><a href="#checkout" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Pesan Sekarang</a></div><div className="mt-8 border-t border-border pt-5 text-sm text-muted-foreground"><p><Truck className="mr-2 inline text-primary" size={16} />{t('product.shipping', 'J&T Express · Regular · 2–5 hari')}</p><p className="mt-3"><Check className="mr-2 inline text-primary" size={16} />{t('product.payment', 'Pembayaran COD atau QRIS')}</p></div></div></div></section>

          {/* CHECKOUT SECTION */}
          <section id="checkout" className="border-y border-border bg-muted/40">
            <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
              <div className="mb-10 max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">{t('checkout.label', 'Checkout')}</p>
                <h2 className="mt-4 font-serif text-4xl">{t('checkout.title', 'Selesaikan pesananmu.')}</h2>
                <p className="mt-3 text-muted-foreground">{t('checkout.description', 'Isi data singkat di bawah. Tidak perlu membuat akun.')}</p>
              </div>
              <div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                  <div className="mb-8 flex items-center justify-between text-xs font-medium text-muted-foreground"><span className="text-primary">01 Produk</span><span>02 Data</span><span>03 Pengiriman</span><span>04 Bayar</span></div>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="customerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Lengkap</FormLabel>
                              <FormControl>
                                <Input className="rounded-xl px-4 py-3 h-auto bg-background" placeholder="Nama penerima" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="whatsapp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nomor WhatsApp</FormLabel>
                              <FormControl>
                                <Input className="rounded-xl px-4 py-3 h-auto bg-background" placeholder="08xxxxxxxxxx" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Provinsi</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className="rounded-xl px-4 py-3 h-auto bg-background">
                                    <SelectValue placeholder="Pilih Provinsi" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Kalimantan Timur">Kalimantan Timur</SelectItem>
                                  <SelectItem value="DKI Jakarta">DKI Jakarta</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kabupaten / Kota</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className="rounded-xl px-4 py-3 h-auto bg-background">
                                    <SelectValue placeholder="Pilih Kota" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Samarinda">Samarinda</SelectItem>
                                  <SelectItem value="Balikpapan">Balikpapan</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel>Alamat Lengkap</FormLabel>
                              <FormControl>
                                <textarea 
                                  className="mt-2 min-h-24 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" 
                                  placeholder="Nama jalan, nomor rumah, patokan"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mt-8 border-t border-border pt-7">
                        <p className="text-sm font-medium">{t('checkout.paymentTitle', 'Metode pembayaran')}</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setPaymentMethod('COD')} className={`rounded-xl border p-4 text-left transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-border'}`}><span className="font-medium">COD</span><span className="mt-1 block text-xs text-muted-foreground">Bayar saat diterima</span></button>
                          <button type="button" onClick={() => setPaymentMethod('QRIS')} className={`rounded-xl border p-4 text-left transition-all ${paymentMethod === 'QRIS' ? 'border-primary bg-primary/5' : 'border-border'}`}><span className="font-medium">QRIS</span><span className="mt-1 block text-xs text-muted-foreground">Pembayaran digital cepat</span></button>
                        </div>
                        <Button 
                          type="submit" 
                          disabled={checkoutMutation.isPending}
                          className="mt-7 w-full rounded-full h-auto px-5 py-3.5 font-medium hover:opacity-90 transition-all text-base"
                        >
                          {checkoutMutation.isPending ? 'Memproses...' : `${t('checkout.submit', 'Buat Pesanan')} · ${paymentMethod}`}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
                <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-28">
                  <h3 className="font-serif text-2xl">Ringkasan</h3>
                  <div className="mt-6 flex justify-between text-sm"><span>Garam Mandi Ruqiyah × {quantity}</span><span>{formatRupiah(subtotal)}</span></div>
                  <div className="mt-4 flex justify-between text-sm"><span>J&T Express</span><span>{formatRupiah(shippingCost)}</span></div>
                  <div className="my-5 border-t border-border" />
                  <div className="flex justify-between font-medium"><span>Total</span><span className="text-primary">{formatRupiah(subtotal + shippingCost)}</span></div>
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">Biaya pengiriman dihitung berdasarkan alamat tujuan.</p>
                </aside>
              </div>
            </div>
          </section>

          {/* TRACKING SECTION */}
          <section id="tracking" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">{t('tracking.label', 'Pesananmu')}</p>
                <h2 className="mt-4 font-serif text-4xl">{t('tracking.title', 'Lacak pesanan.')}</h2>
                <div className="mt-4 leading-7 text-muted-foreground [&_p]:m-0" dangerouslySetInnerHTML={{ __html: t('tracking.description', 'Pantau status order dan perjalanan paket dalam satu tempat.') }} />
                <form onSubmit={handleTrackSubmit} className="mt-7 flex gap-2">
                  <Input name="tracking" className="rounded-xl h-auto px-4 py-3 text-sm" placeholder={t('tracking.placeholder', '#GRM-xxxxxxxx-xxxx')} />
                  <Button type="submit" className="rounded-xl px-4 h-auto" disabled={trackingQuery.isFetching}>
                    {trackingQuery.isFetching ? <div className="animate-spin size-4 border-2 border-background border-t-transparent rounded-full"/> : <Search size={17} />}
                  </Button>
                </form>
                {trackingQuery.isError && <p className="mt-3 text-sm text-destructive">Pesanan tidak ditemukan.</p>}
                {trackingQuery.isSuccess && <p className="mt-3 text-sm text-primary">Pesanan ditemukan. Status terakhir baru saja diperbarui.</p>}
              </div>
              
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 min-h-[300px]">
                {trackingQuery.isLoading && (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
                    <p className="text-sm">Mencari pesanan...</p>
                  </div>
                )}
                {!trackingQuery.data && !trackingQuery.isLoading && (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 opacity-60">
                    <Package size={32} />
                    <p className="text-sm">Masukkan nomor pesanan untuk melacak.</p>
                  </div>
                )}
                {trackingQuery.isSuccess && trackingQuery.data && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
                      <div>
                        <p className="text-sm text-muted-foreground">{trackingQuery.data.trackingNumber}</p>
                        <h3 className="mt-2 text-xl font-semibold">
                          {trackingQuery.data.status === 'PENDING' && 'Menunggu Pembayaran'}
                          {trackingQuery.data.status === 'PROCESSING' && 'Pesanan Diproses'}
                          {trackingQuery.data.status === 'SHIPPED' && 'Dalam Pengiriman'}
                          {trackingQuery.data.status === 'DELIVERED' && 'Paket Diterima'}
                        </h3>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">Pembaruan otomatis</span>
                    </div>
                    <div className="mt-7 grid gap-4 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-muted-foreground">Nama Penerima</p>
                        <p className="mt-1 font-medium">{trackingQuery.data.customerName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Nomor Resi / ID</p>
                        <button onClick={() => copyResi(trackingQuery.data.trackingNumber)} className="mt-1 font-medium text-primary">
                          {trackingQuery.data.trackingNumber} <Copy className="ml-1 inline" size={13} />
                        </button>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Bayar ({trackingQuery.data.paymentMethod})</p>
                        <p className="mt-1 font-medium">{formatRupiah(trackingQuery.data.totalPrice)}</p>
                      </div>
                    </div>
                    <div className="mt-8 border-l border-primary/30 pl-6">
                      <div className="relative pb-7 last:pb-0">
                        <span className="absolute -left-[31px] grid size-4 place-items-center rounded-full border-2 border-primary bg-primary text-primary-foreground"><Check size={10} /></span>
                        <p className="text-sm font-medium">Pesanan dibuat</p>
                        <p className="mt-1 text-xs text-muted-foreground">{new Date(trackingQuery.data.createdAt).toLocaleString('id-ID')}</p>
                      </div>
                      {trackingQuery.data.status !== 'PENDING' && (
                        <div className="relative pb-7 last:pb-0">
                          <span className="absolute -left-[31px] grid size-4 place-items-center rounded-full border-2 border-primary bg-primary text-primary-foreground"><Check size={10} /></span>
                          <p className="text-sm font-medium">Pesanan diproses</p>
                          <p className="mt-1 text-xs text-muted-foreground">{new Date(trackingQuery.data.updatedAt).toLocaleString('id-ID')}</p>
                        </div>
                      )}
                      {(trackingQuery.data.status === 'SHIPPED' || trackingQuery.data.status === 'DELIVERED') && (
                        <div className="relative pb-7 last:pb-0">
                          <span className="absolute -left-[31px] grid size-4 place-items-center rounded-full border-2 border-primary bg-primary text-primary-foreground"><Check size={10} /></span>
                          <p className="text-sm font-medium">Paket dalam perjalanan</p>
                        </div>
                      )}
                      {trackingQuery.data.status === 'DELIVERED' && (
                        <div className="relative pb-7 last:pb-0">
                          <span className="absolute -left-[31px] grid size-4 place-items-center rounded-full border-2 border-primary bg-primary text-primary-foreground"><Check size={10} /></span>
                          <p className="text-sm font-medium">Tiba di tujuan</p>
                        </div>
                      )}
                    </div>
                    {copied && <p className="mt-5 text-sm text-primary">Disalin ke clipboard.</p>}
                    
                    {(trackingQuery.data.status === 'SHIPPED' || trackingQuery.data.status === 'DELIVERED') && (
                      <TrackingMap 
                        city={trackingQuery.data.city} 
                        address={trackingQuery.data.address} 
                        isDelivered={trackingQuery.data.status === 'DELIVERED'} 
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div><p className="font-serif text-3xl">{t('footer.ctaTitle', 'Sudah melakukan pemesanan?')}</p><p className="mt-2 text-primary-foreground/70">{t('footer.ctaDescription', 'Simpan nomor pesanan untuk memantau pengiriman.')}</p></div><a href="#tracking" className="w-fit rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground">Lacak Pesanan <ArrowRight className="ml-2 inline" size={16} /></a></div></section>
        </main>

        <footer className="border-t border-border"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><div><p className="font-serif text-lg font-semibold text-foreground">{t('navigation.brand', 'Garam Mandi Ruqiyah')}</p><p className="mt-2">{t('footer.tagline', 'Ritual kecil untuk jeda yang lebih berarti.')}</p></div><div className="flex flex-wrap gap-5"><a href="#home">Beranda</a><a href="#about">Tentang</a><a href="#product">Produk</a><a href="#tracking">Lacak</a><a href="/admin" className="font-medium text-primary">Admin</a></div><p>{t('footer.copyright', '© 2026 Garam Mandi Ruqiyah')}</p></div></footer>
      </div>

      {/* SUCCESS DIALOG / POPUP */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md text-center rounded-[2rem] p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Check className="size-8 text-primary" strokeWidth={3} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-center">Pesanan Berhasil!</DialogTitle>
            <DialogDescription className="text-center pt-2 text-base">
              Pesananmu telah kami terima dan sedang diproses. Simpan nomor pesanan ini untuk melacak pengiriman:
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-4 rounded-xl mt-4 border border-border flex items-center justify-between">
            <span className="font-mono text-lg font-semibold">{newTrackingNumber}</span>
            <Button variant="ghost" size="icon" onClick={() => copyResi(newTrackingNumber)}>
              <Copy size={16} />
            </Button>
          </div>
          {copied && <p className="text-sm text-primary mt-2">Nomor disalin!</p>}

          <div className="mt-6">
            <Button onClick={() => setSuccessDialogOpen(false)} className="w-full rounded-full h-12 text-base">
              Tutup & Kembali
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
