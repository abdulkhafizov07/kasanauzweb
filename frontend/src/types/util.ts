interface NavbarLinkActiveClassGeneratorProps {
    isActive: boolean;
}

export type { NavbarLinkActiveClassGeneratorProps };

export interface PaginatedResponse<T> {
    count: number;
    results: T[];
}
