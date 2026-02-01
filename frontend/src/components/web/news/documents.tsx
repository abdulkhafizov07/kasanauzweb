import type {
    HomePageDocumentsSectionData,
    LegacyDocumentItem,
} from "@/types/news";
import { useQuery } from "@tanstack/react-query";
import { Link } from "lucide-react";
import React from "react";
import { useInView } from "react-intersection-observer";

interface LegacyDocumentItemWidgetProps {
    value: LegacyDocumentItem;
}

const LegacyDocumentItemWidget: React.FC<LegacyDocumentItemWidgetProps> = ({
    value,
}) => (
    <div className="w-full flex justify-start items-end">
        <div className="w-full">
            <h1 className="text-xl font-semibold">{value.title}</h1>
            <p className="text-description">{value.subtitle}</p>
        </div>

        <div className="max-w-fit min-w-fit">
            <Link
                to={value.link || "#nolink"}
                className="py-1 px-3 bg-bg-placeholder rounded-lg hover:bg-brand hover:text-white transition-all duration-200 ease-in"
            >
                {value.link?.split("/").find((value) => value.includes("."))}
            </Link>
        </div>
    </div>
);

const DocumentsSection: React.FC = () => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    const fetchData = async (): Promise<HomePageDocumentsSectionData> => {
        return {
            legacyDocuments: [],
            bussiniesDocuments: [],
        };
    };

    const { data } = useQuery<HomePageDocumentsSectionData>({
        queryKey: ["news", "documents", "home-page"],
        queryFn: fetchData,
        enabled: inView,
    });

    const legacyDocuments = data?.legacyDocuments;
    const bussiniesDocuments = data?.bussiniesDocuments;

    return (
        <section id="documents">
            <div
                className="container mx-auto max-w-[1366px] py-6 px-4 flex items-start justify-center flex-col md:flex-row"
                ref={ref}
            >
                <div className="w-full md:w-1/2 border-r border-border pr-6">
                    <div className="flex justify-between items-center">
                        <div className="text">
                            <h1 className="text-2xl font-semibold mb-1">
                                Qonunchilik hujjatlari
                            </h1>
                            <p className="text-description">
                                Kasanachilik sohasidagi qonunchilik hujjatlari
                            </p>
                        </div>

                        <Link
                            to={"/news/documents/a"}
                            className="py-1.5 px-3 border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition-all duration-200 ease-in"
                        >
                            Ko'proq ko'rish
                        </Link>
                    </div>

                    <div className="flex flex-col items-start justify-start space-y-3 mt-4">
                        {legacyDocuments?.length === 0 ? (
                            <></>
                        ) : (
                            legacyDocuments?.map((value, index) => (
                                <LegacyDocumentItemWidget
                                    value={value}
                                    key={index}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className="w-full md:w-1/2 md:pl-6">
                    <div className="flex justify-between items-center">
                        <div className="text">
                            <h1 className="text-2xl font-semibold mb-1">
                                Kichik biznes loyihalar
                            </h1>
                            <p className="text-description">
                                Turli darajadagi kichik biznes loyihalar
                            </p>
                        </div>

                        <Link
                            to={"/news/documents/b"}
                            className="py-1.5 px-3 border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition-all duration-200 ease-in"
                        >
                            Ko'proq ko'rish
                        </Link>
                    </div>

                    <div className="flex flex-col items-start justify-start space-y-3 mt-4">
                        {/* {bussiniesDocuments.map((value, index) => (
                            <div
                                key={index}
                                className="w-full flex justify-start items-end"
                            >
                                <div className="w-full">
                                    <h1 className="text-lg font-semibold">
                                        {value.title}
                                    </h1>
                                    <p className="text-description">
                                        {value.subtitle}
                                    </p>
                                </div>

                                <div className="max-w-fit min-w-fit">
                                    <Link
                                        to={`/news/document/${value.guid}`}
                                        className="py-1 px-3 bg-bg-placeholder rounded-lg hover:bg-brand hover:text-white transition-all duration-200 ease-in"
                                    >
                                        Ko'proq
                                    </Link>
                                </div>
                            </div>
                        ))} */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DocumentsSection;
