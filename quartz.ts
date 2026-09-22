import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import GoogleTranslate from "./quartz/components/GoogleTranslate"
import { componentRegistry } from "./quartz/components/registry"

const googleTranslate = GoogleTranslate({
	sourceLanguage: "en",
	targetLanguages: ["vi", "en", "fr", "ja", "zh-CN"],
})
componentRegistry.register("GoogleTranslate", googleTranslate, "local")

const addGoogleTranslate = (siteLayout: Awaited<ReturnType<typeof loadQuartzLayout>>) => {
	siteLayout.defaults.beforeBody = [googleTranslate, ...(siteLayout.defaults.beforeBody ?? [])]
	for (const pageLayout of Object.values(siteLayout.byPageType)) {
		pageLayout.beforeBody = [googleTranslate, ...(pageLayout.beforeBody ?? [])]
	}
}

const config = await loadQuartzConfig(undefined, undefined, addGoogleTranslate)
export default config
export const layout = await loadQuartzLayout()
addGoogleTranslate(layout)
