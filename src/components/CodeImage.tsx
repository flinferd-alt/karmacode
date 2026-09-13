interface CodeImageProps {
  code: number | string;
  title?: string;
  description?: string;
}

export default function CodeImage({ code, title, description }: CodeImageProps) {
  const imageUrl = `https://annabaryshnikova.com/karma/codeimgs/${code}.png`;

  return (
    <div className="mb-6">
      {/* Мобильная версия: картинка после заголовка */}
      <div className="md:hidden">
        {title && (
          <h3 className="text-xl font-bold text-[#ffd700] mb-3">{title}</h3>
        )}
        <img
          src={imageUrl}
          alt={`Код ${code}`}
          className="w-full rounded-xl mb-4 shadow-lg"
          loading="lazy"
        />
        {description && (
          <p className="text-[#e8d5f5] text-sm md:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Десктопная версия: картинка справа */}
      <div className="hidden md:flex md:gap-6">
        <div className="flex-1">
          {title && (
            <h3 className="text-xl font-bold text-[#ffd700] mb-3">{title}</h3>
          )}
          {description && (
            <p className="text-[#e8d5f5] text-sm md:text-base leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 w-64">
          <img
            src={imageUrl}
            alt={`Код ${code}`}
            className="w-full rounded-xl shadow-lg"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
