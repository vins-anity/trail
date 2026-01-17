/**
 * Trail AI - Web Application
 *
 * Delivery Assurance & Evidence-Based Audit System
 */

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          borderRadius: "1rem",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          maxWidth: "500px",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
            background: "linear-gradient(90deg, #38bdf8, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🛤️ Trail AI
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "2rem", fontSize: "1.1rem" }}>
          Delivery Assurance & Evidence-Based Audit System
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <a
            href="/api/reference"
            style={{
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(90deg, #0ea5e9, #6366f1)",
              color: "white",
              textDecoration: "none",
              borderRadius: "0.5rem",
              fontWeight: "500",
              transition: "transform 0.2s",
            }}
          >
            API Docs
          </a>
          <a
            href="https://github.com"
            style={{
              padding: "0.75rem 1.5rem",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              textDecoration: "none",
              borderRadius: "0.5rem",
              fontWeight: "500",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            GitHub
          </a>
        </div>

        <div style={{ marginTop: "3rem", color: "#64748b", fontSize: "0.875rem" }}>
          <p>Built with Bun, Hono, Drizzle, and Supabase</p>
        </div>
      </div>
    </div>
  );
}

export default App;
