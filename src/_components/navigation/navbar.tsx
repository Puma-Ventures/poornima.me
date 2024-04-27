'use client'

import React, { useState } from 'react'
import SparkyLogo from '@/images/sparky-logo'
import SparkyLogoFill from '@/images/sparky-logo-fill'
import HelixLogo from '@/images/helix-logo'
import { clsx } from '@/libs/utils'

const Navbar = ({ menu }: { menu: any[] }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav
            className={clsx({
                'theme:rounded theme:header sm:min-h-5 lg:mt-5 lg:box-shadow flex flex-col lg:flex-row lg:justify-between overflow-hidden sm:overflow-visible':
                    true,
                'h-screen': isOpen
                // 'h-24': !isOpen
            })}
        >
            <div className="flex flex-row items-center justify-between pt-8 pb-4 sm:py-0 px-6">
                {/* <SparkyLogo /> */}
                <a href="/">
                    <HelixLogo />
                </a>
                <button
                    className="lg:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? 'Close' : 'Open'}
                </button>
            </div>
            <ul className="p-4 flex-1 flex flex-col items-center justify-start sm:justify-end lg:flex-row text-white ">
                {menu.map((item, index) => (
                    <li
                        key={`menuItem-${index}`}
                        className=" w-full lg:w-fit h-10 my-4 lg:my-0 lg:pl-4 lg:ml-2 flex flex-row items-center justify-between text-xl lg:text-xs font-bold uppercase select-none lg:font-normal tracking-widest"
                    >
                        <a
                            className="theme:rounded-small theme:menuItem transition ease-in-out delay-50 px-2 py-2 cursor-pointer"
                            href={item.link}
                        >
                            {item.name}
                        </a>
                        {index < menu.length - 1 && (
                            <div className="hidden lg:block lg:ml-6 opacity-20 select-none">
                                /
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Navbar
