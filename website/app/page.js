'use client'
import './globals.css'
import Link from 'next/link'
import { Button } from './Button'


export default function App() {

    return (
        <div className="App">
            <div className="flex text-darkgreen font-semibold flex-row">
                <div className="basis-1/4">
                    <h1>plassen</h1>
                    <Button text="Hey!" navigateTo="/keuzescherm" />
                </div>
                <div className="basis-2/4">
                    <h1>Welkom bij Wing!</h1>
                    {/*<img src="/clickicon.png" alt="Click Icon" className="h-1/6 w-1/6 mb-3 ml-7 mt-2" />*/}
                    <Link href="/keuzescherm">Klik om naar de keuzescherm te gaan</Link>
                </div>
                <div className="basis-1/4">
                    <h1>poepen</h1>
                    <Button text="Hallo!" navigateTo="/keuzescherm" />
                </div>
            </div>
        </div>
    );

}