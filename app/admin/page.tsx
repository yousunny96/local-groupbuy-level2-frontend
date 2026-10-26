"use client";

import Link from "next/link";
import { useState } from "react";
import { Notice } from "@/components/ui";
import { api, ApiError, type Stats } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";

export default function Admin() {
  const { data, error, reload } = useFetch<Stats>("/stats");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function seed() {
    if (!window.confirm("지금 있는 공동구매와 신청이 모두 지워지고, 가상 데이터로 새로 채워져요. 계속할까요?")) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<{ groupBuys: number; orders: number; cancelledOrders: number }>("/seed", { method: "POST" });
      setMsg({
        kind: "ok",
        text: `새로 채웠어요: 공동구매 ${r.groupBuys}개, 신청 ${r.orders}건, 취소 ${r.cancelledOrders}건`,
      });
      reload();
    } catch (e) {
      setMsg({ kind: "error", text: (e as ApiError).message });
    } finally {
      setBusy(false);
    }
  }

  const tiles = [
    { label: "진행 중인 공동구매", value: data?.openGroupBuys, unit: "개" },
    { label: "지금 신청된 박스", value: data?.orderedBoxes, unit: "박스" },
    { label: "신청한 사람", value: data?.applicants, unit: "명" },
  ];

  return (
    <>
      <h1>현황</h1>
      <p className="sub">취소된 신청은 숫자에 들어 있지 않아요.</p>
      {error && <Notice>{error}</Notice>}
      <div className="tiles">
        {tiles.map((t) => (
          <div className="tile" key={t.label}>
            <div className="tile-label">{t.label}</div>
            <div className="tile-num">
              {t.value ?? "–"}
              <small>{t.unit}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>가상 데이터 다시 채우기</h2>
        <p className="muted">
          시연할 때 쓰는 버튼이에요. 모든 공동구매와 신청을 지우고 가상 데이터로 새로 채워요. 이름과 연락처도 모두 지어낸 값이에요.
        </p>
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
        <div className="row gap">
          <button className="btn primary" onClick={seed} disabled={busy}>
            {busy ? "채우는 중…" : "가상 데이터 채우기"}
          </button>
          <Link href="/admin/orders" className="btn ghost">신청 목록 보기</Link>
        </div>
      </div>
    </>
  );
}
