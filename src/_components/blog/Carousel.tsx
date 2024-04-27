import React, { useState, useEffect } from 'react'

import { ReactNode } from 'react'

const Carousel = ({
    children,
    autoSlide = false,
    autoSlideInterval = 3000
}: {
    children: any[]
    autoSlide?: boolean
    autoSlideInterval?: number
}) => {
    // const [curr, setCurr] = useState(0)

    // const prev = () =>
    //     setCurr((curr) => (curr === 0 ? children.length - 1 : curr - 1))
    // const next = () =>
    //     setCurr((curr) => (curr === children.length - 1 ? 0 : curr + 1))

    // useEffect(() => {
    //     if (!autoSlide) return
    //     const slideInterval = setInterval(next, autoSlideInterval)
    //     return () => clearInterval(slideInterval)
    // }, [])

    const [curr, setCurr] = useState(1) // Start from 1 because of the prepended last item
    const childrenArray = React.Children.toArray(children)
    const totalChildren = childrenArray.length
    const [slides, setSlides] = useState(childrenArray)

    const next = () => {
        setCurr((curr) => (curr + 1) % (totalChildren + 1))
        setTimeout(() => {
            setSlides((currentSlides) => {
                if (curr === totalChildren) {
                    // If it's on the last item
                    return [...currentSlides.slice(1), currentSlides[0]] // Move the first item to the last
                } else {
                    return currentSlides
                }
            })
        }, 5000)
    }

    const prev = () => {
        setCurr((curr) => (curr - 1 + totalChildren + 1) % (totalChildren + 1))
    }

    useEffect(() => {
        // When the carousel reaches the "fake" first/last item, jump to the "real" one without animation
        if (curr === totalChildren + 1) {
            // If it's on the fake first item
            setTimeout(() => setCurr(1), 50) // Jump to the real first item
        } else if (curr === 0) {
            // If it's on the fake last item
            setTimeout(() => setCurr(totalChildren), 50) // Jump to the real last item
        }
    }, [curr, totalChildren])

    return (
        <div className="overflow-hidden relative w-full">
            <div
                className="flex flex-row transition-transform ease-out duration-500 w-full h-96 flex-nowrap"
                style={{ transform: `translateX(-${curr * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0">
                        {slide}
                    </div>
                ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-between p-4">
                <button
                    onClick={prev}
                    className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
                >
                    <span className="font-4xl">{'<'}</span>
                </button>
                <button
                    onClick={next}
                    className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
                >
                    <span className="font-4xl">{'>'}</span>
                </button>
            </div>

            <div className="absolute bottom-4 right-0 left-0">
                <div className="flex items-center justify-center gap-2">
                    {children.map((_, i) => (
                        <div
                            key={i}
                            className={`transition-transform ease-out duration-500 
               h-1 bg-white rounded-md
              ${curr === i ? 'w-12' : 'w-6 bg-opacity-50'}
            `}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Carousel
