import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MonthlyReport() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState({});
  const years = [2025, 2024, 2023, 2022];

  useEffect(() => {
    fetchData(year, month);
  }, [year, month]);

  const fetchData = (y, m) => {
    axios.get(`http://localhost:8080/api/treatments/summary/monthly?year=${y}&month=${m}`)
      .then((res) => {
        transformData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching treatments:", err);
      });
  };

  const transformData = (entries) => {
    const map = {
      drop: {}, blood_vessel: {}, muscle: {}, under_skin: {}, inside_skin: {},
      UHF_machine: {}, massage_chair: {}, red_light: {}, ultrasound: {}, laser: {},
      biotens: {}, lymphatic_drainage_massage: {}, electrophoresis: {},
      micro_cupping: {}, oxygen: {}, surgical_bandage: {}
    };

    entries.forEach((entry) => {
      const day = new Date(entry.date).getDate();
      if (entry.injection) {
        map.drop[day] = (map.drop[day] || 0) + (entry.injection.drop || 0);
        map.blood_vessel[day] = (map.blood_vessel[day] || 0) + (entry.injection.blood_vessel || 0);
        map.muscle[day] = (map.muscle[day] || 0) + (entry.injection.muscle || 0);
        map.inside_skin[day] = (map.inside_skin[day] || 0) + (entry.injection.inside_skin || 0);
        map.under_skin[day] = (map.under_skin[day] || 0) + (entry.injection.under_skin || 0);
      }
      map.UHF_machine[day] = (map.UHF_machine[day] || 0) + (entry.UHF_machine || 0);
      map.massage_chair[day] = (map.massage_chair[day] || 0) + (entry.massage_chair || 0);
      map.red_light[day] = (map.red_light[day] || 0) + (entry.red_light || 0);
      map.ultrasound[day] = (map.ultrasound[day] || 0) + (entry.ultrasound || 0);
      map.laser[day] = (map.laser[day] || 0) + (entry.laser || 0);
      map.biotens[day] = (map.biotens[day] || 0) + (entry.biotens || 0);
      map.lymphatic_drainage_massage[day] = (map.lymphatic_drainage_massage[day] || 0) + (entry.lymphatic_drainage_massage || 0);
      map.electrophoresis[day] = (map.electrophoresis[day] || 0) + (entry.electrophoresis || 0);
      map.micro_cupping[day] = (map.micro_cupping[day] || 0) + (entry.micro_cupping || 0);
      map.oxygen[day] = (map.oxygen[day] || 0) + (entry.oxygen || 0);
      map.surgical_bandage[day] = (map.surgical_bandage[day] || 0) + (entry.surgical_bandage || 0);
    });

    setData(map);
  };

  const labels = {
    drop: "Дусал",
    blood_vessel: "Судас тарилга",
    muscle: "Булчин тарилга",
    under_skin: "Арьсан дор",
    inside_skin: "Арьсан дотор",
    UHF_machine: "УВЧ аппарат",
    massage_chair: "Массажны сандал",
    red_light: "Улаан гэрэл",
    ultrasound: "Ултразвук",
    laser: "Лазер",
    biotens: "Биотенс",
    lymphatic_drainage_massage: "Лимфо массаж",
    electrophoresis: "Электрофорез",
    micro_cupping: "Бичил ханьур",
    oxygen: "Хүчилтөрөгч",
    surgical_bandage: "Мэс заслын боолт"
  };

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const cellStyle = {
    border: "1px solid black",
    padding: "5px",
    textAlign: "center",
  };

  const exportToExcel = () => {
    const table = document.getElementById("reportTable");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Тайлан" });
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${year} оны ${month}-р сарын тайлан.xlsx`);
  };

  const exportToPDF = () => {
    const input = document.getElementById("reportSection");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${year} оны ${month}-р сарын тайлан.pdf`);
    });
  };

  const printReport = () => {
    const printContents = document.getElementById("reportSection").outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h2>Сарын Эмчилгээний Тайлан</h2>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m} сар</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={exportToExcel} style={buttonStyle}>⬇️ Excel татах</button>
        <button onClick={exportToPDF} style={buttonStyle}>⬇️ PDF татах</button>
        <button onClick={printReport} style={buttonStyle}>🖨 Хэвлэх</button>
      </div>

      {/* Тайлангийн хэсэг */}
      <div id="reportSection">
        <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>{year} оны {month}-р сарын эмчилгээний тайлан</h3>

        <table id="reportTable" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th style={cellStyle}>№</th>
              <th style={cellStyle}>Үйлчилгээ</th>
              {daysInMonth.map((d) => (
                <th key={d} style={cellStyle}>{d}</th>
              ))}
              <th style={cellStyle}>Нийт</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, values], idx) => {
              const total = daysInMonth.reduce((sum, d) => sum + (values[d] || 0), 0);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{idx + 1}</td>
                  <td style={cellStyle}>{labels[key]}</td>
                  {daysInMonth.map((d) => (
                    <td key={d} style={cellStyle}>{values[d] || ""}</td>
                  ))}
                  <td style={cellStyle}>{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "8px 16px",
  fontSize: "16px",
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
