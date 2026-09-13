interface CodeImageProps {
  code: number | string;
  title: string;
}

export default function CodeImage({ code, title }: CodeImageProps) {
  const imageUrl = `https://annabaryshnikova.com/karma/codeimgs/${code}.png`;

  return (
    <>
      {/* Мобильная версия - после заголовка */}
      <div className="md:hidden mb-6 animate-fade-in">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full max-w-xs mx-auto rounded-xl shadow-lg"
          loading="lazy"
        />
      </div>

      {/* Десктопная версия - справа в тексте */}
      <div className="hidden md:block float-right ml-6 mb-4 animate-fade-in">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-64 rounded-xl shadow-lg"
          loading="lazy"
        />
      </div>
    </>
  );
}
