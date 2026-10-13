import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { catalog, findModule } from '@/config/catalog'
import { LearnView } from '@/components/learn/LearnView'
import { moduleName } from '@/lib/course/names'

export function generateStaticParams() {
  return catalog.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const m = findModule(slug)
  return { title: m ? `${moduleName(m.number)}: ${m.title}` : 'Lesson' }
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!findModule(slug)) notFound()
  return <LearnView slug={slug} />
}
