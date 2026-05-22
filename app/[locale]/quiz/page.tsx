import BackgroundMesh from '@/components/quiz/BackgroundMesh'
import LanguageSwitcher from '@/components/quiz/LanguageSwitcher'
import QuizContainer from '@/components/quiz/QuizContainer'

type Props = { params: Promise<{ locale: string }> }

export default async function QuizPage({ params }: Props) {
  const { locale } = await params

  return (
    <div className="relative min-h-svh">
      <BackgroundMesh />

      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <LanguageSwitcher locale={locale} />
      </div>

      <QuizContainer locale={locale} />
    </div>
  )
}
