import { ProductType } from "@/types/onlineshop";
import React from "react";
import { DiscountWidget } from "./discount";
import { Link } from "@tanstack/react-router";

export const ProductWidget: React.FC<{ product: ProductType }> = ({
    product,
}) => {
    return (
        <>
            <Link
                to={`/shop/details/$product`}
                params={{ product: product.meta }}
                key={product.guid}
                data-aos="fade-up"
            >
                <div className="rounded-lg h-full overflow-hidden">
                    <div className="aspect-[1/1.1]">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover rounded-t-xl"
                        />
                    </div>
                    <div className="py-2 px-0 h-full">
                        <div className="text-text font-semibold text-[17px] mt-2">
                            {product.title}
                        </div>
                        <div className="text-description text-sm mt-1 mb-3">
                            {product.short_description}
                        </div>

                        <DiscountWidget
                            price={product.price}
                            priceDiscount={product.price_discount}
                        />

                        <div className="flex items-center gap-2 border-t border-gray-200 pt-2 mt-2 text-sm text-decription">
                            <div className="flex items-center gap-1">
                                <span>0</span>
                                <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                >
                                    <path
                                        d="M9.99935 2.16666L12.5743 7.38333L18.3327 8.225L14.166 12.2833L15.1494 18.0167L9.99935 15.3083L4.84935 18.0167L5.83268 12.2833L1.66602 8.225L7.42435 7.38333L9.99935 2.16666Z"
                                        fill="#FEC967"
                                    />
                                </svg>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg
                                    width="16"
                                    height="17"
                                    viewBox="0 0 16 17"
                                    fill="none"
                                >
                                    <path
                                        d="M0.667969 1.16667H3.33464L5.1213 10.0933C5.18226 10.4003 5.34924 10.676 5.593 10.8722C5.83676 11.0684 6.14177 11.1727 6.45464 11.1667H12.9346C13.2475 11.1727 13.5525 11.0684 13.7963 10.8722C14.04 10.676 14.207 10.4003 14.268 10.0933L15.3346 4.50001H4.0013"
                                        stroke="#757575"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>0</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <img
                                src={product.user.pfp}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm text-description">
                                {product.user.first_name}{" "}
                                {product.user.last_name}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};
