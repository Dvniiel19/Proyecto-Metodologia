import { useState } from 'react'

function Star({ filled, onClick, onMouseEnter, onMouseLeave, interactive }) {
  return (
    <svg
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      viewBox="0 0 24 24"
      className={`h-7 w-7 ${interactive ? 'cursor-pointer' : ''}`}
      fill={filled ? '#000000' : 'none'}
      stroke="#000000"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.98 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  )
}

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
}) {
  const [hovered, setHovered] = useState(0)

  const displayValue = readOnly ? value : hovered || value

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          filled={star <= displayValue}
          interactive={!readOnly}
          onClick={readOnly ? undefined : () => onChange(star)}
          onMouseEnter={readOnly ? undefined : () => setHovered(star)}
          onMouseLeave={readOnly ? undefined : () => setHovered(0)}
        />
      ))}
    </div>
  )
}
