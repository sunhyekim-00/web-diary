export const metadata = {
  title: "웹 다이어리",
  description: "Next.js + n8n 웹 다이어리",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, background: "#f5f5f7", fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
