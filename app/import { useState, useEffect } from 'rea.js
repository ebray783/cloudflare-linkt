import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Add this new import
import initScrollFix from './js/scroll-fix';

export default function Home() {
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Counter animation effect
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    // Initialize scroll fix
    initScrollFix();

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Head>
        <title>Home Page</title>
      </Head>
      <main>
        <h1>Welcome to the Home Page</h1>
        <p>Counter: {count}</p>
        <Link href="/about">Go to About Page</Link>
      </main>
    </div>
  );
}