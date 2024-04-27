import '@/app/globals.css'
import type { Metadata } from 'next'

import Wave from '@/components/fancy/wave'
import Footer from '@/components/footer'
import Header from '@/components/header'

const Container = ({
    children,
    className
}: Readonly<{
    children: React.ReactNode
    className?: string
}>) => {
    return (
        <div
            className={`md:container md:mx-auto sm:max-w-screen-lg  flex flex-col ${className}`}
        >
            {children}
        </div>
    )
}

// Layout
export const metadata: Metadata = {
    title: 'Blog',
    description: 'Blog'
}

export default function Layout({
    children,
    hero,
    body
}: {
    children: React.ReactNode
    hero: React.ReactNode
    body: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="theme:back-canvas flex flex-col min-h-screen max-w-screen">
                {/* Header */}
                <section
                    className="theme:hero flex flex-col sm:max-w-screen px-0 sm:px-5"
                    style={{
                        minHeight: '300px'
                    }}
                >
                    <Container className="flex-1">
                        <Header />
                        <div className="flex-1 flex flex-col justify-center">
                            {hero}
                        </div>
                    </Container>
                </section>

                {/* Body  */}
                <section className="theme:body flex flex-col min-h-screen sm:max-w-screen px-0 sm:px-5">
                    <Container>
                        <main className="flex-1 flex flex-col items-start justify-start my-4">
                            {body}
                            {children}
                        </main>
                    </Container>
                </section>

                {/* Footer */}
                <section className="theme:footer flex flex-col sm:min-h-48 sm:max-w-screen">
                    <Wave startColor={'#ffffff'} endColor={'#23132f'} />
                    <Container>
                        <Footer />
                    </Container>
                </section>
            </body>
        </html>
    )
}
