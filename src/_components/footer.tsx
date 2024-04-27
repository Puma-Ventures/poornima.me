const Footer = () => {
    // Current year
    const year = new Date().getFullYear()

    // Copy Right symbol
    const copyRight = '\u00A9'
    return (
        <div
            className="flex flex-row items-center justify-center py-10 min-h-fit"
            style={{ backgroundColor: '#23132f' }}
        >
            {`${copyRight} ${year} All rights reserved`}
        </div>
    )
}

export default Footer
