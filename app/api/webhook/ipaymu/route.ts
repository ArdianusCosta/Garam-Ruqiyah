import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    
    // Parse URL-encoded body if it's form data, or JSON
    let data: Record<string, any> = {}
    if (req.headers.get('content-type')?.includes('application/json')) {
      data = JSON.parse(rawBody)
    } else {
      const searchParams = new URLSearchParams(rawBody)
      data = Object.fromEntries(searchParams.entries())
    }

    const { reference_id, status_code, status } = data
    
    if (!reference_id) {
      return NextResponse.json({ error: 'Missing reference_id' }, { status: 400 })
    }
    
    const isSuccess = String(status_code) === '1' || status?.toLowerCase() === 'berhasil' || status?.toLowerCase() === 'sukses'

    if (isSuccess) {
      await prisma.order.update({
        where: { trackingNumber: reference_id },
        data: { status: 'PROCESSING' }
      })
    } else if (String(status_code) === '-2' || status?.toLowerCase() === 'expired') {
      // Handle expired if needed
    }

    // iPaymu requires a 200 OK string or similar response
    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('iPaymu Webhook Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
