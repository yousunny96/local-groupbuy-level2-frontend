"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const FACES = ["😢", "😕", "😐", "🙂", "😄"];

interface Mood {
  date: string;
  score: number;
  note: string;
}

export default function Home() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [score, setScore] = useState(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch(`${API}/moods`);
      const list: Mood[] = await res.json();
      setMoods(list);
      const today = list.find((m) => m.date === new Date().toLocaleDateString("sv-SE"));
      if (today) {
        setScore(today.score);
        setNote(today.note);
      }
    } catch {
      setError("서버에 연결할 수 없어요");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setError("");
    const res = await fetch(`${API}/moods/today`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, note }),
    }).catch(() => null);
    if (!res?.ok) return setError("저장하지 못했어요");
    load();
  }

  return (
    <main>
      <h1>오늘 기분 기록기</h1>
      <p className="sub">오늘 기분은 어떤가요?</p>

      <div className="faces">
        {FACES.map((face, i) => (
          <button
            key={face}
            className={score === i + 1 ? "on" : ""}
            onClick={() => setScore(i + 1)}
            aria-label={`기분 ${i + 1}점`}
          >
            {face}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={note}
        maxLength={200}
        placeholder="한 줄 메모 (선택)"
        onChange={(e) => setNote(e.target.value)}
      />
      <button className="save" disabled={!score} onClick={save}>
        저장
      </button>
      <p className="msg">{error}</p>

      <h2>최근 기록</h2>
      <ul>
        {moods.map((m) => (
          <li key={m.date}>
            <span className="d">{m.date.slice(5)}</span>
            <span>{FACES[m.score - 1]}</span>
            <span className="n">{m.note}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
