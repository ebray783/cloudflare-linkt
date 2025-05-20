import React from 'react';
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.push('/presale')} className="cyberpunk-btn">
        Go to Presale
      </button>
    </div>
  );
};

export default Home;