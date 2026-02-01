import { createIsomorphicFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { I18nResources } from '@/types/i18n'
import LanguageDetector from 'i18next-browser-languagedetector'

import uzLanguage from '@/locales/uz.json'
import enLanguage from '@/locales/en.json'

export const resources = {
  uz: uzLanguage,
  en: enLanguage,
} as const

export const defaultNS = 'translation'
const i18nCookieName = 'i18nextLng'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init<I18nResources>({
    resources,
    defaultNS,

    lng: 'uz',
    fallbackLng: 'uz',
    supportedLngs: ['uz', 'en', 'ru'],

    detection: {
      order: ['cookie'],
      lookupCookie: i18nCookieName,
      caches: ['cookie'],
      cookieMinutes: 60 * 24 * 365,
    },

    interpolation: { escapeValue: false },
  })

export const setSSRLanguage = createIsomorphicFn().server(async () => {
  const language = getCookie(i18nCookieName)
  await i18n.changeLanguage(language || 'en')
})

export default i18n
