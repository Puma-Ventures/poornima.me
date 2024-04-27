import React from 'react'

// @ts-ignore
const CustomLink = ({ href, children }) => {
    const isYouTubeLink = href.includes('youtube.com')

    if (isYouTubeLink) {
        const videoId = new URL(href).searchParams.get('v') // Assumes URL contains a 'v' parameter for YouTube videos
        const embedUrl = `https://www.youtube.com/embed/${videoId}?&autoplay=0`

        return (
            <p
                style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden'
                }}
            >
                <iframe
                    title={videoId || 'YouTube video'}
                    src={embedUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                />
            </p>
        )
    }

    return <a href={href}>{children}</a>
}

export default CustomLink
