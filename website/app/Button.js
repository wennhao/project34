'use client'
import { useRouter } from 'next/navigation'

export function Button({ text, navigateTo }) {
    const router = useRouter();
    function handleClick() {
        router.push(navigateTo);
    }
    return (
        <button onClick={handleClick} className="button">
            {text}
        </button>
    );
}