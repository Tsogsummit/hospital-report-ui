import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "2rem", textAlign: "center", fontFamily: "monospace" }}>
      <h1>Эмнэлгийн тайлангийн систем</h1>
      <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <Link href="/monthly-report">
          <button style={buttonStyle}>📅 Сарын тайлан</button>
        </Link>
        <Link href="/yearly-report">
          <button style={buttonStyle}>📆 Жилийн тайлан</button>
        </Link>
        <Link href="/add-entry">
          <button style={buttonStyle}>➕ Өдөр бүрийн мэдээлэл нэмэх</button>
        </Link>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "18px",
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
