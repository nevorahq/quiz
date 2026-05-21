import en from '@/messages/en.json'
import ro from '@/messages/ro.json'
import ru from '@/messages/ru.json'

const MESSAGES = { en, ro, ru } as const

export type QuizMessages = typeof en

export function getQuizMessages(locale: string): QuizMessages {
  return MESSAGES[locale as keyof typeof MESSAGES] ?? MESSAGES.en
}

/** Traverse a dotted path through the message tree, returning the string value or the path itself as fallback. */
export function t(messages: QuizMessages, path: string): string {
  const parts = path.split('.')
  let node: unknown = messages
  for (const part of parts) {
    if (typeof node !== 'object' || node === null) return path
    node = (node as Record<string, unknown>)[part]
  }
  return typeof node === 'string' ? node : path
}
