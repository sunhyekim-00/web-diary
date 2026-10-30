"use client";

import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { ok: boolean, message: string }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      // 브라우저는 n8n이 아니라 Next.js API Route(/api/diary)로만 요청합니다.
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setResult({ ok: true, message: "✅ 저장 완료! 일기가 저장되었습니다." });
        setTitle("");
        setContent("");
      } else {
        setResult({ ok: false, message: "❌ 저장 실패: " + (data.error || "알 수 없는 오류") });
      }
    } catch (err) {
      setResult({ ok: false, message: "❌ 저장 실패: " + err.message });
    } finally {
      setLoading(false);
    }
  }

  const box = { width: "100%", padding: 10, fontSize: 16, border: "1px solid #ccc", borderRadius: 8, boxSizing: "border-box" };

  return (
    <main style={{ maxWidth: 560, margin: "48px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,.08)" }}>
      <h1 style={{ marginTop: 0 }}>📔 웹 다이어리 작성</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title" style={{ fontWeight: 600 }}>title</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" required style={{ ...box, margin: "6px 0 16px" }} />

        <label htmlFor="content" style={{ fontWeight: 600 }}>content</label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="오늘의 일기를 입력하세요" required rows={8} style={{ ...box, margin: "6px 0 16px", resize: "vertical" }} />

        <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, fontSize: 16, fontWeight: 600, color: "#fff", background: loading ? "#999" : "#2563eb", border: "none", borderRadius: 8, cursor: "pointer" }}>
          {loading ? "저장 중..." : "Submit"}
        </button>
      </form>

      {result && (
        <div role="status" style={{ marginTop: 20, padding: 14, borderRadius: 8, fontWeight: 600, background: result.ok ? "#dcfce7" : "#fee2e2", color: result.ok ? "#166534" : "#991b1b" }}>
          {result.message}
        </div>
      )}
    </main>
  );
}
