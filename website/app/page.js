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
          <MyButton />
          <MyButton />
          <Button1 />
        </div>

      </header>
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      I'm a button! [{count}]
    </button>
  );
}

function Button1() {
  const router = useRouter();
  function handleClick() {
      router.push("/saldoscherm");
  }
  return (
    <button onClick={handleClick}>
      Ga naar Saldo Scherm!
    </button>
  );
}