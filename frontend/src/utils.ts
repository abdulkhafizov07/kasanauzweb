export const formatPhone = (phone: string | undefined): string => {
    if (!phone) return "";
    const digits = phone.toString().replace("+998", "").replace(/\D/g, "");
    return `+998 (${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(
        5,
        7
    )}-${digits.slice(7, 9)}`;
};

export const phoneToNumber = (phone: string): string => {
    return phone?.replace("+998", "")?.replace(/\D/g, "");
};

export const normalizeDateTime = (dateInput: Date | string): string => {
    const date =
        typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date input");
    }

    const pad = (num: number): string => num.toString().padStart(2, "0");

    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(
        date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const normalizeDate = (dateInput: Date | string): string => {
    const date =
        typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const today = new Date();

    const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();

    if (isToday) {
        return "Bugun";
    }

    const pad = (num: number): string => num.toString().padStart(2, "0");

    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(
        date.getDate()
    )}`;
};

export const getPageNumbers = (
    currentPage: number,
    totalPages: number
): number[] => {
    const totalShown = 5;
    const half = Math.floor(totalShown / 2);

    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + totalShown - 1, totalPages);

    start = Math.max(end - totalShown + 1, 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const getPasswordStrengthScore = (password: string): number => {
    let score = 0;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[\W_]/.test(password);
    const isLongEnough = password.length >= 8;

    if (isLongEnough) score += 25;
    if (hasLower) score += 15;
    if (hasUpper) score += 15;
    if (hasDigit) score += 20;
    if (hasSpecial) score += 25;

    return score;
};

export const convertToYouTubeEmbed = (url: string): string | null => {
    const regex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};
