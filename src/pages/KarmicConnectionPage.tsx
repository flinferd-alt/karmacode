import { useState } from "react";
import KarmaTriangle, { TriangleData } from "../components/KarmaTriangle";
import jsPDF from "jspdf";

interface KarmicConnectionPageProps {
  onBack: () => void;
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
  if (num <= 0) return 1;
  while (num > 22) {
    num -= 22;
  }
  return num;
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
  
  // КР - код рождения
  const birthCode = reduceTo22(day);
  
  // КС1 - код судьбы 1 (сумма всех цифр даты)
  const allDigitsSum = day + month + year;
  const destinyCode1 = reduceTo22(allDigitsSum);
  
  // КС2 - код судьбы 2 (сумма дня, месяца, года)
  const dayMonthYearSum = day + month + year;
  const destinyCode2 = reduceTo22(dayMonthYearSum);
  
  // Приводим день, месяц, год к 1-22 для КЛК
  const dayReduced = reduceTo22(day);
  const monthReduced = reduceTo22(month);
  const yearReduced = reduceTo22(year);
  
  // КЛК1 - разница между днём и месяцем
  let karmaCode1: number;
  if (dayReduced === monthReduced) {
    karmaCode1 = 22;
  } else if (dayReduced > monthReduced) {
    karmaCode1 = dayReduced - monthReduced;
  } else {
    karmaCode1 = monthReduced - dayReduced;
  }
  
  // КЛК2 - разница между днём и годом
  let karmaCode2: number;
  if (dayReduced === yearReduced) {
    karmaCode2 = 22;
  } else if (dayReduced > yearReduced) {
    karmaCode2 = dayReduced - yearReduced;
  } else {
    karmaCode2 = yearReduced - dayReduced;
  }
  
  // КЛК3 - разница между КЛК1 и КЛК2
  let karmaCode3: number;
  if (karmaCode1 === karmaCode2) {
    karmaCode3 = 22;
  } else if (karmaCode1 > karmaCode2) {
    karmaCode3 = karmaCode1 - karmaCode2;
  } else {
    karmaCode3 = karmaCode2 - karmaCode1;
  }
  
  // КЛК4 - разница между месяцем и годом
  let karmaCode4: number;
  if (monthReduced === yearReduced) {
    karmaCode4 = 22;
  } else if (monthReduced > yearReduced) {
    karmaCode4 = monthReduced - yearReduced;
  } else {
    karmaCode4 = yearReduced - monthReduced;
  }
  
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

export default function KarmicConnectionPage({ onBack }: KarmicConnectionPageProps) {
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

  const handleExportPDF = () => {
    if (!result1 || !result2) return;
    
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Кармическая связь", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Дата 1: ${date1}`, 20, 40);
    doc.text(`КР: ${result1.birthCode}`, 20, 50);
    doc.text(`КС1: ${result1.destinyCode1}`, 20, 60);
    doc.text(`КС2: ${result1.destinyCode2}`, 20, 70);
    doc.text(`КЛК1: ${result1.karmaCode1}`, 20, 80);
    doc.text(`КЛК2: ${result1.karmaCode2}`, 20, 90);
    doc.text(`КЛК3: ${result1.karmaCode3}`, 20, 100);
    doc.text(`КЛК4: ${result1.karmaCode4}`, 20, 110);
    
    doc.text(`Дата 2: ${date2}`, 20, 130);
    doc.text(`КР: ${result2.birthCode}`, 20, 140);
    doc.text(`КС1: ${result2.destinyCode1}`, 20, 150);
    doc.text(`КС2: ${result2.destinyCode2}`, 20, 160);
    doc.text(`КЛК1: ${result2.karmaCode1}`, 20, 170);
    doc.text(`КЛК2: ${result2.karmaCode2}`, 20, 180);
    doc.text(`КЛК3: ${result2.karmaCode3}`, 20, 190);
    doc.text(`КЛК4: ${result2.karmaCode4}`, 20, 200);
    
    // Находим совпадения
    const matches = findMatches(result1, result2);
    if (matches.length > 0) {
      doc.text("Совпадения кодов:", 20, 220);
      matches.forEach((match, i) => {
        doc.text(`• Код ${match.code}: ${match.desc}`, 25, 230 + i * 10);
      });
    }
    
    doc.save("karmic-connection.pdf");
  };

  const handleShareVK = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Проверьте свою кармическую связь!");
    window.open(`https://vk.com/share.php?url=${url}&title=${text}`, "_blank");
  };

  const handleShareTelegram = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Проверьте свою кармическую связь!");
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
  };

  // Находим совпадения между двумя результатами
  const findMatches = (res1: CalcResult, res2: CalcResult) => {
    const matches: { code: number; desc: string }[] = [];
    
    const top1 = [res1.birthCode, res1.destinyCode1, res1.destinyCode2];
    const top2 = [res2.birthCode, res2.destinyCode1, res2.destinyCode2];
    const bottom1 = [res1.karmaCode1, res1.karmaCode2, res1.karmaCode3, res1.karmaCode4];
    const bottom2 = [res2.karmaCode1, res2.karmaCode2, res2.karmaCode3, res2.karmaCode4];
    
    // Проверяем совпадения верхних кодов одной даты с нижними кодами другой
    top1.forEach((code, i) => {
      if (bottom2.includes(code)) {
        const labels = ["КР", "КС1", "КС2"];
        matches.push({ code, desc: `${labels[i]} даты 1 совпадает с КЛК даты 2` });
      }
    });
    
    top2.forEach((code, i) => {
      if (bottom1.includes(code)) {
        const labels = ["КР", "КС1", "КС2"];
        matches.push({ code, desc: `${labels[i]} даты 2 совпадает с КЛК даты 1` });
      }
    });
    
    return matches;
  };

  const matches = result1 && result2 ? findMatches(result1, result2) : [];
  
  // Подсвечиваем совпадающие коды
  const highlighted1 = result1 && result2 ? 
    [result2.birthCode, result2.destinyCode1, result2.destinyCode2].filter(c => 
      [result1.karmaCode1, result1.karmaCode2, result1.karmaCode3, result1.karmaCode4].includes(c)
    ) : [];
  
  const highlighted2 = result1 && result2 ?
    [result1.birthCode, result1.destinyCode1, result1.destinyCode2].filter(c =>
      [result2.karmaCode1, result2.karmaCode2, result2.karmaCode3, result2.karmaCode4].includes(c)
    ) : [];

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
                  highlightedCodes={highlighted1}
                  title="Дата 1"
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
                  highlightedCodes={highlighted2}
                  title="Дата 2"
                />
              </div>
            </div>

            {/* Совпадения */}
            {matches.length > 0 && (
              <section className="glass-card p-6 mb-6 border-[#ffd700]/30 animate-pulse-slow">
                <h2 className="text-xl font-bold text-[#ffd700] mb-4 text-center">
                  🔥 Обнаружена Кармическая Связь!
                </h2>
                <div className="space-y-2">
                  {matches.map((match, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#ffd700]/10 to-[#ff69b4]/10 border border-[#ffd700]/20">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ff69b4] flex items-center justify-center text-[#1a0a2e] font-bold">
                        {match.code}
                      </div>
                      <p className="text-[#e8d5f5] text-sm">{match.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[#e8d5f5]/80 text-sm mt-4 text-center italic">
                  Эти совпадения показывают переход кармы между вами. 
                  Обратите внимание на эти коды — они несут важные уроки для ваших отношений.
                </p>
              </section>
            )}

            {matches.length === 0 && (
              <section className="glass-card p-6 mb-6">
                <p className="text-[#e8d5f5] text-center">
                  Прямых кармических связей между этими датами не обнаружено. 
                  Но это не значит, что связи нет — она может проявляться через другие аспекты.
                </p>
              </section>
            )}

            {/* Кнопки экспорта */}
            <section className="glass-card p-6 mb-6">
              <h3 className="text-lg font-bold text-[#ffd700] mb-4 text-center">
                Поделиться результатами
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={handleExportPDF}
                  className="py-3 px-4 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
                >
                  📄 PDF
                </button>
                <button
                  onClick={handleShareVK}
                  className="py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                  💙 VK
                </button>
                <button
                  onClick={handleShareTelegram}
                  className="py-3 px-4 rounded-xl bg-sky-500 text-white font-semibold text-sm hover:bg-sky-600 transition-colors"
                >
                  ✈️ Telegram
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Ссылка скопирована!");
                  }}
                  className="py-3 px-4 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition-colors"
                >
                  🔗 Копировать
                </button>
              </div>
            </section>
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
