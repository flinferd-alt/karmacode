import { useState, useEffect } from "react";
import { getKarmaData, KarmaCodeData } from "./data/karmaCodes";
import YearLessonPage from "./pages/YearLessonPage";
import KarmicConnectionPage from "./pages/KarmicConnectionPage";
import KarmaTriangle from "./components/KarmaTriangle";
import CodeImage from "./components/CodeImage";

// ============================================
// 📅 ДАТЫ ЭФИРОВ — МЕНЯТЬ ЗДЕСЬ
// Формат: { date: "дата для отображения", time: "время для отображения", topic: "тема", 
//          startDate: "YYYY-MM-DD", startTime: "HH:MM", duration: длительность в минутах }
// ============================================
const EVENT_DATES = [
  { 
    date: "20 сентября", 
    time: "18:00 МСК", 
    topic: "Разбор кодов кармы",
    startDate: "2026-09-20",
    startTime: "18:00",
    duration: 90
  },
  { 
    date: "21 сентября", 
    time: "20:00 МСК", 
    topic: "Практики активации кодов",
    startDate: "2026-09-21",
    startTime: "20:00",
    duration: 90
  },
  { 
    date: "23 сентября", 
    time: "20:00 МСК", 
    topic: "Индивидуальные разборы",
    startDate: "2026-09-23",
    startTime: "20:00",
    duration: 90
  },
];
// ============================================

function App() {
  const [code1, setCode1] = useState<string>("");
  const [code2, setCode2] = useState<string>("");
  const [code3, setCode3] = useState<string>("");
  const [code4, setCode4] = useState<string>("");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [trianglePosition, setTrianglePosition] = useState<string>("karmaCode1"); // Позиция кода в треугольнике
  const [showEvents, setShowEvents] = useState(false);
  const [currentPage, setCurrentPage] = useState<"main" | "lesson" | "calculator">("main");
  const [lessonCode, setLessonCode] = useState<number>(1);

  useEffect(() => {
    // Читаем параметры из URL (отправляет Автопилот)
    // Поддерживаем два формата:
    // 1. Query: ?code1=2&code2=1&code3=4&code4=3
    // 2. Hash: #code1=2&code2=1&code3=4&code4=3
    const queryParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
    
    const c1 = queryParams.get("code1") || hashParams.get("code1") || "";
    const c2 = queryParams.get("code2") || hashParams.get("code2") || "";
    const c3 = queryParams.get("code3") || hashParams.get("code3") || "";
    const c4 = queryParams.get("code4") || hashParams.get("code4") || "";
    
    // Проверяем параметры lesson и calc
    const lesson = queryParams.get("lesson") || hashParams.get("lesson");
    const calc = queryParams.get("calc") || hashParams.get("calc");
    
    if (lesson) {
      setLessonCode(parseInt(lesson) || 1);
      setCurrentPage("lesson");
      return;
    }
    
    if (calc === "1") {
      setCurrentPage("calculator");
      return;
    }
    
    // Если есть параметры — используем их
    if (c1 || c2 || c3 || c4) {
      setCode1(c1);
      setCode2(c2);
      setCode3(c3);
      setCode4(c4);
    } else {
      // Иначе проверяем localStorage
      const stored = localStorage.getItem("karmaCodes");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (data.code1 || data.code2 || data.code3 || data.code4) {
            setCode1(data.code1 || "");
            setCode2(data.code2 || "");
            setCode3(data.code3 || "");
            setCode4(data.code4 || "");
            return;
          }
        } catch (e) { /* ignore */ }
      }
      // Демо-режим с тестовыми данными
      setCode1("2");
      setCode2("1");
      setCode3("4");
      setCode4("3");
    }
  }, []);

  const codes = [code1, code2, code3, code4].filter(Boolean);
  const hasCodes = codes.length > 0;

  const handleCodeClick = (code: string | number, position: string = "karmaCode1") => {
    setCurrentPage("main");
    setSelectedCode(String(code));
    setTrianglePosition(position);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedCode(null);
    setCurrentPage("main");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToLesson = () => {
    setCurrentPage("lesson");
    setLessonCode(parseInt(code1) || 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Специальная функция для клика по коду из урока года
  const handleCodeClickFromLesson = (code: number) => {
    handleCodeClick(code, "yearLesson");
  };

  const handleGoToCalculator = () => {
    setCurrentPage("calculator");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Страница "Урок года"
  if (currentPage === "lesson") {
    return <YearLessonPage lessonCode={lessonCode} onBack={handleBack} onCodeClick={handleCodeClickFromLesson} />;
  }

  // Страница "Калькулятор кармической связи"
  if (currentPage === "calculator") {
    return <KarmicConnectionPage onBack={handleBack} onCodeClick={handleCodeClick} onGoToLesson={handleGoToLesson} onGoToCalculator={handleGoToCalculator} />;
  }

  // Экран с описанием конкретного кода
  if (selectedCode) {
    const data = getKarmaData(selectedCode);
    return <CodeDetail code={selectedCode} data={data} onBack={handleBack} trianglePosition={trianglePosition} />;
  }

  // Главная страница
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] text-white relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="stars-bg" />
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ffd700] via-[#ff69b4] to-[#9b59b6] bg-clip-text text-transparent">
            Коды Кармы
          </h1>
          <p className="text-[#e8d5f5] mt-3 text-base md:text-lg leading-relaxed">
            Ваш персональный разбор энергий
          </p>
        </header>

        {/* Краткое описание системы */}
        <section className="glass-card p-6 mb-8 animate-fade-in-delay">
          <h2 className="text-xl font-semibold text-[#ffd700] mb-3 flex items-center gap-2">
            <span>🔮</span> О системе
          </h2>
          <p className="text-[#e8d5f5] leading-relaxed text-sm md:text-base">
            Коды Кармы — это числовые вибрации, которые определяют вашу судьбу, 
            характер и жизненные задачи. Каждый код несёт свою уникальную энергию, 
            сильные стороны и кармические уроки.
          </p>
          <p className="text-[#e8d5f5] leading-relaxed text-sm md:text-base mt-3">
            Ниже представлены <strong className="text-[#ff69b4]">4 ключевых кода</strong> (КЛК), 
            рассчитанные по вашей дате рождения. Нажмите на любой код, чтобы узнать 
            его подробное описание, кармические задачи и рекомендации.
          </p>
        </section>

        {/* Кода клиента */}
        {hasCodes ? (
          <section className="mb-8 animate-fade-in-delay-2">
            <h2 className="text-xl font-semibold text-center text-[#ffd700] mb-5">
              Ваши коды
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {code1 && <CodeButton code={code1} label="1 КЛК" onClick={() => handleCodeClick(code1, "karmaCode1")} />}
              {code2 && <CodeButton code={code2} label="2 КЛК" onClick={() => handleCodeClick(code2, "karmaCode2")} />}
              {code3 && <CodeButton code={code3} label="3 КЛК" onClick={() => handleCodeClick(code3, "karmaCode3")} />}
              {code4 && <CodeButton code={code4} label="4 КЛК" onClick={() => handleCodeClick(code4, "karmaCode4")} />}
            </div>
            
            {/* Кнопка "Узнать свой Урок года" */}
            <button
              onClick={handleGoToLesson}
              className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30"
            >
              📖 Узнать свой Урок года
            </button>
            
            {/* Кнопка "Калькулятор кармической связи" */}
            <button
              onClick={handleGoToCalculator}
              className="mt-3 w-full py-4 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ff69b4] text-[#1a0a2e] font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-yellow-500/30"
            >
              🔗 Калькулятор кармической связи
            </button>
          </section>
        ) : (
          <section className="glass-card p-6 mb-8 text-center animate-fade-in-delay">
            <p className="text-[#e8d5f5] mb-2">
              ✨ Демо-режим
            </p>
            <p className="text-[#e8d5f5] text-sm">
              Для получения персонального разбора перейдите по ссылке из сообщения ВКонтакте.
            </p>
          </section>
        )}

        {/* Блок с эфирами */}
        <section className="glass-card p-6 mb-8 animate-fade-in-delay-2">
          <h2 className="text-xl font-semibold text-[#ffd700] mb-4 flex items-center gap-2">
            <span>📅</span> Ближайшие эфиры
          </h2>
          <p className="text-[#e8d5f5] text-sm mb-4">
            Приходите на бесплатные эфиры, где я подробно разберу ваши коды и дам персональные рекомендации:
          </p>
          <div className="space-y-3">
            {EVENT_DATES.map((event, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-[#ffd700]/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ff69b4] flex items-center justify-center text-lg font-bold text-[#1a0a2e] shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold text-[#ffd700]">{event.date}</div>
                  <div className="text-xs text-[#e8d5f5]">{event.time} • {event.topic}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowEvents(true)}
            className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ff69b4] text-[#1a0a2e] font-bold text-base hover:opacity-90 transition-opacity"
          >
            Записаться на эфир ✨
          </button>
        </section>

        {/* Футер */}
        <footer className="text-center text-[#e8d5f5]/60 text-xs pb-6">
          <p>✨ Персональный разбор кодов кармы ✨</p>
        </footer>
      </div>

      {/* Модалка выбора календаря */}
      {showEvents && (
        <CalendarModal onClose={() => setShowEvents(false)} />
      )}
    </div>
  );
}

// Компонент кнопки-кода
function CodeButton({ code, label, onClick }: { code: string; label: string; onClick: () => void }) {
  const data = getKarmaData(code);
  return (
    <button
      onClick={onClick}
      className="code-button group relative p-5 rounded-2xl bg-gradient-to-br from-[#2d1b4e]/80 to-[#1a0a2e]/80 border border-[#ffd700]/30 hover:border-[#ffd700]/70 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]"
    >
      <div className="text-3xl mb-2">{data.symbol}</div>
      <div className="text-xs text-[#e8d5f5]/70 mb-1">{label}</div>
      <div className="text-2xl font-bold text-[#ffd700]">{code}</div>
      <div className="text-xs text-[#ff69b4] mt-1 font-medium">{data.title}</div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ffd700]/0 via-[#ffd700]/5 to-[#ffd700]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

// Экран с описанием кода
function CodeDetail({ code, data, onBack, trianglePosition = "karmaCode1" }: { code: string; data: KarmaCodeData; onBack: () => void; trianglePosition?: string }) {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [showEvents, setShowEvents] = useState(false);
  
  // Формируем данные для треугольника в зависимости от позиции
  const getTriangleData = () => {
    const codeNum = parseInt(code);
    switch (trianglePosition) {
      case "yearLesson":
        return { yearLesson: codeNum };
      case "karmaCode1":
        return { karmaCode1: codeNum };
      case "karmaCode2":
        return { karmaCode2: codeNum };
      case "karmaCode3":
        return { karmaCode3: codeNum };
      case "karmaCode4":
        return { karmaCode4: codeNum };
      default:
        return { karmaCode1: codeNum };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] text-white relative overflow-hidden">
      <div className="stars-bg" />
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Заголовок кода */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-3 animate-pulse-slow">{data.symbol}</div>
          <div className="text-sm text-[#e8d5f5]/70 mb-1">Код {code}</div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ffd700] via-[#ff69b4] to-[#9b59b6] bg-clip-text text-transparent">
            {data.title}
          </h1>
          <p className="text-[#ff69b4] mt-2 text-sm font-medium">{data.subtitle}</p>
        </header>

        {/* Картинка для мобильных - после заголовка */}
        <div className="md:hidden mb-6">
          <CodeImage code={code} title={data.title} />
        </div>

        {/* Треугольник с кодом */}
        <KarmaTriangle 
          data={getTriangleData()}
          title={trianglePosition === "yearLesson" ? "Ваш урок года" : "Ваш код кармы"}
        />

        {/* Контент с картинкой */}
        <div className="code-content-with-image">
          <div className="code-text">
            {/* Краткое описание */}
            <section className="glass-card p-5 mb-6 animate-fade-in-delay">
              <p className="text-[#e8d5f5] leading-relaxed text-base md:text-lg">
                {data.shortDesc}
              </p>
            </section>

        {/* Полное описание кода */}
        {data.fullDescription.length > 0 && (
          <section className="glass-card p-5 mb-4 animate-fade-in-delay">
            <button
              onClick={() => setActiveSection(activeSection === 0 ? null : 0)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-[#ffd700] flex items-center gap-2">
                <span>📖</span> Подробное описание
              </h2>
              <span className={`text-[#ffd700] transition-transform ${activeSection === 0 ? "rotate-180" : ""}`}>▼</span>
            </button>
            {activeSection === 0 && (
              <div className="mt-4 space-y-4">
                {data.fullDescription.map((paragraph, i) => (
                  <p key={i} className="text-base md:text-lg text-[#e8d5f5] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Кармические задачи */}
        {data.karmaTasks.length > 0 && (
          <section className="glass-card p-5 mb-4 animate-fade-in-delay-2">
            <button
              onClick={() => setActiveSection(activeSection === 1 ? null : 1)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-[#9b59b6] flex items-center gap-2">
                <span>🎯</span> Кармические задачи
              </h2>
              <span className={`text-[#9b59b6] transition-transform ${activeSection === 1 ? "rotate-180" : ""}`}>▼</span>
            </button>
            {activeSection === 1 && (
              <ul className="mt-4 space-y-2">
                {data.karmaTasks.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-base md:text-lg text-[#e8d5f5]">
                    <span className="text-[#9b59b6] mt-0.5">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Примечание про эфиры */}
        {data.hasLiveEventNote && (
          <section className="glass-card p-5 mb-4 animate-fade-in-delay-2 border-2 border-[#ffd700]/30">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📅</span>
              <p className="text-base md:text-lg text-[#e8d5f5] leading-relaxed">
                <span className="text-[#ffd700] font-semibold">Подробно разберём на эфирах 20, 21 и 23 сентября.</span>
              </p>
            </div>
          </section>
        )}

        {/* Гендерная заметка */}
        {data.genderNote && (
          <section className="glass-card p-5 mb-4 border-[#ff69b4]/30 animate-fade-in-delay-2">
            <p className="text-sm text-[#ff69b4] flex items-start gap-2">
              <span>💡</span>
              <span>{data.genderNote}</span>
            </p>
          </section>
        )}

        {/* Аффирмация */}
        {data.affirmation && (
          <section className="glass-card p-6 mb-6 text-center bg-gradient-to-br from-[#ffd700]/10 to-[#ff69b4]/10 border-[#ffd700]/30 animate-fade-in-delay-2">
            <div className="text-2xl mb-2">🌟</div>
            <p className="text-[#ffd700] italic text-sm md:text-base leading-relaxed">
              «{data.affirmation}»
            </p>
          </section>
        )}
          </div>
          
          {/* Картинка справа на десктопе */}
          <div className="code-image-container">
            <CodeImage code={code} title={data.title} />
          </div>
        </div>

        {/* CTA — запись на эфир */}
        <section className="glass-card p-6 mb-6 text-center border-[#ffd700]/30 animate-fade-in-delay-2">
          <h3 className="text-lg font-semibold text-[#ffd700] mb-2">
            Хотите полный разбор?
          </h3>
          <p className="text-[#e8d5f5] text-sm mb-4">
            Приходите на бесплатный эфир, где я подробно разберу все ваши коды и дам персональные рекомендации.
          </p>
          <div className="space-y-2 mb-4">
            {EVENT_DATES.map((event, i) => (
              <div key={i} className="text-xs text-[#e8d5f5]">
                📅 <strong className="text-[#ffd700]">{event.date}</strong> в {event.time}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowEvents(true)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ff69b4] text-[#1a0a2e] font-bold text-base hover:opacity-90 transition-opacity"
          >
            Записаться на эфир ✨
          </button>
        </section>

        {/* Модалка выбора календаря */}
        {showEvents && (
          <CalendarModal onClose={() => setShowEvents(false)} />
        )}

        {/* Кнопка назад внизу */}
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl border border-[#ffd700]/30 text-[#ffd700] font-medium text-sm hover:bg-[#ffd700]/10 transition-colors mb-6"
        >
          ← Вернуться к кодам
        </button>

        {/* Футер */}
        <footer className="text-center text-[#e8d5f5]/60 text-xs pb-6">
          <p>✨ Персональный разбор кодов кармы ✨</p>
        </footer>
      </div>
    </div>
  );
}

// ============================================
// 📅 ФУНКЦИИ ДЛЯ КАЛЕНДАРЕЙ
// ============================================

// Форматирование даты для Google Calendar (UTC формат)
function formatGoogleDate(date: string, time: string): string {
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");
  // МСК = UTC+3, поэтому вычитаем 3 часа для UTC
  let utcHours = parseInt(hours) - 3;
  let utcDay = parseInt(day);
  
  if (utcHours < 0) {
    utcHours += 24;
    utcDay -= 1;
  }
  
  return `${year}${month}${String(utcDay).padStart(2, "0")}T${String(utcHours).padStart(2, "0")}${minutes}00Z`;
}

// Форматирование даты для .ics файла
function formatIcsDate(date: string, time: string): string {
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");
  let utcHours = parseInt(hours) - 3;
  let utcDay = parseInt(day);
  
  if (utcHours < 0) {
    utcHours += 24;
    utcDay -= 1;
  }
  
  return `${year}${month}${String(utcDay).padStart(2, "0")}T${String(utcHours).padStart(2, "0")}${minutes}00Z`;
}

// Добавление минут к времени
function addMinutes(date: string, time: string, minutes: number): { date: string; time: string } {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, mins] = time.split(":").map(Number);
  
  let totalMinutes = hours * 60 + mins + minutes;
  let newDay = day;
  
  while (totalMinutes >= 24 * 60) {
    totalMinutes -= 24 * 60;
    newDay += 1;
  }
  
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  
  return {
    date: `${year}-${String(month).padStart(2, "0")}-${String(newDay).padStart(2, "0")}`,
    time: `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`
  };
}

// Генерация ссылки для Google Calendar
function generateGoogleCalendarUrl(event: typeof EVENT_DATES[0]): string {
  const startDate = formatGoogleDate(event.startDate, event.startTime);
  const endDateObj = addMinutes(event.startDate, event.startTime, event.duration);
  const endDate = formatGoogleDate(endDateObj.date, endDateObj.time);
  
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Эфир: ${event.topic} — Коды Кармы`,
    dates: `${startDate}/${endDate}`,
    details: `Бесплатный эфир по кодам кармы.\n\nТема: ${event.topic}\nДата: ${event.date}\nВремя: ${event.time}\n\nСсылка на эфир будет отправлена в день мероприятия.`,
    location: "Онлайн (ВКонтакте)"
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Генерация .ics файла для Apple Calendar / Yandex
function generateIcsFile(events: typeof EVENT_DATES): void {
  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Коды Кармы//Эфиры//RU
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Эфиры Коды Кармы
X-WR-TIMEZONE:Europe/Moscow
`;

  events.forEach((event, index) => {
    const startDate = formatIcsDate(event.startDate, event.startTime);
    const endDateObj = addMinutes(event.startDate, event.startTime, event.duration);
    const endDate = formatIcsDate(endDateObj.date, endDateObj.time);
    const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    
    icsContent += `BEGIN:VEVENT
UID:event-${index + 1}-${now}@karma
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:Эфир: ${event.topic} — Коды Кармы
DESCRIPTION:Бесплатный эфир по кодам кармы.\\n\\nТема: ${event.topic}\\nДата: ${event.date}\\nВремя: ${event.time}\\n\\nСсылка на эфир будет отправлена в день мероприятия.
LOCATION:Онлайн (ВКонтакте)
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
  });

  icsContent += `END:VCALENDAR`;

  // Скачивание файла
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "karma-events.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================
// КОМПОНЕНТ МОДАЛКИ КАЛЕНДАРЯ
// ============================================
function CalendarModal({ onClose }: { onClose: () => void }) {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const handleGoogleCalendar = (eventIndex: number) => {
    const event = EVENT_DATES[eventIndex];
    const url = generateGoogleCalendarUrl(event);
    window.open(url, "_blank");
  };

  const handleAppleYandexCalendar = (eventIndex: number | "all") => {
    if (eventIndex === "all") {
      generateIcsFile(EVENT_DATES);
    } else {
      generateIcsFile([EVENT_DATES[eventIndex]]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card p-6 max-w-md w-full animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-[#ffd700] mb-4 text-center">📅 Добавить в календарь</h3>
        
        {/* Выбор события */}
        <div className="mb-4">
          <p className="text-[#e8d5f5] text-sm mb-3">Выберите эфир:</p>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedEvent(null)}
              className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                selectedEvent === null 
                  ? "bg-gradient-to-r from-[#ffd700]/20 to-[#ff69b4]/20 border border-[#ffd700]/50" 
                  : "bg-white/5 border border-white/10 hover:border-[#ffd700]/30"
              }`}
            >
              <div className="font-semibold text-[#ffd700]">✨ Все 3 эфира</div>
              <div className="text-xs text-[#e8d5f5] mt-1">Добавить все мероприятия сразу</div>
            </button>
            {EVENT_DATES.map((event, i) => (
              <button
                key={i}
                onClick={() => setSelectedEvent(i)}
                className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                  selectedEvent === i 
                    ? "bg-gradient-to-r from-[#ffd700]/20 to-[#ff69b4]/20 border border-[#ffd700]/50" 
                    : "bg-white/5 border border-white/10 hover:border-[#ffd700]/30"
                }`}
              >
                <div className="font-semibold text-[#ffd700]">{event.date} — {event.topic}</div>
                <div className="text-xs text-[#e8d5f5] mt-1">{event.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Кнопки календарей */}
        <div className="space-y-3">
          <p className="text-[#e8d5f5] text-sm text-center mb-2">Выберите календарь:</p>
          
          {/* Google Calendar */}
          <button
            onClick={() => {
              if (selectedEvent === null) {
                // Для всех событий открываем первое (Google не поддерживает несколько событий в одном URL)
                handleGoogleCalendar(0);
              } else {
                handleGoogleCalendar(selectedEvent);
              }
            }}
            className="w-full py-3 px-4 rounded-xl bg-white text-gray-800 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">📆</span>
            Google Календарь
          </button>

          {/* Yandex Calendar */}
          <button
            onClick={() => handleAppleYandexCalendar(selectedEvent === null ? "all" : selectedEvent)}
            className="w-full py-3 px-4 rounded-xl bg-[#FC3F1D] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#E53517] transition-colors"
          >
            <span className="text-xl">🗓️</span>
            Яндекс Календарь
          </button>

          {/* Apple Calendar (iPhone) */}
          <button
            onClick={() => handleAppleYandexCalendar(selectedEvent === null ? "all" : selectedEvent)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-gray-700 hover:to-gray-800 transition-colors"
          >
            <span className="text-xl">🍎</span>
            Apple Календарь (iPhone)
          </button>
        </div>

        {/* Подсказка */}
        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[#e8d5f5] text-xs text-center">
            💡 <strong>Google:</strong> откроется в новой вкладке<br/>
            💡 <strong>Яндекс/Apple:</strong> скачается файл .ics — откройте его
          </p>
        </div>

        {/* Кнопка закрыть */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-xl border border-[#ffd700]/30 text-[#ffd700] font-medium text-sm hover:bg-[#ffd700]/10 transition-colors"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default App;
