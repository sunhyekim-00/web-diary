// Next.js API Route: POST /api/diary
// 브라우저 → (이 API Route) → n8n Webhook 순서로 전달합니다.
// n8n Webhook 주소는 Vercel 환경변수 N8N_WEBHOOK_URL 에 넣습니다.

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const title = (body.title || "").trim();
  const content = (body.content || "").trim();
  if (!title || !content) {
    return Response.json({ ok: false, error: "title과 content를 모두 입력하세요." }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json({ ok: false, error: "서버에 N8N_WEBHOOK_URL 환경변수가 없습니다." }, { status: 500 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, createdAt: new Date().toISOString() }),
    });
    if (!res.ok) {
      return Response.json({ ok: false, error: `n8n 응답 오류 (${res.status})` }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: "n8n 연결 실패: " + err.message }, { status: 502 });
  }
}
