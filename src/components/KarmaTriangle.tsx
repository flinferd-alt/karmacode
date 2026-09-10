import { useState } from "react";

export interface TriangleData {
  // Верхний ряд (1 кружок)
  moneyCode?: number | null;
  // Второй ряд (2 кружка)
  yearLesson?: number | null;
  yearResource?: number | null;
  // Третий ряд (4 кружка)
  karmaCode1?: number | null;
  karmaCode2?: number | null;
  karmaCode3?: number | null;
  karmaCode4?: number | null;
  // Четвёртый ряд (3 кружка)
  birthCode?: number | null;
  destinyCode1?: number | null;
  destinyCode2?: number | null;
}

interface KarmaTriangleProps {
  data: TriangleData;
  highlightedCodes?: number[]; // Коды для подсветки (совпадения)
  title?: string;
}

interface CircleProps {
  value: number | null | undefined;
  label: string;
  highlighted?: boolean;
  tooltip?: string;
}

function KarmaCircle({ value, label, highlighted, tooltip }: CircleProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const hasValue = value !== null && value !== undefined;
  
  return (
    <div 
      className="relative flex flex-col items-center"
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div 
        className={`
          w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center
          font-bold text-lg md:text-xl transition-all duration-300
          ${hasValue 
            ? highlighted 
              ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-purple-900 shadow-lg shadow-yellow-400/50 animate-pulse-slow"
              : "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md"
            : "bg-gray-200 text-gray-400"
          }
        `}
      >
        {hasValue ? value : "—"}
      </div>
      <span className="text-xs text-purple-700 mt-1 text-center leading-tight max-w-[80px]">
        {label}
      </span>
      
      {/* Tooltip */}
      {showTooltip && tooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-purple-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-purple-900"></div>
        </div>
      )}
    </div>
  );
}

export default function KarmaTriangle({ data, highlightedCodes = [], title }: KarmaTriangleProps) {
  const isHighlighted = (code: number | null | undefined) => 
    code !== null && code !== undefined && highlightedCodes.includes(code);

  return (
    <div className="relative w-full max-w-md mx-auto my-8">
      {/* Светлый фон с градиентом */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-purple-100 rounded-3xl shadow-xl"></div>
      
      {/* Содержимое */}
      <div className="relative p-6 md:p-8">
        {title && (
          <h3 className="text-center text-lg font-bold text-purple-800 mb-6">{title}</h3>
        )}
        
        {/* Треугольник */}
        <div className="flex flex-col items-center gap-4 md:gap-6">
          
          {/* Ряд 1: Денежный код (1 кружок) */}
          <div className="flex justify-center">
            <KarmaCircle 
              value={data.moneyCode} 
              label="Денежный код"
              highlighted={isHighlighted(data.moneyCode)}
              tooltip={data.moneyCode ? `Код: ${data.moneyCode}` : undefined}
            />
          </div>
          
          {/* Ряд 2: Урок года и Ресурс года (2 кружка) */}
          <div className="flex justify-center gap-6 md:gap-10">
            <KarmaCircle 
              value={data.yearLesson} 
              label="Урок года"
              highlighted={isHighlighted(data.yearLesson)}
              tooltip={data.yearLesson ? `Код: ${data.yearLesson}` : undefined}
            />
            <KarmaCircle 
              value={data.yearResource} 
              label="Ресурс года"
              highlighted={isHighlighted(data.yearResource)}
              tooltip={data.yearResource ? `Код: ${data.yearResource}` : undefined}
            />
          </div>
          
          {/* Ряд 3: Коды Кармы 1-4 (4 кружка) */}
          <div className="flex justify-center gap-3 md:gap-5">
            <KarmaCircle 
              value={data.karmaCode1} 
              label="Код Кармы 1"
              highlighted={isHighlighted(data.karmaCode1)}
              tooltip={data.karmaCode1 ? `КЛК 1: ${data.karmaCode1}` : undefined}
            />
            <KarmaCircle 
              value={data.karmaCode2} 
              label="Код Кармы 2"
              highlighted={isHighlighted(data.karmaCode2)}
              tooltip={data.karmaCode2 ? `КЛК 2: ${data.karmaCode2}` : undefined}
            />
            <KarmaCircle 
              value={data.karmaCode3} 
              label="Код Кармы 3"
              highlighted={isHighlighted(data.karmaCode3)}
              tooltip={data.karmaCode3 ? `КЛК 3: ${data.karmaCode3}` : undefined}
            />
            <KarmaCircle 
              value={data.karmaCode4} 
              label="Код Кармы 4"
              highlighted={isHighlighted(data.karmaCode4)}
              tooltip={data.karmaCode4 ? `КЛК 4: ${data.karmaCode4}` : undefined}
            />
          </div>
          
          {/* Ряд 4: Код рождения, Коды судьбы (3 кружка) */}
          <div className="flex justify-center gap-6 md:gap-10">
            <KarmaCircle 
              value={data.birthCode} 
              label="Код рождения"
              highlighted={isHighlighted(data.birthCode)}
              tooltip={data.birthCode ? `КР: ${data.birthCode}` : undefined}
            />
            <KarmaCircle 
              value={data.destinyCode1} 
              label="Код судьбы 1"
              highlighted={isHighlighted(data.destinyCode1)}
              tooltip={data.destinyCode1 ? `КС 1: ${data.destinyCode1}` : undefined}
            />
            <KarmaCircle 
              value={data.destinyCode2} 
              label="Код судьбы 2"
              highlighted={isHighlighted(data.destinyCode2)}
              tooltip={data.destinyCode2 ? `КС 2: ${data.destinyCode2}` : undefined}
            />
          </div>
        </div>
        
        {/* Декоративный треугольник */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          viewBox="0 0 400 500"
          preserveAspectRatio="none"
        >
          <path 
            d="M 200 50 L 350 450 L 50 450 Z" 
            fill="none" 
            stroke="url(#goldGradient)" 
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
