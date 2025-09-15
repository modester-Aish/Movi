import Image from "next/image";
import { useState, useEffect } from "react";

interface MovieImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function MovieImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill = false, 
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: MovieImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('/placeholder.svg');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Update image source when src prop changes
  useEffect(() => {
    if (src && src.trim() !== '' && src !== '/placeholder.svg') {
      setImageSrc(src);
      setHasError(false);
      setIsLoading(true);
    } else {
      setImageSrc('/placeholder.svg');
      setHasError(true);
      setIsLoading(false);
    }
  }, [src]);

  const handleError = () => {
    console.log('MovieImage error for:', alt, 'src:', src, 'imageSrc:', imageSrc);
    if (!hasError) {
      setHasError(true);
      setImageSrc('/placeholder.svg');
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const imageProps = {
    src: imageSrc,
    alt: alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    priority,
    onError: handleError,
    onLoad: handleLoad,
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width || 300}
      height={height || 450}
    />
  );
}
