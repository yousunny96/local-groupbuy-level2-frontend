"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SHOPPER = [
  { href: "/", label: "공동구매" },
  { href: "/cancel", label: "신청 취소" },
];
const ADMIN = [
  { href: "/admin", label: "현황" },
  { href: "/admin/orders", label: "신청 목록" },
  { href: "/admin/group-buys/new", label: "공동구매 등록" },
];

export function Nav() {
  const path = usePathname();
  const on = (href: string) => (href === "/" ? path === "/" || path.startsWith("/group-buys") : path === href);
  return (
    <header className="nav">
      <div className="nav-in">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden>🥬</span> 동네장터 공동구매
        </Link>
        <nav aria-label="신청자 메뉴">
          {SHOPPER.map((l) => (
            <Link key={l.href} href={l.href} className={on(l.href) ? "on" : ""}>
              {l.label}
            </Link>
          ))}
        </nav>
        <nav className="admin" aria-label="관리자 메뉴">
          <span className="tag">관리자</span>
          {ADMIN.map((l) => (
            <Link key={l.href} href={l.href} className={on(l.href) ? "on" : ""}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
