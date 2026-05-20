import { Language } from '@/types/quiz'

export interface UITranslations {
  // Intro screen
  researchTitle: string
  researchPurpose: string
  questionCount: string
  selectLanguage: string
  startButton: string

  // Block header
  blockLabel: string
  continueButton: string

  // Question screen
  nextButton: string
  backButton: string
  skipButton: string
  questionLabel: string
  ofLabel: string
  answerPlaceholder: string

  // Scale labels
  scaleLabel1: string
  scaleLabel2: string
  scaleLabel3: string
  scaleLabel4: string
  scaleLabel5: string

  // Results screen
  thankYouTitle: string
  thankYouMessage: string
  answeredLabel: string
  totalLabel: string
  exportButton: string
  restartButton: string
  blockAnsweredLabel: string

  // Language names (shown on intro)
  langEn: string
  langRo: string
  langRu: string
}

const translations: Record<Language, UITranslations> = {
  en: {
    researchTitle: 'Personal Finance & Task Management Research',
    researchPurpose:
      'Help us understand how people manage their finances, subscriptions, and personal obligations. Your honest answers will directly shape the product we\'re building.',
    questionCount: '30 questions · ~15 minutes',
    selectLanguage: 'Choose your language to begin',
    startButton: 'Start Survey',
    blockLabel: 'Block',
    continueButton: 'Continue',
    nextButton: 'Next',
    backButton: 'Back',
    skipButton: 'Skip',
    questionLabel: 'Question',
    ofLabel: 'of',
    answerPlaceholder: 'Type your answer here…',
    scaleLabel1: '1',
    scaleLabel2: '2',
    scaleLabel3: '3',
    scaleLabel4: '4',
    scaleLabel5: '5',
    thankYouTitle: 'Thank you!',
    thankYouMessage:
      'Your responses have been recorded. We genuinely appreciate your time and honest answers.',
    answeredLabel: 'Questions answered',
    totalLabel: 'Total',
    exportButton: 'Export Results (JSON)',
    restartButton: 'Start Over',
    blockAnsweredLabel: 'answered',
    langEn: 'English',
    langRo: 'Română',
    langRu: 'Русский',
  },

  ro: {
    researchTitle: 'Cercetare: Finanțe personale și gestionarea sarcinilor',
    researchPurpose:
      'Ajutați-ne să înțelegem cum gestionați finanțele, abonamentele și obligațiile personale. Răspunsurile dvs. sincere vor modela direct produsul pe care îl construim.',
    questionCount: '30 întrebări · ~15 minute',
    selectLanguage: 'Alegeți limba pentru a începe',
    startButton: 'Începe Sondajul',
    blockLabel: 'Blocul',
    continueButton: 'Continuă',
    nextButton: 'Următor',
    backButton: 'Înapoi',
    skipButton: 'Omite',
    questionLabel: 'Întrebarea',
    ofLabel: 'din',
    answerPlaceholder: 'Introduceți răspunsul dvs. aici…',
    scaleLabel1: '1',
    scaleLabel2: '2',
    scaleLabel3: '3',
    scaleLabel4: '4',
    scaleLabel5: '5',
    thankYouTitle: 'Mulțumesc!',
    thankYouMessage:
      'Răspunsurile dvs. au fost înregistrate. Apreciem cu adevărat timpul și onestitatea dvs.',
    answeredLabel: 'Întrebări la care s-a răspuns',
    totalLabel: 'Total',
    exportButton: 'Exportați Rezultatele (JSON)',
    restartButton: 'Reîncepeți',
    blockAnsweredLabel: 'răspuns',
    langEn: 'English',
    langRo: 'Română',
    langRu: 'Русский',
  },

  ru: {
    researchTitle: 'Исследование: Личные финансы и управление задачами',
    researchPurpose:
      'Помогите нам понять, как люди управляют финансами, подписками и личными обязательствами. Ваши честные ответы напрямую определят продукт, который мы создаём.',
    questionCount: '30 вопросов · ~15 минут',
    selectLanguage: 'Выберите язык, чтобы начать',
    startButton: 'Начать опрос',
    blockLabel: 'Блок',
    continueButton: 'Продолжить',
    nextButton: 'Далее',
    backButton: 'Назад',
    skipButton: 'Пропустить',
    questionLabel: 'Вопрос',
    ofLabel: 'из',
    answerPlaceholder: 'Введите ваш ответ здесь…',
    scaleLabel1: '1',
    scaleLabel2: '2',
    scaleLabel3: '3',
    scaleLabel4: '4',
    scaleLabel5: '5',
    thankYouTitle: 'Спасибо!',
    thankYouMessage:
      'Ваши ответы записаны. Мы искренне ценим ваше время и честность.',
    answeredLabel: 'Отвечено на вопросы',
    totalLabel: 'Всего',
    exportButton: 'Экспортировать результаты (JSON)',
    restartButton: 'Начать заново',
    blockAnsweredLabel: 'ответов',
    langEn: 'English',
    langRo: 'Română',
    langRu: 'Русский',
  },
}

export function getTranslations(language: Language): UITranslations {
  return translations[language]
}
