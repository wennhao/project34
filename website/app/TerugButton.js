'use client'
import { useRouter } from 'next/navigation'

export function TerugButton() {
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