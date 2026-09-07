import { useState, useEffect } from 'react';
import { karmaCodes, getKarmaData, KarmaCodeData } from './data/karmaCodes';

// Даты эфиров - МЕНЯЙТЕ ЗДЕСЬ
const EVENT_DATES = [
  { date: "20 сентября", time: "19:00 МСК", topic: "Разбор кодов кармы" },
  { date: "21 сентября", time: "19:00 МСК", topic: "Практики активации кодов" },
  { date: "24 сентября", time: "19:00 МСК", topic: "Индивидуальные разборы" },
];

function App() {
  const [codes, setCodes] = useState<string[]>([]);
  const [activeCode, setActiveCode] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Проверяем URL параметры (для Автопилота)
    const params = new URLSearchParams(window.location.search);
    const urlCodes = [
      params.get('code1'),
      params.get('code2'),
      params.get('code3'),
      params.get('code4'),
    ].filter(Boolean) as string[];

    if (urlCodes.length > 0) {
      setCodes(urlCodes);
      setActiveCode(urlCodes[0]);
      // Сохраняем в localStorage
      localStorage.setItem('karmaCodes', JSON.stringify(urlCodes));
      setIsLoaded(true);
      return;
    }

    // 2. Проверяем localStorage
    const saved = localStorage.getItem('karmaCodes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCodes(parsed);
          setActiveCode(parsed[0]);
          setIsLoaded(true);
          return;
        }
      } catch (e) { /* ignore */ }
    }

    // 3. Демо-режим
    setCodes(['1']);
    setActiveCode('1');
    setIsLoaded(true);
  }, []);

  // Слушаем POST-сообщения от Автопилота
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'KARMA_CODES') {
        const newCodes = event.data.codes.filter(Boolean);
        setCodes(newCodes);
        setActiveCode(newCodes[0]);
        localStorage.setItem('karmaCodes', JSON.stringify(newCodes));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const currentData = getKarmaData(activeCode);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0015]">
        <div className="text-purple-300 text-xl animate-pulse">Загрузка вашего кода кармы...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0015] text-white relative overflow-hidden">
      {/* Космический фон */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0033] via-[#0a0015] to-[#0d001a]" />
        <div className="stars" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Хедер */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 mb-4">
            <span className="text-amber-400 text-sm">✦</span>
            <span className="text-purple-200 text-sm font-light">Персональный разбор кодов кармы</span>
            <span className="text-amber-400 text-sm">✦</span>
          </div>
        </header>

        {/* Переключатель кодов */}
        {codes.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {codes.map((code, index) => {
              const data = getKarmaData(code);
              const isActive = code === activeCode;
              return (
                <button
                  key={code}
                  onClick={() => setActiveCode(code)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                    ${isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10 border border-white/10'
                    }
                  `}
                >
                  {data?.symbol} Код {index + 1}: {code}
                </button>
              );
            })}
          </div>
        )}

        {/* Основной контент */}
        {currentData && (
          <div className="animate-fade-in">
            {/* Заголовок кода */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-float">{currentData.symbol}</div>
              <div className="inline-block bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-transparent bg-clip-text">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Код {currentData.code} — {currentData.title}
                </h1>
              </div>
              <p className="text-purple-300 text-sm italic">{currentData.subtitle}</p>
            </div>

            {/* Суть кода */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-400">◈</span>
                <h2 className="text-lg font-semibold text-amber-200">Суть вашего кода</h2>
              </div>
              <p className="text-purple-100 leading-relaxed">{currentData.essence}</p>
            </div>

            {/* Сильные стороны */}
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💜</span>
                <h2 className="text-lg font-semibold text-purple-200">Ваши сильные стороны (в плюсе)</h2>
              </div>
              <ul className="space-y-2">
                {currentData.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-purple-100">
                    <span className="text-amber-400 mt-1 text-xs">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Вызовы */}
            <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/10 backdrop-blur-md border border-pink-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔮</span>
                <h2 className="text-lg font-semibold text-pink-200">На что обратить внимание (в минусе)</h2>
              </div>
              <ul className="space-y-2">
                {currentData.challenges.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-pink-100">
                    <span className="text-pink-400 mt-1 text-xs">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Кармические задачи */}
            <div className="bg-gradient-to-br from-amber-900/20 to-yellow-900/10 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⭐</span>
                <h2 className="text-lg font-semibold text-amber-200">Ваши кармические задачи</h2>
              </div>
              <ul className="space-y-3">
                {currentData.karmicTasks.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center text-xs font-bold text-purple-900">
                      {i + 1}
                    </span>
                    <span className="text-amber-100">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Испытания */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌟</span>
                <h2 className="text-lg font-semibold text-purple-200">Испытания жизни</h2>
              </div>
              <p className="text-purple-300 text-sm mb-3">Жизнь будет постоянно ставить перед выбором:</p>
              <ul className="space-y-2">
                {currentData.tests.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-purple-200 italic">
                    <span className="text-amber-400">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Аффирмация */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 border border-purple-400/30 rounded-2xl px-6 py-4">
                <p className="text-sm text-purple-300 mb-2">Ваша аффирмация:</p>
                <p className="text-lg text-white italic font-light">«{currentData.affirmation}»</p>
              </div>
            </div>

            {/* Блок с эфирами */}
            <div className="bg-gradient-to-br from-purple-800/40 via-pink-800/20 to-amber-800/20 backdrop-blur-md border border-amber-400/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-amber-200 mb-1">🔥 Бесплатные эфиры</h2>
                  <p className="text-purple-200 text-sm">Узнайте больше о своих кодах кармы</p>
                </div>
                <div className="space-y-3">
                  {EVENT_DATES.map((event, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-pink-500 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-xs text-white/80 leading-none">{event.date.split(' ')[1]}</span>
                        <span className="text-lg font-bold text-white leading-none">{event.date.split(' ')[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{event.topic}</p>
                        <p className="text-purple-300 text-xs">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-purple-900 font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 text-sm">
                    ✨ Записаться на эфир
                  </button>
                </div>
              </div>
            </div>

            {/* Полный разбор CTA */}
            <div className="text-center bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 border border-purple-400/20 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Хотите полный разбор?</h3>
              <p className="text-purple-300 text-sm mb-4">
                На эфирах мы подробно разберём все 4 ваших кода кармы, 
                покажем как их активировать и использовать для улучшения жизни.
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
                Узнать подробности →
              </button>
            </div>
          </div>
        )}

        {/* Футер */}
        <footer className="text-center text-purple-400/50 text-xs pb-8">
          <p>✦ Коды Кармы ✦ Персональный разбор ✦</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
