import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [sign, setSign] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sign: sign }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setSign("");
      setResult(data.result);
      
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Zodiach Horoscope & Tarot</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>FREE Horoscope Readings!!!</h3> 
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="sign"
            placeholder="Enter your Zodiac sign"
            value={sign}
            onChange={(e) => setSign(e.target.value)}
          />
          <input type="submit" value="Generate my Horoscope" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
