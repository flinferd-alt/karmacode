import { useState, useEffect } from 'react';
import { getKarmaData, KarmaCodeData } from './data/karmaCodes';

function App() {
  const [karmaData, setKarmaData] = useState<KarmaCodeData | null>(null);
  const [code, setCode] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('description');
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code');
    
    if (urlCode) {
      setCode(urlCode);
      const data = getKarmaData(urlCode);
      setKarmaData(data);
      setTimeout(() => setIsLoaded(true), 300);
    } else {
      setShowDemo(true);
      setTimeout(() => setIsLoaded(true), 300);
    }
  }, []);

  const handleDemoCode = (demoCode: string) => {
    setIsLoaded(false);
    setCode(demoCode);
    const data = getKarmaData(demoCode);
    setKarmaData(data);
    setShowDemo(false);
    setActiveSection('description');
    setTimeout(() => setIsLoaded(true), 100);
  };

  const handleBack = () => {
    setIsLoaded(false);
    setTimeout(() => {
      setKarmaData(null);
      setCode('');
      setShowDemo(true);
      setIsLoaded(true);
    }, 300);
  };

  if (showDemo) {
    return <DemoPage onSelectCode={handleDemoCode} isLoaded={isLoaded} />;
  }

  if (!karmaData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0517]">
        <div className="animate-pulse text-purple-300 text-xl font-light">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Фон */}
      <CosmicBackground />

      {/* Хедер */}
      <header className="relative z-10 pt-6 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={handleBack}
            className="text-purple-400/60 hover:text-purple-300 transition-colors text-sm mb-4 inline-flex items-center gap-1"
          >
            ← Назад к выбору кода
          </button>
          <div className="text-center">
            <div className="text-5xl mb-3 drop-shadow-lg">{karmaData.symbol}</div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-yellow-200 leading-tight">
              {karmaData.title}
            </h1>
            <p className="text-purple-300/80 font-light mt-2 text-lg md:text-xl">{karmaData.subtitle}</p>
            <div className="mt-5 inline-flex items-center gap-3 bg-purple-900/30 backdrop-blur-md rounded-full px-7 py-3 border border-purple-500/20 shadow-lg shadow-purple-900/30">
              <span className="text-yellow-300/80 text-sm font-light">Код кармы:</span>
              <span className="text-white font-bold text-2xl tracking-widest">{karmaData.code}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="relative z-10 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Навигация */}
          <nav className="flex flex-wrap justify-center gap-2 mb-8 mt-6">
            {[
              { id: 'description', label: '✨ Описание', icon: '✨' },
              { id: 'strengths', label: '💎 Сильные стороны', icon: '💎' },
              { id: 'challenges', label: '🌊 Вызовы', icon: '🌊' },
              { id: 'recommendations', label: '🌟 Рекомендации', icon: '🌟' },
              { id: 'details', label: '🔮 Детали', icon: '🔮' },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2.5 rounded-full text-sm transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-purple-900/30 text-purple-300/80 hover:bg-purple-800/40 border border-purple-500/20 hover:border-purple-400/40'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>

          {/* Контент */}
          <div key={activeSection} className="space-y-6 animate-fadeIn">
            {activeSection === 'description' && <DescriptionSection data={karmaData} />}
            {activeSection === 'strengths' && <StrengthsSection data={karmaData} />}
            {activeSection === 'challenges' && <ChallengesSection data={karmaData} />}
            {activeSection === 'recommendations' && <RecommendationsSection data={karmaData} />}
            {activeSection === 'details' && <DetailsSection data={karmaData} />}
          </div>

          {/* Аффирмация */}
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-purple-900/50 to-pink-900/30 backdrop-blur-md border border-purple-400/20 shadow-2xl shadow-purple-900/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400/5 rounded-full blur-2xl"></div>
            <div className="relative text-center">
              <p className="text-yellow-300/70 text-xs uppercase tracking-[0.2em] mb-4">Ваша аффирмация</p>
              <p className="text-white/90 font-serif text-xl md:text-2xl italic leading-relaxed">
                «{karmaData.affirmation}»
              </p>
              <div className="mt-6 pt-5 border-t border-purple-500/20">
                <p className="text-purple-300/60 text-sm">Мантра:</p>
                <p className="text-yellow-200/90 font-medium text-lg mt-1">{karmaData.mantra}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <div className="inline-block p-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 shadow-lg shadow-purple-500/20">
              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-900/95 to-pink-900/95 text-white font-medium hover:from-purple-800/95 hover:to-pink-800/95 transition-all duration-300 text-lg">
                🔮 Получить полную расшифровку
              </button>
            </div>
            <p className="text-purple-400/50 text-sm mt-4">Полная персональная расшифровка доступна в нашем боте ВКонтакте</p>
          </div>
        </div>
      </main>

      {/* Футер */}
      <footer className="relative z-10 py-8 px-4 border-t border-purple-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-purple-400/40 text-sm">
            ✨ Коды Кармы — путь к пониманию своей души ✨
          </p>
        </div>
      </footer>
    </div>
  );
}

// Космический фон
function CosmicBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Основной градиент */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#2d1b4e] to-[#0d0517]"></div>
      
      {/* Свечения */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-700/8 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-700/8 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-600/5 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      {/* Звёзды */}
      <Stars />
      
      {/* Виньетка */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(13,5,23,0.4)_70%,rgba(13,5,23,0.8)_100%)]"></div>
    </div>
  );
}

function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 13) % 100}%`,
    top: `${(i * 53 + 7) % 100}%`,
    size: (i % 3) + 1,
    delay: `${(i * 0.7) % 5}s`,
    duration: `${2 + (i % 4)}s`,
  }));

  return (
    <div className="absolute inset-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white/30 animate-pulse"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}

// Демо-страница
function DemoPage({ onSelectCode, isLoaded }: { onSelectCode: (code: string) => void; isLoaded: boolean }) {
  const [inputCode, setInputCode] = useState('');
  
  const demoCodes = [
    { code: '111', label: 'Светило', emoji: '☀️', desc: 'Путь первородного пламени' },
    { code: '222', label: 'Луна', emoji: '🌙', desc: 'Путь лунной воды' },
    { code: '333', label: 'Венера', emoji: '♀️', desc: 'Путь божественной любви' },
    { code: '444', label: 'Земля', emoji: '🌍', desc: 'Путь священной матери' },
    { code: '555', label: 'Меркурий', emoji: '✈️', desc: 'Путь мудрой странницы' },
    { code: '666', label: 'Марс', emoji: '⚔️', desc: 'Путь воительницы света' },
    { code: '777', label: 'Нептун', emoji: '🔮', desc: 'Путь мистической провидицы' },
    { code: '888', label: 'Изобилие', emoji: '∞', desc: 'Путь бесконечного потока' },
    { code: '999', label: 'Феникс', emoji: '🦅', desc: 'Путь трансформации' },
  ];

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 relative transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <CosmicBackground />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Заголовок */}
        <div className="mb-10">
          <div className="text-6xl mb-4 animate-glow inline-block">✨</div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-yellow-200 mb-3 leading-tight">
            Коды Кармы
          </h1>
          <p className="text-purple-300/70 font-light text-lg md:text-xl max-w-md mx-auto">
            Расшифровка вашей судьбы через числовые вибрации вселенной
          </p>
        </div>

        {/* Ввод кода */}
        <div className="mb-10">
          <div className="flex gap-3 justify-center items-center flex-wrap">
            <div className="relative">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Введите ваш код..."
                className="px-6 py-4 rounded-2xl bg-purple-900/40 backdrop-blur-md border border-purple-500/30 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 w-64 text-center text-lg tracking-wider transition-all duration-300"
                maxLength={9}
              />
            </div>
            <button
              onClick={() => inputCode && onSelectCode(inputCode)}
              disabled={!inputCode}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Узнать ✨
            </button>
          </div>
        </div>

        {/* Разделитель */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/30"></div>
          <span className="text-purple-400/50 text-sm">или выберите код</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/30"></div>
        </div>

        {/* Демо-коды */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {demoCodes.map((item) => (
            <button
              key={item.code}
              onClick={() => onSelectCode(item.code)}
              className="p-4 rounded-2xl bg-purple-900/30 backdrop-blur-sm border border-purple-500/15 hover:border-purple-400/40 hover:bg-purple-800/40 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{item.emoji}</div>
              <div className="text-white/90 text-sm font-medium">{item.label}</div>
              <div className="text-purple-400/50 text-xs mt-1">{item.desc}</div>
            </button>
          ))}
        </div>

        <p className="text-purple-400/30 text-xs mt-6">
          Демо-версия • Полная версия доступна через бот ВКонтакте
        </p>
      </div>
    </div>
  );
}

// Секция описания
function DescriptionSection({ data }: { data: KarmaCodeData }) {
  return (
    <div className="space-y-6">
      <div className="p-7 rounded-3xl bg-gradient-to-br from-purple-900/40 to-pink-900/20 backdrop-blur-md border border-purple-400/15 shadow-xl shadow-purple-900/20">
        <h2 className="text-xl font-serif text-yellow-200/90 mb-4 flex items-center gap-2">
          <span>📜</span> Послание вашего кода
        </h2>
        <p className="text-purple-100/80 leading-relaxed text-lg font-light">
          {data.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-purple-900/30 backdrop-blur-md border border-purple-400/15 hover:border-purple-400/25 transition-all duration-300">
          <p className="text-yellow-300/70 text-xs uppercase tracking-[0.15em] mb-3">Ваша миссия</p>
          <p className="text-purple-100/80 font-light leading-relaxed">{data.mission}</p>
        </div>
        <div className="p-6 rounded-2xl bg-purple-900/30 backdrop-blur-md border border-purple-400/15 hover:border-purple-400/25 transition-all duration-300">
          <p className="text-yellow-300/70 text-xs uppercase tracking-[0.15em] mb-3">Из прошлой жизни</p>
          <p className="text-purple-100/80 font-light leading-relaxed">{data.pastLifeHint}</p>
        </div>
      </div>
    </div>
  );
}

// Секция сильных сторон
function StrengthsSection({ data }: { data: KarmaCodeData }) {
  return (
    <div>
      <div className="p-7 rounded-3xl bg-gradient-to-br from-emerald-900/15 to-purple-900/30 backdrop-blur-md border border-emerald-400/15 shadow-xl shadow-purple-900/20">
        <h2 className="text-xl font-serif text-yellow-200/90 mb-6 flex items-center gap-2">
          <span>💎</span> Ваши дары и сильные стороны
        </h2>
        <div className="space-y-3">
          {data.strengths.map((strength, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-purple-900/20 border border-purple-500/10 hover:border-purple-400/20 transition-all duration-300">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400/20 to-purple-500/20 flex items-center justify-center text-yellow-300 text-sm font-bold flex-shrink-0 border border-yellow-400/20">
                {index + 1}
              </div>
              <p className="text-purple-100/80 font-light pt-1.5">{strength}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Секция вызовов
function ChallengesSection({ data }: { data: KarmaCodeData }) {
  const moonPhases = ['🌑', '🌒', '🌓', '🌔', '🌕'];
  
  return (
    <div>
      <div className="p-7 rounded-3xl bg-gradient-to-br from-pink-900/15 to-purple-900/30 backdrop-blur-md border border-pink-400/15 shadow-xl shadow-purple-900/20">
        <h2 className="text-xl font-serif text-yellow-200/90 mb-6 flex items-center gap-2">
          <span>🌊</span> Уроки и вызовы
        </h2>
        <div className="space-y-3">
          {data.challenges.map((challenge, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-purple-900/20 border border-purple-500/10 hover:border-pink-400/20 transition-all duration-300">
              <div className="text-xl flex-shrink-0 pt-0.5">{moonPhases[index]}</div>
              <p className="text-purple-100/80 font-light pt-1">{challenge}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-400/10">
          <p className="text-purple-300/70 text-sm italic leading-relaxed">
            💡 Помните: каждый вызов — это возможность для роста. Ваша душа выбрала эти уроки для эволюции. Примите их с любовью и благодарностью.
          </p>
        </div>
      </div>
    </div>
  );
}

// Секция рекомендаций
function RecommendationsSection({ data }: { data: KarmaCodeData }) {
  return (
    <div>
      <div className="p-7 rounded-3xl bg-gradient-to-br from-yellow-900/10 to-purple-900/30 backdrop-blur-md border border-yellow-400/15 shadow-xl shadow-purple-900/20">
        <h2 className="text-xl font-serif text-yellow-200/90 mb-6 flex items-center gap-2">
          <span>🌟</span> Рекомендации для вашей души
        </h2>
        <div className="space-y-3">
          {data.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-transparent border border-purple-500/10 hover:border-yellow-400/20 transition-all duration-300">
              <div className="text-yellow-300/80 text-lg flex-shrink-0 pt-0.5">✦</div>
              <p className="text-purple-100/80 font-light">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Секция деталей
function DetailsSection({ data }: { data: KarmaCodeData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DetailCard icon="🔥" label="Стихия" value={data.element} />
        <DetailCard icon="🪐" label="Планета" value={data.planet} />
        <DetailCard icon="💫" label="Энергия" value={data.energyType.split('—')[0].trim()} />
        <DetailCard icon="🧿" label="Чакра" value={data.chakra.split('(')[0].trim()} />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <DetailCard icon="💎" label="Кристаллы-помощники" value={data.crystal} wide />
        <DetailCard icon="🔢" label="Счастливые числа" value={data.luckyNumbers.join(' • ')} wide />
        <DetailCard icon="📅" label="Удачные дни недели" value={data.luckyDays.join(', ')} wide />
        <DetailCard icon="🌿" label="Совместимые стихии" value={data.compatibleElements.join(', ')} wide />
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, wide }: { icon: string; label: string; value: string; wide?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl bg-purple-900/30 backdrop-blur-md border border-purple-400/15 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 ${wide ? 'md:col-span-1' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-yellow-300/60 text-[10px] uppercase tracking-[0.15em]">{label}</span>
      </div>
      <p className="text-purple-100/90 font-medium text-sm">{value}</p>
    </div>
  );
}

export default App;
