import Color from 'color'

const interpolate = (startColor: Color, endColor: Color, percent: number) => {
    // Convert the hex colors to RGB values
    const [r1, g1, b1] = startColor.rgb().array()
    const [r2, g2, b2] = endColor.rgb().array()

    // Interpolate the RGB values
    const r = Math.round(r1 + (r2 - r1) * percent)
    const g = Math.round(g1 + (g2 - g1) * percent)
    const b = Math.round(b1 + (b2 - b1) * percent)

    // Convert the interpolated RGB values back to a hex color
    const mixedColor =
        '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

    return Color(mixedColor)
}

const Wave = ({
    startColor = '',
    endColor = '',
    darken = true
}: {
    startColor: string | Color
    endColor?: string | Color
    darken?: boolean
}) => {
    let startColorAsColor: Color = Color('#FFFFFF')
    let endColorAsColor: Color = Color('#000000')
    if (typeof startColor === 'string') {
        startColorAsColor = Color(startColor)
    }
    if (typeof endColor === 'string') {
        if (endColor !== '') {
            endColorAsColor = Color(endColor)
        } else {
            if (darken) {
                endColorAsColor = startColorAsColor.darken(0.75)
            }
        }
    }

    const wave1Color = interpolate(startColorAsColor, endColorAsColor, 0.55)
    const wave2Color = interpolate(startColorAsColor, endColorAsColor, 0.85)

    // return null

    return (
        <div className="w-full">
            <svg viewBox="0 0 960 100" className="w-full">
                <rect
                    x="0"
                    y="0"
                    width="960"
                    height="100"
                    // className="theme:wave0"
                    fill={startColorAsColor.hex()}
                ></rect>
                <path
                    d="M0 42L137 32L274 30L411 29L549 47L686 21L823 39L960 45L960 101L823 101L686 101L549 101L411 101L274 101L137 101L0 101Z"
                    // fill="#871400"
                    // className="theme:wave1"
                    fill={wave1Color.hex()}
                ></path>
                <path
                    d="M0 46L137 62L274 57L411 56L549 64L686 55L823 67L960 69L960 101L823 101L686 101L549 101L411 101L274 101L137 101L0 101Z"
                    // fill="#b61039"
                    fill={wave2Color.hex()}
                ></path>
                <path
                    d="M0 83L137 82L274 69L411 81L549 80L686 90L823 80L960 69L960 101L823 101L686 101L549 101L411 101L274 101L137 101L0 101Z"
                    fill={endColorAsColor.hex()}
                ></path>
            </svg>
        </div>
    )
}

export default Wave
