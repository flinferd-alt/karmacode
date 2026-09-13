import { useState, useRef, useEffect } from "react";

export interface TriangleData {
  moneyCode?: number | null;
  yearLesson?: number | null;
  yearResource?: number | null;
  karmaCode1?: number | null;
  karmaCode2?: number | null;
  karmaCode3?: number | null;
  karmaCode4?: number | null;
  birthCode?: number | null;
  destinyCode1?: number | null;
  destinyCode2?: number | null;
}

interface KarmaTriangleProps {
  data: TriangleData;
  highlightedCodes?: number[];
  title?: string;
  onCodeClick?: (code: number) => void;
}

interface CircleProps {
  value: number | null | undefined;
  x: number;
  y: number;
  size: number;
  highlighted?: boolean;
  onClick?: () => void;
}

function KarmaCircle({ value, x, y, size, highlighted, onClick }: CircleProps) {
  const hasValue = value !== null && value !== undefined;
  const isClickable = hasValue && onClick;

  const borderSize = Math.max(1, size * 0.025); // Адаптивный размер бортика

  return (
    <div
      className={`absolute flex items-center justify-center rounded-full font-bold transition-all duration-300 ${
        hasValue
          ? highlighted
            ? "bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 text-purple-900 animate-pulse-slow"
            : "bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white hover:scale-105"
          : "bg-gray-300 text-gray-500"
      } ${isClickable ? "cursor-pointer" : ""}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        transform: "translate(-50%, -50%)",
        fontSize: `${size * 0.4}px`,
        // Бортики
        boxShadow: hasValue
          ? highlighted
            ? // Активный кружок - бортик внутри с градиентом и свечением
              `inset 0 0 0 ${borderSize}px #9d0842, 0 0 ${size * 0.2}px #e42872, 0 0 ${size * 0.4}px #e42872`
            : // Неактивный кружок - бортик снаружи, дизайнерский чёрный
              `0 0 0 ${borderSize}px rgba(30, 30, 40, 0.7), 0 ${size * 0.05}px ${size * 0.15}px rgba(0, 0, 0, 0.3)`
          : // Пустой кружок
            `0 0 0 ${borderSize}px rgba(30, 30, 40, 0.5)`,
      }}
      onClick={onClick}
    >
      {hasValue ? value : "—"}
    </div>
  );
}

export default function KarmaTriangle({ data, highlightedCodes = [], title, onCodeClick }: KarmaTriangleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [circleSize, setCircleSize] = useState(80);

  const isHighlighted = (code: number | null | undefined) =>
    code !== null && code !== undefined && highlightedCodes.includes(code);

  const handleClick = (code: number | null | undefined) => {
    if (code !== null && code !== undefined && onCodeClick) {
      onCodeClick(code);
    }
  };

  // Адаптивный размер кружков
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // Размер кружка = 12% от ширины контейнера, но не меньше 40px и не больше 80px
        const newSize = Math.max(40, Math.min(80, width * 0.12));
        setCircleSize(newSize);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Координаты центров кругов (в процентах от изображения 1341x1173)
  const positions = {
    moneyCode: { x: (669 / 1341) * 100, y: (388 / 1173) * 100 },
    yearLesson: { x: (533 / 1341) * 100, y: (585 / 1173) * 100 },
    yearResource: { x: (806 / 1341) * 100, y: (585 / 1173) * 100 },
    karmaCode1: { x: (375 / 1341) * 100, y: (774 / 1173) * 100 },
    karmaCode2: { x: (569 / 1341) * 100, y: (774 / 1173) * 100 },
    karmaCode3: { x: (770 / 1341) * 100, y: (774 / 1173) * 100 },
    karmaCode4: { x: (962 / 1341) * 100, y: (774 / 1173) * 100 },
    birthCode: { x: (327 / 1341) * 100, y: (1030 / 1173) * 100 },
    destinyCode1: { x: (669 / 1341) * 100, y: (1030 / 1173) * 100 },
    destinyCode2: { x: (1011 / 1341) * 100, y: (1030 / 1173) * 100 },
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto my-8">
      {title && (
        <h3 className="text-center text-lg font-bold text-purple-800 mb-4">{title}</h3>
      )}
      
      {/* Контейнер с изображением и кругами */}
      <div className="relative w-full" style={{ paddingBottom: "87.47%" /* 1173/1341 * 100 */ }}>
        {/* Фоновое изображение */}
        <img
          src="https://annabaryshnikova.com/karma/tri.png"
          alt="Треугольник кодов"
          className="absolute inset-0 w-full h-full object-contain"
        />
        
        {/* Круги с кодами */}
        <KarmaCircle
          value={data.moneyCode}
          x={positions.moneyCode.x}
          y={positions.moneyCode.y}
          size={circleSize}
          highlighted={isHighlighted(data.moneyCode)}
          onClick={() => handleClick(data.moneyCode)}
        />
        <KarmaCircle
          value={data.yearLesson}
          x={positions.yearLesson.x}
          y={positions.yearLesson.y}
          size={circleSize}
          highlighted={isHighlighted(data.yearLesson)}
          onClick={() => handleClick(data.yearLesson)}
        />
        <KarmaCircle
          value={data.yearResource}
          x={positions.yearResource.x}
          y={positions.yearResource.y}
          size={circleSize}
          highlighted={isHighlighted(data.yearResource)}
          onClick={() => handleClick(data.yearResource)}
        />
        <KarmaCircle
          value={data.karmaCode1}
          x={positions.karmaCode1.x}
          y={positions.karmaCode1.y}
          size={circleSize}
          highlighted={isHighlighted(data.karmaCode1)}
          onClick={() => handleClick(data.karmaCode1)}
        />
        <KarmaCircle
          value={data.karmaCode2}
          x={positions.karmaCode2.x}
          y={positions.karmaCode2.y}
          size={circleSize}
          highlighted={isHighlighted(data.karmaCode2)}
          onClick={() => handleClick(data.karmaCode2)}
        />
        <KarmaCircle
          value={data.karmaCode3}
          x={positions.karmaCode3.x}
          y={positions.karmaCode3.y}
          size={circleSize}
          highlighted={isHighlighted(data.karmaCode3)}
          onClick={() => handleClick(data.karmaCode3)}
        />
        <KarmaCircle
          value={data.karmaCode4}
          x={positions.karmaCode4.x}
          y={positions.karmaCode4.y}
          size={circleSize}
          highlighted={isHighlighted(data.karmaCode4)}
          onClick={() => handleClick(data.karmaCode4)}
        />
        <KarmaCircle
          value={data.birthCode}
          x={positions.birthCode.x}
          y={positions.birthCode.y}
          size={circleSize}
          highlighted={isHighlighted(data.birthCode)}
          onClick={() => handleClick(data.birthCode)}
        />
        <KarmaCircle
          value={data.destinyCode1}
          x={positions.destinyCode1.x}
          y={positions.destinyCode1.y}
          size={circleSize}
          highlighted={isHighlighted(data.destinyCode1)}
          onClick={() => handleClick(data.destinyCode1)}
        />
        <KarmaCircle
          value={data.destinyCode2}
          x={positions.destinyCode2.x}
          y={positions.destinyCode2.y}
          size={circleSize}
          highlighted={isHighlighted(data.destinyCode2)}
          onClick={() => handleClick(data.destinyCode2)}
        />
      </div>
    </div>
  );
}
