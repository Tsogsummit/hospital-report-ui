import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function YearlyReport() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState({});
  const years = [2025, 2024, 2023, 2022];

  useEffect(() => {
    fetchYearlyData(year);
  }, [year]);

  const fetchYearlyData = (selectedYear) => {
    axios.get("http://localhost:8080/api/treatments")
      .then((res) => {
        transformData(res.data, selectedYear);
      })
      .catch((err) => {
        console.error("Error fetching treatments:", err);
      });
  };

  const transformData = (entries, selectedYear) => {
    const map = {
      drop: {}, blood_vessel: {}, muscle: {}, under_skin: {}, inside_skin: {},
      UHF_machine: {}, massage_chair: {}, red_light: {}, ultrasound: {}, laser: {},
      biotens: {}, lymphatic_drainage_massage: {}, electrophoresis: {},
      micro_cupping: {}, oxygen: {}, surgical_bandage: {}
    };

    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const entryYear = date.getFullYear();
      const monthIndex = date.getMonth() + 1; // 1-based (1=Jan, 12=Dec)

      if (entryYear === selectedYear) {
        if (entry.injection) {
          map.drop[monthIndex] = (map.drop[monthIndex] || 0) + (entry.injection.drop || 0);
          map.blood_vessel[monthIndex] = (map.blood_vessel[monthIndex] || 0) + (entry.injection.blood_vessel || 0);
          map.muscle[monthIndex] = (map.muscle[monthIndex] || 0) + (entry.injection.muscle || 0);
          map.inside_skin[monthIndex] = (map.inside_skin[monthIndex] || 0) + (entry.injection.inside_skin || 0);
          map.under_skin[monthIndex] = (map.under_skin[monthIndex] || 0) + (entry.injection.under_skin || 0);
        }
        map.UHF_machine[monthIndex] = (map.UHF_machine[monthIndex] || 0) + (entry.UHF_machine || 0);
        map.massage_chair[monthIndex] = (map.massage_chair[monthIndex] || 0) + (entry.massage_chair || 0);
        map.red_light[monthIndex] = (map.red_light[monthIndex] || 0) + (entry.red_light || 0);
        map.ultrasound[monthIndex] = (map.ultrasound[monthIndex] || 0) + (entry.ultrasound || 0);
        map.laser[monthIndex] = (map.laser[monthIndex] || 0) + (entry.laser || 0);
        map.biotens[monthIndex] = (map.biotens[monthIndex] || 0) + (entry.biotens || 0);
        map.lymphatic_drainage_massage[monthIndex] = (map.lymphatic_drainage_massage[monthIndex] || 0) + (entry.lymphatic_drainage_massage || 0);
        map.electrophoresis[monthIndex] = (map.electrophoresis[monthIndex] || 0) + (entry.electrophoresis || 0);
        map.micro_cupping[monthIndex] = (map.micro_cupping[monthIndex] || 0) + (entry.micro_cupping || 0);
        map.oxygen[monthIndex] = (map.oxygen[monthIndex] || 0) + (entry.oxygen || 0);
        map.surgical_bandage[monthIndex] = (map.surgical_bandage[monthIndex] || 0) + (entry.surgical_bandage || 0);
      }
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

  const months = [1,2,3,4,5,6,7,8,9,10,11,12];

  const cellStyle = {
    border: "1px solid black",
    padding: "5px",
    textAlign: "center",
  };

  const exportToExcel = () => {
    const table = document.getElementById("reportTable");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Жилийн тайлан" });
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${year} оны дэлгэрэнгүй жилийн тайлан.xlsx`);
  };

  const exportToPDF = () => {
    const input = document.getElementById("reportSection");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${year} оны дэлгэрэнгүй жилийн тайлан.pdf`);
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
      <h2>Жилийн Эмчилгээний Дэлгэрэнгүй Тайлан</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Жил сонгох: </label>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={exportToExcel} style={buttonStyle}>⬇️ Excel татах</button>
        <button onClick={exportToPDF} style={buttonStyle}>⬇️ PDF татах</button>
        <button onClick={printReport} style={buttonStyle}>🖨 Хэвлэх</button>
      </div>

      <div id="reportSection">
        <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>{year} оны Эмчилгээний Дэлгэрэнгүй Жилийн Тайлан</h3>

        <table id="reportTable" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th style={cellStyle}>№</th>
              <th style={cellStyle}>Үйлчилгээ</th>
              {months.map((m) => (
                <th key={m} style={cellStyle}>{m} сар</th>
              ))}
              <th style={cellStyle}>Нийт</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, values], idx) => {
              const total = months.reduce((sum, m) => sum + (values[m] || 0), 0);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{idx + 1}</td>
                  <td style={cellStyle}>{labels[key]}</td>
                  {months.map((m) => (
                    <td key={m} style={cellStyle}>{values[m] || ""}</td>
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
