import ContentList from '@/components/blog/ContentList'
import Article from '@/components/blog/Article'
import Morph from '@/components/fancy/morph'
import Peel from '@/components/fancy/peel'

import { getAllPosts, getBlog, getFeaturedPosts } from '@/libs/api'

export async function generateMetadata() {
    const { title } = getBlog()
    return {
        title: title || 'My Blog'
    }
}

const Section = ({
    title,
    className
}: {
    title: string
    className?: string
}) => {
    return (
        <h3
            className={`theme:section-line border-b text-xs font-semibold uppercase tracking-widest my-5 mb-5 ${className}`}
        >
            <div className="theme:section theme:text-primary py-1 px-3 w-fit">
                {title}
            </div>
        </h3>
    )
}

const HomePage = async () => {
    const allPosts = await getAllPosts()

    return (
        <div className="flex flex-col w-full">
            <ContentList items={allPosts} />
        </div>
    )
}

export default HomePage
