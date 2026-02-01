export const NewsPoster = () => {
    return (
        <div
            className="relative w-full aspect-[32/10] sm:aspect-[32/8] md:aspect-[32/4] flex overflow-hidden justify-between"
            style={{
                backgroundImage: `url(/assets/onlineshop/background.png)`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-l from-[#41a584e7] to-[#41a584e7] z-10"></div>
            <div className="container max-w-[1366px] relative z-20 flex items-center mx-auto h-full px-4">
                <div className="text-4xl font-semibold text-white">
                    Yangiliklar
                </div>
            </div>
            <img
                src="/assets/news/poster.png"
                alt="Poster"
                className="absolute -bottom-6 md:-bottom-1/2 lg:bottom-auto lg:top-0 right-0 z-10 w-full md:w-1/2 lg:w-1/3"
            />
        </div>
    );
};
