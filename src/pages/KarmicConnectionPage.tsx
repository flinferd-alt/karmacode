import { useState, useRef, useEffect } from "react";
import { getKarmaData } from "../data/karmaCodes";

interface KarmicConnectionPageProps {
  onBack: () => void;
  onCodeClick?: (code: number) => void;
  onGoToLesson?: () => void;
  onGoToCalculator?: () => void;
}

interface CalcResult {
  birthCode: number;
  destinyCode1: number;
  destinyCode2: number;
  karmaCode1: number;
  karmaCode2: number;
  karmaCode3: number;
  karmaCode4: number;
}

interface KarmicMatch {
  code: number;
  parentField: string;
  childField: string;
}

// Приведение к числу от 1 до 22
function reduceTo22(num: number): number {
  if (num === 0) return 22;
  while (num > 22) {
    num -= 22;
  }
  return num;
}

// Сумма цифр числа
function sumOfDigits(num: number): number {
  return String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
}

// Расчёт кодов для даты
function calculateCodes(dateStr: string): CalcResult | null {
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) return null;
  
  const birthCode = reduceTo22(day);
  const allDigitsSum = sumOfDigits(day) + sumOfDigits(month) + sumOfDigits(year);
  const destinyCode1 = reduceTo22(allDigitsSum);
  
  const D = reduceTo22(day);
  const M = reduceTo22(month);
  const Y = reduceTo22(sumOfDigits(year));
  
  const destinyCode2 = reduceTo22(D + M + Y);
  
  let karmaCode1 = Math.abs(D - M);
  if (karmaCode1 === 0) karmaCode1 = 22;
  
  let karmaCode2 = Math.abs(D - Y);
  if (karmaCode2 === 0) karmaCode2 = 22;
  
  let karmaCode3 = Math.abs(karmaCode1 - karmaCode2);
  if (karmaCode3 === 0) karmaCode3 = 22;
  
  let karmaCode4 = Math.abs(M - Y);
  if (karmaCode4 === 0) karmaCode4 = 22;
  
  return {
    birthCode,
    destinyCode1,
    destinyCode2,
    karmaCode1,
    karmaCode2,
    karmaCode3,
    karmaCode4
  };
}

// Парсинг даты для сравнения
function parseDate(dateStr: string): Date | null {
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const year = parseInt(parts[2]);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month, day);
}

// Поиск кармических переходов от родителя к ребенку
function findKarmicMatches(parent: CalcResult, child: CalcResult): KarmicMatch[] {
  const matches: KarmicMatch[] = [];
  
  const childTopCodes = [
    { code: child.birthCode, field: "КР" },
    { code: child.destinyCode1, field: "КС1" },
    { code: child.destinyCode2, field: "КС2" }
  ];
  
  const parentKarmaCodes = [
    { code: parent.karmaCode1, field: "КЛК1" },
    { code: parent.karmaCode2, field: "КЛК2" },
    { code: parent.karmaCode3, field: "КЛК3" },
    { code: parent.karmaCode4, field: "КЛК4" }
  ];
  
  parentKarmaCodes.forEach(parentCode => {
    childTopCodes.forEach(childCode => {
      if (parentCode.code === childCode.code) {
        matches.push({
          code: parentCode.code,
          parentField: parentCode.field,
          childField: childCode.field
        });
      }
    });
  });
  
  return matches;
}

export default function KarmicConnectionPage({ onBack, onCodeClick, onGoToLesson, onGoToCalculator }: KarmicConnectionPageProps) {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result1, setResult1] = useState<CalcResult | null>(null);
  const [result2, setResult2] = useState<CalcResult | null>(null);
  const [isParent1, setIsParent1] = useState<boolean>(true);
  const [matches, setMatches] = useState<KarmicMatch[]>([]);
  const [error, setError] = useState("");
  const [linePositions, setLinePositions] = useState<{fromX: number, fromY: number, toX: number, toY: number}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const childRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const handleCalculate = () => {
    setError("");
    
    const res1 = calculateCodes(date1);
    const res2 = calculateCodes(date2);
    
    if (!res1 || !res2) {
      setError("Пожалуйста, введите корректные даты в формате дд.мм.гггг");
      return;
    }
    
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    
    if (!d1 || !d2) {
      setError("Ошибка при обработке дат");
      return;
    }
    
    const parentIsFirst = d1 <= d2;
    setIsParent1(parentIsFirst);
    
    const parent = parentIsFirst ? res1 : res2;
    const child = parentIsFirst ? res2 : res1;
    
    const karmicMatches = findKarmicMatches(parent, child);
    setMatches(karmicMatches);
    
    setResult1(res1);
    setResult2(res2);
  };

  // Вычисление позиций линий после рендера
  useEffect(() => {
    if (matches.length > 0 && containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      const positions: {fromX: number, fromY: number, toX: number, toY: number}[] = [];
      
      matches.forEach((match) => {
        const parentKey = match.parentField;
        const childKey = match.childField;
        
        const parentEl = parentRefs.current[parentKey];
        const childEl = childRefs.current[childKey];
        
        if (parentEl && childEl) {
          const parentRect = parentEl.getBoundingClientRect();
          const childRect = childEl.getBoundingClientRect();
          
          // Определяем, какая дата родитель
          const parentIsLeft = isParent1;
          
          const fromX = parentIsLeft 
            ? parentRect.right - containerRect.left 
            : parentRect.left - containerRect.left;
          const fromY = parentRect.top + parentRect.height / 2 - containerRect.top;
          
          const toX = parentIsLeft 
            ? childRect.left - containerRect.left 
            : childRect.right - containerRect.left;
          const toY = childRect.top + childRect.height / 2 - containerRect.top;
          
          positions.push({ fromX, fromY, toX, toY });
        }
      });
      
      setLinePositions(positions);
    }
  }, [matches, result1, result2, isParent1]);

  // Проверка, подсвечивать ли поле
  const isHighlighted = (field: string, isParent: boolean): boolean => {
    return matches.some(m => {
      if (isParent) {
        // Для родителя: подсвечиваем КЛК, если они есть в matches
        return m.parentField === field;
      } else {
        // Для ребёнка: подсвечиваем КР/КС1/КС2, если они есть в matches
        return m.childField === field;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] text-white relative overflow-hidden">
      <div className="stars-bg" />
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* Кнопка назад */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#ffd700] mb-6 hover:opacity-80 transition-opacity"
        >
          <span>←</span>
          <span className="text-sm">Назад</span>
        </button>

        {/* Заголовок */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-3">🔗</div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ffd700] via-[#ff69b4] to-[#9b59b6] bg-clip-text text-transparent">
            Калькулятор Кармической Связи
          </h1>
          <p className="text-[#e8d5f5] mt-3 text-base">
            Проверьте кармическую связь между двумя людьми
          </p>
        </header>

        {/* Видео-заглушка */}
        <section className="glass-card p-6 mb-6 animate-fade-in-delay">
          <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/30 rounded-xl flex items-center justify-center border border-[#ffd700]/20">
            <div className="text-center p-6">
              <div className="text-5xl mb-3">🎥</div>
              <p className="text-[#e8d5f5] text-sm">
                Здесь будет видео-пояснение,<br/>как проверить кармическую связь
              </p>
              <p className="text-[#ffd700] text-xs mt-2 italic">
                (Kinescope или другой видео-хостинг)
              </p>
            </div>
          </div>
        </section>

        {/* Форма ввода */}
        <section className="glass-card p-6 mb-6 animate-fade-in-delay">
          <h2 className="text-xl font-bold text-[#ffd700] mb-4 text-center">
            Введите даты рождения
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#e8d5f5] text-sm mb-2">Дата 1</label>
              <input
                type="text"
                value={date1}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  let formatted = value;
                  if (value.length >= 2) {
                    formatted = value.slice(0, 2) + '.' + value.slice(2);
                  }
                  if (value.length >= 4) {
                    formatted = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4, 8);
                  }
                  setDate1(formatted);
                }}
                placeholder="дд.мм.гггг"
                className="w-full px-4 py-3 rounded-xl bg-purple-900/40 backdrop-blur-md border border-purple-500/30 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 text-center text-lg tracking-wider"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-[#e8d5f5] text-sm mb-2">Дата 2</label>
              <input
                type="text"
                value={date2}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  let formatted = value;
                  if (value.length >= 2) {
                    formatted = value.slice(0, 2) + '.' + value.slice(2);
                  }
                  if (value.length >= 4) {
                    formatted = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4, 8);
                  }
                  setDate2(formatted);
                }}
                placeholder="дд.мм.гггг"
                className="w-full px-4 py-3 rounded-xl bg-purple-900/40 backdrop-blur-md border border-purple-500/30 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 text-center text-lg tracking-wider"
                maxLength={10}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <button
            onClick={handleCalculate}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ff69b4] text-[#1a0a2e] font-bold text-base hover:opacity-90 transition-opacity"
          >
            Рассчитать кармическую связь ✨
          </button>
        </section>

        {/* Результаты */}
        {result1 && result2 && (
          <div className="animate-fade-in">
            {/* Информация о родителе */}
            <div className="glass-card p-4 mb-6 border-[#ffd700]/30">
              <p className="text-center text-[#e8d5f5] text-sm">
                <span className="text-[#ffd700] font-bold">Родитель:</span> {isParent1 ? date1 : date2} (более ранняя дата)
              </p>
              <p className="text-center text-[#e8d5f5] text-sm mt-1">
                <span className="text-[#ff69b4] font-bold">Ребёнок:</span> {isParent1 ? date2 : date1}
              </p>
            </div>

            {/* Таблички с кодами и линиями */}
            <div ref={containerRef} className="relative grid md:grid-cols-2 gap-6 mb-6">
              {/* SVG линии между табличками */}
              {linePositions.length > 0 && (
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffd700" stopOpacity="1" />
                      <stop offset="50%" stopColor="#ff69b4" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ffd700" stopOpacity="1" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {linePositions.map((pos, i) => (
                    <g key={i}>
                      <line
                        x1={pos.fromX}
                        y1={pos.fromY}
                        x2={pos.toX}
                        y2={pos.toY}
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        filter="url(#glow)"
                        className="animate-pulse"
                      />
                      <circle
                        cx={pos.fromX}
                        cy={pos.fromY}
                        r="5"
                        fill="#ffd700"
                        className="animate-ping"
                      />
                      <circle
                        cx={pos.toX}
                        cy={pos.toY}
                        r="5"
                        fill="#ff69b4"
                        className="animate-ping"
                      />
                    </g>
                  ))}
                </svg>
              )}

              {/* Дата 1 */}
              <div className="glass-card p-5 relative z-20">
                <h3 className="text-center text-lg font-bold text-[#ffd700] mb-4">
                  {isParent1 ? "Родитель" : "Ребёнок"}: {date1}
                </h3>
                <div className="space-y-2">
                  <div 
                    ref={el => { if (isParent1) parentRefs.current["КР"] = el; else childRefs.current["КР"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КР", isParent1) 
                        ? "bg-gradient-to-r from-[#ffd700]/30 to-[#ff69b4]/30 border border-[#ffd700]/50 shadow-lg shadow-[#ffd700]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КР (Код рождения):</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.birthCode)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КР", isParent1) 
                          ? "text-[#ffd700] animate-pulse" 
                          : "text-[#ffd700] hover:text-[#ff69b4]"
                      }`}
                    >
                      {result1.birthCode}
                    </button>
                  </div>
                  <div 
                    ref={el => { if (isParent1) parentRefs.current["КС1"] = el; else childRefs.current["КС1"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КС1", isParent1) 
                        ? "bg-gradient-to-r from-[#ffd700]/30 to-[#ff69b4]/30 border border-[#ffd700]/50 shadow-lg shadow-[#ffd700]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КС1 (Код судьбы 1):</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.destinyCode1)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КС1", isParent1) 
                          ? "text-[#ffd700] animate-pulse" 
                          : "text-[#ffd700] hover:text-[#ff69b4]"
                      }`}
                    >
                      {result1.destinyCode1}
                    </button>
                  </div>
                  <div 
                    ref={el => { if (isParent1) parentRefs.current["КС2"] = el; else childRefs.current["КС2"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КС2", isParent1) 
                        ? "bg-gradient-to-r from-[#ffd700]/30 to-[#ff69b4]/30 border border-[#ffd700]/50 shadow-lg shadow-[#ffd700]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КС2 (Код судьбы 2):</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.destinyCode2)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КС2", isParent1) 
                          ? "text-[#ffd700] animate-pulse" 
                          : "text-[#ffd700] hover:text-[#ff69b4]"
                      }`}
                    >
                      {result1.destinyCode2}
                    </button>
                  </div>
                  <div className="border-t border-[#ffd700]/20 my-3"></div>
                  <div 
                    ref={el => { if (isParent1) parentRefs.current["КЛК1"] = el; else childRefs.current["КЛК1"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КЛК1", isParent1) 
                        ? "bg-gradient-to-r from-[#ff69b4]/30 to-[#ffd700]/30 border border-[#ff69b4]/50 shadow-lg shadow-[#ff69b4]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КЛК 1:</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.karmaCode1)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КЛК1", isParent1) 
                          ? "text-[#ff69b4] animate-pulse" 
                          : "text-[#ff69b4] hover:text-[#ffd700]"
                      }`}
                    >
                      {result1.karmaCode1}
                    </button>
                  </div>
                  <div 
                    ref={el => { if (isParent1) parentRefs.current["КЛК2"] = el; else childRefs.current["КЛК2"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КЛК2", isParent1) 
                        ? "bg-gradient-to-r from-[#ff69b4]/30 to-[#ffd700]/30 border border-[#ff69b4]/50 shadow-lg shadow-[#ff69b4]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КЛК 2:</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.karmaCode2)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КЛК2", isParent1) 
                          ? "text-[#ff69b4] animate-pulse" 
                          : "text-[#ff69b4] hover:text-[#ffd700]"
                      }`}
                    >
                      {result1.karmaCode2}
                    </button>
                  </div>
                  <div 
                    ref={el => { if (isParent1) parentRefs.current["КЛК3"] = el; else childRefs.current["КЛК3"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КЛК3", isParent1) 
                        ? "bg-gradient-to-r from-[#ff69b4]/30 to-[#ffd700]/30 border border-[#ff69b4]/50 shadow-lg shadow-[#ff69b4]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КЛК 3:</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.karmaCode3)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КЛК3", isParent1) 
                          ? "text-[#ff69b4] animate-pulse" 
                          : "text-[#ff69b4] hover:text-[#ffd700]"
                      }`}
                    >
                      {result1.karmaCode3}
                    </button>
                  </div>
                  <div 
                    ref={el => { if (isParent1) parentRefs.current["КЛК4"] = el; else childRefs.current["КЛК4"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КЛК4", isParent1) 
                        ? "bg-gradient-to-r from-[#ff69b4]/30 to-[#ffd700]/30 border border-[#ff69b4]/50 shadow-lg shadow-[#ff69b4]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КЛК 4:</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.karmaCode4)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КЛК4", isParent1) 
                          ? "text-[#ff69b4] animate-pulse" 
                          : "text-[#ff69b4] hover:text-[#ffd700]"
                      }`}
                    >
                      {result1.karmaCode4}
                    </button>
                  </div>
                </div>
              </div>

              {/* Дата 2 */}
              <div className="glass-card p-5 relative z-20">
                <h3 className="text-center text-lg font-bold text-[#ffd700] mb-4">
                  {isParent1 ? "Ребёнок" : "Родитель"}: {date2}
                </h3>
                <div className="space-y-2">
                  <div 
                    ref={el => { if (!isParent1) parentRefs.current["КР"] = el; else childRefs.current["КР"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КР", !isParent1) 
                        ? "bg-gradient-to-r from-[#ffd700]/30 to-[#ff69b4]/30 border border-[#ffd700]/50 shadow-lg shadow-[#ffd700]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КР (Код рождения):</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.birthCode)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КР", !isParent1) 
                          ? "text-[#ffd700] animate-pulse" 
                          : "text-[#ffd700] hover:text-[#ff69b4]"
                      }`}
                    >
                      {result2.birthCode}
                    </button>
                  </div>
                  <div 
                    ref={el => { if (!isParent1) parentRefs.current["КС1"] = el; else childRefs.current["КС1"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КС1", !isParent1) 
                        ? "bg-gradient-to-r from-[#ffd700]/30 to-[#ff69b4]/30 border border-[#ffd700]/50 shadow-lg shadow-[#ffd700]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КС1 (Код судьбы 1):</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.destinyCode1)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КС1", !isParent1) 
                          ? "text-[#ffd700] animate-pulse" 
                          : "text-[#ffd700] hover:text-[#ff69b4]"
                      }`}
                    >
                      {result2.destinyCode1}
                    </button>
                  </div>
                  <div 
                    ref={el => { if (!isParent1) parentRefs.current["КС2"] = el; else childRefs.current["КС2"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КС2", !isParent1) 
                        ? "bg-gradient-to-r from-[#ffd700]/30 to-[#ff69b4]/30 border border-[#ffd700]/50 shadow-lg shadow-[#ffd700]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КС2 (Код судьбы 2):</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.destinyCode2)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КС2", !isParent1) 
                          ? "text-[#ffd700] animate-pulse" 
                          : "text-[#ffd700] hover:text-[#ff69b4]"
                      }`}
                    >
                      {result2.destinyCode2}
                    </button>
                  </div>
                  <div className="border-t border-[#ffd700]/20 my-3"></div>
                  <div 
                    ref={el => { if (!isParent1) parentRefs.current["КЛК1"] = el; else childRefs.current["КЛК1"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КЛК1", !isParent1) 
                        ? "bg-gradient-to-r from-[#ff69b4]/30 to-[#ffd700]/30 border border-[#ff69b4]/50 shadow-lg shadow-[#ff69b4]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КЛК 1:</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.karmaCode1)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КЛК1", !isParent1) 
                          ? "text-[#ff69b4] animate-pulse" 
                          : "text-[#ff69b4] hover:text-[#ffd700]"
                      }`}
                    >
                      {result2.karmaCode1}
                    </button>
                  </div>
                  <div 
                    ref={el => { if (!isParent1) parentRefs.current["КЛК2"] = el; else childRefs.current["КЛК2"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КЛК2", !isParent1) 
                        ? "bg-gradient-to-r from-[#ff69b4]/30 to-[#ffd700]/30 border border-[#ff69b4]/50 shadow-lg shadow-[#ff69b4]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КЛК 2:</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.karmaCode2)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КЛК2", !isParent1) 
                          ? "text-[#ff69b4] animate-pulse" 
                          : "text-[#ff69b4] hover:text-[#ffd700]"
                      }`}
                    >
                      {result2.karmaCode2}
                    </button>
                  </div>
                  <div 
                    ref={el => { if (!isParent1) parentRefs.current["КЛК3"] = el; else childRefs.current["КЛК3"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КЛК3", !isParent1) 
                        ? "bg-gradient-to-r from-[#ff69b4]/30 to-[#ffd700]/30 border border-[#ff69b4]/50 shadow-lg shadow-[#ff69b4]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КЛК 3:</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.karmaCode3)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КЛК3", !isParent1) 
                          ? "text-[#ff69b4] animate-pulse" 
                          : "text-[#ff69b4] hover:text-[#ffd700]"
                      }`}
                    >
                      {result2.karmaCode3}
                    </button>
                  </div>
                  <div 
                    ref={el => { if (!isParent1) parentRefs.current["КЛК4"] = el; else childRefs.current["КЛК4"] = el; }}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                      isHighlighted("КЛК4", !isParent1) 
                        ? "bg-gradient-to-r from-[#ff69b4]/30 to-[#ffd700]/30 border border-[#ff69b4]/50 shadow-lg shadow-[#ff69b4]/20" 
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-[#e8d5f5] text-sm">КЛК 4:</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.karmaCode4)}
                      className={`font-bold text-lg transition-colors cursor-pointer ${
                        isHighlighted("КЛК4", !isParent1) 
                          ? "text-[#ff69b4] animate-pulse" 
                          : "text-[#ff69b4] hover:text-[#ffd700]"
                      }`}
                    >
                      {result2.karmaCode4}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Кармические переходы */}
            {matches.length > 0 && (
              <section className="glass-card p-6 mb-6 border-[#ffd700]/30 animate-pulse-slow">
                <h2 className="text-xl font-bold text-[#ffd700] mb-4 text-center">
                  🔥 Обнаружены Кармические Переходы!
                </h2>
                <p className="text-[#e8d5f5] text-sm text-center mb-4">
                  Коды Кармы родителя передались в верхние коды ребёнка:
                </p>
                <div className="space-y-3">
                  {matches.map((match, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#ffd700]/10 to-[#ff69b4]/10 border border-[#ffd700]/30">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ff69b4] flex items-center justify-center text-[#1a0a2e] font-bold text-xl shadow-lg">
                        {match.code}
                      </div>
                      <div className="flex-1">
                        <p className="text-[#e8d5f5] text-sm">
                          <span className="text-[#ff69b4] font-bold">Родитель ({match.parentField})</span>
                          <span className="mx-2 text-[#ffd700]">→</span>
                          <span className="text-[#ffd700] font-bold">Ребёнок ({match.childField})</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[#e8d5f5]/80 text-sm mt-4 text-center italic">
                  Эти совпадения показывают переход кармы от родителя к ребёнку. 
                  Обратите внимание на эти коды — они несут важные уроки для ваших отношений.
                </p>
              </section>
            )}

            {matches.length === 0 && (
              <section className="glass-card p-6 mb-6">
                <p className="text-[#e8d5f5] text-center">
                  Кармических переходов между этими датами не обнаружено.
                </p>
              </section>
            )}

            {/* Кнопки перехода на другие калькуляторы */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={onGoToLesson}
                className="py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30"
              >
                📖 Узнать свой Урок года
              </button>
              <button
                onClick={onBack}
                className="py-4 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ff69b4] text-[#1a0a2e] font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-yellow-500/30"
              >
                🔙 Вернуться к кодам
              </button>
            </div>
          </div>
        )}

        {/* Футер */}
        <footer className="text-center text-[#e8d5f5]/60 text-xs pb-6">
          <p>✨ Коды Кармы ✨</p>
        </footer>
      </div>
    </div>
  );
}
