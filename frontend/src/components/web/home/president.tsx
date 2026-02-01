export default function PresidentComponent() {
    return (
        <div className="relative bg-brand">
            <img
                src="/assets/home/flag_480.webp"
                srcSet="/assets/home/flag_480.webp 480w,
          /assets/home/flag_720.webp 720w"
                sizes="(max-width: 480px) 480px, 720px"
                alt="Home Flag  Image"
                className="select-none w-1/2 z-0"
                loading="lazy"
                decoding="async"
            />

            <div className="absolute top-0 left-0 z-10 w-full h-full bg-cover bg-gradient-to-r from-brand/0 via-brand to-brand">
                <div className="container mx-auto max-w-[1366px] h-full flex items-center justify-center lg:px-22">
                    <img
                        src="/assets/home/president_480.webp"
                        srcSet="/assets/home/president_480.webp 480w,
          /assets/home/president_720.webp 720w"
                        sizes="(max-width: 480px) 480px, 720px"
                        alt="Home President Image"
                        className="h-full select-none"
                        loading="lazy"
                        decoding="async"
                    />

                    <div className="content text-white">
                        <h3 className="text-3xl font-medium">
                            Hunarmandchilikning paydo bo‘lishi –<br />{" "}
                            rivojlanish sari tashlangan eng muhim tarixiy qadam
                        </h3>
                        <p>Shavkat Mirziyoyev</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
