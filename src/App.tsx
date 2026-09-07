import { useState, useEffect } from "react";
import { getKarmaData, KarmaCodeData } from "./data/karmaCodes";

// ============================================
// 📅 ДАТЫ ЭФИРОВ — МЕНЯТЬ ЗДЕСЬ
// ============================================
const EVENT_DATES = [
  { date: "20 сентября", time: "19:00 МСК", topic: "Разбор кодов кармы" },
  { date: "21 сентября", time: "19:00 МСК", topic: "Практики активации кодов" },
  { date: "24 сентября", time: "19:00 МСК", topic: "Индивидуальные разборы" },
];
// ============================================

function App() {
  const [code1, setCode1] = useState<string>("");
  const [code2, setCode2] = useState<string>("");
  const [code3, setCode3] = useState<string>("");
  const [code4, setCode4] = useState<string>("");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [showEvents, setShowEvents] = useState(false);

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

  const handleCodeClick = (code: string) => {
    setSelectedCode(code);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedCode(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Экран с описанием конкретного кода
  if (selectedCode) {
    const data = getKarmaData(selectedCode);
    return <CodeDetail code={selectedCode} data={data} onBack={handleBack} />;
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
              {code1 && <CodeButton code={code1} label="1 КЛК" onClick={() => handleCodeClick(code1)} />}
              {code2 && <CodeButton code={code2} label="2 КЛК" onClick={() => handleCodeClick(code2)} />}
              {code3 && <CodeButton code={code3} label="3 КЛК" onClick={() => handleCodeClick(code3)} />}
              {code4 && <CodeButton code={code4} label="4 КЛК" onClick={() => handleCodeClick(code4)} />}
            </div>
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

      {/* Модалка записи */}
      {showEvents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowEvents(false)}>
          <div className="glass-card p-6 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[#ffd700] mb-3">Запись на эфир</h3>
            <p className="text-[#e8d5f5] text-sm mb-4">
              Для записи на эфир напишите в личные сообщения сообщества. 
              Укажите, на какую дату хотите записаться.
            </p>
            <button
              onClick={() => setShowEvents(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ff69b4] text-[#1a0a2e] font-bold"
            >
              Понятно ✨
            </button>
          </div>
        </div>
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
function CodeDetail({ code, data, onBack }: { code: string; data: KarmaCodeData; onBack: () => void }) {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] text-white relative overflow-hidden">
      <div className="stars-bg" />
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Кнопка назад */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#ffd700] mb-6 hover:opacity-80 transition-opacity"
        >
          <span>←</span>
          <span className="text-sm">Назад к кодам</span>
        </button>

        {/* Заголовок кода */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-3 animate-pulse-slow">{data.symbol}</div>
          <div className="text-sm text-[#e8d5f5]/70 mb-1">Код {code}</div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ffd700] via-[#ff69b4] to-[#9b59b6] bg-clip-text text-transparent">
            {data.title}
          </h1>
          <p className="text-[#ff69b4] mt-2 text-sm font-medium">{data.subtitle}</p>
        </header>

        {/* Краткое описание */}
        <section className="glass-card p-5 mb-6 animate-fade-in-delay">
          <p className="text-[#e8d5f5] leading-relaxed text-sm md:text-base">
            {data.shortDesc}
          </p>
        </section>

        {/* Сильные стороны */}
        {data.strengths.length > 0 && (
          <section className="glass-card p-5 mb-4 animate-fade-in-delay">
            <button
              onClick={() => setActiveSection(activeSection === 0 ? null : 0)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-[#ffd700] flex items-center gap-2">
                <span>💫</span> Ваши сильные стороны
              </h2>
              <span className={`text-[#ffd700] transition-transform ${activeSection === 0 ? "rotate-180" : ""}`}>▼</span>
            </button>
            {activeSection === 0 && (
              <ul className="mt-4 space-y-2">
                {data.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#e8d5f5]">
                    <span className="text-[#ffd700] mt-0.5">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* На что обратить внимание */}
        {data.challenges.length > 0 && (
          <section className="glass-card p-5 mb-4 animate-fade-in-delay-2">
            <button
              onClick={() => setActiveSection(activeSection === 1 ? null : 1)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-[#ff69b4] flex items-center gap-2">
                <span>🌑</span> На что обратить внимание
              </h2>
              <span className={`text-[#ff69b4] transition-transform ${activeSection === 1 ? "rotate-180" : ""}`}>▼</span>
            </button>
            {activeSection === 1 && (
              <ul className="mt-4 space-y-2">
                {data.challenges.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#e8d5f5]">
                    <span className="text-[#ff69b4] mt-0.5">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Кармические задачи */}
        {data.karmaTasks.length > 0 && (
          <section className="glass-card p-5 mb-4 animate-fade-in-delay-2">
            <button
              onClick={() => setActiveSection(activeSection === 2 ? null : 2)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-[#9b59b6] flex items-center gap-2">
                <span>🎯</span> Кармические задачи
              </h2>
              <span className={`text-[#9b59b6] transition-transform ${activeSection === 2 ? "rotate-180" : ""}`}>▼</span>
            </button>
            {activeSection === 2 && (
              <ul className="mt-4 space-y-2">
                {data.karmaTasks.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#e8d5f5]">
                    <span className="text-[#9b59b6] mt-0.5">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Испытания */}
        {data.lifeTests.length > 0 && (
          <section className="glass-card p-5 mb-4 animate-fade-in-delay-2">
            <button
              onClick={() => setActiveSection(activeSection === 3 ? null : 3)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-[#e8d5f5] flex items-center gap-2">
                <span>⚡</span> Испытания жизни
              </h2>
              <span className={`text-[#e8d5f5] transition-transform ${activeSection === 3 ? "rotate-180" : ""}`}>▼</span>
            </button>
            {activeSection === 3 && (
              <ul className="mt-4 space-y-2">
                {data.lifeTests.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#e8d5f5]">
                    <span className="text-[#ffd700] mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
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
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ff69b4] text-[#1a0a2e] font-bold text-base hover:opacity-90 transition-opacity">
            Записаться на эфир ✨
          </button>
        </section>

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

export default App;
