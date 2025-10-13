export default function PreloadResources() {
  return (
    <>
      {/* Preload critical resources */}
      
      {/* Preload critical images */}
      <link
        rel="preload"
        href="/favicon.svg"
        as="image"
        type="image/svg+xml"
      />
      
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//image.tmdb.org" />
      <link rel="dns-prefetch" href="//api.themoviedb.org" />
      <link rel="dns-prefetch" href="//vidsrc.to" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://image.tmdb.org" />
      <link rel="preconnect" href="https://api.themoviedb.org" />
    </>
  );
}
