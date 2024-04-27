'use client'

import './morph.css'
import { memo, useEffect } from 'react'

const Morph = ({ text = 'No Time To Caution' }: { text?: string }) => {
    useEffect(() => {
        const elts = {
            text1: document.getElementById('morph-text1'),
            text2: document.getElementById('morph-text2')
        }

        if (elts.text1 == null || elts.text2 == null) {
            return
        }

        // The strings to morph between. You can change these to anything you want!
        const texts = text.split(' ')

        // Controls the speed of morphing.
        const morphTime = 1
        const cooldownTime = 0.25

        let textIndex = texts.length - 1
        let time = new Date()
        let morph = 0
        let cooldown = cooldownTime

        elts.text1.textContent = texts[textIndex % texts.length]
        elts.text2.textContent = texts[(textIndex + 1) % texts.length]

        function doMorph() {
            morph -= cooldown
            cooldown = 0

            let fraction = morph / morphTime

            if (fraction > 1) {
                cooldown = cooldownTime
                fraction = 1
            }

            setMorph(fraction)
        }

        // A lot of the magic happens here, this is what applies the blur filter to the text.
        function setMorph(fraction: number) {
            if (elts.text1 == null || elts.text2 == null) {
                return
            }

            // fraction = Math.cos(fraction * Math.PI) / -2 + .5;

            elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
            elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`

            fraction = 1 - fraction
            elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
            elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`

            elts.text1.textContent = texts[textIndex % texts.length]
            elts.text2.textContent = texts[(textIndex + 1) % texts.length]
        }

        function doCooldown() {
            if (elts.text1 == null || elts.text2 == null) {
                return
            }

            morph = 0

            elts.text2.style.filter = ''
            elts.text2.style.opacity = '100%'

            elts.text1.style.filter = ''
            elts.text1.style.opacity = '0%'
        }

        // Animation loop, which is called every frame.
        function animate() {
            requestAnimationFrame(animate)

            let newTime = new Date()
            let shouldIncrementIndex = cooldown > 0

            // @ts-ignore
            let dt = (newTime - time) / 1000
            time = newTime

            cooldown -= dt

            if (cooldown <= 0) {
                if (shouldIncrementIndex) {
                    textIndex++
                }

                doMorph()
            } else {
                doCooldown()
            }
        }

        // Start the animation.
        animate()
    }, [text])

    return (
        <div
            className="theme:rounded h-96 w-full mb-4 bg-pink-600 flex flex-col items-center justify-center"
            // style={{
            //     backgroundColor: 'rgb(38, 18, 49, 0.8)',
            //     color: '#fff'
            // }}
        >
            <div className="relative w-full flex flex-row items-center">
                <div
                    id="morph-container"
                    className="!bg-pink-500 flex flex-col items-center justify-center w-full"
                >
                    <span id="morph-text1"></span>
                    <span id="morph-text2"></span>
                </div>
            </div>

            {/* SVG filter used to create the merging effect */}
            <svg id="filters" className="hidden">
                <defs>
                    <filter id="threshold">
                        <feColorMatrix
                            in="SourceGraphic"
                            type="matrix"
                            values="1 0 0 0 0
									0 1 0 0 0
									0 0 1 0 0
									0 0 0 255 -140"
                        />
                    </filter>
                </defs>
            </svg>
        </div>
    )
}

export default memo(Morph)
