import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { Providers } from '@/components/site/Providers'
import { ThemeScript } from '@/components/site/Theme'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ThemeScript />
      <div className="flex min-h-[100dvh] flex-col bg-surface">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </Providers>
  )
}
