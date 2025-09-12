import Image from "next/image";
import { useState } from "react";

interface MovieImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export default function MovieImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill = false, 
  className = "",
  priority = false 
}: MovieImageProps) {
  const [imageSrc, setImageSrc] = useState(src || '/placeholder.svg');
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc('/placeholder.svg');
    }
  };

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        onError={handleError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 300}
      height={height || 450}
      className={className}
      priority={priority}
      onError={handleError}
    />
  );
}
