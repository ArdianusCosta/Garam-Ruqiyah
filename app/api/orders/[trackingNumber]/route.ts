import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ trackingNumber: string }> }) {
  try {
    const { trackingNumber } = await params
    
    if (!trackingNumber) {
      return NextResponse.json({ error: 'Tracking number is required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: {
        trackingNumber
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Fetch Order Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ trackingNumber: string }> }) {
  try {
    const { trackingNumber } = await params
    const body = await req.json()
    const { status } = body
    
    if (!trackingNumber || !status) {
      return NextResponse.json({ error: 'Tracking number and status are required' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { trackingNumber },
      data: { status }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Update Order Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
