import React from "react";

import Loading from "@/components/web/loader";

interface Person {
    id: number;
    image: string;
    type: string;
    title: string;
    successMessage: string;
    income: string;
}

const SuccessComponent: React.FC = () => {
    const successPeople: Person[] = [
        {
            id: 1,
            image: "/assets/home/success/img1.png",
            type: "Silk yo'nalishi",
            title: "Alimardon Shohnazarov",
            successMessage: "Sentabrning eng yaxshi sotuvchisi",
            income: "$25k+ umumiy daromadlar",
        },
        {
            id: 2,
            image: "/assets/home/success/img2.png",
            type: "Sabzavotchilik",
            title: "Shomurodov Eldorjon",
            successMessage: "Sentabrning eng yaxshi sotuvchisi",
            income: "$25k+ umumiy daromadlar",
        },
        {
            id: 3,
            image: "/assets/home/success/img3.png",
            type: "Silk yo'nalishi",
            title: "Alimardon Shohnazarov",
            successMessage: "Sentabrning eng yaxshi sotuvchisi",
            income: "$25k+ umumiy daromadlar",
        },
        {
            id: 4,
            image: "/assets/home/success/img4.png",
            type: "Silk yo'nalishi",
            title: "Alimardon Shohnazarov",
            successMessage: "Sentabrning eng yaxshi sotuvchisi",
            income: "$25k+ umumiy daromadlar",
        },
    ];

    return (
        <div
            id="successPeople"
            className="container mx-auto max-w-[1366px] px-5 py-12 sm:py-6"
        >
            <h1 className="text-center text-3xl font-semibold text-text">
                Muvaffaqiyatga erishganlar
            </h1>
            <div className="flex items-center justify-center flex-wrap gap-4 mt-4">
                {successPeople.length > 0 ? (
                    successPeople.map((person) => (
                        <div
                            key={person.id}
                            className="scroll-fade-effect relative aspect-[9/13] h-[400px] rounded-[10px] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-[#118E71] via-[#118E7100] to-[#118E7100] z-[1]" />
                            <img
                                src={person.image}
                                alt={person.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 z-[2] flex flex-col items-start p-5">
                                <div className="bg-white text-[#118E71] rounded-full px-3 py-1 text-sm">
                                    {person.type}
                                </div>
                                <div className="mt-1 mb-1 text-white text-[22px] font-semibold">
                                    {person.title}
                                </div>
                                <div className="text-[#FEC967] text-sm line-clamp-2">
                                    {person.successMessage}
                                </div>
                                <div className="text-white text-sm mt-1 line-clamp-2">
                                    {person.income}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>
                        <Loading />
                    </p>
                )}
            </div>
        </div>
    );
};

export default SuccessComponent;
