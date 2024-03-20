'use client'

import React from 'react';
import '../globals.css'; // Importing CSS for styling
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '../Button'




export default function KeuzeScherm() {
    return (
        <div className="App text-center text-DarkGreen min-h-screen flex flex-col items-center justify-center font-calc">
            {/* Page Content */}
            <div className="buttons-container flex justify-between p-5 items-start">
                <div className="button-group flex flex-col gap-2.5">
                    <Button1 className="button text-base basis-1/4 py-10 text-left" text="Button Left 1" navigateTo="/path1" />
                    <Button1 className="button basis-1/4 py-10 text-left" text="Button Left 2" navigateTo="/path2" />
                    <Button1 className="button basis-1/4 py-10 text-left" text="Button Left 3" navigateTo="/path3" />
                </div>
                <div className="spacer flex-grow text-darkgreen font-semibold">
                    <br />
                    Welkom! <br />
                    <br />
                    <br />
                    Bedankt dat je kiest voor ons!
                </div> {/* This creates a visible space in the middle */}
                <div className="button-group">
                    <Button1 className="button py-10 text-left" text="Button Right 1" navigateTo="/path4" />
                    <Button1 className="button py-10 text-left" text="Button Right 2" navigateTo="/path5" />
                    <Button className="button py-10 text-left" text="Tijd om terug te gaan!" navigateTo="/path6" />
                </div>
            </div>
        </div>
    );
}

function Button1({ text, navigateTo }) {
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