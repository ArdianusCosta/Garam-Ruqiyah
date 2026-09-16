import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const contents = await prisma.cmsContent.findMany()
    const data = contents.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, string>)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching CMS content:', error)
    return NextResponse.json({ error: 'Failed to fetch cms content' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const entries = Object.entries(body)
    
    const updates = entries.map(([key, value]) => {
      return prisma.cmsContent.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    })

    await prisma.$transaction(updates)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating CMS content:', error)
    return NextResponse.json({ error: 'Failed to update cms content' }, { status: 500 })
  }
}
