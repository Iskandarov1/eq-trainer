// All user-facing content in EN + RU. Every string is {en, ru}; L() picks the active language.
export const L = (lang, s) => (typeof s === 'string' ? s : s?.[lang] ?? s?.en ?? '')

// Sentence starter pre-filled INTO the field: the user finishes the sentence by typing.
// A trailing "…" is an open tail — strip it and leave a space; internal "…" stay as slots.
export const starterFor = (lang, ph) => {
  const s = L(lang, ph)
  return (s.endsWith('…') ? s.slice(0, -1).trimEnd() : s) + ' '
}

export const UI = {
  appName: { en: 'EQ Trainer', ru: 'EQ Тренер' },
  tagline: { en: 'Grow your emotional intelligence — the Goleman way', ru: 'Развивайте эмоциональный интеллект по методу Гоулмана' },
  home: { en: 'Dashboard', ru: 'Дашборд' },
  journey: { en: '30-Day Journey', ru: '30-дневный путь' },
  nextLevel: { en: 'Next Level', ru: 'Новый уровень' },
  learn: { en: 'Learn', ru: 'Учиться' },
  practice: { en: 'Practice', ru: 'Практика' },
  journal: { en: 'Journal', ru: 'Дневник' },
  progress: { en: 'Progress', ru: 'Прогресс' },
  save: { en: 'Save to journal', ru: 'Сохранить в дневник' },
  saved: { en: 'Saved! Well done — every practice builds the muscle.', ru: 'Сохранено! Отлично — каждая практика укрепляет навык.' },
  day: { en: 'Day', ru: 'День' },
  of30: { en: 'of 30', ru: 'из 30' },
  startJourney: { en: 'Start my journey', ru: 'Начать путь' },
  startJourneyHint: { en: 'Press start — the app will guide you day by day through all 4 weeks.', ru: 'Нажмите «Начать» — приложение проведёт вас день за днём через все 4 недели.' },
  todayPractices: { en: "Today's practices", ru: 'Практики сегодня' },
  markDayDone: { en: 'Complete this day', ru: 'Завершить день' },
  dayDone: { en: 'Day completed ✓', ru: 'День завершён ✓' },
  streak: { en: 'day streak', ru: 'дней подряд' },
  daysCompleted: { en: 'days completed', ru: 'дней завершено' },
  upcoming: { en: 'Upcoming', ru: 'Впереди' },
  currentWeek: { en: 'Current week', ru: 'Текущая неделя' },
  completedW: { en: 'Completed', ru: 'Завершено' },
  weekGoal: { en: 'Goal', ru: 'Цель' },
  viewDay: { en: 'Open today', ru: 'Открыть сегодня' },
  browseDay: { en: 'Open day', ru: 'Открыть день' },
  locked: { en: 'Unlocks later — one day at a time', ru: 'Откроется позже — день за днём' },
  intensity: { en: 'Intensity', ru: 'Интенсивность' },
  intensityNow: { en: 'How intense is it right now? (1–10)', ru: 'Насколько это сильно прямо сейчас? (1–10)' },
  practiceCount: { en: (n, e) => `You've worked with ${e} ${n} time${n === 1 ? '' : 's'}`, ru: (n, e) => `Вы работали с эмоцией «${e}» ${n} раз` },
  masteryScore: { en: 'Mastery score', ru: 'Уровень мастерства' },
  masteryHint: { en: 'Based on practice frequency and depth of reflection', ru: 'На основе частоты практик и глубины рефлексии' },
  intensityOverTime: { en: 'Emotion intensity over time', ru: 'Интенсивность эмоции со временем' },
  insightDown: { en: (p, e) => `Your ${e} intensity has decreased by ${p}% — the practice is working.`, ru: (p, e) => `Интенсивность эмоции «${e}» снизилась на ${p}% — практика работает.` },
  insightUp: { en: (p, e) => `Your recent ${e} intensity is ${p}% higher — be curious: what changed lately?`, ru: (p, e) => `Интенсивность эмоции «${e}» выросла на ${p}% — проявите любопытство: что изменилось в последнее время?` },
  insightFlat: { en: 'Keep practicing to reveal your intensity trend.', ru: 'Продолжайте практиковать, чтобы увидеть динамику.' },
  needMore: { en: 'Complete at least 2 practices to see your chart and insights.', ru: 'Выполните минимум 2 практики, чтобы увидеть график и инсайты.' },
  noEntries: { en: 'No journal entries yet. Complete a practice — it will appear here.', ru: 'Записей пока нет. Выполните практику — она появится здесь.' },
  searchEntries: { en: 'Search entries…', ru: 'Поиск по записям…' },
  from: { en: 'From', ru: 'С' },
  to: { en: 'To', ru: 'По' },
  compare: { en: 'First vs Most recent', ru: 'Первая и последняя' },
  firstEntry: { en: 'First time', ru: 'Первый раз' },
  latestEntry: { en: 'Most recent', ru: 'Последний раз' },
  close: { en: 'Close', ru: 'Закрыть' },
  overallProgress: { en: 'Overall progress', ru: 'Общий прогресс' },
  totalPractices: { en: (n) => `Total practices: ${n} across all emotions`, ru: (n) => `Всего практик: ${n} по всем эмоциям` },
  mostImproved: { en: 'Most improved emotion', ru: 'Наибольший прогресс' },
  focusSuggestion: { en: (e) => `Consider working more on ${e}`, ru: (e) => `Стоит больше поработать с эмоцией «${e}»` },
  weeklySummary: { en: 'Weekly summary', ru: 'Итоги недели' },
  practicesPerEmotion: { en: 'Practices per emotion (last 7 days)', ru: 'Практики по эмоциям (последние 7 дней)' },
  trendText: { en: (e) => `You're getting better at managing ${e}.`, ru: (e) => `Вы всё лучше управляете эмоцией «${e}».` },
  trendNone: { en: 'Complete practices this week to see your trend.', ru: 'Выполняйте практики на этой неделе, чтобы увидеть тренд.' },
  nextMilestone: { en: 'Next milestone', ru: 'Следующая цель' },
  milestoneText: { en: (n, b) => `${n} more practice${n === 1 ? '' : 's'} to earn “${b}”`, ru: (n, b) => `Ещё ${n} практик до значка «${b}»` },
  allBadges: { en: 'All badges earned — you are an Emotion Master!', ru: 'Все значки получены — вы Мастер эмоций!' },
  achievements: { en: 'Achievement badges', ru: 'Значки достижений' },
  earned: { en: 'Earned', ru: 'Получен' },
  notYet: { en: (n) => `${n} practices needed`, ru: (n) => `Нужно практик: ${n}` },
  journeyCard: { en: 'Your 30-day transformation', ru: 'Ваша 30-дневная трансформация' },
  nextLevelCard: { en: 'Next Level — mastering difficult emotions', ru: 'Новый уровень — работа со сложными эмоциями' },
  nextLevelIntro: {
    en: 'This module focuses on mastering three challenging emotions — not by suppressing them, but by understanding and managing them skillfully.',
    ru: 'Этот модуль посвящён освоению трёх сложных эмоций — не через подавление, а через понимание и умелое управление.',
  },
  nlQuote: {
    en: '“A lot of people think emotion regulation is getting rid of a feeling… It’s just having another relationship to it.” — Marc Brackett',
    ru: '«Многие думают, что регуляция эмоций — это избавиться от чувства… На самом деле это просто выстроить с ним другие отношения.» — Марк Брэкетт',
  },
  golemanApproach: { en: 'The Goleman Approach — 4 steps', ru: 'Подход Гоулмана — 4 шага' },
  tapCard: { en: 'Tap a card to explore each step', ru: 'Нажмите на карточку, чтобы раскрыть шаг' },
  breathe: { en: 'Breathing guide · 4-7-8', ru: 'Дыхание · 4-7-8' },
  breatheNav: { en: 'Breathe', ru: 'Дыхание' },
  threeBreaths: { en: '3 deep breaths', ru: '3 глубоких вдоха' },
  breatheIntro: {
    en: 'The 4-7-8 breath: inhale for 4, hold for 7, exhale for 8. Deep belly breathing tells the brain: you are safe now.',
    ru: 'Дыхание 4-7-8: вдох на 4, задержка на 7, выдох на 8. Глубокое дыхание животом говорит мозгу: сейчас ты в безопасности.',
  },
  breatheStart: { en: 'Start breathing', ru: 'Начать дыхание' },
  breatheStop: { en: 'Stop', ru: 'Стоп' },
  inhale: { en: 'Inhale', ru: 'Вдох' },
  hold: { en: 'Hold', ru: 'Задержка' },
  exhale: { en: 'Exhale', ru: 'Выдох' },
  cycles: { en: 'cycles completed', ru: 'циклов завершено' },
  exportData: { en: 'Export backup', ru: 'Экспорт данных' },
  importData: { en: 'Import backup', ru: 'Импорт данных' },
  imported: { en: 'Backup restored successfully.', ru: 'Данные успешно восстановлены.' },
  importError: { en: 'Could not read that file — is it an EQ Trainer backup?', ru: 'Не удалось прочитать файл — это резервная копия EQ Тренера?' },
  finalWords: {
    en: '“It starts with permission to feel.” — Marc Brackett',
    ru: '«Всё начинается с разрешения чувствовать.» — Марк Брэкетт',
  },
  heroQuote: {
    en: '“Unlike IQ, which barely budges over the course of our life, emotional intelligence can change… it’s learned and learnable at any point in life.” — Daniel Goleman',
    ru: '«В отличие от IQ, который почти не меняется в течение жизни, эмоциональный интеллект может меняться… этому можно научиться в любой момент жизни.» — Дэниел Гоулман',
  },
  ritualTitle: { en: 'Final Challenge: Day 31 and beyond', ru: 'Финальный вызов: день 31 и далее' },
  ritualIntro: { en: 'Create your Emotional Intelligence Ritual:', ru: 'Создайте свой ритуал эмоционального интеллекта:' },
  ritualMorning: { en: 'Morning: 2-min intention', ru: 'Утро: 2-минутное намерение' },
  ritualDay: { en: 'Daytime: 1 emotional check-in', ru: 'День: 1 эмоциональный чек-ин' },
  ritualEvening: { en: 'Evening: 5-min reflection journal', ru: 'Вечер: 5-минутная рефлексия' },
  ritualMorningPh: { en: 'In the morning I will…', ru: 'Утром я буду…' },
  ritualDayPh: { en: 'During the day I will…', ru: 'Днём я буду…' },
  ritualEveningPh: { en: 'In the evening I will…', ru: 'Вечером я буду…' },
  congratsJourney: { en: 'You completed the 30-day journey!', ru: 'Вы прошли 30-дневный путь!' },
  yourEntry: { en: 'Your entry', ru: 'Ваша запись' },
  optionalNote: { en: 'Optional note…', ru: 'Заметка (необязательно)…' },
  weeks: { en: 'Weeks', ru: 'Недели' },
  pathTab: { en: 'Path', ru: 'Путь' },
  entriesWord: { en: 'entries', ru: 'записей' },
  goToNextLevel: { en: 'Open Next Level', ru: 'Открыть Новый уровень' },
  goToJourney: { en: 'Open Journey', ru: 'Открыть путь' },
  emotionMasteryRings: { en: 'Emotion mastery', ru: 'Мастерство эмоций' },
  notEnoughData: { en: 'not enough data yet', ru: 'пока мало данных' },
  finalTipsTitle: { en: 'Final Tips: Build Emotional Mastery Like a Muscle', ru: 'Финальные советы: тренируйте эмоциональное мастерство как мышцу' },
  tipCheckin: { en: 'Daily Emotional Check-In', ru: 'Ежедневный эмоциональный чек-ин' },
  tipCheckinDesc: { en: 'What am I feeling right now? Where in my body do I feel it? Why?', ru: 'Что я чувствую прямо сейчас? Где в теле я это ощущаю? Почему?' },
  tipMeditate: { en: 'Meditation on Emotions (10 min/day)', ru: 'Медитация на эмоции (10 мин/день)' },
  tipMeditateDesc: { en: 'Sit. Breathe. Watch anger, shame, or fear arise like clouds — then pass. This builds prefrontal cortex control over amygdala impulses.', ru: 'Сядьте. Дышите. Наблюдайте, как гнев, стыд или страх появляются, словно облака, — и проходят. Это укрепляет контроль префронтальной коры над импульсами миндалины.' },
  tipRehearse: { en: 'Rehearse Emotionally Intelligent Responses', ru: 'Репетируйте эмоционально умные ответы' },
  tipRehearseDesc: { en: 'Visualize triggering situations. Practice responding with calm, compassion, and clarity.', ru: 'Визуализируйте триггерные ситуации. Практикуйте ответ со спокойствием, состраданием и ясностью.' },
  wavesQuote: {
    en: '“Attention is a mental muscle… like going to the gym.” — Daniel Goleman',
    ru: '«Внимание — это ментальная мышца… как тренировка в спортзале.» — Дэниел Гоулман',
  },
  errorTitle: { en: 'Something went wrong', ru: 'Что-то пошло не так' },
  errorReload: { en: 'Reload the app', ru: 'Перезагрузить приложение' },
  goodMorning: { en: 'Good morning', ru: 'Доброе утро' },
  goodAfternoon: { en: 'Good afternoon', ru: 'Добрый день' },
  goodEvening: { en: 'Good evening', ru: 'Добрый вечер' },
  todayLabel: { en: 'Today', ru: 'Сегодня' },
  weekWord: { en: 'Week', ru: 'Неделя' },
  begin: { en: 'Begin', ru: 'Начать' },
  estPractice: { en: '≈ 5–10 min · guided practice', ru: '≈ 5–10 мин · практика с подсказками' },
  trustNote: { en: 'Your journal never leaves this device — everything is stored locally.', ru: 'Ваш дневник не покидает это устройство — всё хранится локально.' },
  milestoneTitle: { en: (d) => `Day ${d} complete!`, ru: (d) => `День ${d} завершён!` },
  milestoneBody: { en: 'A milestone on your journey. Consistency is the practice.', ru: 'Веха на вашем пути. Постоянство и есть практика.' },
  continueWord: { en: 'Continue', ru: 'Продолжить' },
}

// Localized labels for journal entry field keys (raw keys must never reach the UI)
export const FIELD_LABELS = {
  situation: { en: 'Situation', ru: 'Ситуация' },
  emotion: { en: 'Named emotion', ru: 'Названная эмоция' },
  protectQuick: { en: 'What it protects', ru: 'Что это защищает' },
  protecting: { en: 'Protecting (in my words)', ru: 'Защищает (своими словами)' },
  redirect: { en: 'Redirect the energy', ru: 'Куда направить энергию' },
  plan: { en: 'Action plan', ru: 'План действий' },
  critic: { en: 'Inner critic says', ru: 'Внутренний критик говорит' },
  compassion: { en: 'Self-compassion rewrite', ru: 'Ответ с состраданием' },
  needQuick: { en: 'Unmet need', ru: 'Неудовлетворённая потребность' },
  need: { en: 'What I need', ru: 'Что мне нужно' },
  shared: { en: 'Shared with someone safe', ru: 'Поделился(ась) с безопасным человеком' },
  sharedNote: { en: 'Sharing note', ru: 'Заметка о разговоре' },
  threat: { en: 'Threat type', ru: 'Тип угрозы' },
  about: { en: 'This fear is about', ru: 'Этот страх — о' },
  grounding: { en: 'Grounding: 5 things I see', ru: 'Заземление: 5 вещей' },
  reframe: { en: 'Reframe', ru: 'Переосмысление' },
  brave: { en: 'Micro-brave step', ru: 'Микро-смелый шаг' },
  wantQuick: { en: 'What it points at', ru: 'На что указывает' },
  want: { en: 'What I actually want', ru: 'Чего я на самом деле хочу' },
  took: { en: 'I took this step', ru: 'Я сделал(а) этот шаг' },
  tookDate: { en: 'Step taken on', ru: 'Шаг сделан' },
  intensity: { en: 'Intensity', ru: 'Интенсивность' },
}

export const EMOTION_NAMES = {
  anger: { en: 'Anger', ru: 'Гнев' },
  shame: { en: 'Shame', ru: 'Стыд' },
  fear: { en: 'Fear', ru: 'Страх' },
  envy: { en: 'Envy', ru: 'Зависть' },
}

// ---------------- 30-DAY JOURNEY (from the Goleman 1-month plan PDF) ----------------
export const WEEKS = [
  {
    id: 'w1',
    days: [1, 7],
    color: '#565a2b',
    title: { en: 'Week 1 · Build the Foundation — Self-Awareness', ru: 'Неделя 1 · Фундамент — Самоосознание' },
    quote: {
      en: '“Self-awareness means you know what you’re feeling.” — Daniel Goleman',
      ru: '«Неспособность замечать свои истинные чувства оставляет нас на их произвол.» — Дэниел Гоулман, «Эмоциональный интеллект»',
    },
    intro: { en: 'The first step in emotional intelligence is knowing your emotions as they occur.', ru: 'Первый шаг эмоционального интеллекта — распознавать эмоции в момент их появления.' },
    goal: { en: 'By Day 7: recognize your emotional patterns and triggers with 80% accuracy.', ru: 'К 7-му дню: распознавать свои эмоциональные паттерны и триггеры с точностью 80%.' },
    practices: [
      {
        id: 'checkins',
        title: { en: 'Emotional Check-Ins (3×/day)', ru: 'Эмоциональные чек-ины (3 раза в день)' },
        desc: {
          en: 'Pause morning, noon and evening. Ask: What am I feeling right now? Why might I be feeling this way? How is this emotion affecting my behavior? Write it down. Don’t judge it. Just notice.',
          ru: 'Остановитесь утром, днём и вечером. Спросите себя: Что я чувствую прямо сейчас? Почему я могу это чувствовать? Как эта эмоция влияет на моё поведение? Запишите. Не судите. Просто замечайте.',
        },
        fields: [
          { id: 'morningFeel', t: 'text', label: { en: 'Morning check-in', ru: 'Утренний чек-ин' }, ph: { en: 'I feel…', ru: 'Я чувствую…' } },
          { id: 'morningWhy', t: 'text', ph: { en: 'I might be feeling this because…', ru: 'Возможно, я чувствую это, потому что…' } },
          { id: 'morningHow', t: 'text', ph: { en: 'It affects my behavior by…', ru: 'На моё поведение это влияет так…' } },
          { id: 'noonFeel', t: 'text', label: { en: 'Noon check-in', ru: 'Дневной чек-ин' }, ph: { en: 'I feel…', ru: 'Я чувствую…' } },
          { id: 'noonWhy', t: 'text', ph: { en: 'I might be feeling this because…', ru: 'Возможно, я чувствую это, потому что…' } },
          { id: 'noonHow', t: 'text', ph: { en: 'It affects my behavior by…', ru: 'На моё поведение это влияет так…' } },
          { id: 'eveningFeel', t: 'text', label: { en: 'Evening check-in', ru: 'Вечерний чек-ин' }, ph: { en: 'I feel…', ru: 'Я чувствую…' } },
          { id: 'eveningWhy', t: 'text', ph: { en: 'I might be feeling this because…', ru: 'Возможно, я чувствую это, потому что…' } },
          { id: 'eveningHow', t: 'text', ph: { en: 'It affects my behavior by…', ru: 'На моё поведение это влияет так…' } },
        ],
      },
      {
        id: 'naming',
        title: { en: 'Name the Emotion, Tame the Emotion', ru: 'Назови эмоцию — приручи эмоцию' },
        desc: {
          en: 'Use precise language: instead of “bad”, say “disappointed” or “overwhelmed”. Research shows just naming an emotion reduces its intensity in the brain.',
          ru: 'Используйте точные слова: вместо «плохо» — «разочарован» или «перегружен». Исследования показывают: само называние эмоции снижает её интенсивность в мозге.',
        },
        fields: [
          { id: 'words', t: 'text', label: { en: 'Today’s precise emotion words', ru: 'Точные слова эмоций сегодня' }, ph: { en: 'Today I felt precisely…', ru: 'Сегодня я точно чувствовал(а)…' } },
        ],
      },
      {
        id: 'reflection',
        title: { en: 'Evening Reflection Journal', ru: 'Вечерний дневник рефлексии' },
        desc: { en: 'Close the day by looking inward.', ru: 'Завершите день взглядом внутрь себя.' },
        fields: [
          { id: 'trigger', t: 'textarea', label: { en: 'What triggered strong emotion today?', ru: 'Что вызвало сильную эмоцию сегодня?' }, ph: { en: 'A strong emotion rose in me today when…', ru: 'Сильная эмоция поднялась во мне сегодня, когда…' } },
          { id: 'react', t: 'textarea', label: { en: 'Did I react or respond?', ru: 'Я отреагировал импульсивно или ответил осознанно?' }, ph: { en: 'In that moment I…', ru: 'В тот момент я…' } },
          { id: 'learn', t: 'textarea', label: { en: 'What can I learn about myself?', ru: 'Что я могу узнать о себе?' }, ph: { en: 'About myself I learned that…', ru: 'О себе я узнал(а), что…' } },
        ],
      },
    ],
  },
  {
    id: 'w2',
    days: [8, 14],
    color: '#b0563c',
    title: { en: 'Week 2 · Master the Inner World — Self-Management', ru: 'Неделя 2 · Внутренний мир — Саморегуляция' },
    quote: {
      en: '“Maturity is sometimes defined as widening the gap between impulse and action.” — Daniel Goleman',
      ru: '«Контроль над своими эмоциями, отсрочивание удовлетворения и подавление импульсивности лежит в основе всяческих достижений.» — Дэниел Гоулман, «Эмоциональный интеллект»',
    },
    intro: { en: 'Turn awareness into calm, intentional responses.', ru: 'Превратите осознанность в спокойные, намеренные ответы.' },
    goal: { en: 'By Day 14: reduce emotional hijacks. Stay calm in moments of stress with conscious intention.', ru: 'К 14-му дню: меньше эмоциональных «захватов». Сохранять спокойствие в стрессе с осознанным намерением.' },
    practices: [
      {
        id: 'pause',
        title: { en: 'The Pause Power', ru: 'Сила паузы' },
        desc: { en: 'Every time you’re triggered: Pause. Take 3 deep breaths. Ask: What’s the best response here?', ru: 'Каждый раз при триггере: Пауза. 3 глубоких вдоха. Вопрос: какой ответ здесь наилучший?' },
        fields: [
          { id: 'breath', t: 'breathing', pattern: 'three' },
          { id: 'used', t: 'check', label: { en: 'I used the Pause today', ru: 'Сегодня я использовал(а) паузу' } },
          { id: 'when', t: 'textarea', label: { en: 'When?', ru: 'Когда?' }, ph: { en: 'I used the pause when…', ru: 'Я использовал(а) паузу, когда…' } },
          { id: 'changed', t: 'textarea', label: { en: 'What changed?', ru: 'Что изменилось?' }, ph: { en: 'It changed…', ru: 'Это изменило…' } },
        ],
      },
      {
        id: 'visual',
        title: { en: 'Visualization for Composure (10 min/day)', ru: 'Визуализация спокойствия (10 мин/день)' },
        desc: { en: 'Visualize a stressful situation and rehearse staying calm, empathetic, and clear-headed.', ru: 'Представьте стрессовую ситуацию и отрепетируйте спокойствие, эмпатию и ясность мышления.' },
        fields: [
          { id: 'breath', t: 'breathing', pattern: 'calm478', target: 1 },
          { id: 'done', t: 'check', label: { en: 'Visualization completed', ru: 'Визуализация выполнена' } },
          { id: 'scene', t: 'textarea', label: { en: 'What situation did you rehearse?', ru: 'Какую ситуацию вы репетировали?' }, ph: { en: 'I rehearsed staying calm in the situation where…', ru: 'Я репетировал(а) спокойствие в ситуации, где…' } },
        ],
      },
      {
        id: 'gratitude',
        title: { en: 'Gratitude Reframe (evening)', ru: 'Рефрейминг благодарности (вечером)' },
        desc: { en: 'Write 3 things that frustrated you today — and then one silver lining or lesson from each.', ru: 'Запишите 3 вещи, которые вас сегодня расстроили, — и по одному плюсу или уроку из каждой.' },
        fields: [
          { id: 'fr1', t: 'text', label: { en: 'Frustration 1', ru: 'Разочарование 1' }, ph: { en: 'I was frustrated by…', ru: 'Меня расстроило…' } },
          { id: 'ls1', t: 'text', ph: { en: 'The lesson is…', ru: 'Урок в том, что…' } },
          { id: 'fr2', t: 'text', label: { en: 'Frustration 2', ru: 'Разочарование 2' }, ph: { en: 'I was frustrated by…', ru: 'Меня расстроило…' } },
          { id: 'ls2', t: 'text', ph: { en: 'The lesson is…', ru: 'Урок в том, что…' } },
          { id: 'fr3', t: 'text', label: { en: 'Frustration 3', ru: 'Разочарование 3' }, ph: { en: 'I was frustrated by…', ru: 'Меня расстроило…' } },
          { id: 'ls3', t: 'text', ph: { en: 'The lesson is…', ru: 'Урок в том, что…' } },
        ],
      },
      {
        id: 'intention',
        title: { en: 'Morning Intention-Setting (2 min)', ru: 'Утреннее намерение (2 мин)' },
        desc: { en: 'Ask: “How do I want to show up today — regardless of what happens?”', ru: 'Спросите: «Каким я хочу быть сегодня — что бы ни случилось?»' },
        fields: [
          { id: 'intent', t: 'text', label: { en: 'Morning intention', ru: 'Утреннее намерение' }, ph: { en: 'Today I want to show up…', ru: 'Сегодня я хочу быть…' } },
        ],
      },
    ],
  },
  {
    id: 'w3',
    days: [15, 21],
    color: '#5c4632',
    title: { en: 'Week 3 · Understand Others — Social Awareness', ru: 'Неделя 3 · Понимание других — Социальная осознанность' },
    quote: {
      en: '“Emotional empathy is an immediate felt sense of what’s going on in the other person.” — Daniel Goleman',
      ru: '«Эмпатия… является основным человеческим даром.» — Дэниел Гоулман, «Эмоциональный интеллект»',
    },
    intro: { en: 'Learn to sense what others feel — before they say a word.', ru: 'Научитесь чувствовать, что переживают другие, — ещё до слов.' },
    goal: { en: 'By Day 21: sense emotions in others before they say a word. Make people feel seen.', ru: 'К 21-му дню: чувствовать эмоции других до слов. Давать людям ощущение, что их видят.' },
    practices: [
      {
        id: 'empathy',
        title: { en: 'Empathy Practice (1 conversation/day)', ru: 'Практика эмпатии (1 разговор в день)' },
        desc: { en: 'Drop your internal monologue. Be fully present in one interaction. Reflect back what the other person is feeling, not just what they said.', ru: 'Отключите внутренний монолог. Будьте полностью присутствующим в одном разговоре. Отразите, что человек чувствует, а не только что он сказал.' },
        fields: [
          { id: 'with', t: 'text', label: { en: 'Who was it?', ru: 'С кем это было?' }, ph: { en: 'I was fully present with…', ru: 'Я был(а) полностью присутствующим с…' } },
          { id: 'felt', t: 'textarea', label: { en: 'What were they feeling?', ru: 'Что чувствовал собеседник?' }, ph: { en: 'I sensed they felt…', ru: 'Я почувствовал(а), что он(а) испытывает…' } },
        ],
      },
      {
        id: 'nonverbal',
        title: { en: 'Observe Non-Verbal Cues', ru: 'Наблюдение невербальных сигналов' },
        desc: { en: 'In every conversation: What’s their tone? What’s their body saying? What’s unsaid?', ru: 'В каждом разговоре: Какой у собеседника тон? Что говорит его тело? Что осталось невысказанным?' },
        fields: [
          { id: 'tone', t: 'text', label: { en: 'Tone', ru: 'Тон' }, ph: { en: 'Their tone was…', ru: 'Тон собеседника был…' } },
          { id: 'body', t: 'text', label: { en: 'Body language', ru: 'Язык тела' }, ph: { en: 'Their body said…', ru: 'Тело говорило…' } },
          { id: 'unsaid', t: 'text', label: { en: 'The unsaid', ru: 'Невысказанное' }, ph: { en: 'What stayed unsaid was…', ru: 'Невысказанным осталось…' } },
        ],
      },
      {
        id: 'otherlens',
        title: { en: '“Other Lens” Journaling', ru: 'Дневник «Чужая оптика»' },
        desc: { en: 'Each evening, pick a moment from the day.', ru: 'Каждый вечер выберите один момент дня.' },
        fields: [
          { id: 'felt', t: 'textarea', label: { en: 'How did the other person feel in that moment?', ru: 'Что чувствовал другой человек в тот момент?' }, ph: { en: 'In that moment the other person felt…', ru: 'В тот момент другой человек чувствовал…' } },
          { id: 'needs', t: 'textarea', label: { en: 'What needs might have driven their behavior?', ru: 'Какие потребности могли стоять за его поведением?' }, ph: { en: 'Their behavior may have come from a need for…', ru: 'За его поведением могла стоять потребность в…' } },
        ],
      },
      {
        id: 'listening',
        title: { en: 'Mindful Listening Challenge (1 person/day)', ru: 'Челлендж осознанного слушания (1 человек в день)' },
        desc: { en: 'Don’t interrupt. Don’t fix. Just listen and reflect.', ru: 'Не перебивайте. Не «чините». Просто слушайте и отражайте.' },
        fields: [
          { id: 'done', t: 'check', label: { en: 'I listened without interrupting today', ru: 'Сегодня я слушал(а), не перебивая' } },
          { id: 'who', t: 'text', label: { en: 'Who did you listen to?', ru: 'Кого вы слушали?' }, ph: { en: 'Today I listened without interrupting to…', ru: 'Сегодня я, не перебивая, выслушал(а)…' } },
        ],
      },
    ],
  },
  {
    id: 'w4',
    days: [22, 30],
    color: '#9a6b93',
    title: { en: 'Week 4 · Lead with Connection — Relationship Management', ru: 'Неделя 4 · Сила связи — Управление отношениями' },
    quote: {
      en: '“Emotions drive the quality of our relationships.” — Marc Brackett',
      ru: '«Эмоции определяют качество наших отношений.» — Марк Брэкетт',
    },
    intro: { en: 'Bring it all together in how you connect with people.', ru: 'Соедините всё в том, как вы строите отношения с людьми.' },
    goal: { en: 'By Day 30: manage relationships with empathy and authenticity. Be the kind of person others feel safe around.', ru: 'К 30-му дню: управлять отношениями с эмпатией и подлинностью. Быть человеком, рядом с которым другим безопасно.' },
    practices: [
      {
        id: 'connection',
        title: { en: 'Intentional Connection (1 person/day)', ru: 'Намеренный контакт (1 человек в день)' },
        desc: { en: 'Reach out to someone intentionally. Ask how they’re doing. Don’t just make it about you.', ru: 'Намеренно свяжитесь с кем-то. Спросите, как у него дела. Не делайте разговор только о себе.' },
        fields: [
          { id: 'who', t: 'text', label: { en: 'Who did you reach out to?', ru: 'С кем вы связались?' }, ph: { en: 'Today I intentionally reached out to…', ru: 'Сегодня я намеренно связался(ась) с…' } },
          { id: 'note', t: 'textarea', label: { en: 'How did it go?', ru: 'Как прошло?' }, ph: { en: 'The conversation went…', ru: 'Разговор прошёл…' } },
        ],
      },
      {
        id: 'rehearsal',
        title: { en: 'Difficult Conversation Rehearsal', ru: 'Репетиция трудного разговора' },
        desc: { en: 'Practice saying hard things with clarity, kindness, calmness. (Use a mirror or record yourself.)', ru: 'Практикуйте говорить сложные вещи с ясностью, добротой и спокойствием. (Перед зеркалом или на запись.)' },
        fields: [
          { id: 'breath', t: 'breathing', pattern: 'three' },
          { id: 'done', t: 'check', label: { en: 'I rehearsed a difficult conversation', ru: 'Я отрепетировал(а) трудный разговор' } },
          { id: 'topic', t: 'textarea', label: { en: 'What conversation?', ru: 'Какой разговор?' }, ph: { en: 'I rehearsed saying…', ru: 'Я репетировал(а), как сказать…' } },
          { id: 'feltLike', t: 'textarea', label: { en: 'How did it feel?', ru: 'Каково это было?' }, ph: { en: 'It felt…', ru: 'Это ощущалось…' } },
        ],
      },
      {
        id: 'alchemy',
        title: { en: 'Conflict Alchemy Exercise', ru: 'Алхимия конфликта' },
        desc: { en: 'Choose one recent disagreement.', ru: 'Выберите одно недавнее разногласие.' },
        fields: [
          { id: 'need', t: 'textarea', label: { en: 'What was the deeper need behind their reaction?', ru: 'Какая глубинная потребность стояла за реакцией другого?' }, ph: { en: 'Behind their reaction was a deeper need for…', ru: 'За его реакцией стояла глубинная потребность в…' } },
          { id: 'deescalate', t: 'textarea', label: { en: 'How could I have de-escalated the situation?', ru: 'Как я мог(ла) бы деэскалировать ситуацию?' }, ph: { en: 'I could have de-escalated it by…', ru: 'Я мог(ла) бы деэскалировать её, если бы…' } },
        ],
      },
      {
        id: 'reljournal',
        title: { en: 'Relationship Journal', ru: 'Дневник отношений' },
        desc: { en: 'At the end of the day, write:', ru: 'В конце дня запишите:' },
        fields: [
          { id: 'uplift', t: 'textarea', label: { en: 'Who did I uplift today?', ru: 'Кого я сегодня поддержал(а)?' }, ph: { en: 'Today I uplifted…', ru: 'Сегодня я поддержал(а)…' } },
          { id: 'present', t: 'textarea', label: { en: 'Who could I have been more present with?', ru: 'С кем я мог(ла) быть более присутствующим?' }, ph: { en: 'I could have been more present with…', ru: 'Я мог(ла) быть более присутствующим с…' } },
          { id: 'reconnect', t: 'textarea', label: { en: 'Who do I need to reconnect with?', ru: 'С кем мне нужно восстановить связь?' }, ph: { en: 'I need to reconnect with…', ru: 'Мне нужно восстановить связь с…' } },
        ],
      },
    ],
  },
]

// ---------------- NEXT LEVEL MODULES (from the "Next Level" spec docx) ----------------
export const MODULES = {
  anger: {
    color: '#b0563c',
    colorSoft: '#f6ece7',
    subtitle: { en: 'The Fire That Burns — or Builds', ru: 'Огонь, который сжигает — или созидает' },
    explanation: {
      en: 'Anger often masks hurt, injustice, or unmet needs. But unmanaged, it hijacks your prefrontal cortex — the part of your brain that makes wise decisions. Anger wisely channeled = Courage.',
      ru: 'Гнев часто маскирует боль, несправедливость или неудовлетворённые потребности. Неуправляемый, он захватывает префронтальную кору — ту часть мозга, что принимает мудрые решения. Мудро направленный гнев = Смелость.',
    },
    steps: [
      {
        title: { en: 'Step 1 · Name it precisely', ru: 'Шаг 1 · Назовите точно' },
        body: { en: 'Don’t just say “I’m angry.” Try: “I feel disrespected,” or “I feel unseen,” or “I feel powerless.” Precision defuses.', ru: 'Не говорите просто «я злюсь». Попробуйте: «я чувствую неуважение», «меня не замечают», «я бессилен». Точность обезоруживает.' },
        ph: { en: 'Precisely, I feel…', ru: 'Точнее всего, я чувствую…' },
      },
      {
        title: { en: 'Step 2 · The 30-Second Rule', ru: 'Шаг 2 · Правило 30 секунд' },
        body: { en: 'Your amygdala fires fast, but emotion chemicals dissipate in 30 seconds. Breathe deeply. Count slowly. Feel the wave rise and fall.', ru: 'Миндалина срабатывает мгновенно, но химия эмоции рассеивается за 30 секунд. Дышите глубоко. Считайте медленно. Почувствуйте, как волна поднимается и спадает.' },
        ph: { en: 'After 30 seconds, the wave…', ru: 'Через 30 секунд волна…' },
      },
      {
        title: { en: 'Step 3 · Ask the protection question', ru: 'Шаг 3 · Вопрос о защите' },
        body: { en: '“What is this anger trying to protect in me?” Often, it’s your dignity, boundaries, or a core value.', ru: '«Что этот гнев пытается во мне защитить?» Часто это достоинство, границы или важная ценность.' },
        ph: { en: 'This anger is trying to protect…', ru: 'Этот гнев пытается защитить…' },
      },
      {
        title: { en: 'Step 4 · Redirect constructively', ru: 'Шаг 4 · Направьте конструктивно' },
        body: { en: 'Anger is energy. Use it to: speak assertively, not aggressively · create boundaries, not explosions · take action, not revenge.', ru: 'Гнев — это энергия. Используйте её: говорить уверенно, а не агрессивно · выстраивать границы, а не взрываться · действовать, а не мстить.' },
        ph: { en: 'I will channel this energy into…', ru: 'Я направлю эту энергию на…' },
      },
    ],
    practiceSteps: [
      {
        title: { en: '1 · Describe a recent anger situation', ru: '1 · Опишите недавнюю ситуацию гнева' },
        fields: [{ id: 'situation', t: 'textarea', ph: { en: 'I felt angry when…', ru: 'Я почувствовал(а) гнев, когда…' } }],
      },
      {
        title: { en: '2 · Name it precisely', ru: '2 · Назовите точно' },
        fields: [
          { id: 'emotion', t: 'chips', opts: [
            { k: 'disrespected', en: 'disrespected', ru: 'неуважение' }, { k: 'unseen', en: 'unseen', ru: 'меня не видят' }, { k: 'powerless', en: 'powerless', ru: 'бессилие' },
            { k: 'frustrated', en: 'frustrated', ru: 'фрустрация' }, { k: 'betrayed', en: 'betrayed', ru: 'предательство' },
          ] },
          { id: 'intensity', t: 'slider' },
          { id: 'breathing', t: 'breathing', pattern: 'three' },
        ],
      },
      {
        title: { en: '3 · What is this anger protecting?', ru: '3 · Что защищает этот гнев?' },
        fields: [
          { id: 'protectQuick', t: 'chips-multi', opts: [
            { k: 'dignity', en: 'Dignity', ru: 'Достоинство' }, { k: 'boundaries', en: 'Boundaries', ru: 'Границы' }, { k: 'coreValues', en: 'Core values', ru: 'Ценности' },
            { k: 'safety', en: 'Safety', ru: 'Безопасность' }, { k: 'identity', en: 'Identity', ru: 'Идентичность' },
          ] },
          { id: 'protecting', t: 'textarea', ph: { en: 'This anger is protecting my…', ru: 'Этот гнев защищает мои…' } },
        ],
      },
      {
        title: { en: '4 · How can you redirect this energy?', ru: '4 · Как направить эту энергию?' },
        fields: [
          { id: 'redirect', t: 'checks', opts: [
            { k: 'speakAssertively', en: 'Speak assertively', ru: 'Говорить уверенно' }, { k: 'createBoundaries', en: 'Create boundaries', ru: 'Выстроить границы' }, { k: 'constructiveAction', en: 'Take constructive action', ru: 'Действовать конструктивно' },
          ] },
          { id: 'plan', t: 'textarea', ph: { en: 'My action plan is…', ru: 'Мой план действий…' } },
        ],
      },
    ],
    journalFields: ['situation', 'protecting', 'plan'],
  },
  shame: {
    color: '#5c4632',
    colorSoft: '#f2ede7',
    subtitle: { en: 'The Silent Saboteur', ru: 'Тихий саботажник' },
    explanation: {
      en: 'Shame says “I am bad.” It’s different from guilt, which says “I did something bad.” Shame can freeze us — emotionally and neurologically. It shrinks empathy, creativity, and connection. Shame loses power in the presence of empathy.',
      ru: 'Стыд говорит: «Я плохой». Это не вина, которая говорит: «Я сделал что-то плохое». Стыд замораживает нас — эмоционально и нейрологически. Он сжимает эмпатию, творчество и близость. Стыд теряет силу в присутствии эмпатии.',
    },
    steps: [
      {
        title: { en: 'Step 1 · Identify the inner critic’s voice', ru: 'Шаг 1 · Голос внутреннего критика' },
        body: { en: 'What’s the exact phrase your mind is repeating? (“I’m not good enough,” “They’ll reject me.”)', ru: 'Какую точную фразу повторяет ваш ум? («Я недостаточно хорош», «Меня отвергнут».)' },
        ph: { en: 'My inner critic repeats…', ru: 'Мой внутренний критик повторяет…' },
      },
      {
        title: { en: 'Step 2 · Activate self-compassion', ru: 'Шаг 2 · Включите сострадание к себе' },
        body: { en: 'Treat yourself like you would a dear friend: “Yes, I made a mistake. But I am still worthy. I can learn. I can grow.”', ru: 'Отнеситесь к себе как к близкому другу: «Да, я ошибся. Но я по-прежнему ценен. Я могу учиться. Я могу расти».' },
        ph: { en: 'As a friend, I would tell myself…', ru: 'Как друг, я сказал(а) бы себе…' },
      },
      {
        title: { en: 'Step 3 · Replace judgment with curiosity', ru: 'Шаг 3 · Замените осуждение любопытством' },
        body: { en: 'Ask: “What unmet need is this shame revealing?” Often: acceptance, connection, achievement.', ru: 'Спросите: «Какую неудовлетворённую потребность обнажает этот стыд?» Часто: принятие, близость, достижение.' },
        ph: { en: 'This shame reveals my need for…', ru: 'Этот стыд обнажает мою потребность в…' },
      },
      {
        title: { en: 'Step 4 · Speak it out loud (to someone safe)', ru: 'Шаг 4 · Произнесите вслух (безопасному человеку)' },
        body: { en: 'Shame thrives in secrecy. Share it with someone who listens without fixing or judging. That alone deflates it.', ru: 'Стыд живёт в секретности. Поделитесь с тем, кто слушает без советов и осуждения. Уже одно это его сдувает.' },
        ph: { en: 'A safe person I could tell is…', ru: 'Безопасный человек, которому я могу рассказать, — …' },
      },
    ],
    practiceSteps: [
      {
        title: { en: '1 · Identify your inner critic’s voice', ru: '1 · Определите голос внутреннего критика' },
        fields: [
          { id: 'critic', t: 'textarea', ph: { en: 'My inner critic says…', ru: 'Мой внутренний критик говорит…' } },
          { id: 'intensity', t: 'slider' },
        ],
      },
      {
        title: { en: '2 · Activate self-compassion', ru: '2 · Включите сострадание к себе' },
        hint: { en: 'Rewrite the critic’s phrase with compassion:', ru: 'Перепишите фразу критика с состраданием:' },
        fields: [
          { id: 'breathing', t: 'breathing', pattern: 'three' },
          { id: 'compassion', t: 'textarea', ph: { en: 'The truth is, I am still worthy because…', ru: 'На самом деле я по-прежнему ценен, потому что…' } },
        ],
      },
      {
        title: { en: '3 · What unmet need is this revealing?', ru: '3 · Какую потребность это обнажает?' },
        fields: [
          { id: 'needQuick', t: 'chips-multi', opts: [
            { k: 'acceptance', en: 'Acceptance', ru: 'Принятие' }, { k: 'connection', en: 'Connection', ru: 'Близость' }, { k: 'achievement', en: 'Achievement', ru: 'Достижение' },
            { k: 'belonging', en: 'Belonging', ru: 'Принадлежность' }, { k: 'recognition', en: 'Recognition', ru: 'Признание' },
          ] },
          { id: 'need', t: 'textarea', ph: { en: 'I realize I need…', ru: 'Я понимаю, что мне нужно…' } },
        ],
      },
      {
        title: { en: '4 · Share it', ru: '4 · Поделитесь' },
        fields: [
          { id: 'shared', t: 'check', label: { en: 'I’ve shared this with someone safe', ru: 'Я поделился(ась) этим с безопасным человеком' } },
          { id: 'sharedNote', t: 'textarea', optional: true, ph: { en: 'When I shared it, I felt…', ru: 'Когда я поделился(ась), я почувствовал(а)…' } },
        ],
      },
    ],
    journalFields: ['critic', 'compassion', 'need'],
  },
  fear: {
    color: '#565a2b',
    colorSoft: '#eff0e6',
    subtitle: { en: 'The Ancient Protector', ru: 'Древний защитник' },
    explanation: {
      en: 'Fear evolved to keep us alive. But modern fear is often not about survival — it’s about ego, failure, rejection. Fear hijacks the brain’s reasoning center and narrows attention. Courage is fear transformed by purpose.',
      ru: 'Страх появился, чтобы сохранить нам жизнь. Но современный страх чаще не о выживании — он об эго, неудаче, отвержении. Страх захватывает центр рассуждений мозга и сужает внимание. Смелость — это страх, преображённый смыслом.',
    },
    steps: [
      {
        title: { en: 'Step 1 · Separate real from imagined threat', ru: 'Шаг 1 · Отделите реальную угрозу от воображаемой' },
        body: { en: 'Ask: “Is this danger physical, or emotional?” “Is this fear helping me or paralyzing me?”', ru: 'Спросите: «Эта опасность физическая или эмоциональная?» «Этот страх помогает мне или парализует?»' },
        ph: { en: 'This danger is really…', ru: 'На самом деле эта опасность…' },
      },
      {
        title: { en: 'Step 2 · Ground yourself physically', ru: 'Шаг 2 · Заземлитесь физически' },
        body: { en: 'Deep belly breathing (4-7-8 technique) · press your feet into the floor · name 5 things you can see or feel. This tells the brain: you are safe now.', ru: 'Глубокое дыхание животом (техника 4-7-8) · прижмите стопы к полу · назовите 5 вещей, которые видите или ощущаете. Это говорит мозгу: сейчас ты в безопасности.' },
        ph: { en: 'Right now my body feels…', ru: 'Прямо сейчас моё тело ощущает…' },
      },
      {
        title: { en: 'Step 3 · Reframe the narrative', ru: 'Шаг 3 · Переосмыслите историю' },
        body: { en: '“What does this fear say about what matters deeply to me?” Fear often signals where your values, hopes, or purpose live.', ru: '«Что этот страх говорит о том, что мне по-настоящему важно?» Страх часто указывает, где живут ваши ценности, надежды и смысл.' },
        ph: { en: 'This fear says I deeply care about…', ru: 'Этот страх говорит, что мне глубоко важно…' },
      },
      {
        title: { en: 'Step 4 · Take a micro-brave step', ru: 'Шаг 4 · Сделайте микро-смелый шаг' },
        body: { en: 'Fear shrinks when we act. Not big leaps — small, repeated steps.', ru: 'Страх уменьшается, когда мы действуем. Не гигантские прыжки — маленькие, повторяющиеся шаги.' },
        ph: { en: 'My smallest brave step is…', ru: 'Мой самый маленький смелый шаг…' },
      },
    ],
    practiceSteps: [
      {
        title: { en: '1 · Separate real from imagined threat', ru: '1 · Реальная угроза или воображаемая?' },
        fields: [
          { id: 'threat', t: 'radio', opts: [
            { k: 'physical', en: 'Physical danger', ru: 'Физическая опасность' }, { k: 'emotional', en: 'Emotional discomfort', ru: 'Эмоциональный дискомфорт' }, { k: 'ego', en: 'Ego threat', ru: 'Угроза эго' },
          ] },
          { id: 'about', t: 'textarea', ph: { en: 'This fear is about…', ru: 'Этот страх — о…' } },
          { id: 'intensity', t: 'slider' },
        ],
      },
      {
        title: { en: '2 · Ground yourself physically', ru: '2 · Заземлитесь физически' },
        fields: [
          { id: 'breathing', t: 'breathing', pattern: 'calm478' },
          { id: 'grounding', t: 'inputs5', label: { en: 'Grounding checklist: name 5 things you see', ru: 'Заземление: назовите 5 вещей, которые видите' }, ph: { en: 'I see…', ru: 'Я вижу…' } },
        ],
      },
      {
        title: { en: '3 · Reframe the narrative', ru: '3 · Переосмыслите историю' },
        fields: [{ id: 'reframe', t: 'textarea', ph: { en: 'This fear shows that I deeply care about…', ru: 'Этот страх показывает, что мне глубоко важно…' } }],
      },
      {
        title: { en: '4 · Your micro-brave step', ru: '4 · Ваш микро-смелый шаг' },
        fields: [
          { id: 'brave', t: 'textarea', ph: { en: 'One small action I can take today is…', ru: 'Один маленький шаг, который я могу сделать сегодня…' } },
          { id: 'took', t: 'check', label: { en: 'I took this step', ru: 'Я сделал(а) этот шаг' } },
        ],
      },
    ],
    journalFields: ['about', 'reframe', 'brave'],
  },
  envy: {
    color: '#9a6b93',
    colorSoft: '#f4edf3',
    subtitle: { en: 'The Hidden Compass', ru: 'Скрытый компас' },
    explanation: {
      en: 'Envy signals that someone has something you deeply want — status, skill, love, freedom. It often masks quiet self-criticism and constant comparison. Heard as information, it becomes a compass pointing at your own unmet wants. Envy heard clearly = Direction.',
      ru: 'Зависть сигналит: у другого есть то, чего вы глубоко хотите, — статус, умение, любовь, свобода. Часто она маскирует тихую самокритику и постоянное сравнение. Услышанная как информация, она становится компасом, указывающим на ваши собственные желания. Ясно услышанная зависть = Направление.',
    },
    steps: [
      {
        title: { en: 'Step 1 · Name it precisely', ru: 'Шаг 1 · Назовите точно' },
        body: { en: 'Is this envy — wanting what another has — or jealousy, fear of losing what is yours? Precision defuses.', ru: 'Это зависть — желание того, что есть у другого, — или ревность, страх потерять своё? Точность обезоруживает.' },
        ph: { en: 'What I actually feel is…', ru: 'На самом деле я чувствую…' },
      },
      {
        title: { en: 'Step 2 · Catch the comparison', ru: 'Шаг 2 · Поймайте сравнение' },
        body: { en: 'Notice the story — “they have it easy”, “I’m behind”. Comparison sets another person’s highlight reel against your full picture. Separate the story from the facts.', ru: 'Заметьте историю: «им легко досталось», «я отстаю». Сравнение ставит чужую витрину против вашей полной картины. Отделите историю от фактов.' },
        ph: { en: 'The story I tell myself is…', ru: 'История, которую я себе рассказываю, — …' },
      },
      {
        title: { en: 'Step 3 · Ask the signal question', ru: 'Шаг 3 · Вопрос о сигнале' },
        body: { en: '“What exactly do I want that they have? What does this envy say I value?”', ru: '«Чего именно я хочу из того, что есть у них? О какой моей ценности говорит эта зависть?»' },
        ph: { en: 'What I want that they have is…', ru: 'Из того, что есть у них, я хочу…' },
      },
      {
        title: { en: 'Step 4 · Turn it into direction', ru: 'Шаг 4 · Превратите её в направление' },
        body: { en: 'Envy is a want without a plan. Use it to: learn from the person you envy · take one concrete step toward what you want · name what you already have. Movement, not comparison.', ru: 'Зависть — это желание без плана. Используйте её: поучиться у того, кому завидуете · сделать один конкретный шаг к желаемому · назвать то, что у вас уже есть. Движение, а не сравнение.' },
        ph: { en: 'My first step toward it is…', ru: 'Мой первый шаг к этому…' },
      },
    ],
    practiceSteps: [
      {
        title: { en: '1 · Describe a recent envy situation', ru: '1 · Опишите недавнюю ситуацию зависти' },
        fields: [{ id: 'situation', t: 'textarea', ph: { en: 'I felt envious when…', ru: 'Я почувствовал(а) зависть, когда…' } }],
      },
      {
        title: { en: '2 · Name it precisely', ru: '2 · Назовите точно' },
        fields: [
          { id: 'emotion', t: 'chips', opts: [
            { k: 'resentful', en: 'resentful', ru: 'обида' }, { k: 'inadequate', en: 'inadequate', ru: 'я недостаточно хорош(а)' }, { k: 'longing', en: 'longing', ru: 'сильное желание' },
            { k: 'bitter', en: 'bitter', ru: 'горечь' }, { k: 'inspired', en: 'inspired', ru: 'вдохновение' },
          ] },
          { id: 'intensity', t: 'slider' },
          { id: 'breathing', t: 'breathing', pattern: 'three' },
        ],
      },
      {
        title: { en: '3 · What is it pointing at?', ru: '3 · На что она указывает?' },
        fields: [
          { id: 'wantQuick', t: 'chips-multi', opts: [
            { k: 'recognition', en: 'Recognition', ru: 'Признание' }, { k: 'achievement', en: 'Achievement', ru: 'Достижение' }, { k: 'freedom', en: 'Freedom', ru: 'Свобода' },
            { k: 'mastery', en: 'Mastery', ru: 'Мастерство' }, { k: 'love', en: 'Love', ru: 'Любовь' },
          ] },
          { id: 'want', t: 'textarea', ph: { en: 'What I actually want is…', ru: 'На самом деле я хочу…' } },
        ],
      },
      {
        title: { en: '4 · Turn it into direction', ru: '4 · Превратите её в направление' },
        fields: [
          { id: 'redirect', t: 'checks', opts: [
            { k: 'learnFromThem', en: 'Learn from the person I envy', ru: 'Поучиться у того, кому завидую' }, { k: 'oneStep', en: 'Take one step toward what I want', ru: 'Сделать один шаг к желаемому' }, { k: 'gratitude', en: 'Name what I already have', ru: 'Назвать то, что у меня уже есть' },
          ] },
          { id: 'plan', t: 'textarea', ph: { en: 'My action plan is…', ru: 'Мой план действий…' } },
        ],
      },
    ],
    journalFields: ['situation', 'want', 'plan'],
  },
}

// Reverse lookup: option key → {en,ru}. Also maps legacy English display strings
// (entries saved before options had stable keys) so old data localizes with no migration.
export const OPTION_LABELS = {}
for (const m of Object.values(MODULES))
  for (const s of m.practiceSteps)
    for (const f of s.fields || [])
      for (const o of f.opts || []) {
        OPTION_LABELS[o.k] = o
        OPTION_LABELS[o.en] = o
      }
export const optionLabel = (lang, v) => (OPTION_LABELS[v] ? L(lang, OPTION_LABELS[v]) : v)

export const BADGES = [
  { id: 'angerAlchemist', need: 10, scope: 'anger', name: { en: 'Anger Alchemist', ru: 'Алхимик гнева' }, desc: { en: '10 anger practices', ru: '10 практик с гневом' } },
  { id: 'shameShifter', need: 10, scope: 'shame', name: { en: 'Shame Shifter', ru: 'Преобразователь стыда' }, desc: { en: '10 shame practices', ru: '10 практик со стыдом' } },
  { id: 'fearFacer', need: 10, scope: 'fear', name: { en: 'Fear Facer', ru: 'Лицом к страху' }, desc: { en: '10 fear practices', ru: '10 практик со страхом' } },
  { id: 'envyNavigator', need: 10, scope: 'envy', name: { en: 'Envy Navigator', ru: 'Навигатор зависти' }, desc: { en: '10 envy practices', ru: '10 практик с завистью' } },
  { id: 'emotionMaster', need: 30, scope: 'total', name: { en: 'Emotion Master', ru: 'Мастер эмоций' }, desc: { en: '30 total practices across all emotions', ru: '30 практик по всем эмоциям' } },
]
