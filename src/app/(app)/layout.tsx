import { AppShell } from '@/components/app/AppShell'
import { Providers } from '@/components/site/Providers'
import { ThemeScript } from '@/components/site/Theme'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ThemeScript />
      <AppShell>{children}</AppShell>
    </Providers>
  )
}
