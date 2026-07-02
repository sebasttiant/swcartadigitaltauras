export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "var(--space-page)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          color: "var(--color-gold)",
        }}
      >
        Tauras
      </p>
      <h1 style={{ margin: 0, fontSize: "clamp(1.75rem, 6vw, 2.75rem)" }}>
        Carta Digital
      </h1>
      <p style={{ margin: 0, color: "var(--color-muted)", maxWidth: "32ch" }}>
        Premium bilingual menu — coming soon.
      </p>
    </main>
  );
}
