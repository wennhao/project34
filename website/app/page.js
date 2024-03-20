'use client'

import React from 'react';
import './globals.css'; // Importing CSS for styling
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link'


export default function App() {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/tzk6xve.css" />
      </Head>
      {/* Page Content */}
      <p>oi oi oi</p>
      <div>
        <Button1 />
      </div>
    </>
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