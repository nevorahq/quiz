import { getQuizMessages } from '@/lib/getQuizMessages'
import BackgroundMesh from '@/components/quiz/BackgroundMesh'
import LanguageSwitcher from '@/components/quiz/LanguageSwitcher'
import IntroHero from '@/components/quiz/IntroHero'

type Props = { params: Promise<{ locale: string }> }

export default async function IntroPage({ params }: Props) {
  const { locale } = await params
  const msg = getQuizMessages(locale)

  return (
    <div className="relative flex min-h-svh flex-col">
      <BackgroundMesh />

      {/* Language switcher — top right */}
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <LanguageSwitcher locale={locale} />
      </div>

      {/* Vertically centred hero */}
      <div className="flex flex-1 items-center justify-center py-16">
        <IntroHero locale={locale} msg={msg} />
      </div>
    </div>
  )
}
