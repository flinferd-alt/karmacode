import { useState } from "react";
import { yearLessons2026 } from "../data/yearLessons2026";
import KarmaTriangle from "../components/KarmaTriangle";

interface YearLessonPageProps {
  lessonCode: number;
  onBack: () => void;
  onCodeClick?: (code: number) => void;
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

export default function YearLessonPage({ lessonCode, onBack, onCodeClick }: YearLessonPageProps) {
  const [expandedSign, setExpandedSign] = useState<number | null>(null);
  const [showAllSigns, setShowAllSigns] = useState(false);

  const lessonData = yearLessons2026[lessonCode];

  if (!lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-purple-600 text-xl animate-pulse">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Заголовок */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-3">📖</div>
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">
            КАРМИЧЕСКИЙ УРОК 2026 ГОДА
          </h1>
        </header>

        {/* Треугольник */}
        <KarmaTriangle 
          data={{ yearLesson: lessonCode }}
          title="Ваш Урок Года"
          onCodeClick={onCodeClick}
        />

        {/* Вступление */}
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200 animate-fade-in-delay">
          <p className="text-gray-800 leading-relaxed text-sm md:text-base mb-4">
            Сентябрь 2026 года — это зеркало 2027 года. Сентябрь формирует события, которые придут к вам в следующем году. И Урок года, рассчитанный по вашей дате рождения, показывает - что нужно сделать до конца 2026 года, чтобы 2027 год прожить легче.
          </p>
          <p className="text-gray-800 leading-relaxed text-sm md:text-base mb-4">
            Урок Года объясняет, какие качества вам сейчас стоит развить, какие сложности, какой путь пройти, чему научиться.
          </p>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
            <p className="text-gray-800 text-sm md:text-base">
              <span className="text-green-600 font-bold">➕</span> Когда вы следуете кармическим урокам года, вы быстрее достигаете целей, меньше ошибаетесь, а жизнь становится понятнее. И конечно можно прогулять эти уроки, НО…..
            </p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <p className="text-gray-800 text-sm md:text-base">
              <span className="text-red-600 font-bold">➖</span> Если их игнорировать, уроки все равно пройти придется, но в более жесткой форме. Например, через лишения, потери, неприятные ситуации.
            </p>
          </div>
          <p className="text-gray-800 leading-relaxed text-sm md:text-base mb-4">
            Одни и те же проблемы могут возвращаться снова и снова, лишая сил и надежды на то, что «все наладится». Это похоже на блуждание в лабиринте, из которого выход никак не найти.
          </p>
          <p className="text-purple-900 font-semibold text-center text-base md:text-lg mt-6">
            Кармические уроки — не наказание, а подсказки.
          </p>
        </section>

        {/* 9 признаков */}
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200 animate-fade-in-delay">
          <h2 className="text-xl font-bold text-purple-900 mb-4 text-center">
            9 признаков того, что Карма Включилась
          </h2>
          
          <div className="space-y-2">
            {SIGNS_TEXT.map((sign) => (
              <div key={sign.num} className="border border-purple-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setExpandedSign(expandedSign === sign.num ? null : sign.num)}
                  className="w-full p-3 flex items-center gap-3 text-left hover:bg-purple-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {sign.num}
                  </div>
                  <span className="text-gray-800 text-sm flex-1">
                    {sign.text.split(".")[0]}.
                  </span>
                  <span className={`text-purple-600 transition-transform ${expandedSign === sign.num ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                
                {(expandedSign === sign.num || showAllSigns) && (
                  <div className="px-3 pb-3 pt-0 animate-fade-in">
                    <p className="text-gray-700 text-sm pl-11 leading-relaxed">
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
            className="mt-4 w-full py-2 text-sm text-purple-700 hover:text-pink-600 transition-colors font-medium"
          >
            {showAllSigns ? "Свернуть все" : "Развернуть все"}
          </button>
        </section>

        {/* Вывод */}
        <section className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 mb-6 border-2 border-purple-300 animate-fade-in-delay-2">
          <p className="text-gray-800 leading-relaxed text-sm md:text-base italic">
            Если вы узнали себя хотя бы в одном пункте, а тем более сразу в нескольких — значит, пришло время разобраться со своей кармой глубже: понять её задачи, увидеть повторяющиеся сценарии, осознать, какой урок сейчас проходит ваша жизнь, и начать его гармонизировать.
          </p>
          <p className="text-gray-800 leading-relaxed text-sm md:text-base mt-4">
            Именно этим мы и будем заниматься дальше на практикуме. И я очень рада, что вы оказались здесь именно сейчас. В нужное время и в нужном месте.
          </p>
        </section>

        {/* Кармические уроки 2026 года */}
        <section className="bg-white rounded-2xl p-6 mb-6 border-2 border-purple-300 shadow-lg animate-fade-in-delay-2">
          <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">
            КАРМИЧЕСКИЕ УРОКИ 2026 ГОДА
          </h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> КОД {lessonCode} — {lessonData.title}
            </h3>
            <p className="text-gray-700 font-medium mb-4">
              Ваши кармические уроки на 2026 год:
            </p>
            
            <div className="space-y-3">
              {lessonData.lessons.map((lesson, i) => (
                <div key={i} className="flex items-start gap-3 bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <span className="text-purple-600 text-xl flex-shrink-0">~</span>
                  <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                    {lesson}
                  </p>
                </div>
              ))}
            </div>

            {lessonData.summary && (
              <div className="mt-6 bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border-2 border-pink-300">
                <p className="text-gray-800 text-sm md:text-base leading-relaxed italic">
                  {lessonData.summary}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Кнопка назад */}
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base hover:opacity-90 transition-opacity shadow-lg"
        >
          ← Вернуться назад
        </button>

        {/* Футер */}
        <footer className="text-center text-gray-500 text-xs pb-6 mt-6">
          <p>✨ Коды Кармы ✨</p>
        </footer>
      </div>
    </div>
  );
}
