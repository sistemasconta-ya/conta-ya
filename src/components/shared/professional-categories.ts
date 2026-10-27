export type ProfessionalCategoryIconShape =
    | { element: 'path'; d: string }
    | { element: 'circle'; cx: string; cy: string; r: string }

export const PROFESSIONAL_CATEGORIES = [
    {
        type: 'psychologist',
        title: 'Psicólogo/a',
        label: 'Psicólogos',
        description: 'Atención profesional de salud mental',
        icon: [
            { element: 'path', d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' },
            { element: 'circle', cx: '12', cy: '7', r: '4' },
        ],
        markerColor: '#07865f',
        iconClass: 'bg-emerald-100 text-emerald-800',
        activeClass: 'border-emerald-600 bg-emerald-50',
        priceClass: 'text-emerald-800',
    },
    {
        type: 'therapist',
        title: 'Acompañante Terapéutico',
        label: 'Acompañantes',
        description: 'Apoyo y contención',
        icon: [
            {
                element: 'path',
                d: 'M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5',
            },
        ],
        markerColor: '#8b5cf6',
        iconClass: 'bg-violet-100 text-violet-700',
        activeClass: 'border-violet-500 bg-violet-50',
        priceClass: 'text-violet-700',
    },
    {
        type: 'coach',
        title: 'Coach Ontológico',
        label: 'Coaches',
        description: 'Acompañamiento personal',
        icon: [
            {
                element: 'path',
                d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
            },
        ],
        markerColor: '#0f9f8f',
        iconClass: 'bg-teal-100 text-teal-700',
        activeClass: 'border-teal-500 bg-teal-50',
        priceClass: 'text-teal-700',
    },
    {
        type: 'student',
        title: 'Estudiante avanzado',
        label: 'Estudiantes',
        description: 'Atención supervisada • Tarifas accesibles',
        icon: [
            {
                element: 'path',
                d: 'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z',
            },
            { element: 'path', d: 'M22 10v6' },
            { element: 'path', d: 'M6 12.5V16a6 3 0 0 0 12 0v-3.5' },
        ],
        markerColor: '#2684e8',
        iconClass: 'bg-sky-100 text-sky-700',
        activeClass: 'border-sky-500 bg-sky-50',
        priceClass: 'text-sky-700',
    },
] as const

export interface ProfessionalCategory {
    type: string
    title: string
    label: string
    description: string
    icon: readonly ProfessionalCategoryIconShape[]
    markerColor: string
    iconClass: string
    activeClass: string
    priceClass: string
}

export function getProfessionalCategory(type: string): ProfessionalCategory | undefined {
    return PROFESSIONAL_CATEGORIES.find((category) => category.type === type)
}

export function renderProfessionalCategoryIcon(type: string): string {
    const shapes = getProfessionalCategory(type)?.icon ?? PROFESSIONAL_CATEGORIES[0].icon
    const content = shapes.map((shape) => {
        if (shape.element === 'circle') {
            return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}"/>`
        }
        return `<path d="${shape.d}"/>`
    }).join('')

    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`
}
