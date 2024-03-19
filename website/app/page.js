'use client'

import React from 'react';
import './globals.css'; // Importing CSS for styling
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
       
        <div>
          <Button1 />
        </div>

      </header>
    </div>
  );
}

function Button1() {
  const router = useRouter();
  function handleClick() {
      router.push("/saldoscherm");
  }
  return (
    <button onClick={handleClick}>
      Klik om naar de Saldo Scherm te gaan!
    </button>
  );
}