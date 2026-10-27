'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import { LocateFixed, Minus, Plus } from 'lucide-react'
import {
    getProfessionalCategory,
    renderProfessionalCategoryIcon,
} from '@/components/shared/professional-categories'
import L from 'leaflet'

// Coordenadas fijas en Santiago del Estero Capital
const SGO_CENTER = { lat: -27.7833, lng: -64.2667 }

const customIcon = (color: string, iconMarkup: string) =>
    L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<span class="professional-map-pin" style="--pin-color:${color}"><span>${iconMarkup}</span></span>`,
        iconSize: [36, 42],
        iconAnchor: [18, 40],
    })

function MapController() {
    const map = useMap()
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize()
        }, 200)
        return () => clearTimeout(timer)
    }, [map])
    return null
}

function MapControls({ center }: { center: { lat: number; lng: number } }) {
    const map = useMap()

    return (
        <div className="professional-map-controls">
            <button
                type="button"
                onClick={() => map.flyTo([center.lat, center.lng], 14)}
                aria-label="Volver a mi ubicación"
            >
                <LocateFixed className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => map.zoomIn()} aria-label="Acercar mapa">
                <Plus className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => map.zoomOut()} aria-label="Alejar mapa">
                <Minus className="h-4 w-4" />
            </button>
        </div>
    )
}

interface ProfessionalMapProps {
    onSelectProfessional: (profileId: string) => void
    professionals: Array<{
        id: string
        profileId: string
        name: string
        specialty: string
        lat: number
        lng: number
        type: string
    }>
}

export default function MapReal({
    professionals,
    onSelectProfessional,
}: ProfessionalMapProps) {
    const [userCoords, setUserCoords] = useState(SGO_CENTER)

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                },
                () => setUserCoords(SGO_CENTER)
            )
        }
    }, [])

    return (
        <div className="w-full h-full relative z-0 flex-1">
            <MapContainer
                center={[userCoords.lat, userCoords.lng]}
                zoom={13}
                zoomControl={false}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            >
                <MapController />
                <MapControls center={userCoords} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Circle
                    center={[userCoords.lat, userCoords.lng]}
                    radius={2000}
                    pathOptions={{
                        fillColor: '#064e3b',
                        fillOpacity: 0.12,
                        color: '#064e3b',
                        weight: 1.5,
                    }}
                />

                {professionals.map((prof) => {
                    const category = getProfessionalCategory(prof.type)

                    return (
                        <Marker
                            key={prof.id}
                            position={[prof.lat, prof.lng]}
                            eventHandlers={{
                                click: () => onSelectProfessional(prof.profileId),
                            }}
                            icon={customIcon(
                                category?.markerColor ?? '#64748b',
                                renderProfessionalCategoryIcon(prof.type),
                            )}
                        >
                            <Popup className="professional-map-popup">
                                <div className="professional-map-popup text-xs font-sans p-1">
                                    <strong className="block text-slate-900 font-bold">{prof.name}</strong>
                                    <span className="text-slate-500">{prof.specialty}</span>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}