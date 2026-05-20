import { Question, BlockInfo, Language, QuestionType } from '@/types/quiz'

// ---------------------------------------------------------------------------
// Block metadata
// ---------------------------------------------------------------------------

const BLOCK_DATA: Array<{
  block: number
  titles: Record<Language, string>
  goals: Record<Language, string>
}> = [
  {
    block: 1,
    titles: {
      en: 'Personal Context',
      ro: 'Contextul persoanei',
      ru: 'Контекст человека',
    },
    goals: {
      en: 'Understand how you currently manage finances and household obligations',
      ro: 'Înțelegem cum gestionați în prezent finanțele și obligațiile casnice',
      ru: 'Понять, как вы сейчас управляете финансами и бытовыми обязательствами',
    },
  },
  {
    block: 2,
    titles: {
      en: 'Subscriptions & Silent Charges',
      ro: 'Abonamente și taxe silențioase',
      ru: 'Подписки и тихие списания',
    },
    goals: {
      en: 'Explore your awareness of subscriptions and unexpected charges',
      ro: 'Explorăm conștientizarea abonamentelor și taxelor neașteptate',
      ru: 'Изучить осведомлённость о подписках и неожиданных списаниях',
    },
  },
  {
    block: 3,
    titles: {
      en: 'Life Deadlines & Adult Routine',
      ro: 'Termene limită și rutina adultului',
      ru: 'Жизненные дедлайны и взрослая рутина',
    },
    goals: {
      en: 'Understand how you handle recurring annual deadlines and reminders',
      ro: 'Înțelegem cum gestionați termenele limită anuale și reminderele',
      ru: 'Понять, как вы справляетесь с ежегодными дедлайнами и напоминаниями',
    },
  },
  {
    block: 4,
    titles: {
      en: 'Family Budget & Joint Planning',
      ro: 'Bugetul familiei și planificarea comună',
      ru: 'Семейный бюджет и совместное планирование',
    },
    goals: {
      en: 'Explore shared financial management with a partner or family',
      ro: 'Explorăm gestionarea financiară comună cu partenerul sau familia',
      ru: 'Изучить совместное управление финансами с партнёром или семьёй',
    },
  },
  {
    block: 5,
    titles: {
      en: 'Current Tools & Workarounds',
      ro: 'Instrumente actuale și workarounds',
      ru: 'Текущие инструменты и workarounds',
    },
    goals: {
      en: 'Review the tools and workarounds you currently use',
      ro: 'Revizuim instrumentele și soluțiile pe care le folosiți în prezent',
      ru: 'Проверить текущие инструменты и способы управления',
    },
  },
  {
    block: 6,
    titles: {
      en: 'Money & Willingness to Pay',
      ro: 'Bani și disponibilitatea de a plăti',
      ru: 'Деньги и готовность платить',
    },
    goals: {
      en: 'Understand your willingness to pay for better tools',
      ro: 'Înțelegem disponibilitatea dvs. de a plăti pentru instrumente mai bune',
      ru: 'Понять готовность платить за более удобные инструменты',
    },
  },
  {
    block: 7,
    titles: {
      en: 'Criteria & Signals',
      ro: 'Criterii și semnale',
      ru: 'Критерии и сигналы',
    },
    goals: {
      en: 'Identify what matters most to you in an ideal solution',
      ro: 'Identificăm ce contează cel mai mult pentru dvs. în o soluție ideală',
      ru: 'Определить, что для вас важнее всего в идеальном инструменте',
    },
  },
]

// ---------------------------------------------------------------------------
// Question template types
// ---------------------------------------------------------------------------

interface ChoiceOptionsLocalized {
  en: string[]
  ro: string[]
  ru: string[]
}

interface ScaleLabelsLocalized {
  en: { low: string; high: string }
  ro: { low: string; high: string }
  ru: { low: string; high: string }
}

interface QuestionTemplate {
  id: number
  block: number
  type: QuestionType
  texts: Record<Language, string>
  placeholders?: Record<Language, string>
  options?: ChoiceOptionsLocalized
  scaleLabels?: ScaleLabelsLocalized
}

// ---------------------------------------------------------------------------
// Question data (structure + localized text)
// ---------------------------------------------------------------------------

const QUESTION_TEMPLATES: QuestionTemplate[] = [
  // ── Block 1: Personal Context ──────────────────────────────────────────
  {
    id: 1,
    block: 1,
    type: 'open',
    texts: {
      en: 'Walk me through your typical week in terms of finances and household obligations — what do you regularly track and monitor?',
      ro: 'Povestește-mi cum arată o săptămână tipică pentru tine din perspectiva finanțelor și obligațiilor casnice — ce monitorizezi regulat, ce urmărești?',
      ru: 'Расскажи, как выглядит твоя типичная неделя с точки зрения финансов и бытовых обязательств — что ты регулярно контролируешь, за чем следишь?',
    },
    placeholders: {
      en: 'e.g. I check my bank statements weekly, pay utilities on the 1st, track groceries in a spreadsheet…',
      ro: 'ex. Verific extrasele săptămânal, plătesc utilitățile pe 1, urmăresc cheltuielile cu mâncarea într-un tabel…',
      ru: 'например, проверяю выписки еженедельно, плачу коммуналку 1-го числа, веду таблицу расходов на продукты…',
    },
  },
  {
    id: 2,
    block: 1,
    type: 'open',
    texts: {
      en: 'How many active digital subscriptions do you have right now — streaming, apps, SaaS, services? Do you know the exact number or just roughly?',
      ro: 'Câte abonamente digitale active ai în prezent — streaming, aplicații, SaaS, servicii? Cunoști exact cifra sau aproximativ?',
      ru: 'Сколько примерно цифровых подписок у тебя активно прямо сейчас — стриминги, приложения, SaaS, сервисы? Ты точно знаешь эту цифру или примерно?',
    },
    placeholders: {
      en: 'e.g. Netflix, Spotify, iCloud, Notion, gym membership — roughly 8 I think…',
      ro: 'ex. Netflix, Spotify, iCloud, Notion, abonament sală — vreo 8 cred…',
      ru: 'например, Netflix, Spotify, iCloud, Notion, абонемент в зал — штук 8, думаю…',
    },
  },
  {
    id: 3,
    block: 1,
    type: 'choice',
    texts: {
      en: 'Who handles finances and planning in your household — you alone, or is it a shared responsibility?',
      ro: 'Cine se ocupă de finanțe și planificare în familia/gospodăria ta — tu singur sau este o sarcină comună?',
      ru: 'Кто в вашей семье/домохозяйстве занимается финансами и планированием — ты один, или это общая задача?',
    },
    options: {
      en: ['Me alone', 'Mostly me', 'Shared equally', 'Mostly my partner'],
      ro: ['Eu singur/ă', 'Majoritar eu', 'Împărțit egal', 'Majoritar partenerul meu'],
      ru: ['Я один(а)', 'В основном я', 'Поровну', 'В основном партнёр'],
    },
  },
  {
    id: 4,
    block: 1,
    type: 'open',
    texts: {
      en: 'Do you currently have any system for tracking personal obligations — documents, deadlines, payments? What does that look like?',
      ro: 'Ai în prezent un sistem pentru urmărirea obligațiilor personale — documente, termene, plăți? Ce sistem este acela?',
      ru: 'Есть ли у тебя сейчас какая-то система для отслеживания личных обязательств — документов, дедлайнов, платежей? Что это за система?',
    },
    placeholders: {
      en: 'e.g. I use a Notion page / Google Sheets / just rely on memory / nothing formal…',
      ro: 'ex. Folosesc o pagină Notion / Google Sheets / mă bazez pe memorie / nimic formal…',
      ru: 'например, использую страницу в Notion / Google Таблицы / просто помню / ничего формального…',
    },
  },
  {
    id: 5,
    block: 1,
    type: 'open',
    texts: {
      en: 'How many apps do you use to manage personal finances and tasks? List them.',
      ro: 'Câte aplicații folosești pentru gestionarea finanțelor personale și sarcinilor? Enumeră-le.',
      ru: 'Сколько приложений ты используешь для управления личными финансами и задачами? Перечисли их.',
    },
    placeholders: {
      en: 'e.g. Monzo for banking, Reminders for to-dos, Google Sheets for budget…',
      ro: 'ex. Banca pentru banking, Reminders pentru to-do, Google Sheets pentru buget…',
      ru: 'например, банковское приложение, Напоминания для задач, Google Таблицы для бюджета…',
    },
  },

  // ── Block 2: Subscriptions & Silent Charges ────────────────────────────
  {
    id: 6,
    block: 2,
    type: 'open',
    texts: {
      en: 'When did you last discover a charge you had forgotten about or didn\'t plan for? What was it and how long had it been going unnoticed?',
      ro: 'Când ai descoperit ultima dată o taxă pe care ai uitat-o sau nu ai planificat-o? Ce era și cât timp a trecut neobservată?',
      ru: 'Когда ты последний раз обнаружил списание, о котором забыл или не планировал? Что это было и сколько времени оно шло незамеченным?',
    },
    placeholders: {
      en: 'e.g. A $12/mo app subscription I hadn\'t opened in 6 months, charged for about a year…',
      ro: 'ex. Un abonament de 12$/lună la o aplicație pe care nu o mai deschisesem de 6 luni, taxat circa un an…',
      ru: 'например, подписка 12$/мес на приложение, которое не открывал полгода, списывалась около года…',
    },
  },
  {
    id: 7,
    block: 2,
    type: 'open',
    texts: {
      en: 'How do you currently track what you\'re paying for each month? Show me, if that\'s not too much trouble.',
      ro: 'Cum urmărești în prezent pentru ce plătești în fiecare lună? Arată-mi, dacă nu este complicat.',
      ru: 'Как ты сейчас отслеживаешь, за что платишь каждый месяц? Покажи мне, если не сложно.',
    },
    placeholders: {
      en: 'e.g. I scan my bank statement monthly / I have a spreadsheet / I don\'t really track it…',
      ro: 'ex. Scanez extrasul lunar / Am un tabel / Nu urmăresc cu adevărat…',
      ru: 'например, просматриваю выписку ежемесячно / веду таблицу / особо не слежу…',
    },
  },
  {
    id: 8,
    block: 2,
    type: 'open',
    texts: {
      en: 'Has there ever been a situation where you paid for a subscription you hadn\'t used in over a month? How did you find out?',
      ro: 'A existat vreodată o situație în care ai plătit pentru un abonament pe care nu l-ai folosit mai mult de o lună? Cum ai aflat?',
      ru: 'Был ли случай, когда ты платил за подписку, которой не пользовался больше месяца? Как это вскрылось?',
    },
    placeholders: {
      en: 'e.g. Yes — a Duolingo yearly plan, I forgot I auto-renewed it and noticed 3 months later…',
      ro: 'ex. Da — un plan anual Duolingo, am uitat că s-a reînnoit automat și am observat după 3 luni…',
      ru: 'например, да — годовой план Duolingo, забыл про авторенью и заметил через 3 месяца…',
    },
  },
  {
    id: 9,
    block: 2,
    type: 'choice',
    texts: {
      en: 'How do you find out when a service has raised its price? Do you notice right away or after several months?',
      ro: 'Cum afli că prețul unui serviciu a crescut? Observi imediat sau după câteva luni?',
      ru: 'Как ты узнаёшь о том, что цена на сервис выросла? Замечаешь сразу или через несколько месяцев?',
    },
    options: {
      en: ['Immediately — I get an email', 'After a few weeks', 'After a few months', 'I rarely notice'],
      ro: ['Imediat — primesc un email', 'După câteva săptămâni', 'După câteva luni', 'Rareori observ'],
      ru: ['Сразу — получаю письмо', 'Через несколько недель', 'Через несколько месяцев', 'Редко замечаю'],
    },
  },
  {
    id: 10,
    block: 2,
    type: 'choice',
    texts: {
      en: 'Have you tried any dedicated subscription tracking apps — Bobby, Rocket Money, or others? Why did you start or why did you stop?',
      ro: 'Ai încercat aplicații speciale pentru controlul abonamentelor — Bobby, Rocket Money, altceva? De ce ai început sau de ce ai renunțat?',
      ru: 'Пробовал ли ты специальные приложения для контроля подписок — Bobby, Rocket Money, что-то ещё? Почему начал или почему бросил?',
    },
    options: {
      en: ['Yes, still using one', 'Yes, but I stopped', 'No, never tried', 'Currently testing one'],
      ro: ['Da, îl folosesc în continuare', 'Da, dar am renunțat', 'Nu, niciodată', 'Testez acum unul'],
      ru: ['Да, пользуюсь', 'Да, но бросил(а)', 'Нет, не пробовал(а)', 'Сейчас тестирую'],
    },
  },

  // ── Block 3: Life Deadlines & Adult Routine ────────────────────────────
  {
    id: 11,
    block: 3,
    type: 'open',
    texts: {
      en: 'Tell me about the last time you missed something — insurance renewal, a document, a payment, a doctor\'s appointment. What happened? What were the consequences?',
      ro: 'Povestește-mi despre ultima situație în care ai ratat ceva — asigurare, document, plată, programare la medic. Ce s-a întâmplat? Care au fost consecințele?',
      ru: 'Расскажи о последнем случае, когда ты что-то пропустил — страховку, документ, оплату, запись к врачу. Что произошло? Какие были последствия?',
    },
    placeholders: {
      en: 'e.g. I forgot to renew my car insurance and drove uninsured for two weeks before noticing…',
      ro: 'ex. Am uitat să reînnoiesc asigurarea auto și am condus neasigurat două săptămâni înainte să observ…',
      ru: 'например, забыл продлить страховку и две недели ездил незастрахованным, пока не заметил…',
    },
  },
  {
    id: 12,
    block: 3,
    type: 'open',
    texts: {
      en: 'Where do your reminders for important annual things currently "live" — insurance renewals, car inspection, passport, taxes?',
      ro: 'Unde "locuiesc" în prezent reminderele tale pentru lucruri importante anuale — reînnoirea asigurării, inspecția auto, pașaportul, taxele?',
      ru: 'Где у тебя сейчас "живут" напоминания о важных ежегодных вещах — продление страховки, техосмотр, паспорт, налоги?',
    },
    placeholders: {
      en: 'e.g. Scattered across email, phone calendar, and sticky notes on my desk…',
      ro: 'ex. Împrăștiate prin email, calendarul telefonului și notițe pe birou…',
      ru: 'например, разбросаны по почте, календарю телефона и стикерам на столе…',
    },
  },
  {
    id: 13,
    block: 3,
    type: 'choice',
    texts: {
      en: 'How do you find out that a document or insurance policy is about to expire? Is it a system or luck?',
      ro: 'Cum afli că un document sau o asigurare expiră în curând? Este un sistem sau o întâmplare?',
      ru: 'Как ты узнаёшь, что документ или страховка скоро истекает? Это система или случайность?',
    },
    options: {
      en: ['I have a reminder system', 'I remember them myself', 'I find out by accident', 'I often miss deadlines'],
      ro: ['Am un sistem de remindere', 'Le țin minte singur/ă', 'Aflu accidental', 'Adesea le ratez'],
      ru: ['Есть система напоминаний', 'Помню сам(а)', 'Узнаю случайно', 'Часто пропускаю'],
    },
  },
  {
    id: 14,
    block: 3,
    type: 'scale',
    texts: {
      en: 'How much time per month do you spend on what could be called "household admin work" — payments, reminders, checks, documents?',
      ro: 'Cât timp pe lună petreci cu ceea ce se poate numi "muncă administrativă casnică" — plăți, remindere, verificări, documente?',
      ru: 'Сколько времени в месяц ты тратишь на бытовую административную работу — платежи, напоминания, проверки, документы?',
    },
    scaleLabels: {
      en: { low: 'Almost none', high: '10+ hours' },
      ro: { low: 'Aproape deloc', high: 'Peste 10 ore' },
      ru: { low: 'Почти нет', high: '10+ часов' },
    },
  },
  {
    id: 15,
    block: 3,
    type: 'scale',
    texts: {
      en: 'Have you ever had the feeling "I\'m definitely missing something important but I don\'t know what"? How often does that happen?',
      ro: 'Ai avut vreodată sentimentul că "cu siguranță ratez ceva important, dar nu știu ce"? Cât de des se întâmplă?',
      ru: 'Было ли у тебя ощущение "я точно что-то важное упускаю, но не знаю что"? Как часто это происходит?',
    },
    scaleLabels: {
      en: { low: 'Never', high: 'Very often' },
      ro: { low: 'Niciodată', high: 'Foarte des' },
      ru: { low: 'Никогда', high: 'Очень часто' },
    },
  },

  // ── Block 4: Family Budget & Joint Planning ────────────────────────────
  {
    id: 16,
    block: 4,
    type: 'open',
    texts: {
      en: 'If you have a partner — how do you manage a shared budget? Where does it live, who updates it, how often do disagreements come up?',
      ro: 'Dacă ai un partener — cum gestionați bugetul comun? Unde este stocat, cine îl actualizează, cât de des apar neînțelegeri?',
      ru: 'Если у тебя есть партнёр — как вы ведёте совместный бюджет? Где это живёт, кто обновляет, как часто бывают разногласия?',
    },
    placeholders: {
      en: 'e.g. We share a Google Sheet, I update it weekly, disagreements maybe once a month…',
      ro: 'ex. Avem un Google Sheet comun, îl actualizez săptămânal, neînțelegeri poate o dată pe lună…',
      ru: 'например, есть общая Google Таблица, обновляю раз в неделю, разногласия может раз в месяц…',
    },
  },
  {
    id: 17,
    block: 4,
    type: 'open',
    texts: {
      en: 'Has there ever been a conflict or tension because one of you didn\'t know about the other\'s expense? Tell me what happened.',
      ro: 'A existat vreun conflict sau tensiune din cauza faptului că unul dintre voi nu știa despre cheltuiala celuilalt? Povestește ce s-a întâmplat.',
      ru: 'Был ли конфликт или напряжение из-за того, что один из вас не знал о расходе другого? Расскажи, что случилось.',
    },
    placeholders: {
      en: 'e.g. My partner bought a course without mentioning it and we went over budget that month…',
      ro: 'ex. Partenerul a cumpărat un curs fără să menționeze și am depășit bugetul luna aceea…',
      ru: 'например, партнёр купил курс, не предупредив, и мы вышли за бюджет в том месяце…',
    },
  },
  {
    id: 18,
    block: 4,
    type: 'choice',
    texts: {
      en: 'How do you currently divide responsibility for payments and household tasks — does each person have their own zone or is it chaotic?',
      ro: 'Cum împărțiți în prezent responsabilitatea pentru plăți și sarcini casnice — fiecare are zona sa sau este haos?',
      ru: 'Как вы сейчас делите ответственность за платежи и задачи по дому — у каждого своя зона или это хаос?',
    },
    options: {
      en: ['Each has their own zone', 'We share everything', 'Mostly one person handles it', "It's pretty chaotic"],
      ro: ['Fiecare are zona sa', 'Împărțim totul', 'Majoritar o persoană', 'Este destul de haotic'],
      ru: ['У каждого своя зона', 'Делим всё', 'В основном один человек', 'Это довольно хаотично'],
    },
  },
  {
    id: 19,
    block: 4,
    type: 'open',
    texts: {
      en: 'Have you tried any shared app for family budgeting or tasks? What did you like, what didn\'t work?',
      ro: 'Ați încercat vreo aplicație comună pentru bugetul familiei sau sarcini? Ce v-a plăcut, ce nu?',
      ru: 'Пробовали ли вы какое-то общее приложение для семейного бюджета или задач? Что понравилось, что нет?',
    },
    placeholders: {
      en: 'e.g. We tried Splitwise — good for shared expenses but doesn\'t handle recurring bills…',
      ro: 'ex. Am încercat Splitwise — bun pentru cheltuieli comune dar nu gestionează facturile recurente…',
      ru: 'например, пробовали Splitwise — хорошо для общих трат, но не справляется с регулярными платежами…',
    },
  },

  // ── Block 5: Current Tools & Workarounds ───────────────────────────────
  {
    id: 20,
    block: 5,
    type: 'open',
    texts: {
      en: 'Show me what your Google Calendar or Notion looks like — what\'s in there related to personal obligations?',
      ro: 'Arată-mi cum arată Google Calendar-ul sau Notion-ul tău — ce există acolo legat de obligațiile personale?',
      ru: 'Покажи мне, как выглядит твой Google Calendar или Notion — что там есть по личным обязательствам?',
    },
    placeholders: {
      en: 'e.g. My calendar has only work meetings, nothing personal — or describe what you have there…',
      ro: 'ex. Calendarul meu are doar întâlniri de lucru, nimic personal — sau descrie ce ai acolo…',
      ru: 'например, в моём календаре только рабочие встречи, ничего личного — или опиши что там есть…',
    },
  },
  {
    id: 21,
    block: 5,
    type: 'open',
    texts: {
      en: 'Have you tried pulling everything into one place — Notion, a spreadsheet, an app? What happened and why didn\'t it stick?',
      ro: 'Ai încercat să aduni totul într-un singur loc — Notion, tabel, aplicație? Ce s-a întâmplat și de ce nu a funcționat?',
      ru: 'Ты пробовал собрать всё в одном месте — Notion, таблицу, приложение? Что получилось и почему это не прижилось?',
    },
    placeholders: {
      en: 'e.g. Set up a full Notion dashboard once, maintained it for 2 weeks, then forgot about it…',
      ro: 'ex. Am creat un dashboard Notion complet, l-am menținut 2 săptămâni, apoi l-am uitat…',
      ru: 'например, сделал полный дашборд в Notion, поддерживал 2 недели, потом забросил…',
    },
  },
  {
    id: 22,
    block: 5,
    type: 'choice',
    texts: {
      en: 'If you had to answer right now "how much do I spend on subscriptions per month" — do you know the exact number? How long would it take you to find it?',
      ro: 'Dacă ar trebui să răspunzi acum "cât cheltuiesc pe abonamente pe lună" — cunoști cifra exactă? Cât timp ți-ar lua să o găsești?',
      ru: 'Если бы тебе нужно было прямо сейчас ответить "сколько я трачу на подписки в месяц" — ты знаешь точную цифру? Как долго займёт её найти?',
    },
    options: {
      en: ['I know exactly', 'Roughly — within $10', "I'd need to look it up (5–10 min)", 'No idea at all'],
      ro: ['Știu exact', 'Aproximativ — cu ±10€', 'Ar trebui să verific (5–10 min)', 'Nu am nicio idee'],
      ru: ['Знаю точно', 'Примерно — с разницей до 10$', 'Придётся поискать (5–10 мин)', 'Понятия не имею'],
    },
  },
  {
    id: 23,
    block: 5,
    type: 'open',
    texts: {
      en: 'What frustrates you most about how you currently manage personal finances and tasks?',
      ro: 'Ce te deranjează cel mai mult în modul în care gestionezi în prezent finanțele personale și sarcinile?',
      ru: 'Что тебя больше всего раздражает в том, как ты сейчас управляешь личными финансами и задачами?',
    },
    placeholders: {
      en: 'e.g. Everything is scattered, I never have a clear picture, I waste time searching for info…',
      ro: 'ex. Totul este împrăștiat, nu am niciodată o imagine clară, pierd timp căutând informații…',
      ru: 'например, всё разбросано, никогда нет чёткой картины, трачу время на поиск информации…',
    },
  },

  // ── Block 6: Money & Willingness to Pay ───────────────────────────────
  {
    id: 24,
    block: 6,
    type: 'open',
    texts: {
      en: 'Are you currently paying for any personal finance or productivity app? What exactly and why that one?',
      ro: 'Plătești în prezent pentru vreo aplicație de finanțe personale sau productivitate? Pentru ce anume și de ce exact pentru aceea?',
      ru: 'Ты сейчас платишь за какое-то приложение для личных финансов или продуктивности? За что именно и почему именно за это?',
    },
    placeholders: {
      en: 'e.g. YNAB at $99/year — it forced me to think about money differently…',
      ro: 'ex. YNAB la 99$/an — m-a forțat să gândesc altfel despre bani…',
      ru: 'например, YNAB за 99$/год — заставил думать о деньгах по-другому…',
    },
  },
  {
    id: 25,
    block: 6,
    type: 'open',
    texts: {
      en: 'Has there been a case where you paid for an app specifically because it saved you money or reduced stress? Tell me about it.',
      ro: 'A existat vreodată o situație în care ai plătit pentru o aplicație doar pentru că ți-a economisit bani sau a redus stresul? Povestește.',
      ru: 'Был ли случай, когда ты заплатил за приложение только потому, что оно сэкономило тебе деньги или сняло стресс? Расскажи.',
    },
    placeholders: {
      en: 'e.g. A budgeting app that caught a duplicate subscription saved me $180/year…',
      ro: 'ex. O aplicație de buget care a prins un abonament duplicat mi-a economisit 180$/an…',
      ru: 'например, приложение для бюджета нашло дубль подписки и сэкономило 180$/год…',
    },
  },
  {
    id: 26,
    block: 6,
    type: 'choice',
    texts: {
      en: 'If a tool found you one forgotten subscription costing $15/month — would you pay $9/month for it?',
      ro: 'Dacă un instrument ți-ar găsi un abonament uitat de $15/lună — ai plăti $9/lună pentru el?',
      ru: 'Если бы инструмент нашёл тебе одну забытую подписку на $15/мес — ты бы заплатил за него $9/мес?',
    },
    options: {
      en: ['Yes, definitely', 'Probably yes', 'Need to think about it', 'No'],
      ro: ['Da, cu siguranță', 'Probabil da', 'Trebuie să mă gândesc', 'Nu'],
      ru: ['Да, точно', 'Скорее да', 'Нужно подумать', 'Нет'],
    },
  },
  {
    id: 27,
    block: 6,
    type: 'choice',
    texts: {
      en: 'Who in your household makes the decision to buy a new app or service — you, your partner, jointly?',
      ro: 'Cine în familia ta ia decizia de a cumpăra o nouă aplicație sau serviciu — tu, partenerul, împreună?',
      ru: 'Кто в вашей семье принимает решение о покупке нового приложения или сервиса — ты, партнёр, совместно?',
    },
    options: {
      en: ['Me', 'My partner', 'Jointly', "No one — we don't buy apps"],
      ro: ['Eu', 'Partenerul meu', 'Împreună', 'Nimeni — nu cumpărăm aplicații'],
      ru: ['Я', 'Мой партнёр', 'Совместно', 'Никто — не покупаем приложения'],
    },
  },

  // ── Block 7: Criteria & Signals ───────────────────────────────────────
  {
    id: 28,
    block: 7,
    type: 'open',
    texts: {
      en: 'If you had a perfect app for managing personal obligations — what would it do first? What would matter most?',
      ro: 'Dacă ai avea aplicația perfectă pentru gestionarea obligațiilor personale — ce ar face în primul rând? Ce ar conta cel mai mult?',
      ru: 'Если бы у тебя было идеальное приложение для управления личными обязательствами — что бы оно делало в первую очередь? Что было бы важнее всего?',
    },
    placeholders: {
      en: 'e.g. Show me everything I\'m paying for, alert me to forgotten subscriptions, remind me 30 days before renewals…',
      ro: 'ex. Să îmi arate tot ce plătesc, să mă alerteze la abonamente uitate, să mă reamintească cu 30 de zile înainte de reînnoire…',
      ru: 'например, показывать всё что я плачу, предупреждать о забытых подписках, напоминать за 30 дней до продления…',
    },
  },
  {
    id: 29,
    block: 7,
    type: 'open',
    texts: {
      en: 'What would stop you from switching to a new tool, even if it\'s better than what you use now?',
      ro: 'Ce te-ar împiedica să treci la un nou instrument, chiar dacă este mai bun decât cel actual?',
      ru: 'Что останавливало бы тебя от перехода на новый инструмент, даже если он лучше текущего?',
    },
    placeholders: {
      en: 'e.g. Having to migrate data, a steep learning curve, not trusting a new app with my financial info…',
      ro: 'ex. Migrarea datelor, o curbă abruptă de învățare, neîncrederea într-o nouă aplicație cu datele financiare…',
      ru: 'например, перенос данных, крутой порог вхождения, недоверие новому приложению с финансовыми данными…',
    },
  },
  {
    id: 30,
    block: 7,
    type: 'choice',
    texts: {
      en: 'Would you be willing to show me right now how you currently manage your subscriptions and budget?',
      ro: 'Ai fi de acord să-mi arăți acum cum gestionezi abonamentele și bugetul?',
      ru: 'Ты бы согласился показать мне прямо сейчас, как ты ведёшь подписки и бюджет?',
    },
    options: {
      en: ['Yes, right now', 'Maybe later', 'Prefer not to'],
      ro: ['Da, acum', 'Poate mai târziu', 'Prefer să nu'],
      ru: ['Да, прямо сейчас', 'Может позже', 'Предпочитаю не показывать'],
    },
  },
]

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Assemble localized Question[] from templates + block metadata */
export function getQuestions(language: Language): Question[] {
  return QUESTION_TEMPLATES.map((template) => {
    const blockMeta = BLOCK_DATA.find((b) => b.block === template.block)!
    return {
      id: template.id,
      block: template.block,
      blockTitle: blockMeta.titles[language],
      blockGoal: blockMeta.goals[language],
      text: template.texts[language],
      type: template.type,
      ...(template.options
        ? { options: template.options[language] }
        : {}),
      ...(template.placeholders
        ? { placeholder: template.placeholders[language] }
        : {}),
      ...(template.scaleLabels
        ? {
            scaleLow: template.scaleLabels[language].low,
            scaleHigh: template.scaleLabels[language].high,
          }
        : {}),
    }
  })
}

/** Localized block info for block-header screens */
export function getBlockInfo(language: Language): BlockInfo[] {
  return BLOCK_DATA.map((b) => ({
    block: b.block,
    title: b.titles[language],
    goal: b.goals[language],
  }))
}

export const TOTAL_QUESTIONS = QUESTION_TEMPLATES.length   // 30
export const TOTAL_BLOCKS = BLOCK_DATA.length              // 7

/** First question index (0-based) for a given block */
export function blockStartIndex(block: number): number {
  return QUESTION_TEMPLATES.filter((q) => q.block < block).length
}

/** Last question index (0-based) for a given block */
export function blockEndIndex(block: number): number {
  return QUESTION_TEMPLATES.filter((q) => q.block <= block).length - 1
}
