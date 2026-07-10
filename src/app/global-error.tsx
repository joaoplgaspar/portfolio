"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: "#1b1a17",
          color: "#ede8de",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Algo deu errado.</h2>
        <button
          onClick={reset}
          style={{
            border: "1px solid #7c2d2d",
            background: "#7c2d2d",
            color: "#ede8de",
            padding: "0.6rem 1.4rem",
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          Tentar de novo
        </button>
      </body>
    </html>
  );
}
