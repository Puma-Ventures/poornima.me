import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import moment from 'moment'

import authorsData from '@/data/config/authors.json'
import featuredData from '@/data/config/featured.json'
import blogConfig from '@/data/config/meta.json'
import menuConfig from '@/data/config/menu.json'

import { readingTime } from '@/libs/utils'
import {
    ContentType,
    type IContent,
    type IAuthor,
    type IBlog,
    type IPage,
    type ICollection,
    type IPost
} from '@/types'

// Directories and file extensions
const postsDirectory: string = path.join(process.cwd(), '_data', 'posts')
const pagesDirectory: string = path.join(process.cwd(), '_data', 'pages')

// const PAGE_CONFIG_FILE_NAME: string = 'page.json'
const PAGE_CONTENT_FILE_NAME: string = 'page.mdx'
const POST_CONTENT_FILE_NAME: string = 'post.mdx'

const MDX_FILE_EXTENSION: string = '.mdx'
const PDF_FILE_EXTENSION: string = '.pdf'

interface IParsedPath {
    fileExtension: string
    fileName: string
    filePath: string
    id: string
    name: string
}

// Function to return  all files in a directory that match the filter criteria (extensions, filenames) if provided
const getFiles = (
    dir: string,
    filter: { extension?: string[]; namePattern?: string } = {}
): string[] => {
    let files: string[] = []

    // Check if the directory exists if not return empty array
    if (!fs.existsSync(dir)) {
        return []
    }

    // Get all contents in the directory
    const dirContents = fs.readdirSync(dir)

    for (let content of dirContents) {
        const isFile = fs.statSync(path.join(dir, content)).isFile()
        if (isFile) {
            if (filter.extension) {
                if (filter.extension.includes(path.extname(content))) {
                    files.push(content)
                }
            }
            if (filter.namePattern) {
                // check name pattern as regex against the name of the file
                const regexNamePattern = new RegExp(filter.namePattern)
                if (regexNamePattern.test(content)) {
                    files.push(content)
                }
            }
        }
    }

    return files
}

const getDirectories = (dir: string): string[] => {
    const files = fs.readdirSync(dir)
    return files.filter((file) => {
        return fs.statSync(path.join(dir, file)).isDirectory()
    })
}

// Get all  file recursively from a source directory that match the filter criteria (extensions, filenames) and return an array of IParsedPath
const getContentFiles = (
    rootPath: string,
    contentPath: string,
    filter: {
        extensions?: string[]
        filenames?: string[]
    } = {
        extensions: [],
        filenames: []
    }
): IParsedPath[] => {
    let allContentFiles: IParsedPath[] = []

    const fileNames: string[] = fs.readdirSync(contentPath)

    for (const fileName of fileNames) {
        // Get full path of the parent directory
        const filePath = path.join(contentPath, fileName)

        // Get extension of the file
        const fileExtension = path.extname(fileName)

        // Get parent directory of the file
        const fileDirectory = path.dirname(fileName)

        const { name } = path.parse(fileName)

        if (
            filter.extensions?.includes(fileExtension) ||
            filter.filenames?.includes(fileName)
        ) {
            allContentFiles.push({
                fileExtension,
                fileName,
                filePath,
                id: filter.filenames?.includes(fileName)
                    ? contentPath.replace(rootPath + '/', '')
                    : filePath
                          .replace(rootPath + '/', '')
                          .replace(fileExtension, ''),
                name
            })
        } else if (fs.lstatSync(filePath).isDirectory()) {
            allContentFiles = allContentFiles.concat(
                getContentFiles(rootPath, filePath, filter)
            )
        }
    }
    return allContentFiles
}

// Pages & Collections

// Collections
const getAllCollections = async (
    contentPath?: string
): Promise<ICollection[]> => {
    const allCollections: ICollection[] = []

    const pathToProcess: string = contentPath ?? pagesDirectory

    // Get all directories in the pathToProcess
    const allDirectories = getDirectories(pathToProcess)

    for (const directory of allDirectories) {
        // Check if page.mdx exists in the directory
        const pagePath = path.join(
            pathToProcess,
            directory,
            PAGE_CONTENT_FILE_NAME
        )

        // Check if page or pdf exists in the directory to decide if it is a collection
        const pageOrPdfFiles = getFiles(path.join(pathToProcess, directory), {
            extension: [MDX_FILE_EXTENSION, PDF_FILE_EXTENSION]
        })
        if (pageOrPdfFiles.length == 0) {
            allCollections.push({
                id: directory,
                name: capitalize(directory),
                type: ContentType.COLLECTION
            })
        }
    }

    // const allCollections: ICollection[] = await Promise.all(
    //     allDirectories.map(async (collectionId) => {
    //         const collection: ICollection = await getCollection(collectionId)
    //         return collection
    //     })
    // )

    return allCollections
}

// Pages
const getAllPages = async (
    contentPath?: string,
    filter: {
        extensions?: string[]
        filenames?: string[]
    } = {
        extensions: [MDX_FILE_EXTENSION, PDF_FILE_EXTENSION],
        filenames: [PAGE_CONTENT_FILE_NAME]
    }
): Promise<IPage[]> => {
    contentPath = contentPath || pagesDirectory

    const allContentFiles = getContentFiles(pagesDirectory, contentPath, filter)

    const allPages: IPage[] = await Promise.all(
        allContentFiles.map(async (pageFile) => {
            const page: IPage = await getPage(pageFile.id)
            return page
        })
    )

    const nonEmptyPages = allPages.filter((page) => page.id !== 'not_found')
    return nonEmptyPages
}

// Posts
const getAllPosts = async (): Promise<IPost[]> => {
    const allContentFiles = getContentFiles(postsDirectory, postsDirectory, {
        extensions: [MDX_FILE_EXTENSION],
        filenames: [POST_CONTENT_FILE_NAME]
    })

    const allPosts: IPost[] = await Promise.all(
        allContentFiles.map(async (postFile) => {
            const post: IPost = await getPost(postFile.id)
            return post
        })
    )

    // Sort by date in descending order
    return allPosts.sort((a, b) => {
        return (
            new Date(b.date as Date).getTime() -
            new Date(a.date as Date).getTime()
        )
    })
}

// Given a markdown content, return the first header # text
const getFirstHeader = (content: string) => {
    const firstHeader = content.split('\n').find((line) => line.startsWith('#'))
    return firstHeader
}

const excerptEndDelimiter = '(...)'

// Given a markdown content, return the body without the first header and first image
const getBody = (content: string) => {
    // Remove first header
    const firstHeader = getFirstHeader(content)
    if (firstHeader) {
        content = content.replace(firstHeader, '')
    }

    // Remove first image
    const heroImage = getHeroImage(content)
    const images = content.match(/!\[.*\]\((.*)\)/)
    const firstImage = images ? images[0] : ''

    if (heroImage && firstImage) {
        if (firstImage.includes(heroImage)) {
            content = content.replace(firstImage, '')
        }
    }

    // Remove excerpt delimiter
    if (content.includes(excerptEndDelimiter)) {
        content = content.replace(excerptEndDelimiter, '')
    }

    return content
}

// Given a markdown content, return the first paragraph
const getExcerpt = (content: string) => {
    // split content by new line, and ignore empty lines, ignore header lines, pick first non-empty line
    const firstParagraph = content.split('\n').filter(
        (line) =>
            line.trim() !== '' && // ignore empty lines
            !line.startsWith('#') && //
            !line.startsWith('!') && // ignore image lines
            !line.startsWith('[') && // ignore link lines
            !line.startsWith('<') && // ignore html lines
            !line.startsWith('>') && // ignore blockquote lines
            !line.startsWith('-') && // ignore list lines
            !line.startsWith('*') && // ignore list lines
            !line.startsWith('1') // ignore list lines
    )[0]

    if (firstParagraph?.includes(excerptEndDelimiter)) {
        return {
            excerpt: firstParagraph.split(excerptEndDelimiter)[0].trim(),
            hasExcerptDelimiter: true
        }
    } else {
        return {
            excerpt: firstParagraph,
            hasExcerptDelimiter: false
        }
    }
}

const removeExcerptDelimiter = (content: string) => {
    if (content.includes(' ' + excerptEndDelimiter + ' '))
        return content.replace(' ' + excerptEndDelimiter + ' ', ' ')

    if (content.includes(excerptEndDelimiter + ' '))
        return content.replace(excerptEndDelimiter + ' ', ' ')

    if (content.includes(' ' + excerptEndDelimiter))
        return content.replace(' ' + excerptEndDelimiter, ' ')

    return content.replace(excerptEndDelimiter, '')
}

const getTitleFromContent = (content: string) => {
    const firstHeader = getFirstHeader(content)
    return firstHeader?.replace('#', '').trim()
}

const getDate = (stringDate: string): string => {
    if (stringDate === undefined) return ''
    if (stringDate === '') return ''

    try {
        return moment(stringDate).format(blogConfig.dateFormat || 'YYYY-MMM-DD')
    } catch (e) {
        console.error('getDate:error', e)
        return moment(stringDate, 'DD-MMM-YYYY').format(
            blogConfig.dateFormat || 'YYYY-MMM-DD'
        )
    }
}

// Get the first image from the content, if it exists in the first two lines of the content (ignoring empty lines)
const getHeroImage = (content: string): string | null => {
    // get first two lines of content ignore empty lines
    const nonEmptyLines = content
        .split('\n')
        .filter((line) => line.trim() !== '')

    const firstTwoLines = nonEmptyLines.slice(0, 2).join('\n')

    const firstImage = firstTwoLines.match(/!\[.*\]\((.*)\)/)

    return firstImage ? firstImage[1]?.split(' ')[0] : ''
}

type IContentData = IPage | IPage[] | IPost | IPost[] | ICollection

// Get a page, post, collection by id
const getContentOrCollection = async (
    id: string
): Promise<{
    contentType: ContentType
    contentData: IContentData
}> => {
    // Try page
    let page = await getPage(id)
    if (page.type === ContentType.PAGE) {
        page['type'] = ContentType.PAGE
        return {
            contentType: ContentType.PAGE,
            contentData: page
        }
    }

    // Try page collection
    const collection: ICollection = await getCollection(id)
    if (collection.type === ContentType.COLLECTION) {
        return {
            contentType: ContentType.COLLECTION,
            contentData: collection
        }
    }

    // Try post
    let post = await getPost(id)
    if (post.id !== 'not_found') {
        post['type'] = ContentType.POST
        return {
            contentType: ContentType.POST,
            contentData: post
        }
    }

    // Nothing found, return not found and unknown type
    return {
        contentType: ContentType.UNKNOWN,
        contentData: {
            id: id,
            name: 'not_found',
            type: ContentType.UNKNOWN
        }
    }
}

const getCollection = async (id: string): Promise<ICollection> => {
    const collectionPath = path.join(pagesDirectory, id)
    const collectionPathExists = fs.existsSync(collectionPath)
    if (!collectionPathExists) {
        return {
            id: id,
            name: 'not_found',
            type: ContentType.UNKNOWN
        }
    }

    const pages = await getAllPages(collectionPath, {
        extensions: [MDX_FILE_EXTENSION],
        filenames: [PAGE_CONTENT_FILE_NAME]
    })

    return {
        id,
        type: ContentType.COLLECTION,
        name: capitalize(id), // capitalize id for collection name,
        pages
    }
}

// functiont to get a string capitalized
const capitalize = (value: string = '') => {
    return value.charAt(0).toUpperCase() + value.slice(1)
}

// Get a page by id
const getPage = async (id: string): Promise<IPage> => {
    const content = await getContent(ContentType.PAGE, id)
    return content as IPage
}

// Get a post by id
const getPost = async (id: string): Promise<IPost> => {
    const content = await getContent(ContentType.POST, id)
    return content as IPost
}

// Get content by type and id, either a page or a post by id (slug) from the content directory
const getContent = async (
    contentType: ContentType.PAGE | ContentType.POST,
    id: string
): Promise<IPage | IPost> => {
    if (id == undefined || id == '') {
        return {
            id: 'not_found',
            name: 'not_found',
            content: 'not_found',
            type: ContentType.UNKNOWN
        }
    }

    const contentDirectory: string =
        contentType === ContentType.PAGE ? pagesDirectory : postsDirectory
    const contentFileName: string =
        contentType === ContentType.PAGE ? 'page' : 'post'

    try {
        // Try just [id].mdx
        let fullPath: string = path.join(
            contentDirectory,
            id + MDX_FILE_EXTENSION
        )

        // If not found as [id].mdx, try [id]/post.mdx
        if (!fs.existsSync(fullPath)) {
            fullPath = path.join(
                contentDirectory,
                id,
                contentFileName + MDX_FILE_EXTENSION
            )

            // If not found as [id]/post.mdx as well, return not found
            if (!fs.existsSync(fullPath)) {
                return {
                    id,
                    name: `not_found`,
                    content: 'not_found',
                    type: ContentType.UNKNOWN
                }
            }
        }

        //// GET Post or Page metadata and content

        // Get metadata from gray-matter
        const { data, content } = matter.read(fullPath)

        let pageOrPost: IPage | IPost = data as any
        pageOrPost['id'] = id
        pageOrPost['type'] = contentType

        const titleFromContent = getTitleFromContent(content)
        pageOrPost['title'] = titleFromContent || id

        pageOrPost['date'] = getDate(pageOrPost['date'] as string) || ''

        const { excerpt, hasExcerptDelimiter } = getExcerpt(content)

        pageOrPost['excerpt'] = pageOrPost['excerpt'] || excerpt || ''

        pageOrPost['heroImage'] =
            pageOrPost['hero_image'] || getHeroImage(content) || ''

        pageOrPost['body'] = getBody(content)

        pageOrPost['content'] = content

        pageOrPost['readingTime'] = readingTime({
            wordCount: pageOrPost['content'].split(' ').length,
            imageCount: 0
        })

        // convert comma separated tags to array
        pageOrPost['tags'] = Array.isArray(pageOrPost['tags'])
            ? pageOrPost['tags']
            : String(pageOrPost['tags'] || '')
                  ?.split(',')
                  // map each tag to a trimmed string but remove empty strings
                  .filter((tag: string) => tag.trim())
                  .map((tag: string) => tag.trim())

        // category can be only one
        pageOrPost['category'] = String(pageOrPost['category'] || '')
            ?.split(',')
            .map((category: string) => category.trim())[0]

        return pageOrPost
    } catch (e) {
        console.error('getPost:error', e)
        return {
            id: 'error',
            name: 'error',
            content: 'error',
            type: ContentType.UNKNOWN
        }
    }
}

// Get featured posts using FeaturedData and getPost function
const getFeaturedPosts = async (): Promise<IPost[]> => {
    const featuredPosts = []

    // For each featured post, get the post data and add it to the featuredPosts array
    for (const featuredPostData of featuredData || []) {
        // Check if featuredPost has not expired
        if (featuredPostData.expiry_date) {
            const expiryDate = new Date(featuredPostData.expiry_date)
            const currentDate = new Date()
            if (expiryDate < currentDate) {
                continue
            }
        }
        const featuredPost = await getPost(featuredPostData.post_id)
        featuredPosts.push(featuredPost)
    }

    // Sort by date in descending order
    return featuredPosts.sort((a, b) => {
        return (
            new Date(b.date as string).getTime() -
            new Date(a.date as string).getTime()
        )
    })
}

//// Authors

const getAllAuthors = () => {
    return authorsData
}

const getAuthor = (authorId: string): IAuthor => {
    const author = authorsData.find((author) => author.id === authorId)
    return author ?? { id: '_', name: 'Anonymous' }
}

const getAuthors = (authorIds: string): IAuthor[] => {
    const arrayOfAuthorIds = authorIds.split(',')
    const authors = arrayOfAuthorIds.map((authorId) => {
        return getAuthor(authorId)
    })
    return authors ?? [{ id: '_', name: 'Anonymous' }]
}

// Blog Info

const getBlog = (): IBlog => {
    return blogConfig
}

// Menu

const getMenu = () => {
    return menuConfig
}

// Pages
export { getAllPages, getAllCollections }

// Posts
export { getAllPosts, getFeaturedPosts }

// Content / Collection
export { getContentOrCollection }

// Authors
export { getAllAuthors, getAuthor, getAuthors }

// Blog Info
export { getBlog }

// Menu
export { getMenu }
