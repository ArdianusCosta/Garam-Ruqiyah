'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// We need a dummy coordinate based on city if possible, or just hardcoded for simulation
const COORDINATES: Record<string, [number, number]> = {
  'Samarinda': [-0.5022, 117.1536],
  'Balikpapan': [-1.2379, 116.8529],
  'Jakarta': [-6.2088, 106.8456],
  'Surabaya': [-7.2504, 112.7688],
  'Bandung': [-6.9175, 107.6191],
  'Default': [-1.2379, 116.8529], // Balikpapan
}

const truckSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10h1"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`

const homeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`

export default function TrackingMap({ city, address, isDelivered }: { city: string, address: string, isDelivered: boolean }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Fix leaflet default icon issue in React
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }, [])

  const truckIcon = useMemo(() => {
    if (!mounted) return null;
    return new L.DivIcon({
      html: `<div style="background-color: #16a34a; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">${truckSvg}</div>`,
      className: '', 
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    })
  }, [mounted])

  const homeIcon = useMemo(() => {
    if (!mounted) return null;
    return new L.DivIcon({
      html: `<div style="background-color: #374151; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">${homeSvg}</div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    })
  }, [mounted])

  if (!mounted || !truckIcon || !homeIcon) {
    return <div className="mt-8 h-[350px] w-full bg-muted/30 animate-pulse rounded-2xl flex items-center justify-center text-sm text-muted-foreground">Memuat Peta...</div>
  }

  const destination = COORDINATES[city] || COORDINATES['Default']
  const startPoint: [number, number] = COORDINATES['Samarinda']
  const currentPos: [number, number] = isDelivered ? destination : [
    startPoint[0] + (destination[0] - startPoint[0]) * 0.7,
    startPoint[1] + (destination[1] - startPoint[1]) * 0.7,
  ]

  return (
    <div className="mt-8 h-[350px] w-full overflow-hidden rounded-2xl border border-border relative z-0">
      <MapContainer 
        center={currentPos} 
        zoom={9} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route Line */}
        <Polyline 
          positions={[startPoint, destination]} 
          color="#16a34a" 
          weight={4} 
          dashArray="10, 10" 
        />
        
        {/* Destination Marker */}
        <Marker position={destination} icon={homeIcon}>
          <Popup>
            <b>Tujuan:</b><br />{address}, {city}
          </Popup>
        </Marker>

        {/* Truck Marker */}
        <Marker position={currentPos} icon={truckIcon} zIndexOffset={100}>
          <Popup>
            <b>{isDelivered ? 'Paket Diterima' : 'Kurir sedang dalam perjalanan'}</b>
          </Popup>
        </Marker>

      </MapContainer>
    </div>
  )
}
