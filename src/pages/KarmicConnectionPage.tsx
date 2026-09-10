import { useState } from "react";

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

export default function KarmicConnectionPage({ onBack, onCodeClick }: KarmicConnectionPageProps) {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result1, setResult1] = useState<CalcResult | null>(null);
  const [result2, setResult2] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    
    const res1 = calculateCodes(date1);
    const res2 = calculateCodes(date2);
    
    if (!res1 || !res2) {
      setError("Пожалуйста, введите корректные даты в формате дд.мм.гггг");
      return;
    }
    
    setResult1(res1);
    setResult2(res2);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] text-white relative overflow-hidden">
      <div className="stars-bg" />
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-6">
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
              <label className="block text-[#e8d5f5] text-sm mb-2">Ваша Дата</label>
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
              <label className="block text-[#e8d5f5] text-sm mb-2">Дата того, с кем проверяем связь</label>
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
            {/* Таблички с кодами */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Дата 1 */}
              <div className="glass-card p-5">
                <h3 className="text-center text-lg font-bold text-[#ffd700] mb-4">
                  Дата 1: {date1}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КР (Код рождения):</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.birthCode)}
                      className="text-[#ffd700] font-bold text-lg hover:text-[#ff69b4] transition-colors cursor-pointer"
                    >
                      {result1.birthCode}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КС1 (Код судьбы 1):</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.destinyCode1)}
                      className="text-[#ffd700] font-bold text-lg hover:text-[#ff69b4] transition-colors cursor-pointer"
                    >
                      {result1.destinyCode1}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КС2 (Код судьбы 2):</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.destinyCode2)}
                      className="text-[#ffd700] font-bold text-lg hover:text-[#ff69b4] transition-colors cursor-pointer"
                    >
                      {result1.destinyCode2}
                    </button>
                  </div>
                  <div className="border-t border-[#ffd700]/20 my-3"></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КЛК 1:</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.karmaCode1)}
                      className="text-[#ff69b4] font-bold text-lg hover:text-[#ffd700] transition-colors cursor-pointer"
                    >
                      {result1.karmaCode1}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КЛК 2:</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.karmaCode2)}
                      className="text-[#ff69b4] font-bold text-lg hover:text-[#ffd700] transition-colors cursor-pointer"
                    >
                      {result1.karmaCode2}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КЛК 3:</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.karmaCode3)}
                      className="text-[#ff69b4] font-bold text-lg hover:text-[#ffd700] transition-colors cursor-pointer"
                    >
                      {result1.karmaCode3}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КЛК 4:</span>
                    <button 
                      onClick={() => onCodeClick?.(result1.karmaCode4)}
                      className="text-[#ff69b4] font-bold text-lg hover:text-[#ffd700] transition-colors cursor-pointer"
                    >
                      {result1.karmaCode4}
                    </button>
                  </div>
                </div>
              </div>

              {/* Дата 2 */}
              <div className="glass-card p-5">
                <h3 className="text-center text-lg font-bold text-[#ffd700] mb-4">
                  Дата 2: {date2}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КР (Код рождения):</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.birthCode)}
                      className="text-[#ffd700] font-bold text-lg hover:text-[#ff69b4] transition-colors cursor-pointer"
                    >
                      {result2.birthCode}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КС1 (Код судьбы 1):</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.destinyCode1)}
                      className="text-[#ffd700] font-bold text-lg hover:text-[#ff69b4] transition-colors cursor-pointer"
                    >
                      {result2.destinyCode1}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КС2 (Код судьбы 2):</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.destinyCode2)}
                      className="text-[#ffd700] font-bold text-lg hover:text-[#ff69b4] transition-colors cursor-pointer"
                    >
                      {result2.destinyCode2}
                    </button>
                  </div>
                  <div className="border-t border-[#ffd700]/20 my-3"></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КЛК 1:</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.karmaCode1)}
                      className="text-[#ff69b4] font-bold text-lg hover:text-[#ffd700] transition-colors cursor-pointer"
                    >
                      {result2.karmaCode1}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КЛК 2:</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.karmaCode2)}
                      className="text-[#ff69b4] font-bold text-lg hover:text-[#ffd700] transition-colors cursor-pointer"
                    >
                      {result2.karmaCode2}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КЛК 3:</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.karmaCode3)}
                      className="text-[#ff69b4] font-bold text-lg hover:text-[#ffd700] transition-colors cursor-pointer"
                    >
                      {result2.karmaCode3}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span className="text-[#e8d5f5] text-sm">КЛК 4:</span>
                    <button 
                      onClick={() => onCodeClick?.(result2.karmaCode4)}
                      className="text-[#ff69b4] font-bold text-lg hover:text-[#ffd700] transition-colors cursor-pointer"
                    >
                      {result2.karmaCode4}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Кнопка назад */}
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl border border-[#ffd700]/30 text-[#ffd700] font-medium text-sm hover:bg-[#ffd700]/10 transition-colors mb-6"
        >
          ← Вернуться назад
        </button>

        {/* Футер */}
        <footer className="text-center text-[#e8d5f5]/60 text-xs pb-6">
          <p>✨ Коды Кармы ✨</p>
        </footer>
      </div>
    </div>
  );
}
