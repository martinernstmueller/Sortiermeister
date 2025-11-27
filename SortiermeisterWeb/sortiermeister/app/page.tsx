import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/game');
    return <div>Lade Sortiermeister ...</div>;
}