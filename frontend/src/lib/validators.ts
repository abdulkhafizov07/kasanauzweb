// Phone validator
export const phoneValidator = (value: string) => {
  if (!value) return "Telefon raqamingizni to'liq kiring";
  if (value.length < 9) return "Telefon raqami juda qisqa";
  return undefined;
};

// Password validator
export const loginPasswordValidator = (value: string) => {
  if (!value) return "Parolni kiriting";
  return undefined;
};

export const passwordValidator = (value: string) => {
  if (!value) return "Parolni kiriting";
  if (value.length < 6) return "Parol kamida 6 belgidan iborat bo'lishi kerak";
  return undefined;
};

export const registerPasswordValidator = (
  value: string,
): string | undefined => {
  if (!value) return "Parolni kiriting";
  if (value.length < 6)
    return "Parol eng kamida 6 ta belgidan iborat bo‘lishi kerak";
  if (!/[A-Z]/.test(value))
    return "Parolda kamida bitta katta harf bo‘lishi kerak";
  if (!/[0-9]/.test(value)) return "Parolda kamida bitta raqam bo‘lishi kerak";
  return undefined;
};

export const confirmPasswordValidator = (
  value: string,
  password: string,
): string | undefined => {
  if (!value) return "Parolni qaytadan kiriting";
  if (value !== password) return "Parollar mos emas";
  return undefined;
};
// Ism tekshiruvchisi
export const firstNameValidator = (value: string) => {
  if (!value) return "Iltimos, ism kiriting.";
  if (value.length < 3)
    return "Ism kamida 3 ta belgidan iborat bo‘lishi kerak.";
  return undefined;
};

// Familiya tekshiruvchisi
export const lastNameValidator = (value: string) => {
  if (!value) return "Iltimos, familiya kiriting.";
  if (value.length < 3)
    return "Familiya kamida 3 ta belgidan iborat bo‘lishi kerak.";
  return undefined;
};

// Sharif tekshiruvchisi
export const middleNameValidator = (value: string) => {
  if (!value) return "Iltimos, sharif kiriting.";
  if (value.length < 3)
    return "Sharif kamida 3 ta belgidan iborat bo‘lishi kerak.";
  return undefined;
};

// OTP Code Validator
export const otpCodeValidator = (value: string): string | undefined => {
  if (!value) return "Kod kiriting";
  if (value.length !== 5) return "Kod 5 xonali bo‘lishi kerak";
  if (!/^\d+$/.test(value))
    return "Kod faqat raqamlardan iborat bo‘lishi kerak";
  return undefined;
};

// Title validator
export const titleValidator = (value: string) => {
  if (!value) return "Nom kiriting";
  if (value.length < 3) return "Nom juda qisqa";
  return undefined;
};

// Meta (slug) validator
export const metaValidator = (value: string) => {
  if (!value) return "Slug kiriting";

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!slugRegex.test(value)) {
    return "Slug faqat kichik harflar, raqamlar va chiziqchadan iborat bo‘lishi kerak";
  }

  return undefined;
};

export const emailValidator = (value: string) => {
  if (!value) return "Iltimos, elektron pochta kiriting.";

  // Oddiy email pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return "Elektron pochta manzili noto‘g‘ri kiritilgan.";
  }

  return undefined;
};

// Narx
export const priceValidator = (value: string) => {
  if (value === undefined || value === null || value === "")
    return "Narxni kiriting";
  const num = Number(value);
  if (!Number.isFinite(num)) return "Narx noto‘g‘ri";
  if (num < 0) return "Narx manfiy bo‘lishi mumkin emas";
  return undefined;
};

// Qisqa description
export const shortDescriptionValidator = (value: string) => {
  if (!value) return "Qisqa tafsilot kiriting";
  if (value.length < 10)
    return "Qisqa tafsilot kamida 10 ta belgidan iborat bo‘lishi kerak";
  return undefined;
};

// To‘liq description
export const descriptionValidator = (value: string) => {
  if (!value) return "To‘liq tafsilot kiriting";
  if (value.length < 20)
    return "To‘liq tafsilot kamida 20 ta belgidan iborat bo‘lishi kerak";
  return undefined;
};

// Manzil
export const addressValidator = (value: string) => {
  if (!value) return "Manzilni kiriting";
  if (value.length < 5) return "Manzil juda qisqa";
  return undefined;
};

// Tajriba
export const experienceValidator = (value: string) => {
  if (!value) return "Tajribani kiriting";
  if (value.length < 2) return "Tajribangiz noto‘g‘ri kiritilgan";
  return undefined;
};

// Select tanlash
export const requiredSelect = (value: string) => {
  if (!value) return "Maydonni tanlang";
  return undefined;
};

// Announcement type
export const announcementTypeValidator = (value: string) => {
  if (!value) return "E`lon turini tanlang";
  if (!["service_announcement", "work_announcement"].includes(value))
    return "E`lon turi noto‘g‘ri";
  return undefined;
};

// Work time
export const workTimeValidator = (value: string) => {
  if (!value) return "Ish vaqtini tanlang";
  if (!["full_time", "part_time", "flexable_time"].includes(value))
    return "Ish vaqti noto‘g‘ri";
  return undefined;
};
