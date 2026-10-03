import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { catalog, findModule } from '@/config/catalog'
import { LearnView } from '@/components/learn/LearnView'
import { moduleName } from '@/lib/course/names'

export function generateStaticParams() {
  return catalog.map((m) => ({ slug: m.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const m = findModule(params.slug)
  return { title: m ? `${moduleName(m.number)}: ${m.title}` : 'Lesson' }
}

export default function LearnPage({ params }: { params: { slug: string } }) {
  if (!findModule(params.slug)) notFound()
  return <LearnView slug={params.slug} />
}
