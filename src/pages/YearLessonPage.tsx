import { useState, useEffect } from "react";
import { getYearLessonData, YearLessonData } from "../data/yearLessons";
import KarmaTriangle from "../components/KarmaTriangle";

interface YearLessonPageProps {
  lessonCode: number;
  onBack: () => void;
}

const SIGNS_TEXT = [
  {
    num: 1,
    text: "Отношения не складываются. Мужчины исчезают, не выбирают вас, отношения повторяются по одному сценарию или знакомства будто совсем прекратились."
  },
  {
    num: 2,
    text: "Возникают суды, конфликты, штрафы, претензии. Причём часто там, где другим подобное сходило с рук, вам приходится отвечать по полной."
  },
  {
    num: 3,
    text: "Вы упёрлись в финансовый потолок. Сколько бы ни работали, доход выше определённой суммы не растёт. А если денег приходит больше — они тут же уходят на внезапные расходы."
  },
  {
    num: 4,
    text: "Долги стали тяжёлой частью жизни. Кредиты, обязательства, постоянное ощущение, что деньги приходят только для того, чтобы сразу кому-то их отдать."
  },
  {
    num: 5,
    text: "Неожиданно обостряется тема здоровья. Появляются хронические проблемы, серьёзные обследования или много сил начинает уходить на здоровье детей и близких."
  },
  {
    num: 6,
    text: "Возвращаются старые ситуации. Бывшие отношения, давние конфликты, обиды, семейные истории — то, что вы считали давно завершённым, снова появляется в жизни."
  },
  {
    num: 7,
    text: "Вы резко теряете что-то важное. Работу, отношения, деньги, бизнес, привычный уровень жизни — и приходится буквально собирать жизнь заново."
  },
  {
    num: 8,
    text: "Чёрная полоса затягивается. Только решается одна проблема — сразу появляется следующая. Возникает ощущение: «Когда это уже закончится?»"
  },
  {
    num: 9,
    text: "Вы сами пропускаете важные возможности. Забываете сделать практику, провести активацию, отправить документы, позвонить или принять решение — и вспоминаете, когда момент уже упущен."
  }
];

export default function YearLessonPage({ lessonCode, onBack }: YearLessonPageProps) {
  const [data, setData] = useState<YearLessonData | null>(null);
  const [expandedSign, setExpandedSign] = useState<number | null>(null);
  const [showAllSigns, setShowAllSigns] = useState(false);

  useEffect(() => {
    const lessonData = getYearLessonData(lessonCode);
    setData(lessonData);
  }, [lessonCode]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-purple-300 text-xl animate-pulse">Загрузка...</div>
      </div>
    );
  }

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
          <span className="text-sm">Назад</span>
        </button>

        {/* Заголовок */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-3">📖</div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ffd700] via-[#ff69b4] to-[#9b59b6] bg-clip-text text-transparent">
            Ваш Урок Года
          </h1>
          <p className="text-[#ff69b4] mt-2 text-lg font-medium">Код {lessonCode}</p>
        </header>

        {/* Треугольник */}
        <KarmaTriangle 
          data={{ yearLesson: lessonCode }}
          title="Ваш Урок Года"
        />

        {/* 9 признаков */}
        <section className="glass-card p-6 mb-6 animate-fade-in-delay">
          <h2 className="text-xl font-bold text-[#ffd700] mb-4 text-center">
            9 признаков того, что Карма Включилась
          </h2>
          
          <div className="space-y-2">
            {SIGNS_TEXT.map((sign) => (
              <div key={sign.num} className="border border-[#ffd700]/20 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedSign(expandedSign === sign.num ? null : sign.num)}
                  className="w-full p-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ff69b4] flex items-center justify-center text-[#1a0a2e] font-bold text-sm flex-shrink-0">
                    {sign.num}
                  </div>
                  <span className="text-[#e8d5f5] text-sm flex-1">
                    {sign.text.split(".")[0]}.
                  </span>
                  <span className={`text-[#ffd700] transition-transform ${expandedSign === sign.num ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                
                {expandedSign === sign.num && (
                  <div className="px-3 pb-3 pt-0 animate-fade-in">
                    <p className="text-[#e8d5f5]/80 text-sm pl-11 leading-relaxed">
                      {sign.text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Развёрнуть/свернуть все */}
          <button
            onClick={() => setShowAllSigns(!showAllSigns)}
            className="mt-4 w-full py-2 text-sm text-[#ffd700] hover:text-[#ff69b4] transition-colors"
          >
            {showAllSigns ? "Свернуть все" : "Развернуть все"}
          </button>
        </section>

        {/* Вывод */}
        <section className="glass-card p-6 mb-6 animate-fade-in-delay-2 border-[#ffd700]/30">
          <p className="text-[#e8d5f5] leading-relaxed text-sm md:text-base italic">
            Если вы узнали себя хотя бы в одном пункте, а тем более сразу в нескольких — значит, пришло время разобраться со своей кармой глубже: понять её задачи, увидеть повторяющиеся сценарии, осознать, какой урок сейчас проходит ваша жизнь, и начать его гармонизировать.
          </p>
          <p className="text-[#e8d5f5] leading-relaxed text-sm md:text-base mt-4">
            Именно этим мы и будем заниматься дальше на практикуме. И я очень рада, что вы оказались здесь именно сейчас. В нужное время и в нужном месте.
          </p>
        </section>

        {/* Описание урока года */}
        <section className="glass-card p-6 mb-6 animate-fade-in-delay-2">
          <h2 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
            <span>🌟</span> {data.title}
          </h2>
          <p className="text-[#ff69b4] text-sm font-medium mb-4 italic">
            {data.shortDesc}
          </p>
          <p className="text-[#e8d5f5] leading-relaxed text-sm md:text-base">
            {data.fullDesc}
          </p>
        </section>

        {/* Рекомендации */}
        <section className="glass-card p-6 mb-6 animate-fade-in-delay-2">
          <h2 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
            <span>💫</span> Рекомендации на год
          </h2>
          <ul className="space-y-3">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#ffd700] mt-1">✦</span>
                <span className="text-[#e8d5f5] text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Аффирмация */}
        {data.affirmation && (
          <section className="glass-card p-6 mb-6 text-center bg-gradient-to-br from-[#ffd700]/10 to-[#ff69b4]/10 border-[#ffd700]/30 animate-fade-in-delay-2">
            <div className="text-2xl mb-2">🌟</div>
            <p className="text-[#ffd700] italic text-sm md:text-base leading-relaxed">
              «{data.affirmation}»
            </p>
          </section>
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
