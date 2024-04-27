const readingTime = ({
    wordCount,
    imageCount
}: {
    wordCount: number
    imageCount: number
}): string => {
    let wordsPerMinute = 275
    let wordsPerSecond = wordsPerMinute / 60
    let minute = '1 min read'
    let minutes = '% min read'

    let readingTimeSeconds = wordCount / wordsPerSecond

    for (var i = 12; i > 12 - imageCount; i -= 1) {
        // add 12 seconds for the first image, 11 for the second, etc. limiting at 3
        readingTimeSeconds += Math.max(i, 3)
    }

    let readingTimeMinutes = Math.round(readingTimeSeconds / 60)

    if (readingTimeMinutes < 1) {
        return minute
    } else {
        return minutes.replace('%', readingTimeMinutes.toString())
    }
}

function toVal(mix: string | number | object) {
    var k,
        y,
        str = ''

    if (typeof mix === 'string' || typeof mix === 'number') {
        str += mix
    } else if (typeof mix === 'object') {
        if (Array.isArray(mix)) {
            var len = mix.length
            for (k = 0; k < len; k++) {
                if (mix[k]) {
                    if ((y = toVal(mix[k]))) {
                        str && (str += ' ')
                        str += y
                    }
                }
            }
        } else {
            for (y in mix) {
                // @ts-ignore
                if (mix[y]) {
                    str && (str += ' ')
                    str += y
                }
            }
        }
    }

    return str
}

function clsx(...args: (string | number | object)[]): string {
    var i = 0,
        tmp: string | number | object,
        x: string,
        str = '',
        len = args.length
    for (; i < len; i++) {
        if ((tmp = args[i])) {
            if ((x = toVal(tmp))) {
                str && (str += ' ')
                str += x
            }
        }
    }
    return str
}

export { readingTime, clsx }
