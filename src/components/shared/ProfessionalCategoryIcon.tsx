import {
    getProfessionalCategory,
    PROFESSIONAL_CATEGORIES,
} from './professional-categories'

interface ProfessionalCategoryIconProps {
    type: string
    className?: string
    color?: string
    size?: number
}

export default function ProfessionalCategoryIcon({
    type,
    className,
    color = 'currentColor',
    size = 24,
}: ProfessionalCategoryIconProps) {
    const shapes = getProfessionalCategory(type)?.icon ?? PROFESSIONAL_CATEGORIES[0].icon

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {shapes.map((shape, index) =>
                shape.element === 'circle' ? (
                    <circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} />
                ) : (
                    <path key={index} d={shape.d} />
                ),
            )}
        </svg>
    )
}
