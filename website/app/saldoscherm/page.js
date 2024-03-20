'use client'

import '../globals.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SaldoScherm(){


return (
    <div className="App">
        <TerugButton />
        <Link href="/pinscherm">pinscherm</Link>
    </div>
);

}

function TerugButton() {
    const router = useRouter();
  function handleClick() {
      router.push("./");
  }
  return (
    <button onClick={handleClick}>
      Klik om terug te gaan!
    </button>
  );
}