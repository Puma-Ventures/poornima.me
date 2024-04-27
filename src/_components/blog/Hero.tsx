const Hero = ({ title, excerpt }: { title?: string; excerpt?: string }) => {
    return (
        <div className="hero flex flex-col justify-center my-8">
            <h1 className="text-5xl font-bold tracking-widest">{title}</h1>
        </div>
    )
}

export default Hero
