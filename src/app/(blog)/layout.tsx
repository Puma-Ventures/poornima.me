import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Wave from '@/components/fancy/wave'
import Footer from '@/components/footer'
import Header from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

const Container = ({
    children
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <div className="md:container md:mx-auto sm:max-w-screen-lg">
            {children}
        </div>
    )
}

// Layout

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Blog'
}

const Layout = ({
    hero,
    body
}: {
    hero: React.ReactNode
    body: React.ReactNode
}) => {
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
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="theme:back-canvas flex flex-col min-h-screen max-w-screen">
                {/* Header */}
                <section
                    className="theme:hero flex flex-col sm:max-w-screen px-0 sm:px-5"
                    style={{ minHeight: '550px' }}
                >
                    <Container>
                        <Header />
                        {hero}
                    </Container>
                </section>

                {/* Body  */}
                <section className="theme:body flex flex-col min-h-screen sm:max-w-screen px-0 sm:px-5">
                    <Container>
                        <main className="flex-1 flex flex-col items-start justify-start my-4">
                            {body}
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

export default Layout
