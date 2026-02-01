import React from "react";

interface DiscountWidgetProps {
    price: number | null;
    priceDiscount: number | null;
}

export const DiscountWidget: React.FC<DiscountWidgetProps> = ({
    price = 0,
    priceDiscount = 0,
}) => {
    const formatPrice = (price: number | null) => {
        if (price === null) return "";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const isDiscounted = priceDiscount !== null;

    return isDiscounted ? (
        <div className="mt-1 flex justify-between pb-1 flex-col sm:flex-row">
            <span className="text-sm text-text line-through">
                {formatPrice(price)} so'm
            </span>
            {isDiscounted && (
                <span className="text-[#41A58D] font-semibold text-[17px] sm:text-[17px]">
                    {formatPrice(priceDiscount)} so'm
                </span>
            )}
        </div>
    ) : (
        <div className="mt-1 flex justify-end pb-1 flex-col sm:flex-row">
            {
                <span className="text-[#41A58D] font-semibold text-[17px] sm:text-[17px]">
                    {formatPrice(price)} so'm
                </span>
            }
        </div>
    );
};
