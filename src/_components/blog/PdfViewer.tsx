const PdfViewer = async ({ src }: { src: string }) => {
    return (
        // <div className="w-full bg-red-500" style={{ height: 700 }}>
        <iframe src={src} style={{ height: '1200px', width: '100%' }} />
        // </div>
    )
}

export default PdfViewer
