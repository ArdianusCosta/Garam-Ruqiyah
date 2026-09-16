import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createIpaymuTransaction } from '@/lib/ipaymu'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customerName, whatsapp, province, city, address, quantity, paymentMethod } = body

    // Validation (basic)
    if (!customerName || !whatsapp || !province || !city || !address || !quantity || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate Tracking Number
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const trackingNumber = `GRM-${dateStr}-${randomNum}`

    // Calculate total price
    const basePrice = 40000
    const shippingPrice = 15000 // In a real app, calculate based on province/city
    const totalPrice = (basePrice * quantity) + shippingPrice

    const order = await prisma.order.create({
      data: {
        trackingNumber,
        customerName,
        whatsapp,
        province,
        city,
        address,
        quantity,
        totalPrice,
        paymentMethod,
        status: 'PENDING'
      }
    })

    let checkout_url = null
    
    // Only call iPaymu if it's a digital payment (QRIS)
    if (paymentMethod !== 'COD') {
      try {
        const transaction = await createIpaymuTransaction({
          referenceId: trackingNumber,
          amount: totalPrice,
          customerName,
          customerEmail: 'customer@example.com', // fallback
          customerPhone: whatsapp,
          products: ["Garam Mandi Ruqiyah", "Ongkos Kirim"],
          quantities: [quantity, 1],
          prices: [basePrice, shippingPrice],
          method: 'qris' // iPaymu's method for QRIS
        })
        checkout_url = transaction.Url || transaction.url
      } catch (ipaymuError) {
        console.error('iPaymu Error:', ipaymuError)
        // If ipaymu fails, order is saved, we can fallback to manual transfer or tell user
      }
    }

    return NextResponse.json({ 
      success: true, 
      trackingNumber: order.trackingNumber, 
      order,
      checkout_url 
    }, { status: 201 })
  } catch (error) {
    console.error('Create Order Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Fetch Orders Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
