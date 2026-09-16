import Link from 'next/link';
export default function NotFound() {
  return (
    <>
      <h1>Cette page est introuvable.</h1>
      <p>Retrouvez les références depuis les deux corpus.</p>
      <Link className="source" href="/">
        Retour à l’accueil
      </Link>
    </>
  );
}
