import { useState } from "react";
import KarmaTriangle, { TriangleData } from "../components/KarmaTriangle";

interface KarmicConnectionPageProps {
  onBack: () => void;
  onCodeClick?: (code: number) => void;
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
  if (num === 0) return 22; // Правило Шута
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
  // Парсим дату в формате дд.мм.гггг
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) return null;
  
  // КР - код рождения (день)
  const birthCode = reduceTo22(day);
  
  // КС1 - код судьбы 1 (сумма ВСЕХ цифр даты)
  const allDigitsSum = sumOfDigits(day) + sumOfDigits(month) + sumOfDigits(year);
  const destinyCode1 = reduceTo22(allDigitsSum);
  
  // Для КС2 и КЛК нужно привести день, месяц, год отдельно
  const D = reduceTo22(day);
  const M = reduceTo22(month);
  const Y = reduceTo22(sumOfDigits(year));
  
  // КС2 - код судьбы 2 (сумма приведенных D, M, Y)
  const destinyCode2 = reduceTo22(D + M + Y);
  
  // КЛК1 - |D - M|
  let karmaCode1 = Math.abs(D - M);
  if (karmaCode1 === 0) karmaCode1 = 22;
  
  // КЛК2 - |D - Y|
  let karmaCode2 = Math.abs(D - Y);
  if (karmaCode2 === 0) karmaCode2 = 22;
  
  // КЛК3 - |КЛК1 - КЛК2|
  let karmaCode3 = Math.abs(karmaCode1 - karmaCode2);
  if (karmaCode3 === 0) karmaCode3 = 22;
  
  // КЛК4 - |M - Y|
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
  const month = parseInt(parts[1]) - 1; // Месяцы в JS с 0
  const year = parseInt(parts[2]);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month, day);
}

// Поиск кармических переходов от родителя к ребенку
function findKarmicMatches(parent: CalcResult, child: CalcResult): KarmicMatch[] {
  const matches: KarmicMatch[] = [];
  
  // Верхние коды ребенка (КР, КС1, КС2)
  const childTopCodes = [
    { code: child.birthCode, field: "КР" },
    { code: child.destinyCode1, field: "КС1" },
    { code: child.destinyCode2, field: "КС2" }
  ];
  
  // Кода Кармы родителя (КЛК1-4)
  const parentKarmaCodes = [
    { code: parent.karmaCode1, field: "КЛК1" },
    { code: parent.karmaCode2, field: "КЛК2" },
    { code: parent.karmaCode3, field: "КЛК3" },
    { code: parent.karmaCode4, field: "КЛК4" }
  ];
  
  // Проверяем совпадения
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

export default function KarmicConnectionPage({ onBack, onCodeClick }: KarmicConnectionPageProps) {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result1, setResult1] = useState<CalcResult | null>(null);
  const [result2, setResult2] = useState<CalcResult | null>(null);
  const [isParent1, setIsParent1] = useState<boolean>(true);
  const [matches, setMatches] = useState<KarmicMatch[]>([]);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    
    const res1 = calculateCodes(date1);
    const res2 = calculateCodes(date2);
    
    if (!res1 || !res2) {
      setError("Пожалуйста, введите корректные даты в формате дд.мм.гггг");
      return;
    }
    
    // Определяем, кто родитель (более ранняя дата)
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
    
    // Находим кармические переходы
    const karmicMatches = findKarmicMatches(parent, child);
    setMatches(karmicMatches);
    
    setResult1(res1);
    setResult2(res2);
  };

  // Получаем коды для подсветки в треугольниках
  const getHighlightedCodes = (isParent: boolean): number[] => {
    if (matches.length === 0) return [];
    
    const highlighted: number[] = [];
    
    if (isParent) {
      // Для родителя подсвечиваем КЛК, которые совпадают с верхними кодами ребенка
      const parent = isParent1 ? result1 : result2;
      if (parent) {
        matches.forEach(match => {
          if (match.parentField === "КЛК1") highlighted.push(parent.karmaCode1);
          if (match.parentField === "КЛК2") highlighted.push(parent.karmaCode2);
          if (match.parentField === "КЛК3") highlighted.push(parent.karmaCode3);
          if (match.parentField === "КЛК4") highlighted.push(parent.karmaCode4);
        });
      }
    } else {
      // Для ребенка подсвечиваем верхние коды, которые совпадают с КЛК родителя
      const child = isParent1 ? result2 : result1;
      if (child) {
        matches.forEach(match => {
          if (match.childField === "КР") highlighted.push(child.birthCode);
          if (match.childField === "КС1") highlighted.push(child.destinyCode1);
          if (match.childField === "КС2") highlighted.push(child.destinyCode2);
        });
      }
    }
    
    return highlighted;
  };

  const parentHighlighted = result1 && result2 ? getHighlightedCodes(true) : [];
  const childHighlighted = result1 && result2 ? getHighlightedCodes(false) : [];

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
                onChange={(e) => setDate1(e.target.value)}
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
                onChange={(e) => setDate2(e.target.value)}
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

            {/* Треугольники */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <KarmaTriangle
                  data={{
                    birthCode: result1.birthCode,
                    destinyCode1: result1.destinyCode1,
                    destinyCode2: result1.destinyCode2,
                    karmaCode1: result1.karmaCode1,
                    karmaCode2: result1.karmaCode2,
                    karmaCode3: result1.karmaCode3,
                    karmaCode4: result1.karmaCode4
                  }}
                  highlightedCodes={isParent1 ? parentHighlighted : childHighlighted}
                  title={`${isParent1 ? "Родитель" : "Ребёнок"}: ${date1}`}
                  onCodeClick={onCodeClick}
                />
              </div>
              <div>
                <KarmaTriangle
                  data={{
                    birthCode: result2.birthCode,
                    destinyCode1: result2.destinyCode1,
                    destinyCode2: result2.destinyCode2,
                    karmaCode1: result2.karmaCode1,
                    karmaCode2: result2.karmaCode2,
                    karmaCode3: result2.karmaCode3,
                    karmaCode4: result2.karmaCode4
                  }}
                  highlightedCodes={isParent1 ? childHighlighted : parentHighlighted}
                  title={`${isParent1 ? "Ребёнок" : "Родитель"}: ${date2}`}
                  onCodeClick={onCodeClick}
                />
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
