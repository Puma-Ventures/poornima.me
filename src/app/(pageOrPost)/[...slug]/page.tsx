import { getAllPages, getAllCollections, getAllPosts } from '@/libs/api'
import { IContent } from '@/types'

// Static method
export async function generateStaticParams() {
    const pages: IContent[] = await getAllPages()
    const collections: IContent[] = await getAllCollections()
    const posts: IContent[] = await getAllPosts()

    const allContents = [...pages, ...collections, ...posts]
    const params = allContents.map(({ id }) => ({
        slug: id.split('/')
    }))
    return params
}

// Page
interface IPageParam {
    params: {
        [key: string]: any
    }
}

const Page = async ({ params: { slug } }: IPageParam) => {
    return null
}

export default Page
