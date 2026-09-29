import { Providers } from '@/components/site/Providers'
import { ThemeScript } from '@/components/site/Theme'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ThemeScript />
      {children}
    </Providers>
  )
}
