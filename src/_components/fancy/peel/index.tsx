'use client'

import './peel.css'
import { useEffect, memo } from 'react'

const Peel = ({ text = 'No Time For Caution' }: { text?: string }) => {
    useEffect(() => {
        var supports3DTransforms =
            document.body.style['perspective'] !== undefined

        function linkify(selector: string, char_crossfade: number) {
            var cc = char_crossfade != null ? char_crossfade : 150
            var ad = 0

            if (supports3DTransforms) {
                var elements = document.querySelectorAll(selector)
                elements.forEach(function (node) {
                    var nodeText = text
                    var char_count = text.length

                    node.textContent = '' // Clear the node
                    for (var i = 0; i < char_count; i++) {
                        var char = nodeText[i]
                        if (char !== ' ') {
                            var span = document.createElement('span')
                            span.className = 'letter'
                            span.setAttribute('data-letter', char)
                            span.innerHTML =
                                `<span class="char2" style="-webkit-animation-delay:${i * cc + ad}ms;-moz-animation-delay:${i * cc + ad}ms;ms;-ms-animation-delay:${i * cc + ad}ms;ms;-o-animation-delay:${i * cc + ad}ms;ms;animation-delay:${i * cc + ad}ms;">${char}</span>${char}` +
                                `<span class="char1" style="-webkit-animation-delay:${i * cc + ad}ms;-moz-animation-delay:${i * cc + ad}ms;ms;-ms-animation-delay:${i * cc + ad}ms;ms;-o-animation-delay:${i * cc + ad}ms;ms;animation-delay:${i * cc + ad}ms;">${char}</span>`
                            node.appendChild(span)
                        } else {
                            var spaceSpan = document.createElement('span')
                            spaceSpan.className = 'letter'
                            spaceSpan.innerHTML = ' &nbsp '
                            node.appendChild(spaceSpan)
                        }
                    }
                    ad += char_count * char_crossfade
                })
            } else {
                var elements = document.querySelectorAll(selector)
                elements.forEach(function (node) {
                    node.classList.add('letter')
                })
            }
        }

        // Add class name here followed by crossfade character animation delay in millisecond
        linkify('.peelMessage', 200)

        // setInterval(function () {
        //     linkify('.peelMessage', 200)
        // }, 6000)
    }, [text])

    //
    return (
        <div
            className="theme:rounded peel overflow-hidden h-96 w-full flex justify-center items-center"
            style={{ backgroundColor: '#261230' }}
        >
            <div className="peelMessage">{text}</div>
        </div>
    )
}

export default memo(Peel)
