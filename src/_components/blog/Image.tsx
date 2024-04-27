'use client'

import { useState } from 'react'

type ImageProps = {
    src?: string
    alt?: string
    className?: string
}

// @ts-ignore
const hide = (e) => {
    e.target.src = 'path/to/fallback-image.jpg'
}

const Image = ({ src, alt = '', className = '' }: ImageProps) => {
    if (!src || src === '') {
        return null
    }

    return (
        <div
            className={`theme:rounded relative flex flex-row items-center justify-center overflow-hidden ${className} max-h-96 mb-5`}
        >
            <div className="absolute flex flex-row h-full">
                <div className="flex-1 h-full relative z-20 overflow-hidden ">
                    <img
                        className="origin-left scale-x-[15] scale-y-[1.02] h-full "
                        src={src}
                        style={{
                            filter: 'blur(0.3rem)'
                        }}
                    />
                </div>
                <div className="flex-1 h-full relative z-20 overflow-hidden">
                    <img
                        className="origin-right scale-x-[15] scale-y-[1.02] h-full"
                        src={src}
                        style={{
                            filter: 'blur(0.3rem)'
                        }}
                    />
                </div>
            </div>

            <img className={`relative z-20 min-h-10`} src={src} />
        </div>
    )
}

export default Image
