import Hero from '@/_components/blog/Hero'
import { getContentOrCollection } from '@/libs/api'
import { ContentType, type ICollection, type IPage, type IPost } from '@/types'

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
        <div className="px-5">
            <Hero title={collection?.name ?? pageOrPost?.title} />
            {contentType === ContentType.POST && (
                <div className="min-w-100 flex flex-row items-center mb-5 tracking-wider text-xs">
                    <div>{pageOrPost?.date?.toString()}</div>
                    <span className="text-white/25 px-4">/</span>
                    <div className="text-pink-500 font-light">
                        {pageOrPost?.readingTime}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Page
