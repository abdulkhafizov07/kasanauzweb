import { ReactNode } from "react";
import { User } from "./admin/users";

export interface ProductCategory {
    guid: string;
    title: string;
    meta: string;
    state: string;
    created_at: string;
}

export interface ProductImage {
    image: string;
}

export interface ProductType {
    guid: string;
    user: User;
    category?: ProductCategory;
    title: string;
    meta: string;
    short_description: string;
    description?: string;
    price: number;
    price_discount: number;
    image: string;
    created_at: string;
    state: string;
    is_verified?: boolean;
    is_active?: boolean;
    is_banned?: boolean;
}

export interface ProductDetail {
    guid: string;
    title: string;
    short_description: string;
    description: string;
    user: User;
    product_images_onlineshop: ProductImage[];
}

export interface SimilarProduct {
    meta: string;
    name: string;
    description: string;
    price: number;
    price_off: number;
    average_rating: number;
    cart: number;
    user: User;
}

export interface LoadUserProductsProps {
    page?: number;
    number?: number;
}

export interface OnlineShopContextType {
    loading: boolean;
    categories: ProductCategory[];
    fastSellingProducts: ProductType[];
    newProducts: ProductType[];
    recommendedProducts: ProductType[];
    userProducts: ProductType[];
    loadUserProducts: (props: LoadUserProductsProps) => Promise<void>;
    userLikedProducts: ProductType[];
    addToLiked: (product: ProductType) => void;
    removeFromLiked: (product: ProductType) => void;
    fetchData: () => Promise<void>;
    fetchUserLikedProducts: () => Promise<void>;
}

export interface OnlineShopProviderProps {
    children: ReactNode;
}

export interface CreateProductFormType {
    category: string;
    name: string;
    price: number;
    discount: number;
    description: string;
    images: File[];
}

export interface CreateProductErrorType {
    category?: string;
    name?: string;
    price?: string;
    discount?: string;
    description?: string;
    images?: string;
}
