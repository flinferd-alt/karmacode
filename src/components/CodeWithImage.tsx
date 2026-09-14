import React from 'react';

interface CodeWithImageProps {
  code: number | string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function CodeWithImage({ code, title, subtitle, children }: CodeWithImageProps) {
  const imageUrl = `https://annabaryshnikova.com/karma/codeimgs/${code}.png`;

  return (
    <div className="glass-card p-6 mb-6">
      {/* Заголовок */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-[#ffd700] mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#ff69b4] text-sm font-medium italic">
            {subtitle}
          </p>
        )}
      </div>

      {/* Контент с картинкой */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Картинка на мобильных - после заголовка */}
        <div className="md:hidden w-full">
          <img 
            src={imageUrl} 
            alt={`Код ${code}`}
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>

        {/* Текст */}
        <div className="flex-1">
          {children}
        </div>

        {/* Картинка на десктопе - справа */}
        <div className="hidden md:block md:w-64 flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={`Код ${code}`}
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
