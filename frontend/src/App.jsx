import React from "react"
import { Toaster } from "sonner"
import AppRouter from "./routes/AppRouter"
import CookieConsentBanner from "./components/layout/CookieConsentBanner"

function App() {
  return (
    <>
      <AppRouter />
      <CookieConsentBanner />
      <Toaster position="bottom-right" />
    </>
  )
}

export default App
