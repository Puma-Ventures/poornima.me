import Image from '@/components/blog/Image'
import { ContentType, type IPage, type IPost } from '@/types'

const ContentList = ({ items }: { items: any[] | undefined }) => {
    return (
        <div className="my-2">
            {items &&
                items.map((content: IPage | IPost) => {
                    return (
                        <div key={content.id}>
                            <div className="theme:rounded my-3 px-5 py-3 hover:bg-purple-400/15 block">
                                {content.category && (
                                    <div className="mb-5">
                                        <span className="theme:rounded-small bg-pink-500 px-3 py-1 text-xs capitalize tracking-widest">
                                            {content.category}
                                        </span>
                                    </div>
                                )}
                                <div className="post-title text-4xl font-bold mb-5 tracking-wider leading-tight">
                                    <a
                                        href={`/${content.id}`}
                                        className="hover:underline"
                                    >
                                        {content.title || content.id}
                                    </a>
                                </div>
                                <Image
                                    src={content.heroImage}
                                    alt={content.title}
                                />
                                <p className="post-description my-5">
                                    {content.description || content.excerpt}
                                </p>

                                {content.type == ContentType.PAGE ||
                                    (content.type == ContentType.POST && (
                                        <div className="flex flex-row items-center mt-5 tracking-wider text-xs ">
                                            <div>
                                                {content.date?.toString()}
                                            </div>
                                            <span className="text-black/75 px-4">
                                                /
                                            </span>
                                            <div className="text-pink-500 font-semibold">
                                                {content.readingTime}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <hr className="border-[0.5] border-white/10 my-5" />
                        </div>
                    )
                })}
        </div>
    )
}

export default ContentList
