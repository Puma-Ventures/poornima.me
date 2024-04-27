import { MDXProvider } from '@mdx-js/react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { FC } from 'react'
import CustomLink from './CustomLink'

const components = {
    a: CustomLink // Override default anchor tags with CustomLink
}

const getComponentProps = (url: string = ''): any => {
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    const query = urlObj.searchParams

    const props = {
        youTubeId: query.get('v')
    }

    return props
}

const Article: FC<{
    hideTitle?: boolean
    source: string
    className?: string
}> = ({ hideTitle = false, source, className = '' }) => {
    return (
        <article
            className={`theme:post-body prose lg:prose-lg max-w-full ${className}`}
        >
            <MDXRemote
                source={source}
                components={{
                    a: (props) => {
                        // @ts-ignore
                        return <CustomLink {...props} />
                    },
                    img: (props) => {
                        const { src = '', alt = '' } = props
                        // extract link from alt text using regex for url, match both http and https

                        const isCreditFound = alt.includes('Credit:')
                        const url = alt.match(/(https?:\/\/[^\s]+)/g)?.[0] || ''
                        const altText = alt
                            .replace(url, '')
                            .trim()
                            .replace('Credit:', '')
                            .trim()

                        return (
                            <span className="block flex flex-col items-center justify-center">
                                <img
                                    className="!m-0 !mt-6"
                                    src={src}
                                    alt={altText}
                                />
                                <span className="text-sm mb-6 pt-4">
                                    {isCreditFound ? `Credit: ` : ''}
                                    {url.length > 0 ? (
                                        <a
                                            className="cursor-pointer"
                                            href={url}
                                        >
                                            {altText}
                                        </a>
                                    ) : (
                                        <span>{altText}</span>
                                    )}
                                </span>
                            </span>
                        )
                    }
                }}
            />
        </article>
    )
}

export default Article
