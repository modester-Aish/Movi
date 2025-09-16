import Head from 'next/head';

interface CanonicalLinkProps {
  url: string;
}

export default function CanonicalLink({ url }: CanonicalLinkProps) {
  return (
    <Head>
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta name="twitter:url" content={url} />
    </Head>
  );
}
