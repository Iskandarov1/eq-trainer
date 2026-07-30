// All user-facing content in EN + RU + UZ (Uzbek Latin). Every string is {en, ru, uz}; L() picks the active language.
export const L = (lang, s) => (typeof s === 'string' ? s : s?.[lang] ?? s?.en ?? '')

// Sentence starter pre-filled INTO the field: the user finishes the sentence by typing.
// A trailing "…" is an open tail — strip it and leave a space; internal "…" stay as slots.
export const starterFor = (lang, ph) => {
  const s = L(lang, ph)
  return (s.endsWith('…') ? s.slice(0, -1).trimEnd() : s) + ' '
}

export const UI = {
  appName: { en: 'EQ Trainer', ru: 'EQ Тренер', uz: 'EQ Trener' },
  tagline: { en: 'Grow your emotional intelligence — the Goleman way', ru: 'Развивайте эмоциональный интеллект по методу Гоулмана', uz: 'Goleman usulida hissiy intellektni rivojlantiring' },
  home: { en: 'Dashboard', ru: 'Дашборд', uz: 'Bosh sahifa' },
  journey: { en: '30-Day Journey', ru: '30-дневный путь', uz: '30 kunlik yoʻl' },
  nextLevel: { en: 'Next Level', ru: 'Новый уровень', uz: 'Yangi bosqich' },
  learn: { en: 'Learn', ru: 'Учиться', uz: 'Oʻrganish' },
  practice: { en: 'Practice', ru: 'Практика', uz: 'Amaliyot' },
  journal: { en: 'Journal', ru: 'Дневник', uz: 'Kundalik' },
  progress: { en: 'Progress', ru: 'Прогресс', uz: 'Oʻsish' },
  save: { en: 'Save to journal', ru: 'Сохранить в дневник', uz: 'Kundalikka saqlash' },
  saved: { en: 'Saved! Well done — every practice builds the muscle.', ru: 'Сохранено! Отлично — каждая практика укрепляет навык.', uz: 'Saqlandi! Barakalla — har bir amaliyot koʻnikmani mustahkamlaydi.' },
  day: { en: 'Day', ru: 'День', uz: 'Kun' },
  of30: { en: 'of 30', ru: 'из 30', uz: '/ 30' },
  startJourney: { en: 'Start my journey', ru: 'Начать путь', uz: 'Yoʻlni boshlash' },
  startJourneyHint: { en: 'Press start — the app will guide you day by day through all 4 weeks.', ru: 'Нажмите «Начать» — приложение проведёт вас день за днём через все 4 недели.', uz: '«Boshlash» tugmasini bosing — ilova sizni 4 hafta davomida kunma-kun yetaklaydi.' },
  todayPractices: { en: "Today's practices", ru: 'Практики сегодня', uz: 'Bugungi amaliyotlar' },
  markDayDone: { en: 'Complete this day', ru: 'Завершить день', uz: 'Kunni yakunlash' },
  dayDone: { en: 'Day completed ✓', ru: 'День завершён ✓', uz: 'Kun yakunlandi ✓' },
  streak: { en: 'day streak', ru: 'дней подряд', uz: 'kun ketma-ket' },
  daysCompleted: { en: 'days completed', ru: 'дней завершено', uz: 'kun yakunlandi' },
  upcoming: { en: 'Upcoming', ru: 'Впереди', uz: 'Oldinda' },
  currentWeek: { en: 'Current week', ru: 'Текущая неделя', uz: 'Joriy hafta' },
  completedW: { en: 'Completed', ru: 'Завершено', uz: 'Yakunlangan' },
  weekGoal: { en: 'Goal', ru: 'Цель', uz: 'Maqsad' },
  viewDay: { en: 'Open today', ru: 'Открыть сегодня', uz: 'Bugunni ochish' },
  browseDay: { en: 'Open day', ru: 'Открыть день', uz: 'Kunni ochish' },
  locked: { en: 'Unlocks later — one day at a time', ru: 'Откроется позже — день за днём', uz: 'Keyinroq ochiladi — har kuni bittadan' },
  intensity: { en: 'Intensity', ru: 'Интенсивность', uz: 'Intensivlik' },
  intensityNow: { en: 'How intense is it right now? (1–10)', ru: 'Насколько это сильно прямо сейчас? (1–10)', uz: 'Hozir bu qanchalik kuchli? (1–10)' },
  practiceCount: { en: (n, e) => `You've worked with ${e} ${n} time${n === 1 ? '' : 's'}`, ru: (n, e) => `Вы работали с эмоцией «${e}» ${n} раз`, uz: (n, e) => `Siz «${e}» hissi bilan ${n} marta ishladingiz` },
  masteryScore: { en: 'Mastery score', ru: 'Уровень мастерства', uz: 'Mahorat darajasi' },
  masteryHint: { en: 'Based on practice frequency and depth of reflection', ru: 'На основе частоты практик и глубины рефлексии', uz: 'Amaliyotlar chastotasi va mulohaza chuqurligiga asoslangan' },
  intensityOverTime: { en: 'Emotion intensity over time', ru: 'Интенсивность эмоции со временем', uz: 'His-tuygʻu intensivligining vaqt boʻyicha oʻzgarishi' },
  insightDown: { en: (p, e) => `Your ${e} intensity has decreased by ${p}% — the practice is working.`, ru: (p, e) => `Интенсивность эмоции «${e}» снизилась на ${p}% — практика работает.`, uz: (p, e) => `«${e}» intensivligi ${p}% ga pasaydi — amaliyot samara beryapti.` },
  insightUp: { en: (p, e) => `Your recent ${e} intensity is ${p}% higher — be curious: what changed lately?`, ru: (p, e) => `Интенсивность эмоции «${e}» выросла на ${p}% — проявите любопытство: что изменилось в последнее время?`, uz: (p, e) => `Soʻnggi paytlarda «${e}» intensivligi ${p}% ga yuqori — qiziqish bilan qarang: yaqinda nima oʻzgardi?` },
  insightFlat: { en: 'Keep practicing to reveal your intensity trend.', ru: 'Продолжайте практиковать, чтобы увидеть динамику.', uz: 'Dinamikani koʻrish uchun amaliyotni davom ettiring.' },
  needMore: { en: 'Complete at least 2 practices to see your chart and insights.', ru: 'Выполните минимум 2 практики, чтобы увидеть график и инсайты.', uz: 'Grafik va xulosalarni koʻrish uchun kamida 2 ta amaliyot bajaring.' },
  noEntries: { en: 'No journal entries yet. Complete a practice — it will appear here.', ru: 'Записей пока нет. Выполните практику — она появится здесь.', uz: 'Hozircha yozuvlar yoʻq. Amaliyot bajaring — u shu yerda paydo boʻladi.' },
  searchEntries: { en: 'Search entries…', ru: 'Поиск по записям…', uz: 'Yozuvlardan qidirish…' },
  from: { en: 'From', ru: 'С', uz: 'Dan' },
  to: { en: 'To', ru: 'По', uz: 'Gacha' },
  compare: { en: 'First vs Most recent', ru: 'Первая и последняя', uz: 'Birinchi va oxirgi' },
  firstEntry: { en: 'First time', ru: 'Первый раз', uz: 'Birinchi marta' },
  latestEntry: { en: 'Most recent', ru: 'Последний раз', uz: 'Oxirgi marta' },
  close: { en: 'Close', ru: 'Закрыть', uz: 'Yopish' },
  overallProgress: { en: 'Overall progress', ru: 'Общий прогресс', uz: 'Umumiy oʻsish' },
  totalPractices: { en: (n) => `Total practices: ${n} across all emotions`, ru: (n) => `Всего практик: ${n} по всем эмоциям`, uz: (n) => `Jami amaliyotlar: ${n} — barcha his-tuygʻular boʻyicha` },
  mostImproved: { en: 'Most improved emotion', ru: 'Наибольший прогресс', uz: 'Eng katta oʻsish' },
  focusSuggestion: { en: (e) => `Consider working more on ${e}`, ru: (e) => `Стоит больше поработать с эмоцией «${e}»`, uz: (e) => `«${e}» hissi bilan koʻproq ishlashga arziydi` },
  weeklySummary: { en: 'Weekly summary', ru: 'Итоги недели', uz: 'Hafta yakunlari' },
  practicesPerEmotion: { en: 'Practices per emotion (last 7 days)', ru: 'Практики по эмоциям (последние 7 дней)', uz: 'His-tuygʻular boʻyicha amaliyotlar (oxirgi 7 kun)' },
  trendText: { en: (e) => `You're getting better at managing ${e}.`, ru: (e) => `Вы всё лучше управляете эмоцией «${e}».`, uz: (e) => `Siz «${e}» hissini boshqarishni tobora yaxshi uddalayapsiz.` },
  trendNone: { en: 'Complete practices this week to see your trend.', ru: 'Выполняйте практики на этой неделе, чтобы увидеть тренд.', uz: 'Trendni koʻrish uchun shu hafta amaliyotlar bajaring.' },
  nextMilestone: { en: 'Next milestone', ru: 'Следующая цель', uz: 'Keyingi marra' },
  milestoneText: { en: (n, b) => `${n} more practice${n === 1 ? '' : 's'} to earn “${b}”`, ru: (n, b) => `Ещё ${n} практик до значка «${b}»`, uz: (n, b) => `«${b}» nishonigacha yana ${n} ta amaliyot` },
  allBadges: { en: 'All badges earned — you are an Emotion Master!', ru: 'Все значки получены — вы Мастер эмоций!', uz: 'Barcha nishonlar olindi — siz His-tuygʻular ustasisiz!' },
  achievements: { en: 'Achievement badges', ru: 'Значки достижений', uz: 'Yutuq nishonlari' },
  earned: { en: 'Earned', ru: 'Получен', uz: 'Olingan' },
  notYet: { en: (n) => `${n} practices needed`, ru: (n) => `Нужно практик: ${n}`, uz: (n) => `${n} ta amaliyot kerak` },
  journeyCard: { en: 'Your 30-day transformation', ru: 'Ваша 30-дневная трансформация', uz: 'Sizning 30 kunlik oʻzgarishingiz' },
  nextLevelCard: { en: 'Next Level — mastering difficult emotions', ru: 'Новый уровень — работа со сложными эмоциями', uz: 'Yangi bosqich — murakkab his-tuygʻularni egallash' },
  nextLevelIntro: {
    en: 'This module focuses on mastering four challenging emotions — not by suppressing them, but by understanding and managing them skillfully.',
    ru: 'Этот модуль посвящён освоению четырёх сложных эмоций — не через подавление, а через понимание и умелое управление.',
    uz: 'Bu modul toʻrtta murakkab his-tuygʻuni egallashga bagʻishlangan — ularni bostirish orqali emas, balki tushunish va mohirona boshqarish orqali.',
  },
  nlQuote: {
    en: '“A lot of people think emotion regulation is getting rid of a feeling… It’s just having another relationship to it.” — Marc Brackett',
    ru: '«Многие думают, что регуляция эмоций — это избавиться от чувства… На самом деле это просто выстроить с ним другие отношения.» — Марк Брэкетт',
    uz: '«Koʻpchilik his-tuygʻuni boshqarish — bu undan qutulish deb oʻylaydi… Aslida bu u bilan boshqacha munosabat qurish, xolos.» — Marc Brackett',
  },
  golemanApproach: { en: 'The Goleman Approach — 4 steps', ru: 'Подход Гоулмана — 4 шага', uz: 'Goleman yondashuvi — 4 qadam' },
  tapCard: { en: 'Tap a card to explore each step', ru: 'Нажмите на карточку, чтобы раскрыть шаг', uz: 'Qadamni ochish uchun kartochkani bosing' },
  breathe: { en: 'Breathing guide · 4-7-8', ru: 'Дыхание · 4-7-8', uz: 'Nafas mashqi · 4-7-8' },
  breatheNav: { en: 'Breathe', ru: 'Дыхание', uz: 'Nafas' },
  threeBreaths: { en: '3 deep breaths', ru: '3 глубоких вдоха', uz: '3 chuqur nafas' },
  breatheIntro: {
    en: 'The 4-7-8 breath: inhale for 4, hold for 7, exhale for 8. Deep belly breathing tells the brain: you are safe now.',
    ru: 'Дыхание 4-7-8: вдох на 4, задержка на 7, выдох на 8. Глубокое дыхание животом говорит мозгу: сейчас ты в безопасности.',
    uz: '4-7-8 nafasi: 4 sanoqda nafas oling, 7 sanoqda ushlab turing, 8 sanoqda chiqaring. Qorin bilan chuqur nafas olish miyaga aytadi: endi xavfsizsan.',
  },
  breatheStart: { en: 'Start breathing', ru: 'Начать дыхание', uz: 'Nafas mashqini boshlash' },
  breatheStop: { en: 'Stop', ru: 'Стоп', uz: 'Toʻxtatish' },
  inhale: { en: 'Inhale', ru: 'Вдох', uz: 'Nafas oling' },
  hold: { en: 'Hold', ru: 'Задержка', uz: 'Ushlab turing' },
  exhale: { en: 'Exhale', ru: 'Выдох', uz: 'Chiqaring' },
  cycles: { en: 'cycles completed', ru: 'циклов завершено', uz: 'ta sikl yakunlandi' },
  exportData: { en: 'Export backup', ru: 'Экспорт данных', uz: 'Zaxirani eksport qilish' },
  importData: { en: 'Import backup', ru: 'Импорт данных', uz: 'Zaxirani import qilish' },
  imported: { en: 'Backup restored successfully.', ru: 'Данные успешно восстановлены.', uz: 'Maʼlumotlar muvaffaqiyatli tiklandi.' },
  importError: { en: 'Could not read that file — is it an EQ Trainer backup?', ru: 'Не удалось прочитать файл — это резервная копия EQ Тренера?', uz: 'Faylni oʻqib boʻlmadi — bu EQ Trener zaxira nusxasimi?' },
  finalWords: {
    en: '“It starts with permission to feel.” — Marc Brackett',
    ru: '«Всё начинается с разрешения чувствовать.» — Марк Брэкетт',
    uz: '«Hammasi his qilishga ruxsat berishdan boshlanadi.» — Marc Brackett',
  },
  heroQuote: {
    en: '“Unlike IQ, which barely budges over the course of our life, emotional intelligence can change… it’s learned and learnable at any point in life.” — Daniel Goleman',
    ru: '«В отличие от IQ, который почти не меняется в течение жизни, эмоциональный интеллект может меняться… этому можно научиться в любой момент жизни.» — Дэниел Гоулман',
    uz: '«Umr boʻyi deyarli oʻzgarmaydigan IQ dan farqli oʻlaroq, hissiy intellekt oʻzgara oladi… uni hayotning istalgan pallasida oʻrganish mumkin.» — Daniel Goleman',
  },
  ritualTitle: { en: 'Final Challenge: Day 31 and beyond', ru: 'Финальный вызов: день 31 и далее', uz: 'Yakuniy sinov: 31-kun va undan keyin' },
  ritualIntro: { en: 'Create your Emotional Intelligence Ritual:', ru: 'Создайте свой ритуал эмоционального интеллекта:', uz: 'Oʻz hissiy intellekt ritualingizni yarating:' },
  ritualMorning: { en: 'Morning: 2-min intention', ru: 'Утро: 2-минутное намерение', uz: 'Ertalab: 2 daqiqalik niyat' },
  ritualDay: { en: 'Daytime: 1 emotional check-in', ru: 'День: 1 эмоциональный чек-ин', uz: 'Kunduzi: 1 ta hissiy tekshiruv' },
  ritualEvening: { en: 'Evening: 5-min reflection journal', ru: 'Вечер: 5-минутная рефлексия', uz: 'Kechqurun: 5 daqiqalik mulohaza' },
  ritualMorningPh: { en: 'In the morning I will…', ru: 'Утром я буду…', uz: 'Ertalab men…' },
  ritualDayPh: { en: 'During the day I will…', ru: 'Днём я буду…', uz: 'Kunduzi men…' },
  ritualEveningPh: { en: 'In the evening I will…', ru: 'Вечером я буду…', uz: 'Kechqurun men…' },
  congratsJourney: { en: 'You completed the 30-day journey!', ru: 'Вы прошли 30-дневный путь!', uz: 'Siz 30 kunlik yoʻlni bosib oʻtdingiz!' },
  yourEntry: { en: 'Your entry', ru: 'Ваша запись', uz: 'Sizning yozuvingiz' },
  optionalNote: { en: 'Optional note…', ru: 'Заметка (необязательно)…', uz: 'Izoh (ixtiyoriy)…' },
  weeks: { en: 'Weeks', ru: 'Недели', uz: 'Haftalar' },
  pathTab: { en: 'Path', ru: 'Путь', uz: 'Yoʻl' },
  entriesWord: { en: 'entries', ru: 'записей', uz: 'ta yozuv' },
  goToNextLevel: { en: 'Open Next Level', ru: 'Открыть Новый уровень', uz: 'Yangi bosqichni ochish' },
  goToJourney: { en: 'Open Journey', ru: 'Открыть путь', uz: 'Yoʻlni ochish' },
  emotionMasteryRings: { en: 'Emotion mastery', ru: 'Мастерство эмоций', uz: 'His-tuygʻular mahorati' },
  notEnoughData: { en: 'not enough data yet', ru: 'пока мало данных', uz: 'hozircha maʼlumot kam' },
  finalTipsTitle: { en: 'Final Tips: Build Emotional Mastery Like a Muscle', ru: 'Финальные советы: тренируйте эмоциональное мастерство как мышцу', uz: 'Yakuniy maslahatlar: hissiy mahoratni mushak kabi chiniqtiring' },
  tipCheckin: { en: 'Daily Emotional Check-In', ru: 'Ежедневный эмоциональный чек-ин', uz: 'Kundalik hissiy tekshiruv' },
  tipCheckinDesc: { en: 'What am I feeling right now? Where in my body do I feel it? Why?', ru: 'Что я чувствую прямо сейчас? Где в теле я это ощущаю? Почему?', uz: 'Hozir nimani his qilyapman? Buni tanamning qayerida sezyapman? Nega?' },
  tipMeditate: { en: 'Meditation on Emotions (10 min/day)', ru: 'Медитация на эмоции (10 мин/день)', uz: 'His-tuygʻular meditatsiyasi (kuniga 10 daqiqa)' },
  tipMeditateDesc: { en: 'Sit. Breathe. Watch anger, shame, or fear arise like clouds — then pass. This builds prefrontal cortex control over amygdala impulses.', ru: 'Сядьте. Дышите. Наблюдайте, как гнев, стыд или страх появляются, словно облака, — и проходят. Это укрепляет контроль префронтальной коры над импульсами миндалины.', uz: 'Oʻtiring. Nafas oling. Gʻazab, uyat yoki qoʻrquv bulutlar kabi paydo boʻlib, soʻng oʻtib ketishini kuzating. Bu prefrontal korteksning amigdala impulslari ustidan nazoratini mustahkamlaydi.' },
  tipRehearse: { en: 'Rehearse Emotionally Intelligent Responses', ru: 'Репетируйте эмоционально умные ответы', uz: 'Hissiy oqilona javoblarni mashq qiling' },
  tipRehearseDesc: { en: 'Visualize triggering situations. Practice responding with calm, compassion, and clarity.', ru: 'Визуализируйте триггерные ситуации. Практикуйте ответ со спокойствием, состраданием и ясностью.', uz: 'Trigger vaziyatlarni koʻz oldingizga keltiring. Xotirjamlik, mehr va aniqlik bilan javob berishni mashq qiling.' },
  wavesQuote: {
    en: '“Attention is a mental muscle… like going to the gym.” — Daniel Goleman',
    ru: '«Внимание — это ментальная мышца… как тренировка в спортзале.» — Дэниел Гоулман',
    uz: '«Diqqat — bu aqliy mushak… xuddi sport zaliga borish kabi.» — Daniel Goleman',
  },
  errorTitle: { en: 'Something went wrong', ru: 'Что-то пошло не так', uz: 'Nimadir xato ketdi' },
  errorReload: { en: 'Reload the app', ru: 'Перезагрузить приложение', uz: 'Ilovani qayta yuklash' },
  goodMorning: { en: 'Good morning', ru: 'Доброе утро', uz: 'Xayrli tong' },
  goodAfternoon: { en: 'Good afternoon', ru: 'Добрый день', uz: 'Xayrli kun' },
  goodEvening: { en: 'Good evening', ru: 'Добрый вечер', uz: 'Xayrli oqshom' },
  todayLabel: { en: 'Today', ru: 'Сегодня', uz: 'Bugun' },
  weekWord: { en: 'Week', ru: 'Неделя', uz: 'Hafta' },
  begin: { en: 'Begin', ru: 'Начать', uz: 'Boshlash' },
  estPractice: { en: '≈ 5–10 min · guided practice', ru: '≈ 5–10 мин · практика с подсказками', uz: '≈ 5–10 daqiqa · yoʻriqli amaliyot' },
  trustNote: { en: 'Your journal never leaves this device — everything is stored locally.', ru: 'Ваш дневник не покидает это устройство — всё хранится локально.', uz: 'Kundaligingiz bu qurilmadan hech qayerga ketmaydi — hammasi lokal saqlanadi.' },
  milestoneTitle: { en: (d) => `Day ${d} complete!`, ru: (d) => `День ${d} завершён!`, uz: (d) => `${d}-kun yakunlandi!` },
  milestoneBody: { en: 'A milestone on your journey. Consistency is the practice.', ru: 'Веха на вашем пути. Постоянство и есть практика.', uz: 'Yoʻlingizdagi muhim marra. Doimiylikning oʻzi — amaliyot.' },
  continueWord: { en: 'Continue', ru: 'Продолжить', uz: 'Davom etish' },
  bookPage: { en: (n) => `p. ${n}`, ru: (n) => `с. ${n}`, uz: (n) => `${n}-bet` },
}

// ---- Quotes from Daniel Goleman, "Emotional Intelligence" (Bloomsbury) — research source #6, PRD §6.
// EN text is verbatim from the book (page = PDF page of the owner's 249-p file); RU/UZ are our translations.
// A quote rotates on every page open via nextBookQuote() — shuffled deck, all 20 cycle before any repeat.
export const BOOK_TITLE = { en: 'Emotional Intelligence', ru: 'Эмоциональный интеллект', uz: 'Hissiy intellekt' }
export const BOOK_AUTHOR = { en: 'Daniel Goleman', ru: 'Дэниел Гоулман', uz: 'Daniel Goleman' }

export const BOOK_QUOTES = [
  {
    page: 6,
    by: { en: 'Aristotle', ru: 'Аристотель', uz: 'Arastu' },
    text: {
      en: 'Anyone can become angry — that is easy. But to be angry with the right person, to the right degree, at the right time, for the right purpose, and in the right way — this is not easy.',
      ru: 'Рассердиться может каждый — это легко. Но сердиться на того, кто этого заслуживает, в должной мере, в нужное время, ради правильной цели и правильным образом — это нелегко.',
      uz: 'Gʻazablanish har kimning qoʻlidan keladi — bu oson. Ammo kerakli odamga, kerakli darajada, kerakli paytda, toʻgʻri maqsad yoʻlida va toʻgʻri tarzda gʻazablanish — bu oson emas.',
    },
  },
  {
    page: 14,
    text: {
      en: 'In a very real sense we have two minds, one that thinks and one that feels.',
      ru: 'В самом прямом смысле у нас два ума: один думает, другой чувствует.',
      uz: 'Toʻgʻridan-toʻgʻri maʼnoda bizda ikkita aql bor: biri oʻylaydi, ikkinchisi his qiladi.',
    },
  },
  {
    page: 37,
    text: {
      en: 'Self-awareness — recognizing a feeling as it happens — is the keystone of emotional intelligence. People with greater certainty about their feelings are better pilots of their lives.',
      ru: 'Самоосознание — умение распознать чувство в момент его возникновения — краеугольный камень эмоционального интеллекта. Люди, которые лучше понимают свои чувства, увереннее ведут корабль своей жизни.',
      uz: 'Oʻz-oʻzini anglash — his-tuygʻuni paydo boʻlgan zahoti taniy olish — hissiy intellektning tamal toshi. Oʻz his-tuygʻularini aniqroq biladigan odamlar hayotlarini yaxshiroq boshqaradilar.',
    },
  },
  {
    page: 40,
    text: {
      en: 'The realization “This is anger I’m feeling” offers a greater degree of freedom — not just the option not to act on it, but the added option to try to let go of it.',
      ru: 'Осознание «это гнев, который я сейчас чувствую» даёт большую степень свободы: не только выбор не действовать под его влиянием, но и возможность попробовать его отпустить.',
      uz: '«Men hozir gʻazabni his qilyapman» degan anglash koʻproq erkinlik beradi: unga berilib harakat qilmaslik bilan birga, uni qoʻyib yuborishga urinish imkonini ham.',
    },
  },
  {
    page: 47,
    text: {
      en: 'We very often have little or no control over when we are swept by emotion, nor over what emotion it will be. But we can have some say in how long an emotion will last.',
      ru: 'Мы почти не властны над тем, когда нас захлестнёт эмоция и какой она будет. Но от нас во многом зависит, как долго она продлится.',
      uz: 'His-tuygʻu bizni qachon qamrab olishi va u qanday boʻlishi koʻpincha bizga bogʻliq emas. Ammo u qancha davom etishiga taʼsir oʻtkaza olamiz.',
    },
  },
  {
    page: 48,
    text: {
      en: 'Brooding fuels anger’s flames. But seeing things differently douses those flames.',
      ru: 'Мысленное пережёвывание обид раздувает пламя гнева. А взгляд на происходящее под другим углом гасит это пламя.',
      uz: 'Xayolda qayta-qayta oʻylayverish gʻazab alangasini avj oldiradi. Vaziyatga boshqacha qarash esa bu alangani oʻchiradi.',
    },
  },
  {
    page: 52,
    by: { en: 'Chögyam Trungpa', ru: 'Чогьям Трунгпа', uz: 'Chogyam Trungpa' },
    text: {
      en: 'Don’t suppress it. But don’t act on it.',
      ru: 'Не подавляйте его. Но и не действуйте под его влиянием.',
      uz: 'Uni bostirmang. Ammo unga berilib ish ham tutmang.',
    },
  },
  {
    page: 63,
    text: {
      en: 'There is perhaps no psychological skill more fundamental than resisting impulse. It is the root of all emotional self-control, since all emotions, by their very nature, lead to one or another impulse to act.',
      ru: 'Пожалуй, нет более фундаментального психологического навыка, чем умение противостоять импульсу. Это корень всякого эмоционального самоконтроля, ведь любая эмоция по самой своей природе толкает к тому или иному действию.',
      uz: 'Impulsga qarshi tura olishdan koʻra asosiyroq ruhiy koʻnikma yoʻq boʻlsa kerak. Bu barcha hissiy oʻzini tutishning ildizi, chunki har qanday his-tuygʻu oʻz tabiatiga koʻra u yoki bu harakatga undaydi.',
    },
  },
  {
    page: 65,
    text: {
      en: 'Our worries become self-fulfilling prophecies, propelling us toward the very disaster they predict.',
      ru: 'Наши тревоги становятся самосбывающимися пророчествами, подталкивая нас к той самой катастрофе, которую они предрекают.',
      uz: 'Xavotirlarimiz oʻz-oʻzini roʻyobga chiqaruvchi bashoratga aylanadi — ular bizni oʻzlari bashorat qilgan falokat sari yetaklaydi.',
    },
  },
  {
    page: 86,
    text: {
      en: 'Attunement to others demands a modicum of calm in oneself.',
      ru: 'Настроиться на другого человека можно, лишь сохраняя хотя бы каплю спокойствия в себе.',
      uz: 'Boshqalarga hamohang boʻlish uchun insonning oʻzida ozgina boʻlsa-da xotirjamlik boʻlishi kerak.',
    },
  },
  {
    page: 108,
    text: {
      en: 'The most powerful form of nondefensive listening, of course, is empathy: actually hearing the feelings behind what is being said.',
      ru: 'Самая действенная форма незащитного слушания — это, конечно, эмпатия: способность действительно услышать чувства за произносимыми словами.',
      uz: 'Himoyasiz tinglashning eng kuchli shakli, albatta, empatiya: aytilayotgan soʻzlar ortidagi his-tuygʻularni chinakam eshita olish.',
    },
  },
  {
    page: 113,
    text: {
      en: 'An artful critique focuses on what a person has done and can do rather than reading a mark of character into a job poorly done.',
      ru: 'Умелая критика говорит о том, что человек сделал и что может сделать, а не превращает неудачную работу в приговор его характеру.',
      uz: 'Mohirona tanqid odamning nima qilgani va nima qila olishiga qaratiladi — yomon bajarilgan ishni uning xarakteriga tamgʻa qilib bosmaydi.',
    },
  },
  {
    page: 154,
    text: {
      en: 'While we cannot decide when we have our emotional outbursts, we have more control over how long they last. A quicker recovery time from such outbursts may well be one mark of emotional maturity.',
      ru: 'Мы не выбираем, когда случится эмоциональная вспышка, но нам куда больше подвластно, как долго она продлится. Умение быстрее приходить в себя после таких вспышек — пожалуй, один из признаков эмоциональной зрелости.',
      uz: 'Hissiy portlash qachon yuz berishini tanlay olmaymiz, ammo u qancha davom etishi koʻproq oʻzimizga bogʻliq. Bunday portlashlardan tezroq oʻziga kelish hissiy yetuklikning belgilaridan biri boʻlsa ajab emas.',
    },
  },
  {
    page: 155,
    text: {
      en: 'Emotional lessons — even the most deeply implanted habits of the heart learned in childhood — can be reshaped. Emotional learning is lifelong.',
      ru: 'Эмоциональные уроки — даже самые глубоко укоренившиеся привычки сердца, усвоенные в детстве, — можно изменить. Эмоциональное обучение длится всю жизнь.',
      uz: 'Hissiy saboqlarni — hatto bolalikda singib ketgan eng chuqur qalb odatlarini ham — qayta shakllantirish mumkin. Hissiy oʻrganish umr boʻyi davom etadi.',
    },
  },
  {
    page: 176,
    text: {
      en: 'Moods like anxiety, sadness, and anger don’t just descend on you without your having any control over them… you can change the way you feel by what you think.',
      ru: 'Тревога, грусть, гнев не просто обрушиваются на вас помимо вашей воли… вы можете изменить то, что чувствуете, через то, что думаете.',
      uz: 'Xavotir, gʻamginlik, gʻazab kabi kayfiyatlar sizga shunchaki oʻz-oʻzidan yopirilib kelmaydi… nimani oʻylashingiz orqali qanday his qilishingizni oʻzgartira olasiz.',
    },
  },
  {
    page: 190,
    text: {
      en: 'Mastery in the emotional domain is especially difficult because skills need to be acquired when people are usually least able to take in new information and learn new habits of response — when they are upset.',
      ru: 'Мастерство в эмоциональной сфере даётся особенно трудно: навыки приходится осваивать именно тогда, когда человек меньше всего способен воспринимать новое и учиться новым реакциям, — когда он расстроен.',
      uz: 'Hissiy sohada mahoratga erishish ayniqsa qiyin: koʻnikmalarni aynan odam yangi maʼlumotni qabul qilishga va yangicha javob berishga eng kam qodir boʻlgan paytda — xafa boʻlib turganda egallashga toʻgʻri keladi.',
    },
  },
  {
    page: 199,
    text: {
      en: 'All feelings are okay to have… but some reactions are okay and others not.',
      ru: 'Любые чувства иметь нормально… но одни реакции допустимы, а другие — нет.',
      uz: 'Har qanday his-tuygʻuni his qilish joiz… ammo baʼzi javob harakatlari toʻgʻri, baʼzilari esa yoʻq.',
    },
  },
  {
    page: 207,
    text: {
      en: 'There are hundreds of emotions, along with their blends, variations, mutations, and nuances. Indeed, there are many more subtleties of emotion than we have words for.',
      ru: 'Существуют сотни эмоций со всеми их сочетаниями, вариациями, мутациями и оттенками. Тонкостей чувств куда больше, чем слов, которыми мы их называем.',
      uz: 'Yuzlab his-tuygʻular bor — ularning qorishmalari, turlari, oʻzgarishlari va nozik ohanglari bilan. His-tuygʻu nozikliklari biz ularni atashga soʻz topganimizdan koʻra koʻproqdir.',
    },
  },
  {
    page: 211,
    text: {
      en: 'While we cannot easily change what specific emotions a certain kind of thought will trigger, we very often can, and do, choose what to think about.',
      ru: 'Мы не можем просто взять и изменить, какие эмоции вызовет та или иная мысль, но мы очень часто можем выбирать — и выбираем, — о чём думать.',
      uz: 'Muayyan fikr qanday his-tuygʻu uygʻotishini osongina oʻzgartira olmaymiz, ammo nima haqida oʻylashni juda koʻp hollarda oʻzimiz tanlay olamiz — va tanlaymiz ham.',
    },
  },
  {
    page: 212,
    text: {
      en: 'The emotional mind reacts to the present as though it were the past. The trouble is that, especially when the appraisal is fast and automatic, we may not realize that what was once the case is no longer so.',
      ru: 'Эмоциональный ум реагирует на настоящее так, будто это прошлое. Беда в том, что при быстрой, автоматической оценке мы можем не заметить: то, что было верно когда-то, уже не так.',
      uz: 'Hissiy aql hozirgi zamonga xuddi oʻtmishdek munosabatda boʻladi. Muammo shundaki, baho tez va avtomatik berilganda, bir paytlar toʻgʻri boʻlgan narsa endi unday emasligini payqamasligimiz mumkin.',
    },
  },
]

// Shuffled deck: every page open shows the next quote; all 20 appear before any repeats.
let quoteDeck = []
let lastQuoteIdx = -1
export function nextBookQuote() {
  if (quoteDeck.length === 0) {
    quoteDeck = BOOK_QUOTES.map((_, i) => i)
    for (let i = quoteDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[quoteDeck[i], quoteDeck[j]] = [quoteDeck[j], quoteDeck[i]]
    }
    // avoid the same quote twice in a row across a reshuffle
    if (quoteDeck[quoteDeck.length - 1] === lastQuoteIdx && quoteDeck.length > 1) {
      ;[quoteDeck[0], quoteDeck[quoteDeck.length - 1]] = [quoteDeck[quoteDeck.length - 1], quoteDeck[0]]
    }
  }
  lastQuoteIdx = quoteDeck.pop()
  return BOOK_QUOTES[lastQuoteIdx]
}

// Localized labels for journal entry field keys (raw keys must never reach the UI)
export const FIELD_LABELS = {
  situation: { en: 'Situation', ru: 'Ситуация', uz: 'Vaziyat' },
  emotion: { en: 'Named emotion', ru: 'Названная эмоция', uz: 'Nomlangan his-tuygʻu' },
  protectQuick: { en: 'What it protects', ru: 'Что это защищает', uz: 'Nimani himoya qiladi' },
  protecting: { en: 'Protecting (in my words)', ru: 'Защищает (своими словами)', uz: 'Himoya qiladi (oʻz soʻzlarim bilan)' },
  redirect: { en: 'Redirect the energy', ru: 'Куда направить энергию', uz: 'Energiyani yoʻnaltirish' },
  plan: { en: 'Action plan', ru: 'План действий', uz: 'Harakat rejasi' },
  critic: { en: 'Inner critic says', ru: 'Внутренний критик говорит', uz: 'Ichki tanqidchi aytadi' },
  compassion: { en: 'Self-compassion rewrite', ru: 'Ответ с состраданием', uz: 'Mehr bilan qayta yozilgan javob' },
  needQuick: { en: 'Unmet need', ru: 'Неудовлетворённая потребность', uz: 'Qondirilmagan ehtiyoj' },
  need: { en: 'What I need', ru: 'Что мне нужно', uz: 'Menga nima kerak' },
  shared: { en: 'Shared with someone safe', ru: 'Поделился(ась) с безопасным человеком', uz: 'Ishonchli inson bilan boʻlishdim' },
  sharedNote: { en: 'Sharing note', ru: 'Заметка о разговоре', uz: 'Suhbat haqida izoh' },
  threat: { en: 'Threat type', ru: 'Тип угрозы', uz: 'Tahdid turi' },
  about: { en: 'This fear is about', ru: 'Этот страх — о', uz: 'Bu qoʻrquv nima haqida' },
  grounding: { en: 'Grounding: 5 things I see', ru: 'Заземление: 5 вещей', uz: 'Zaminlanish: men koʻrgan 5 narsa' },
  reframe: { en: 'Reframe', ru: 'Переосмысление', uz: 'Qayta talqin' },
  brave: { en: 'Micro-brave step', ru: 'Микро-смелый шаг', uz: 'Mikro-jasur qadam' },
  wantQuick: { en: 'What it points at', ru: 'На что указывает', uz: 'Nimaga ishora qiladi' },
  want: { en: 'What I actually want', ru: 'Чего я на самом деле хочу', uz: 'Aslida nimani xohlayman' },
  took: { en: 'I took this step', ru: 'Я сделал(а) этот шаг', uz: 'Bu qadamni bajardim' },
  tookDate: { en: 'Step taken on', ru: 'Шаг сделан', uz: 'Qadam bajarilgan sana' },
  intensity: { en: 'Intensity', ru: 'Интенсивность', uz: 'Intensivlik' },
}

export const EMOTION_NAMES = {
  anger: { en: 'Anger', ru: 'Гнев', uz: 'Gʻazab' },
  shame: { en: 'Shame', ru: 'Стыд', uz: 'Uyat' },
  fear: { en: 'Fear', ru: 'Страх', uz: 'Qoʻrquv' },
  envy: { en: 'Envy', ru: 'Зависть', uz: 'Hasad' },
}

// ---------------- 30-DAY JOURNEY (from the Goleman 1-month plan PDF) ----------------
export const WEEKS = [
  {
    id: 'w1',
    days: [1, 7],
    color: '#565a2b',
    title: { en: 'Week 1 · Build the Foundation — Self-Awareness', ru: 'Неделя 1 · Фундамент — Самоосознание', uz: '1-hafta · Poydevor — Oʻzini anglash' },
    quote: {
      en: '“Self-awareness means you know what you’re feeling.” — Daniel Goleman',
      ru: '«Неспособность замечать свои истинные чувства оставляет нас на их произвол.» — Дэниел Гоулман, «Эмоциональный интеллект»',
      uz: '«Oʻzini anglash — nimani his qilayotganingizni bilish demakdir.» — Daniel Goleman',
    },
    intro: { en: 'The first step in emotional intelligence is knowing your emotions as they occur.', ru: 'Первый шаг эмоционального интеллекта — распознавать эмоции в момент их появления.', uz: 'Hissiy intellektning birinchi qadami — his-tuygʻularni paydo boʻlgan zahoti taniy olish.' },
    goal: { en: 'By Day 7: recognize your emotional patterns and triggers with 80% accuracy.', ru: 'К 7-му дню: распознавать свои эмоциональные паттерны и триггеры с точностью 80%.', uz: '7-kunga qadar: hissiy naqshlaringiz va triggerlaringizni 80% aniqlik bilan taniysiz.' },
    practices: [
      {
        id: 'checkins',
        title: { en: 'Emotional Check-Ins (3×/day)', ru: 'Эмоциональные чек-ины (3 раза в день)', uz: 'Hissiy tekshiruvlar (kuniga 3 marta)' },
        desc: {
          en: 'Pause morning, noon and evening. Ask: What am I feeling right now? Why might I be feeling this way? How is this emotion affecting my behavior? Write it down. Don’t judge it. Just notice.',
          ru: 'Остановитесь утром, днём и вечером. Спросите себя: Что я чувствую прямо сейчас? Почему я могу это чувствовать? Как эта эмоция влияет на моё поведение? Запишите. Не судите. Просто замечайте.',
          uz: 'Ertalab, kunduzi va kechqurun toʻxtang. Oʻzingizdan soʻrang: Hozir nimani his qilyapman? Nega shunday his qilayotgan boʻlishim mumkin? Bu his-tuygʻu xatti-harakatimga qanday taʼsir qilyapti? Yozib qoʻying. Baholamang. Shunchaki kuzating.',
        },
        fields: [
          { id: 'morningFeel', t: 'text', label: { en: 'Morning check-in', ru: 'Утренний чек-ин', uz: 'Ertalabki tekshiruv' }, ph: { en: 'I feel…', ru: 'Я чувствую…', uz: 'Hozir his qilayotganim —…' } },
          { id: 'morningWhy', t: 'text', ph: { en: 'I might be feeling this because…', ru: 'Возможно, я чувствую это, потому что…', uz: 'Sababi, ehtimol,…' } },
          { id: 'morningHow', t: 'text', ph: { en: 'It affects my behavior by…', ru: 'На моё поведение это влияет так…', uz: 'Bu xatti-harakatimga taʼsiri —…' } },
          { id: 'noonFeel', t: 'text', label: { en: 'Noon check-in', ru: 'Дневной чек-ин', uz: 'Kunduzgi tekshiruv' }, ph: { en: 'I feel…', ru: 'Я чувствую…', uz: 'Hozir his qilayotganim —…' } },
          { id: 'noonWhy', t: 'text', ph: { en: 'I might be feeling this because…', ru: 'Возможно, я чувствую это, потому что…', uz: 'Sababi, ehtimol,…' } },
          { id: 'noonHow', t: 'text', ph: { en: 'It affects my behavior by…', ru: 'На моё поведение это влияет так…', uz: 'Bu xatti-harakatimga taʼsiri —…' } },
          { id: 'eveningFeel', t: 'text', label: { en: 'Evening check-in', ru: 'Вечерний чек-ин', uz: 'Kechki tekshiruv' }, ph: { en: 'I feel…', ru: 'Я чувствую…', uz: 'Hozir his qilayotganim —…' } },
          { id: 'eveningWhy', t: 'text', ph: { en: 'I might be feeling this because…', ru: 'Возможно, я чувствую это, потому что…', uz: 'Sababi, ehtimol,…' } },
          { id: 'eveningHow', t: 'text', ph: { en: 'It affects my behavior by…', ru: 'На моё поведение это влияет так…', uz: 'Bu xatti-harakatimga taʼsiri —…' } },
        ],
      },
      {
        id: 'naming',
        title: { en: 'Name the Emotion, Tame the Emotion', ru: 'Назови эмоцию — приручи эмоцию', uz: 'His-tuygʻuni nomla — uni jilovla' },
        desc: {
          en: 'Use precise language: instead of “bad”, say “disappointed” or “overwhelmed”. Research shows just naming an emotion reduces its intensity in the brain.',
          ru: 'Используйте точные слова: вместо «плохо» — «разочарован» или «перегружен». Исследования показывают: само называние эмоции снижает её интенсивность в мозге.',
          uz: 'Aniq soʻzlardan foydalaning: «yomon» oʻrniga «hafsalam pir boʻldi» yoki «zoʻriqib ketdim» deng. Tadqiqotlar shuni koʻrsatadiki, his-tuygʻuni shunchaki nomlashning oʻzi miyada uning intensivligini pasaytiradi.',
        },
        fields: [
          { id: 'words', t: 'text', label: { en: 'Today’s precise emotion words', ru: 'Точные слова эмоций сегодня', uz: 'Bugungi aniq his-tuygʻu soʻzlari' }, ph: { en: 'Today I felt precisely…', ru: 'Сегодня я точно чувствовал(а)…', uz: 'Bugun aniq his qilganlarim —…' } },
        ],
      },
      {
        id: 'reflection',
        title: { en: 'Evening Reflection Journal', ru: 'Вечерний дневник рефлексии', uz: 'Kechki mulohaza kundaligi' },
        desc: { en: 'Close the day by looking inward.', ru: 'Завершите день взглядом внутрь себя.', uz: 'Kunni ichingizga nazar solib yakunlang.' },
        fields: [
          { id: 'trigger', t: 'textarea', label: { en: 'What triggered strong emotion today?', ru: 'Что вызвало сильную эмоцию сегодня?', uz: 'Bugun kuchli his-tuygʻuni nima uygʻotdi?' }, ph: { en: 'A strong emotion rose in me today when…', ru: 'Сильная эмоция поднялась во мне сегодня, когда…', uz: 'Bugun ichimda kuchli his koʻtarildi, qachonki…' } },
          { id: 'react', t: 'textarea', label: { en: 'Did I react or respond?', ru: 'Я отреагировал импульсивно или ответил осознанно?', uz: 'Impulsiv reaksiya qildimmi yoki ongli javob berdimmi?' }, ph: { en: 'In that moment I…', ru: 'В тот момент я…', uz: 'Oʻsha payt men…' } },
          { id: 'learn', t: 'textarea', label: { en: 'What can I learn about myself?', ru: 'Что я могу узнать о себе?', uz: 'Oʻzim haqimda nimani oʻrganishim mumkin?' }, ph: { en: 'About myself I learned that…', ru: 'О себе я узнал(а), что…', uz: 'Oʻzim haqimda shuni angladimki,…' } },
        ],
      },
    ],
  },
  {
    id: 'w2',
    days: [8, 14],
    color: '#b0563c',
    title: { en: 'Week 2 · Master the Inner World — Self-Management', ru: 'Неделя 2 · Внутренний мир — Саморегуляция', uz: '2-hafta · Ichki olam — Oʻzini boshqarish' },
    quote: {
      en: '“Maturity is sometimes defined as widening the gap between impulse and action.” — Daniel Goleman',
      ru: '«Контроль над своими эмоциями, отсрочивание удовлетворения и подавление импульсивности лежит в основе всяческих достижений.» — Дэниел Гоулман, «Эмоциональный интеллект»',
      uz: '«Yetuklik baʼzan impuls va harakat orasidagi masofani kengaytirish deb taʼriflanadi.» — Daniel Goleman',
    },
    intro: { en: 'Turn awareness into calm, intentional responses.', ru: 'Превратите осознанность в спокойные, намеренные ответы.', uz: 'Anglashni xotirjam, ongli javoblarga aylantiring.' },
    goal: { en: 'By Day 14: reduce emotional hijacks. Stay calm in moments of stress with conscious intention.', ru: 'К 14-му дню: меньше эмоциональных «захватов». Сохранять спокойствие в стрессе с осознанным намерением.', uz: '14-kunga qadar: hissiy «bosib olishlar» kamayadi. Stress onlarida ongli niyat bilan xotirjam qolasiz.' },
    practices: [
      {
        id: 'pause',
        title: { en: 'The Pause Power', ru: 'Сила паузы', uz: 'Pauza kuchi' },
        desc: { en: 'Every time you’re triggered: Pause. Take 3 deep breaths. Ask: What’s the best response here?', ru: 'Каждый раз при триггере: Пауза. 3 глубоких вдоха. Вопрос: какой ответ здесь наилучший?', uz: 'Har safar trigger yuz berganda: Pauza. 3 chuqur nafas. Savol: bu yerda eng yaxshi javob qanday?' },
        fields: [
          { id: 'breath', t: 'breathing', pattern: 'three' },
          { id: 'used', t: 'check', label: { en: 'I used the Pause today', ru: 'Сегодня я использовал(а) паузу', uz: 'Bugun pauzadan foydalandim' } },
          { id: 'when', t: 'textarea', label: { en: 'When?', ru: 'Когда?', uz: 'Qachon?' }, ph: { en: 'I used the pause when…', ru: 'Я использовал(а) паузу, когда…', uz: 'Pauzadan foydalandim, qachonki…' } },
          { id: 'changed', t: 'textarea', label: { en: 'What changed?', ru: 'Что изменилось?', uz: 'Nima oʻzgardi?' }, ph: { en: 'It changed…', ru: 'Это изменило…', uz: 'Natijada oʻzgargani —…' } },
        ],
      },
      {
        id: 'visual',
        title: { en: 'Visualization for Composure (10 min/day)', ru: 'Визуализация спокойствия (10 мин/день)', uz: 'Xotirjamlik vizualizatsiyasi (kuniga 10 daqiqa)' },
        desc: { en: 'Visualize a stressful situation and rehearse staying calm, empathetic, and clear-headed.', ru: 'Представьте стрессовую ситуацию и отрепетируйте спокойствие, эмпатию и ясность мышления.', uz: 'Stressli vaziyatni tasavvur qiling va xotirjam, hamdard va tiniq fikrli qolishni mashq qiling.' },
        fields: [
          { id: 'breath', t: 'breathing', pattern: 'calm478', target: 1 },
          { id: 'done', t: 'check', label: { en: 'Visualization completed', ru: 'Визуализация выполнена', uz: 'Vizualizatsiya bajarildi' } },
          { id: 'scene', t: 'textarea', label: { en: 'What situation did you rehearse?', ru: 'Какую ситуацию вы репетировали?', uz: 'Qaysi vaziyatni mashq qildingiz?' }, ph: { en: 'I rehearsed staying calm in the situation where…', ru: 'Я репетировал(а) спокойствие в ситуации, где…', uz: 'Men shu vaziyatda xotirjam qolishni mashq qildim:…' } },
        ],
      },
      {
        id: 'gratitude',
        title: { en: 'Gratitude Reframe (evening)', ru: 'Рефрейминг благодарности (вечером)', uz: 'Minnatdorlik bilan qayta talqin (kechqurun)' },
        desc: { en: 'Write 3 things that frustrated you today — and then one silver lining or lesson from each.', ru: 'Запишите 3 вещи, которые вас сегодня расстроили, — и по одному плюсу или уроку из каждой.', uz: 'Bugun sizni ranjitgan 3 narsani yozing — soʻng har biridan bittadan yaxshi tomon yoki saboq toping.' },
        fields: [
          { id: 'fr1', t: 'text', label: { en: 'Frustration 1', ru: 'Разочарование 1', uz: 'Koʻngilsizlik 1' }, ph: { en: 'I was frustrated by…', ru: 'Меня расстроило…', uz: 'Meni ranjitgani —…' } },
          { id: 'ls1', t: 'text', ph: { en: 'The lesson is…', ru: 'Урок в том, что…', uz: 'Saboq shuki,…' } },
          { id: 'fr2', t: 'text', label: { en: 'Frustration 2', ru: 'Разочарование 2', uz: 'Koʻngilsizlik 2' }, ph: { en: 'I was frustrated by…', ru: 'Меня расстроило…', uz: 'Meni ranjitgani —…' } },
          { id: 'ls2', t: 'text', ph: { en: 'The lesson is…', ru: 'Урок в том, что…', uz: 'Saboq shuki,…' } },
          { id: 'fr3', t: 'text', label: { en: 'Frustration 3', ru: 'Разочарование 3', uz: 'Koʻngilsizlik 3' }, ph: { en: 'I was frustrated by…', ru: 'Меня расстроило…', uz: 'Meni ranjitgani —…' } },
          { id: 'ls3', t: 'text', ph: { en: 'The lesson is…', ru: 'Урок в том, что…', uz: 'Saboq shuki,…' } },
        ],
      },
      {
        id: 'intention',
        title: { en: 'Morning Intention-Setting (2 min)', ru: 'Утреннее намерение (2 мин)', uz: 'Ertalabki niyat (2 daqiqa)' },
        desc: { en: 'Ask: “How do I want to show up today — regardless of what happens?”', ru: 'Спросите: «Каким я хочу быть сегодня — что бы ни случилось?»', uz: 'Soʻrang: «Nima boʻlishidan qatʼi nazar, bugun qanday inson boʻlishni xohlayman?»' },
        fields: [
          { id: 'intent', t: 'text', label: { en: 'Morning intention', ru: 'Утреннее намерение', uz: 'Ertalabki niyat' }, ph: { en: 'Today I want to show up…', ru: 'Сегодня я хочу быть…', uz: 'Bugun men shunday boʻlishni xohlayman:…' } },
        ],
      },
    ],
  },
  {
    id: 'w3',
    days: [15, 21],
    color: '#5c4632',
    title: { en: 'Week 3 · Understand Others — Social Awareness', ru: 'Неделя 3 · Понимание других — Социальная осознанность', uz: '3-hafta · Boshqalarni tushunish — Ijtimoiy sezgirlik' },
    quote: {
      en: '“Emotional empathy is an immediate felt sense of what’s going on in the other person.” — Daniel Goleman',
      ru: '«Эмпатия… является основным человеческим даром.» — Дэниел Гоулман, «Эмоциональный интеллект»',
      uz: '«Hissiy empatiya — boshqa insonda nima kechayotganini shu zahoti his etishdir.» — Daniel Goleman',
    },
    intro: { en: 'Learn to sense what others feel — before they say a word.', ru: 'Научитесь чувствовать, что переживают другие, — ещё до слов.', uz: 'Boshqalar nimani his qilayotganini — ular soʻz aytmasidan oldin sezishni oʻrganing.' },
    goal: { en: 'By Day 21: sense emotions in others before they say a word. Make people feel seen.', ru: 'К 21-му дню: чувствовать эмоции других до слов. Давать людям ощущение, что их видят.', uz: '21-kunga qadar: boshqalarning his-tuygʻularini soʻzlardan oldin sezasiz. Odamlarga oʻzlarini koʻrilgandek his qildirasiz.' },
    practices: [
      {
        id: 'empathy',
        title: { en: 'Empathy Practice (1 conversation/day)', ru: 'Практика эмпатии (1 разговор в день)', uz: 'Empatiya amaliyoti (kuniga 1 suhbat)' },
        desc: { en: 'Drop your internal monologue. Be fully present in one interaction. Reflect back what the other person is feeling, not just what they said.', ru: 'Отключите внутренний монолог. Будьте полностью присутствующим в одном разговоре. Отразите, что человек чувствует, а не только что он сказал.', uz: 'Ichki monologni oʻchiring. Bitta suhbatda toʻliq hozir boʻling. Suhbatdosh nima deganini emas, nimani his qilayotganini aks ettiring.' },
        fields: [
          { id: 'with', t: 'text', label: { en: 'Who was it?', ru: 'С кем это было?', uz: 'Kim bilan boʻldi?' }, ph: { en: 'I was fully present with…', ru: 'Я был(а) полностью присутствующим с…', uz: 'Men toʻliq hozir boʻlgan suhbatdoshim —…' } },
          { id: 'felt', t: 'textarea', label: { en: 'What were they feeling?', ru: 'Что чувствовал собеседник?', uz: 'U nimani his qilayotgan edi?' }, ph: { en: 'I sensed they felt…', ru: 'Я почувствовал(а), что он(а) испытывает…', uz: 'Sezishimcha, uning his qilgani —…' } },
        ],
      },
      {
        id: 'nonverbal',
        title: { en: 'Observe Non-Verbal Cues', ru: 'Наблюдение невербальных сигналов', uz: 'Noverbal signallarni kuzatish' },
        desc: { en: 'In every conversation: What’s their tone? What’s their body saying? What’s unsaid?', ru: 'В каждом разговоре: Какой у собеседника тон? Что говорит его тело? Что осталось невысказанным?', uz: 'Har suhbatda: Suhbatdoshning ohangi qanday? Tanasi nima deyapti? Nima aytilmay qoldi?' },
        fields: [
          { id: 'tone', t: 'text', label: { en: 'Tone', ru: 'Тон', uz: 'Ohang' }, ph: { en: 'Their tone was…', ru: 'Тон собеседника был…', uz: 'Suhbatdosh ohangi —…' } },
          { id: 'body', t: 'text', label: { en: 'Body language', ru: 'Язык тела', uz: 'Tana tili' }, ph: { en: 'Their body said…', ru: 'Тело говорило…', uz: 'Tanasining aytgani —…' } },
          { id: 'unsaid', t: 'text', label: { en: 'The unsaid', ru: 'Невысказанное', uz: 'Aytilmagani' }, ph: { en: 'What stayed unsaid was…', ru: 'Невысказанным осталось…', uz: 'Aytilmay qolgani —…' } },
        ],
      },
      {
        id: 'otherlens',
        title: { en: '“Other Lens” Journaling', ru: 'Дневник «Чужая оптика»', uz: '«Oʻzga nigoh» kundaligi' },
        desc: { en: 'Each evening, pick a moment from the day.', ru: 'Каждый вечер выберите один момент дня.', uz: 'Har kuni kechqurun kunning bitta lahzasini tanlang.' },
        fields: [
          { id: 'felt', t: 'textarea', label: { en: 'How did the other person feel in that moment?', ru: 'Что чувствовал другой человек в тот момент?', uz: 'Oʻsha lahzada boshqa inson nimani his qildi?' }, ph: { en: 'In that moment the other person felt…', ru: 'В тот момент другой человек чувствовал…', uz: 'Oʻsha lahzada u his qilgani —…' } },
          { id: 'needs', t: 'textarea', label: { en: 'What needs might have driven their behavior?', ru: 'Какие потребности могли стоять за его поведением?', uz: 'Uning xatti-harakati ortida qanday ehtiyojlar turgan boʻlishi mumkin?' }, ph: { en: 'Their behavior may have come from a need for…', ru: 'За его поведением могла стоять потребность в…', uz: 'Uning xatti-harakati ortida turgan ehtiyoj —…' } },
        ],
      },
      {
        id: 'listening',
        title: { en: 'Mindful Listening Challenge (1 person/day)', ru: 'Челлендж осознанного слушания (1 человек в день)', uz: 'Ongli tinglash chorlovi (kuniga 1 kishi)' },
        desc: { en: 'Don’t interrupt. Don’t fix. Just listen and reflect.', ru: 'Не перебивайте. Не «чините». Просто слушайте и отражайте.', uz: 'Gapni boʻlmang. «Tuzatmang». Shunchaki tinglang va aks ettiring.' },
        fields: [
          { id: 'done', t: 'check', label: { en: 'I listened without interrupting today', ru: 'Сегодня я слушал(а), не перебивая', uz: 'Bugun gapni boʻlmasdan tingladim' } },
          { id: 'who', t: 'text', label: { en: 'Who did you listen to?', ru: 'Кого вы слушали?', uz: 'Kimni tingladingiz?' }, ph: { en: 'Today I listened without interrupting to…', ru: 'Сегодня я, не перебивая, выслушал(а)…', uz: 'Bugun gapini boʻlmasdan tinglaganim —…' } },
        ],
      },
    ],
  },
  {
    id: 'w4',
    days: [22, 30],
    color: '#9a6b93',
    title: { en: 'Week 4 · Lead with Connection — Relationship Management', ru: 'Неделя 4 · Сила связи — Управление отношениями', uz: '4-hafta · Bogʻlanish kuchi — Munosabatlarni boshqarish' },
    quote: {
      en: '“Emotions drive the quality of our relationships.” — Marc Brackett',
      ru: '«Эмоции определяют качество наших отношений.» — Марк Брэкетт',
      uz: '«His-tuygʻular munosabatlarimiz sifatini belgilaydi.» — Marc Brackett',
    },
    intro: { en: 'Bring it all together in how you connect with people.', ru: 'Соедините всё в том, как вы строите отношения с людьми.', uz: 'Hammasini odamlar bilan qanday bogʻlanishingizda jamlang.' },
    goal: { en: 'By Day 30: manage relationships with empathy and authenticity. Be the kind of person others feel safe around.', ru: 'К 30-му дню: управлять отношениями с эмпатией и подлинностью. Быть человеком, рядом с которым другим безопасно.', uz: '30-kunga qadar: munosabatlarni empatiya va samimiyat bilan boshqarasiz. Yonida boshqalar oʻzini xavfsiz his qiladigan inson boʻlasiz.' },
    practices: [
      {
        id: 'connection',
        title: { en: 'Intentional Connection (1 person/day)', ru: 'Намеренный контакт (1 человек в день)', uz: 'Ongli aloqa (kuniga 1 kishi)' },
        desc: { en: 'Reach out to someone intentionally. Ask how they’re doing. Don’t just make it about you.', ru: 'Намеренно свяжитесь с кем-то. Спросите, как у него дела. Не делайте разговор только о себе.', uz: 'Kimgadir ataylab murojaat qiling. Hol-ahvolini soʻrang. Suhbatni faqat oʻzingiz haqida qilmang.' },
        fields: [
          { id: 'who', t: 'text', label: { en: 'Who did you reach out to?', ru: 'С кем вы связались?', uz: 'Kimga murojaat qildingiz?' }, ph: { en: 'Today I intentionally reached out to…', ru: 'Сегодня я намеренно связался(ась) с…', uz: 'Bugun ataylab bogʻlanganim —…' } },
          { id: 'note', t: 'textarea', label: { en: 'How did it go?', ru: 'Как прошло?', uz: 'Qanday oʻtdi?' }, ph: { en: 'The conversation went…', ru: 'Разговор прошёл…', uz: 'Suhbat shunday oʻtdi:…' } },
        ],
      },
      {
        id: 'rehearsal',
        title: { en: 'Difficult Conversation Rehearsal', ru: 'Репетиция трудного разговора', uz: 'Qiyin suhbat mashqi' },
        desc: { en: 'Practice saying hard things with clarity, kindness, calmness. (Use a mirror or record yourself.)', ru: 'Практикуйте говорить сложные вещи с ясностью, добротой и спокойствием. (Перед зеркалом или на запись.)', uz: 'Ogʻir gaplarni aniqlik, mehr va xotirjamlik bilan aytishni mashq qiling. (Koʻzgu oldida yoki oʻzingizni yozib olib.)' },
        fields: [
          { id: 'breath', t: 'breathing', pattern: 'three' },
          { id: 'done', t: 'check', label: { en: 'I rehearsed a difficult conversation', ru: 'Я отрепетировал(а) трудный разговор', uz: 'Qiyin suhbatni mashq qildim' } },
          { id: 'topic', t: 'textarea', label: { en: 'What conversation?', ru: 'Какой разговор?', uz: 'Qanday suhbat?' }, ph: { en: 'I rehearsed saying…', ru: 'Я репетировал(а), как сказать…', uz: 'Men aytishni mashq qilganim —…' } },
          { id: 'feltLike', t: 'textarea', label: { en: 'How did it feel?', ru: 'Каково это было?', uz: 'Qanday tuyildi?' }, ph: { en: 'It felt…', ru: 'Это ощущалось…', uz: 'Bu menga shunday tuyildi:…' } },
        ],
      },
      {
        id: 'alchemy',
        title: { en: 'Conflict Alchemy Exercise', ru: 'Алхимия конфликта', uz: 'Konflikt alkimyosi' },
        desc: { en: 'Choose one recent disagreement.', ru: 'Выберите одно недавнее разногласие.', uz: 'Yaqinda boʻlgan bitta kelishmovchilikni tanlang.' },
        fields: [
          { id: 'need', t: 'textarea', label: { en: 'What was the deeper need behind their reaction?', ru: 'Какая глубинная потребность стояла за реакцией другого?', uz: 'Uning reaksiyasi ortida qanday chuqur ehtiyoj turgan edi?' }, ph: { en: 'Behind their reaction was a deeper need for…', ru: 'За его реакцией стояла глубинная потребность в…', uz: 'Uning reaksiyasi ortida turgan chuqur ehtiyoj —…' } },
          { id: 'deescalate', t: 'textarea', label: { en: 'How could I have de-escalated the situation?', ru: 'Как я мог(ла) бы деэскалировать ситуацию?', uz: 'Vaziyatni qanday yumshatishim mumkin edi?' }, ph: { en: 'I could have de-escalated it by…', ru: 'Я мог(ла) бы деэскалировать её, если бы…', uz: 'Vaziyatni yumshatishim mumkin edi, agar…' } },
        ],
      },
      {
        id: 'reljournal',
        title: { en: 'Relationship Journal', ru: 'Дневник отношений', uz: 'Munosabatlar kundaligi' },
        desc: { en: 'At the end of the day, write:', ru: 'В конце дня запишите:', uz: 'Kun oxirida yozing:' },
        fields: [
          { id: 'uplift', t: 'textarea', label: { en: 'Who did I uplift today?', ru: 'Кого я сегодня поддержал(а)?', uz: 'Bugun kimni ruhlantirdim?' }, ph: { en: 'Today I uplifted…', ru: 'Сегодня я поддержал(а)…', uz: 'Bugun ruhlantirganim —…' } },
          { id: 'present', t: 'textarea', label: { en: 'Who could I have been more present with?', ru: 'С кем я мог(ла) быть более присутствующим?', uz: 'Kim bilan koʻproq hozir boʻlishim mumkin edi?' }, ph: { en: 'I could have been more present with…', ru: 'Я мог(ла) быть более присутствующим с…', uz: 'Koʻproq hozir boʻlishim mumkin boʻlgan inson —…' } },
          { id: 'reconnect', t: 'textarea', label: { en: 'Who do I need to reconnect with?', ru: 'С кем мне нужно восстановить связь?', uz: 'Kim bilan aloqani qayta tiklashim kerak?' }, ph: { en: 'I need to reconnect with…', ru: 'Мне нужно восстановить связь с…', uz: 'Aloqani qayta tiklashim kerak boʻlgan inson —…' } },
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
    subtitle: { en: 'The Fire That Burns — or Builds', ru: 'Огонь, который сжигает — или созидает', uz: 'Kuydiradigan — yoki bunyod etadigan olov' },
    explanation: {
      en: 'Anger often masks hurt, injustice, or unmet needs. But unmanaged, it hijacks your prefrontal cortex — the part of your brain that makes wise decisions. Anger wisely channeled = Courage.',
      ru: 'Гнев часто маскирует боль, несправедливость или неудовлетворённые потребности. Неуправляемый, он захватывает префронтальную кору — ту часть мозга, что принимает мудрые решения. Мудро направленный гнев = Смелость.',
      uz: 'Gʻazab koʻpincha ogʻriq, adolatsizlik yoki qondirilmagan ehtiyojlarni yashiradi. Boshqarilmasa, u prefrontal korteksni — miyaning oqilona qarorlar qabul qiladigan qismini bosib oladi. Oqilona yoʻnaltirilgan gʻazab = Jasorat.',
    },
    steps: [
      {
        title: { en: 'Step 1 · Name it precisely', ru: 'Шаг 1 · Назовите точно', uz: '1-qadam · Aniq nomlang' },
        body: { en: 'Don’t just say “I’m angry.” Try: “I feel disrespected,” or “I feel unseen,” or “I feel powerless.” Precision defuses.', ru: 'Не говорите просто «я злюсь». Попробуйте: «я чувствую неуважение», «меня не замечают», «я бессилен». Точность обезоруживает.', uz: 'Shunchaki «jahlim chiqdi» demang. «Menga hurmatsizlik qilindi», «meni koʻrishmayapti», «oʻzimni ojiz his qilyapman» deb koʻring. Aniqlik qurolsizlantiradi.' },
      },
      {
        title: { en: 'Step 2 · The 30-Second Rule', ru: 'Шаг 2 · Правило 30 секунд', uz: '2-qadam · 30 soniya qoidasi' },
        body: { en: 'Your amygdala fires fast, but emotion chemicals dissipate in 30 seconds. Breathe deeply. Count slowly. Feel the wave rise and fall.', ru: 'Миндалина срабатывает мгновенно, но химия эмоции рассеивается за 30 секунд. Дышите глубоко. Считайте медленно. Почувствуйте, как волна поднимается и спадает.', uz: 'Amigdala bir zumda ishga tushadi, lekin his-tuygʻu kimyosi 30 soniyada tarqaladi. Chuqur nafas oling. Sekin sanang. Toʻlqin koʻtarilib, soʻng pasayishini his qiling.' },
      },
      {
        title: { en: 'Step 3 · Ask the protection question', ru: 'Шаг 3 · Вопрос о защите', uz: '3-qadam · Himoya savoli' },
        body: { en: '“What is this anger trying to protect in me?” Often, it’s your dignity, boundaries, or a core value.', ru: '«Что этот гнев пытается во мне защитить?» Часто это достоинство, границы или важная ценность.', uz: '«Bu gʻazab menda nimani himoya qilmoqchi?» Koʻpincha bu — qadr-qimmat, chegaralar yoki muhim qadriyat.' },
      },
      {
        title: { en: 'Step 4 · Redirect constructively', ru: 'Шаг 4 · Направьте конструктивно', uz: '4-qadam · Konstruktiv yoʻnaltiring' },
        body: { en: 'Anger is energy. Use it to: speak assertively, not aggressively · create boundaries, not explosions · take action, not revenge.', ru: 'Гнев — это энергия. Используйте её: говорить уверенно, а не агрессивно · выстраивать границы, а не взрываться · действовать, а не мстить.', uz: 'Gʻazab — bu energiya. Undan foydalaning: agressiv emas, dadil gapirish · portlash emas, chegara oʻrnatish · qasos emas, harakat qilish uchun.' },
      },
    ],
    practiceSteps: [
      {
        title: { en: '1 · Describe a recent anger situation', ru: '1 · Опишите недавнюю ситуацию гнева', uz: '1 · Yaqinda gʻazab uygʻotgan vaziyatni tasvirlab bering' },
        fields: [{ id: 'situation', t: 'textarea', ph: { en: 'I felt angry when…', ru: 'Я почувствовал(а) гнев, когда…', uz: 'Gʻazab his qildim, qachonki…' } }],
      },
      {
        title: { en: '2 · Name it precisely', ru: '2 · Назовите точно', uz: '2 · Aniq nomlang' },
        fields: [
          { id: 'emotion', t: 'chips', opts: [
            { k: 'disrespected', en: 'disrespected', ru: 'неуважение', uz: 'hurmatsizlik' }, { k: 'unseen', en: 'unseen', ru: 'меня не видят', uz: 'meni koʻrishmayapti' }, { k: 'powerless', en: 'powerless', ru: 'бессилие', uz: 'ojizlik' },
            { k: 'frustrated', en: 'frustrated', ru: 'фрустрация', uz: 'asabiylashish' }, { k: 'betrayed', en: 'betrayed', ru: 'предательство', uz: 'xiyonat' },
          ] },
          { id: 'intensity', t: 'slider' },
          { id: 'breathing', t: 'breathing', pattern: 'three' },
        ],
      },
      {
        title: { en: '3 · What is this anger protecting?', ru: '3 · Что защищает этот гнев?', uz: '3 · Bu gʻazab nimani himoya qilyapti?' },
        fields: [
          { id: 'protectQuick', t: 'chips-multi', opts: [
            { k: 'dignity', en: 'Dignity', ru: 'Достоинство', uz: 'Qadr-qimmat' }, { k: 'boundaries', en: 'Boundaries', ru: 'Границы', uz: 'Chegaralar' }, { k: 'coreValues', en: 'Core values', ru: 'Ценности', uz: 'Qadriyatlar' },
            { k: 'safety', en: 'Safety', ru: 'Безопасность', uz: 'Xavfsizlik' }, { k: 'identity', en: 'Identity', ru: 'Идентичность', uz: 'Oʻzlik' },
          ] },
          { id: 'protecting', t: 'textarea', ph: { en: 'This anger is protecting my…', ru: 'Этот гнев защищает мои…', uz: 'Bu gʻazab himoya qilayotgani — mening…' } },
        ],
      },
      {
        title: { en: '4 · How can you redirect this energy?', ru: '4 · Как направить эту энергию?', uz: '4 · Bu energiyani qanday yoʻnaltirasiz?' },
        fields: [
          { id: 'redirect', t: 'checks', opts: [
            { k: 'speakAssertively', en: 'Speak assertively', ru: 'Говорить уверенно', uz: 'Dadil gapirish' }, { k: 'createBoundaries', en: 'Create boundaries', ru: 'Выстроить границы', uz: 'Chegara oʻrnatish' }, { k: 'constructiveAction', en: 'Take constructive action', ru: 'Действовать конструктивно', uz: 'Konstruktiv harakat qilish' },
          ] },
          { id: 'plan', t: 'textarea', ph: { en: 'My action plan is…', ru: 'Мой план действий…', uz: 'Harakat rejam —…' } },
        ],
      },
    ],
    journalFields: ['situation', 'protecting', 'plan'],
  },
  shame: {
    color: '#5c4632',
    colorSoft: '#f2ede7',
    subtitle: { en: 'The Silent Saboteur', ru: 'Тихий саботажник', uz: 'Sokin buzgʻunchi' },
    explanation: {
      en: 'Shame says “I am bad.” It’s different from guilt, which says “I did something bad.” Shame can freeze us — emotionally and neurologically. It shrinks empathy, creativity, and connection. Shame loses power in the presence of empathy.',
      ru: 'Стыд говорит: «Я плохой». Это не вина, которая говорит: «Я сделал что-то плохое». Стыд замораживает нас — эмоционально и нейрологически. Он сжимает эмпатию, творчество и близость. Стыд теряет силу в присутствии эмпатии.',
      uz: 'Uyat «Men yomonman» deydi. Bu aybdorlik hissidan farq qiladi — aybdorlik «Men yomon ish qildim» deydi. Uyat bizni hissiy va neyrologik jihatdan qotirib qoʻyishi mumkin. U empatiya, ijodkorlik va yaqinlikni toraytiradi. Empatiya borida uyat kuchini yoʻqotadi.',
    },
    steps: [
      {
        title: { en: 'Step 1 · Identify the inner critic’s voice', ru: 'Шаг 1 · Голос внутреннего критика', uz: '1-qadam · Ichki tanqidchi ovozini aniqlang' },
        body: { en: 'What’s the exact phrase your mind is repeating? (“I’m not good enough,” “They’ll reject me.”)', ru: 'Какую точную фразу повторяет ваш ум? («Я недостаточно хорош», «Меня отвергнут».)', uz: 'Ongingiz qaysi aniq iborani takrorlayapti? («Men yetarlicha yaxshi emasman», «Meni rad etishadi».)' },
      },
      {
        title: { en: 'Step 2 · Activate self-compassion', ru: 'Шаг 2 · Включите сострадание к себе', uz: '2-qadam · Oʻzingizga mehrni yoqing' },
        body: { en: 'Treat yourself like you would a dear friend: “Yes, I made a mistake. But I am still worthy. I can learn. I can grow.”', ru: 'Отнеситесь к себе как к близкому другу: «Да, я ошибся. Но я по-прежнему ценен. Я могу учиться. Я могу расти».', uz: 'Oʻzingizga aziz doʻstingizga boʻlgandek munosabatda boʻling: «Ha, men xato qildim. Lekin men baribir qadrliman. Oʻrgana olaman. Oʻsa olaman».' },
      },
      {
        title: { en: 'Step 3 · Replace judgment with curiosity', ru: 'Шаг 3 · Замените осуждение любопытством', uz: '3-qadam · Hukmni qiziqish bilan almashtiring' },
        body: { en: 'Ask: “What unmet need is this shame revealing?” Often: acceptance, connection, achievement.', ru: 'Спросите: «Какую неудовлетворённую потребность обнажает этот стыд?» Часто: принятие, близость, достижение.', uz: 'Soʻrang: «Bu uyat qaysi qondirilmagan ehtiyojni ochib beryapti?» Koʻpincha: qabul qilinish, yaqinlik, yutuq.' },
      },
      {
        title: { en: 'Step 4 · Speak it out loud (to someone safe)', ru: 'Шаг 4 · Произнесите вслух (безопасному человеку)', uz: '4-qadam · Ovoz chiqarib ayting (ishonchli insonga)' },
        body: { en: 'Shame thrives in secrecy. Share it with someone who listens without fixing or judging. That alone deflates it.', ru: 'Стыд живёт в секретности. Поделитесь с тем, кто слушает без советов и осуждения. Уже одно это его сдувает.', uz: 'Uyat sir saqlanganda kuchayadi. Tuzatmasdan va hukm qilmasdan tinglaydigan inson bilan boʻlishing. Shuning oʻzi uni kuchsizlantiradi.' },
      },
    ],
    practiceSteps: [
      {
        title: { en: '1 · Identify your inner critic’s voice', ru: '1 · Определите голос внутреннего критика', uz: '1 · Ichki tanqidchingiz ovozini aniqlang' },
        fields: [
          { id: 'critic', t: 'textarea', ph: { en: 'My inner critic says…', ru: 'Мой внутренний критик говорит…', uz: 'Ichki tanqidchim shunday deydi:…' } },
          { id: 'intensity', t: 'slider' },
        ],
      },
      {
        title: { en: '2 · Activate self-compassion', ru: '2 · Включите сострадание к себе', uz: '2 · Oʻzingizga mehrni yoqing' },
        hint: { en: 'Rewrite the critic’s phrase with compassion:', ru: 'Перепишите фразу критика с состраданием:', uz: 'Tanqidchi iborasini mehr bilan qayta yozing:' },
        fields: [
          { id: 'breathing', t: 'breathing', pattern: 'three' },
          { id: 'compassion', t: 'textarea', ph: { en: 'The truth is, I am still worthy because…', ru: 'На самом деле я по-прежнему ценен, потому что…', uz: 'Aslida men baribir qadrliman, chunki…' } },
        ],
      },
      {
        title: { en: '3 · What unmet need is this revealing?', ru: '3 · Какую потребность это обнажает?', uz: '3 · Bu qaysi ehtiyojni ochib beryapti?' },
        fields: [
          { id: 'needQuick', t: 'chips-multi', opts: [
            { k: 'acceptance', en: 'Acceptance', ru: 'Принятие', uz: 'Qabul qilinish' }, { k: 'connection', en: 'Connection', ru: 'Близость', uz: 'Yaqinlik' }, { k: 'achievement', en: 'Achievement', ru: 'Достижение', uz: 'Yutuq' },
            { k: 'belonging', en: 'Belonging', ru: 'Принадлежность', uz: 'Mansublik' }, { k: 'recognition', en: 'Recognition', ru: 'Признание', uz: 'Eʼtirof' },
          ] },
          { id: 'need', t: 'textarea', ph: { en: 'I realize I need…', ru: 'Я понимаю, что мне нужно…', uz: 'Tushunyapmanki, menga kerak boʻlgani —…' } },
        ],
      },
      {
        title: { en: '4 · Share it', ru: '4 · Поделитесь', uz: '4 · Boʻlishing' },
        fields: [
          { id: 'shared', t: 'check', label: { en: 'I’ve shared this with someone safe', ru: 'Я поделился(ась) этим с безопасным человеком', uz: 'Buni ishonchli inson bilan boʻlishdim' } },
          { id: 'sharedNote', t: 'textarea', optional: true, ph: { en: 'When I shared it, I felt…', ru: 'Когда я поделился(ась), я почувствовал(а)…', uz: 'Boʻlishganimda his qilganim —…' } },
        ],
      },
    ],
    journalFields: ['critic', 'compassion', 'need'],
  },
  fear: {
    color: '#565a2b',
    colorSoft: '#eff0e6',
    subtitle: { en: 'The Ancient Protector', ru: 'Древний защитник', uz: 'Qadimiy himoyachi' },
    explanation: {
      en: 'Fear evolved to keep us alive. But modern fear is often not about survival — it’s about ego, failure, rejection. Fear hijacks the brain’s reasoning center and narrows attention. Courage is fear transformed by purpose.',
      ru: 'Страх появился, чтобы сохранить нам жизнь. Но современный страх чаще не о выживании — он об эго, неудаче, отвержении. Страх захватывает центр рассуждений мозга и сужает внимание. Смелость — это страх, преображённый смыслом.',
      uz: 'Qoʻrquv bizni tirik saqlash uchun paydo boʻlgan. Lekin zamonaviy qoʻrquv koʻpincha omon qolish haqida emas — u ego, muvaffaqiyatsizlik, rad etilish haqida. Qoʻrquv miyaning fikrlash markazini bosib oladi va diqqatni toraytiradi. Jasorat — bu maqsad bilan oʻzgartirilgan qoʻrquv.',
    },
    steps: [
      {
        title: { en: 'Step 1 · Separate real from imagined threat', ru: 'Шаг 1 · Отделите реальную угрозу от воображаемой', uz: '1-qadam · Haqiqiy tahdidni xayoliysidan ajrating' },
        body: { en: 'Ask: “Is this danger physical, or emotional?” “Is this fear helping me or paralyzing me?”', ru: 'Спросите: «Эта опасность физическая или эмоциональная?» «Этот страх помогает мне или парализует?»', uz: 'Soʻrang: «Bu xavf jismoniymi yoki hissiymi?» «Bu qoʻrquv menga yordam beryaptimi yoki meni qotirib qoʻyyaptimi?»' },
      },
      {
        title: { en: 'Step 2 · Ground yourself physically', ru: 'Шаг 2 · Заземлитесь физически', uz: '2-qadam · Jismonan zaminlaning' },
        body: { en: 'Deep belly breathing (4-7-8 technique) · press your feet into the floor · name 5 things you can see or feel. This tells the brain: you are safe now.', ru: 'Глубокое дыхание животом (техника 4-7-8) · прижмите стопы к полу · назовите 5 вещей, которые видите или ощущаете. Это говорит мозгу: сейчас ты в безопасности.', uz: 'Qorin bilan chuqur nafas olish (4-7-8 texnikasi) · oyoqlaringizni polga bosing · koʻrayotgan yoki his qilayotgan 5 narsani nomlang. Bu miyaga aytadi: endi xavfsizsan.' },
      },
      {
        title: { en: 'Step 3 · Reframe the narrative', ru: 'Шаг 3 · Переосмыслите историю', uz: '3-qadam · Hikoyani qayta talqin qiling' },
        body: { en: '“What does this fear say about what matters deeply to me?” Fear often signals where your values, hopes, or purpose live.', ru: '«Что этот страх говорит о том, что мне по-настоящему важно?» Страх часто указывает, где живут ваши ценности, надежды и смысл.', uz: '«Bu qoʻrquv men uchun chindan muhim narsa haqida nima deydi?» Qoʻrquv koʻpincha qadriyatlaringiz, umidlaringiz va maqsadingiz qayerda yashashini koʻrsatadi.' },
      },
      {
        title: { en: 'Step 4 · Take a micro-brave step', ru: 'Шаг 4 · Сделайте микро-смелый шаг', uz: '4-qadam · Mikro-jasur qadam qoʻying' },
        body: { en: 'Fear shrinks when we act. Not big leaps — small, repeated steps.', ru: 'Страх уменьшается, когда мы действуем. Не гигантские прыжки — маленькие, повторяющиеся шаги.', uz: 'Harakat qilganimizda qoʻrquv kichrayadi. Katta sakrashlar emas — kichik, takrorlanadigan qadamlar.' },
      },
    ],
    practiceSteps: [
      {
        title: { en: '1 · Separate real from imagined threat', ru: '1 · Реальная угроза или воображаемая?', uz: '1 · Haqiqiy tahdidmi yoki xayoliymi?' },
        fields: [
          { id: 'threat', t: 'radio', opts: [
            { k: 'physical', en: 'Physical danger', ru: 'Физическая опасность', uz: 'Jismoniy xavf' }, { k: 'emotional', en: 'Emotional discomfort', ru: 'Эмоциональный дискомфорт', uz: 'Hissiy noqulaylik' }, { k: 'ego', en: 'Ego threat', ru: 'Угроза эго', uz: 'Egoga tahdid' },
          ] },
          { id: 'about', t: 'textarea', ph: { en: 'This fear is about…', ru: 'Этот страх — о…', uz: 'Bu qoʻrquv shu haqda:…' } },
          { id: 'intensity', t: 'slider' },
        ],
      },
      {
        title: { en: '2 · Ground yourself physically', ru: '2 · Заземлитесь физически', uz: '2 · Jismonan zaminlaning' },
        fields: [
          { id: 'breathing', t: 'breathing', pattern: 'calm478' },
          { id: 'grounding', t: 'inputs5', label: { en: 'Grounding checklist: name 5 things you see', ru: 'Заземление: назовите 5 вещей, которые видите', uz: 'Zaminlanish: koʻrayotgan 5 narsangizni nomlang' }, ph: { en: 'I see…', ru: 'Я вижу…', uz: 'Men koʻryapman:…' } },
        ],
      },
      {
        title: { en: '3 · Reframe the narrative', ru: '3 · Переосмыслите историю', uz: '3 · Hikoyani qayta talqin qiling' },
        fields: [{ id: 'reframe', t: 'textarea', ph: { en: 'This fear shows that I deeply care about…', ru: 'Этот страх показывает, что мне глубоко важно…', uz: 'Bu qoʻrquv koʻrsatadiki, men uchun chuqur muhim boʻlgani —…' } }],
      },
      {
        title: { en: '4 · Your micro-brave step', ru: '4 · Ваш микро-смелый шаг', uz: '4 · Sizning mikro-jasur qadamingiz' },
        fields: [
          { id: 'brave', t: 'textarea', ph: { en: 'One small action I can take today is…', ru: 'Один маленький шаг, который я могу сделать сегодня…', uz: 'Bugun qila oladigan bitta kichik harakatim —…' } },
          { id: 'took', t: 'check', label: { en: 'I took this step', ru: 'Я сделал(а) этот шаг', uz: 'Bu qadamni bajardim' } },
        ],
      },
    ],
    journalFields: ['about', 'reframe', 'brave'],
  },
  envy: {
    color: '#9a6b93',
    colorSoft: '#f4edf3',
    subtitle: { en: 'The Hidden Compass', ru: 'Скрытый компас', uz: 'Yashirin kompas' },
    explanation: {
      en: 'Envy signals that someone has something you deeply want — status, skill, love, freedom. It often masks quiet self-criticism and constant comparison. Heard as information, it becomes a compass pointing at your own unmet wants. Envy heard clearly = Direction.',
      ru: 'Зависть сигналит: у другого есть то, чего вы глубоко хотите, — статус, умение, любовь, свобода. Часто она маскирует тихую самокритику и постоянное сравнение. Услышанная как информация, она становится компасом, указывающим на ваши собственные желания. Ясно услышанная зависть = Направление.',
      uz: 'Hasad signal beradi: boshqa insonda siz chuqur istagan narsa bor — maqom, mahorat, muhabbat, erkinlik. U koʻpincha jimgina oʻz-oʻzini tanqid va doimiy taqqoslashni yashiradi. Axborot sifatida eshitilsa, u oʻz istaklaringizga yoʻnaltirilgan kompasga aylanadi. Aniq eshitilgan hasad = Yoʻnalish.',
    },
    steps: [
      {
        title: { en: 'Step 1 · Name it precisely', ru: 'Шаг 1 · Назовите точно', uz: '1-qadam · Aniq nomlang' },
        body: { en: 'Is this envy — wanting what another has — or jealousy, fear of losing what is yours? Precision defuses.', ru: 'Это зависть — желание того, что есть у другого, — или ревность, страх потерять своё? Точность обезоруживает.', uz: 'Bu hasadmi — boshqadagi narsani istash — yoki rashkmi, oʻzingiznikini yoʻqotish qoʻrquvi? Aniqlik qurolsizlantiradi.' },
      },
      {
        title: { en: 'Step 2 · Catch the comparison', ru: 'Шаг 2 · Поймайте сравнение', uz: '2-qadam · Taqqoslashni tuting' },
        body: { en: 'Notice the story — “they have it easy”, “I’m behind”. Comparison sets another person’s highlight reel against your full picture. Separate the story from the facts.', ru: 'Заметьте историю: «им легко досталось», «я отстаю». Сравнение ставит чужую витрину против вашей полной картины. Отделите историю от фактов.', uz: 'Hikoyani payqang: «ularga oson», «men ortda qolyapman». Taqqoslash boshqaning koʻrgazma tomonini sizning toʻliq manzarangiz bilan yonma-yon qoʻyadi. Hikoyani faktlardan ajrating.' },
      },
      {
        title: { en: 'Step 3 · Ask the signal question', ru: 'Шаг 3 · Вопрос о сигнале', uz: '3-qadam · Signal savoli' },
        body: { en: '“What exactly do I want that they have? What does this envy say I value?”', ru: '«Чего именно я хочу из того, что есть у них? О какой моей ценности говорит эта зависть?»', uz: '«Ulardagi aynan nimani istayman? Bu hasad qaysi qadriyatim haqida gapiryapti?»' },
      },
      {
        title: { en: 'Step 4 · Turn it into direction', ru: 'Шаг 4 · Превратите её в направление', uz: '4-qadam · Uni yoʻnalishga aylantiring' },
        body: { en: 'Envy is a want without a plan. Use it to: learn from the person you envy · take one concrete step toward what you want · name what you already have. Movement, not comparison.', ru: 'Зависть — это желание без плана. Используйте её: поучиться у того, кому завидуете · сделать один конкретный шаг к желаемому · назвать то, что у вас уже есть. Движение, а не сравнение.', uz: 'Hasad — bu rejasiz istak. Undan foydalaning: hasad qilgan insoningizdan oʻrganish · istagan narsangiz sari bitta aniq qadam qoʻyish · sizda bor narsani nomlash uchun. Taqqoslash emas, harakat.' },
      },
    ],
    practiceSteps: [
      {
        title: { en: '1 · Describe a recent envy situation', ru: '1 · Опишите недавнюю ситуацию зависти', uz: '1 · Yaqinda hasad uygʻotgan vaziyatni tasvirlab bering' },
        fields: [{ id: 'situation', t: 'textarea', ph: { en: 'I felt envious when…', ru: 'Я почувствовал(а) зависть, когда…', uz: 'Hasad his qildim, qachonki…' } }],
      },
      {
        title: { en: '2 · Name it precisely', ru: '2 · Назовите точно', uz: '2 · Aniq nomlang' },
        fields: [
          { id: 'emotion', t: 'chips', opts: [
            { k: 'resentful', en: 'resentful', ru: 'обида', uz: 'alam' }, { k: 'inadequate', en: 'inadequate', ru: 'я недостаточно хорош(а)', uz: 'oʻzimni yetarli emasdek his qilish' }, { k: 'longing', en: 'longing', ru: 'сильное желание', uz: 'kuchli istak' },
            { k: 'bitter', en: 'bitter', ru: 'горечь', uz: 'achchiq tuygʻu' }, { k: 'inspired', en: 'inspired', ru: 'вдохновение', uz: 'ilhom' },
          ] },
          { id: 'intensity', t: 'slider' },
          { id: 'breathing', t: 'breathing', pattern: 'three' },
        ],
      },
      {
        title: { en: '3 · What is it pointing at?', ru: '3 · На что она указывает?', uz: '3 · U nimaga ishora qilyapti?' },
        fields: [
          { id: 'wantQuick', t: 'chips-multi', opts: [
            { k: 'recognition', en: 'Recognition', ru: 'Признание', uz: 'Eʼtirof' }, { k: 'achievement', en: 'Achievement', ru: 'Достижение', uz: 'Yutuq' }, { k: 'freedom', en: 'Freedom', ru: 'Свобода', uz: 'Erkinlik' },
            { k: 'mastery', en: 'Mastery', ru: 'Мастерство', uz: 'Mahorat' }, { k: 'love', en: 'Love', ru: 'Любовь', uz: 'Muhabbat' },
          ] },
          { id: 'want', t: 'textarea', ph: { en: 'What I actually want is…', ru: 'На самом деле я хочу…', uz: 'Aslida istaganim —…' } },
        ],
      },
      {
        title: { en: '4 · Turn it into direction', ru: '4 · Превратите её в направление', uz: '4 · Uni yoʻnalishga aylantiring' },
        fields: [
          { id: 'redirect', t: 'checks', opts: [
            { k: 'learnFromThem', en: 'Learn from the person I envy', ru: 'Поучиться у того, кому завидую', uz: 'Hasad qilganimdan oʻrganish' }, { k: 'oneStep', en: 'Take one step toward what I want', ru: 'Сделать один шаг к желаемому', uz: 'Istagim sari bir qadam qoʻyish' }, { k: 'gratitude', en: 'Name what I already have', ru: 'Назвать то, что у меня уже есть', uz: 'Menda bor narsani nomlash' },
          ] },
          { id: 'plan', t: 'textarea', ph: { en: 'My action plan is…', ru: 'Мой план действий…', uz: 'Harakat rejam —…' } },
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
  { id: 'angerAlchemist', need: 10, scope: 'anger', name: { en: 'Anger Alchemist', ru: 'Алхимик гнева', uz: 'Gʻazab alkimyogari' }, desc: { en: '10 anger practices', ru: '10 практик с гневом', uz: '10 ta gʻazab amaliyoti' } },
  { id: 'shameShifter', need: 10, scope: 'shame', name: { en: 'Shame Shifter', ru: 'Преобразователь стыда', uz: 'Uyatni oʻzgartiruvchi' }, desc: { en: '10 shame practices', ru: '10 практик со стыдом', uz: '10 ta uyat amaliyoti' } },
  { id: 'fearFacer', need: 10, scope: 'fear', name: { en: 'Fear Facer', ru: 'Лицом к страху', uz: 'Qoʻrquv bilan yuzma-yuz' }, desc: { en: '10 fear practices', ru: '10 практик со страхом', uz: '10 ta qoʻrquv amaliyoti' } },
  { id: 'envyNavigator', need: 10, scope: 'envy', name: { en: 'Envy Navigator', ru: 'Навигатор зависти', uz: 'Hasad navigatori' }, desc: { en: '10 envy practices', ru: '10 практик с завистью', uz: '10 ta hasad amaliyoti' } },
  { id: 'emotionMaster', need: 30, scope: 'total', name: { en: 'Emotion Master', ru: 'Мастер эмоций', uz: 'His-tuygʻular ustasi' }, desc: { en: '30 total practices across all emotions', ru: '30 практик по всем эмоциям', uz: 'Barcha his-tuygʻular boʻyicha jami 30 ta amaliyot' } },
]
