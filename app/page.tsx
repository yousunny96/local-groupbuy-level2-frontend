"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const FACES = ["😢", "😕", "😐", "🙂", "😄"];

interface Mood {
  id: number;
  score: number;
  note: string;
  created_at: string;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

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
    } catch {
      setError("서버에 연결할 수 없어요");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setError("");
    const res = await fetch(`${API}/moods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, note }),
    }).catch(() => null);
    if (!res?.ok) return setError("저장하지 못했어요");
    setScore(0);
    setNote("");
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
          <li key={m.id}>
            <span className="d">{fmt(m.created_at)}</span>
            <span>{FACES[m.score - 1]}</span>
            <span className="n">{m.note}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
