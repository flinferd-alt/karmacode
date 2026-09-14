import { useState } from "react";

interface CalendarModalProps {
  onClose: () => void;
}

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

export default function CalendarModal({ onClose }: CalendarModalProps) {
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

// Форматирование даты для Google Calendar (UTC формат)
function formatGoogleDate(date: string, time: string): string {
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
