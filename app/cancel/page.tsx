"use client";

import Link from "next/link";
import { useState } from "react";
import { Field, Notice } from "@/components/ui";
import { api, ApiError } from "@/lib/api";

export default function Cancel() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ groupBuyTitle: string; boxes: number } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    setFieldErr({});
    try {
      setDone(await api("/orders/cancel", { method: "POST", body: { orderCode: code, phone } }));
      setCode("");
      setPhone("");
    } catch (err) {
      const e2 = err as ApiError;
      setMsg(e2.message);
      setFieldErr(e2.errors ?? {});
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="panel center narrow">
        <div className="check" aria-hidden>✓</div>
        <h1>신청을 취소했어요</h1>
        <p>
          {done.groupBuyTitle} {done.boxes}박스 신청이 취소됐고, 그 수량은 다른 분이 다시 신청할 수 있어요.
        </p>
        <div className="row gap center">
          <button className="btn ghost" onClick={() => setDone(null)}>다른 신청도 취소</button>
          <Link href="/" className="btn primary">공동구매 보기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="panel narrow">
      <h1>신청 취소</h1>
      <p className="muted">신청할 때 받은 신청번호와 연락처를 입력하세요. 마감된 공동구매는 취소할 수 없어요.</p>
      {msg && <Notice>{msg}</Notice>}
      <form onSubmit={submit} noValidate>
        <Field label="신청번호" error={fieldErr.orderCode}>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="예: GB-AB12CD" autoCapitalize="characters" />
        </Field>
        <Field label="연락처" error={fieldErr.phone}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-1234-5678" inputMode="tel" />
        </Field>
        <button className="btn danger wide" disabled={busy}>
          {busy ? "취소하는 중…" : "신청 취소하기"}
        </button>
      </form>
    </div>
  );
}
