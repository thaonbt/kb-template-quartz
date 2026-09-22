import { QuartzComponent, QuartzComponentConstructor } from "./types"

export type GoogleTranslateOptions = {
  sourceLanguage?: string
  targetLanguages?: string[]
}

const languageNames: Record<string, string> = {
  en: "EN",
  fr: "FR",
  ja: "JP",
  "zh-CN": "CN",
  vi: "VI",
}

const GoogleTranslate: QuartzComponentConstructor<GoogleTranslateOptions> = (options = {}) => {
  const sourceLanguage = options.sourceLanguage ?? "vi"
  const targetLanguages = options.targetLanguages ?? ["en", "fr", "ja", "zh-CN"]

  const Translate: QuartzComponent = () => (
    <div class="google-translate" aria-label="Translate page">
      <label for="google-translate-select">Translate to</label>
      <select id="google-translate-select" defaultValue="">
        <option value="">Original</option>
        {targetLanguages.map((language) => (
          <option value={language}>{languageNames[language] ?? language}</option>
        ))}
      </select>
      <div id="google_translate_element"></div>
    </div>
  )

  Translate.afterDOMLoaded = `
    (() => {
      const sourceLanguage = ${JSON.stringify(sourceLanguage)}
      const selector = document.querySelector('#google-translate-select')
      let initialized = false
      const readTranslationLanguage = () => {
        const cookie = document.cookie.split('; ').find((value) => value.startsWith('googtrans='))
        const value = cookie?.slice('googtrans='.length) ?? ''
        const parts = value.split('/')
        if (parts[1] !== sourceLanguage) return ''
        const language = parts[2]
        return language && language !== sourceLanguage ? decodeURIComponent(language) : ''
      }
      let requestedLanguage = readTranslationLanguage()

      const setTranslationCookie = (language) => {
        const value = language ? '/' + sourceLanguage + '/' + language : ''
        const expires = language ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 UTC'
        const cookie = 'googtrans=' + value + '; path=/' + expires
        document.cookie = cookie
        const hostname = window.location.hostname
        if (hostname.includes('.')) {
          document.cookie = cookie + '; domain=.' + hostname
        }
      }

      if (document.cookie.includes('googtrans=') && !requestedLanguage) {
        setTranslationCookie('')
      }

      const applyGoogleLanguage = (language, attempts = 0) => {
        const googleSelector = document.querySelector('.goog-te-combo')
        if (googleSelector) {
          googleSelector.value = language || sourceLanguage
          googleSelector.dispatchEvent(new Event('change'))
          return
        }
        if (attempts < 50) window.setTimeout(() => applyGoogleLanguage(language, attempts + 1), 100)
      }

      const initializeGoogleTranslate = () => {
        if (initialized || !window.google?.translate?.TranslateElement) return
        initialized = true
        new window.google.translate.TranslateElement(
          { pageLanguage: sourceLanguage, autoDisplay: false },
          'google_translate_element',
        )
        if (requestedLanguage) applyGoogleLanguage(requestedLanguage)
      }

      const normalizeTranslatedText = () => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        const textNodes = []
        let node
        while ((node = walker.nextNode())) textNodes.push(node)
        for (const textNode of textNodes) {
          const normalized = textNode.nodeValue?.normalize('NFC')
          if (normalized && normalized !== textNode.nodeValue) textNode.nodeValue = normalized
        }
      }

      const observer = new MutationObserver(() => normalizeTranslatedText())
      observer.observe(document.body, { childList: true, characterData: true, subtree: true })
      normalizeTranslatedText()

      window.googleTranslateElementInit = initializeGoogleTranslate
      if (selector && requestedLanguage) selector.value = requestedLanguage
      if (window.google?.translate?.TranslateElement) {
        initializeGoogleTranslate()
      } else if (!document.querySelector('script[data-google-translate]')) {
        const script = document.createElement('script')
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.dataset.googleTranslate = 'true'
        script.async = true
        document.head.appendChild(script)
      }

      selector?.addEventListener('change', (event) => {
        const language = event.target.value
        requestedLanguage = language
        setTranslationCookie(language)
        applyGoogleLanguage(language)
        window.setTimeout(() => window.location.reload(), 750)
      })
    })()
  `

  Translate.css = `
    @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

    body.translated-ltr,
    body.translated-rtl,
    body.translated-ltr *,
    body.translated-rtl * {
      font-family: 'Be Vietnam Pro', sans-serif !important;
      font-kerning: normal;
      font-variant-ligatures: normal;
      font-feature-settings: 'ccmp', 'mark', 'mkmk';
      text-rendering: optimizeLegibility;
    }

    body.translated-ltr font,
    body.translated-rtl font {
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    body.translated-ltr,
    body.translated-rtl {
      --titleFont: 'Be Vietnam Pro', sans-serif;
      --headerFont: 'Be Vietnam Pro', sans-serif;
      --bodyFont: 'Be Vietnam Pro', sans-serif;
      --codeFont: 'Be Vietnam Pro', sans-serif;
    }

    body.translated-ltr h1,
    body.translated-ltr h2,
    body.translated-ltr h3,
    body.translated-ltr h4,
    body.translated-ltr h5,
    body.translated-ltr h6,
    body.translated-rtl h1,
    body.translated-rtl h2,
    body.translated-rtl h3,
    body.translated-rtl h4,
    body.translated-rtl h5,
    body.translated-rtl h6,
    body.translated-ltr nav,
    body.translated-rtl nav,
    body.translated-ltr button,
    body.translated-rtl button,
    body.translated-ltr input,
    body.translated-rtl input,
    body.translated-ltr select,
    body.translated-rtl select {
      font-family: 'Be Vietnam Pro', sans-serif !important;
    }

    .google-translate {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.85rem;
      justify-content: flex-end;
      margin-left: auto;
      width: 100%;
      box-sizing: border-box;
    }

    .google-translate label {
      color: var(--gray);
    }

    .google-translate select {
      color: var(--darkgray);
      background: var(--light);
      border: 1px solid var(--lightgray);
      border-radius: 4px;
      padding: 0.25rem 0.35rem;
      font: inherit;
      cursor: pointer;
    }

    #google_translate_element {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
    }

    .goog-te-banner-frame,
    .skiptranslate iframe {
      display: none !important;
    }

    body {
      top: 0 !important;
    }
  `

  Translate.displayName = "GoogleTranslate"

  return Translate
}

export default GoogleTranslate