enum ContentType {
    PAGE = 'page',
    POST = 'post',
    COLLECTION = 'collection',
    CATEGORY = 'category',
    TAG = 'tag',
    AUTHOR = 'author',
    UNKNOWN = 'unknown'
}

interface IContent {
    id: string
    name: string
    type: ContentType
}

interface ICollection extends IContent {
    pages?: IPage[]
}

interface IPage extends IContent {
    body?: string
    collection?: string
    content: string
    heroImage?: string
    [key: string]: any
}

interface IPost extends IContent {
    title: string
    body?: string
    category?: string
    content: string
    date?: Date | string
    excerpt?: string
    heroImage?: string
    readingTime?: string
    tags?: string[]
    [key: string]: any
}

interface IAuthor {
    id: string
    name: string
}

interface IBlog {
    title?: string
    description?: string
}

export { ContentType }

export type { IContent, IAuthor, IBlog, IPage, ICollection, IPost }
