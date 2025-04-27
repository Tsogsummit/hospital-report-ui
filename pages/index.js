import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "2rem", textAlign: "center", fontFamily: "monospace" }}>
      <h1>Эмнэлгийн Тайлангийн Систем</h1>
      <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <Link href="/monthly-report">
          <button style={buttonStyle}>📅 Сарын Тайлан</button>
        </Link>
        <Link href="/yearly-report">
          <button style={buttonStyle}>📆 Жилийн Тайлан</button>
        </Link>
        <Link href="/add-entry">
          <button style={buttonStyle}>➕ Өдөр бүрийн Мэдээлэл Нэмэх</button>
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
