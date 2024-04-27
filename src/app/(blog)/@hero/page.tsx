import Morph from '@/components/fancy/morph'
import Image from '@/components/blog/Image'
import Hero from '@/components/blog/Hero'

import { getFeaturedPosts } from '@/libs/api'
import Peel from '@/_components/fancy/peel'

type PageParamsType = {
    params: {
        [key: string]: any
    }
}

const Page = async ({ params: { id } }: PageParamsType) => {
    const featuredPosts = await getFeaturedPosts()

    return (
        <div className="my-10">
            <div className="overflow-hidden relative">
                <div
                    className="flex flex-col justify-center items-center text-8xl tracking-wider"
                    style={{ minHeight: 400 }}
                >
                    Poornima
                </div>
                <div className="bg-red-400 w-full flex">
                    {featuredPosts.map((post: any) => {
                        return (
                            <div key={post.id} className="max-h-96 min-w-full">
                                <img
                                    src={post.hero_image}
                                    alt={post.title}
                                    className="w-full"
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Page

const Carousel = ({ posts }: { posts: any[] }) => {
    return (
        <div className="overflow-hidden relative">
            {posts.map((post: any) => (
                <div key={post.id} className="flex">
                    <img
                        src={post.hero_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
        // <div className="h-fit flex-1 flex-row items-start justify-center bg-blue-400 ">
        //     {posts.map((post: any) => (
        //         <div key={post.id} className="mr-5 w-full bg-red-400">
        //             <img
        //                 src={post.hero_image}
        //                 alt={post.title}
        //                 width={300}
        //                 height={200}
        //             />
        //         </div>
        //     ))}
        // </div>
    )
}

{
    /* <Hero
title={theFeaturedPost.title}
excerpt={theFeaturedPost.excerpt}
/>

<div className="min-w-100 flex flex-row items-center mb-5 tracking-wider text-xs">
<div>{theFeaturedPost.date?.toString()}</div>
<span className="text-white/25 px-4">/</span>
<div className="text-pink-500 font-light">
    {theFeaturedPost.readingTime}
</div>
</div> */
}
