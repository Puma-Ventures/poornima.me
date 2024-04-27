import Color from 'color'

import ContentList from '@/components/blog/ContentList'
import Article from '@/components/blog/Article'
import Image from '@/components/blog/Image'
import { getContentOrCollection } from '@/libs/api'
import { ContentType, type ICollection, type IPage, type IPost } from '@/types'

// Helper methods
const getContrastingTextColor = (colorStr: string) => {
    const color = Color(colorStr)
    const luminance = color.luminosity()

    return luminance > 0.25
        ? [Color('#000000'), Color('#FFFFFF')]
        : [Color('#FFFFFF'), Color('#000000')]
}

const standardizeColor = (colorStr: string): Color => {
    const color = Color(colorStr)
    return color
}

// Page

interface IPageParam {
    params: {
        [key: string]: any
    }
}

const Page = async ({ params: { slug } }: IPageParam) => {
    const id = slug.join('/')
    const { contentType, contentData } = await getContentOrCollection(id)

    let collection: ICollection | null =
        contentType == ContentType.COLLECTION
            ? (contentData as ICollection)
            : null

    let pageOrPost =
        contentType == ContentType.PAGE || ContentType.POST
            ? (contentData as IPage | IPost)
            : null

    return (
        <div className="min-w-full px-5">
            {contentType == ContentType.POST && pageOrPost?.heroImage && (
                <Image src={pageOrPost.heroImage} alt={pageOrPost.title} />
            )}
            {(contentType == ContentType.POST ||
                contentType == ContentType.PAGE) && (
                <Article
                    source={pageOrPost?.body as string}
                    className="my-5 text-white"
                />
            )}
            {contentType == ContentType.COLLECTION && (
                <div className="flex flex-col w-full">
                    <ContentList items={collection?.pages} />
                </div>
            )}
        </div>
    )
}

export default Page
