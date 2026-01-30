interface ZebraLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { width: 140, height: 60, stripeBox: 36, fontSize: 18, subSize: 7, gap: 1 },
  md: { width: 200, height: 80, stripeBox: 50, fontSize: 26, subSize: 9.5, gap: 2 },
  lg: { width: 280, height: 110, stripeBox: 70, fontSize: 36, subSize: 13, gap: 3 },
}

export default function ZebraLogo({ size = 'md', className = '' }: ZebraLogoProps) {
  const s = sizes[size]

  return (
    <svg
      width={s.width}
      height={s.height}
      viewBox={`0 0 ${s.width} ${s.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cuadrado con rayas de cebra */}
      <rect x="0" y="0" width={s.stripeBox} height={s.stripeBox} fill="black" rx="2" />
      {/* Rayas diagonales blancas */}
      <clipPath id={`clip-${size}`}>
        <rect x="0" y="0" width={s.stripeBox} height={s.stripeBox} rx="2" />
      </clipPath>
      <g clipPath={`url(#clip-${size})`}>
        {/* Patrón de rayas diagonales blancas sobre fondo negro */}
        {Array.from({ length: 8 }).map((_, i) => {
          const offset = (i - 2) * (s.stripeBox / 3.2)
          return (
            <rect
              key={i}
              x={offset}
              y={-s.stripeBox * 0.5}
              width={s.stripeBox / 6}
              height={s.stripeBox * 2}
              fill="white"
              transform={`rotate(-45, ${s.stripeBox / 2}, ${s.stripeBox / 2})`}
            />
          )
        })}
      </g>

      {/* Texto ZE encima - primera fila */}
      <text
        x={s.stripeBox + s.gap * 3}
        y={s.stripeBox * 0.48}
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={s.fontSize}
        fontWeight="900"
        fill="black"
        dominantBaseline="middle"
        letterSpacing="2"
      >
        ZE
      </text>

      {/* Texto BRA - segunda fila */}
      <text
        x={s.stripeBox + s.gap * 3}
        y={s.stripeBox * 0.88}
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={s.fontSize}
        fontWeight="900"
        fill="black"
        dominantBaseline="middle"
        letterSpacing="2"
      >
        BRA
      </text>

      {/* Símbolo ® */}
      <text
        x={s.width * 0.72}
        y={s.stripeBox * 0.35}
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={s.subSize * 0.9}
        fill="black"
        dominantBaseline="middle"
      >
        ®
      </text>

      {/* Barra PUBLICIDAD */}
      <rect
        x="0"
        y={s.stripeBox + s.gap * 2}
        width={s.width * 0.72}
        height={s.height - s.stripeBox - s.gap * 2}
        fill="black"
        rx="1"
      />
      <text
        x={s.width * 0.36}
        y={s.stripeBox + s.gap * 2 + (s.height - s.stripeBox - s.gap * 2) / 2}
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={s.subSize}
        fontWeight="600"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        letterSpacing="4"
      >
        PUBLICIDAD
      </text>
    </svg>
  )
}
