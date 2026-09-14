interface CodeImageProps {
  code: number | string;
  title?: string;
  alt?: string;
}

export default function CodeImage({ code, alt }: CodeImageProps) {
  const imageUrl = `https://annabaryshnikova.com/karma/codeimgs/${code}.png`;
  const altText = alt || `Код ${code}`;

  return (
    <div className="code-image-container">
      <img 
        src={imageUrl} 
        alt={altText}
        className="code-image"
        loading="lazy"
      />
    </div>
  );
}
