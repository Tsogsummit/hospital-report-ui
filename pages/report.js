import { useEffect, useState } from "react";
import axios from "axios";

export default function Report() {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8080/api/treatments")
      .then((res) => {
        transformData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching treatments:", err);
      });
  }, []);

  const transformData = (entries) => {
    const map = {
      drop: {}, blood_vessel: {}, muscle: {}, under_skin: {}, inside_skin: {},
      UHF_machine: {}, massage_chair: {}, red_light: {}, ultrasound: {}, laser: {},
      biotens: {}, lymphatic_drainage_massage: {}, electrophoresis: {},
      micro_cupping: {}, oxygen: {}, surgical_bandage: {}
    };

    entries.forEach((entry) => {
      const day = new Date(entry.date).getDate(); // Зөвхөн өдөр авна

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
    blood_vessel: "Судас",
    muscle: "Булчин",
    under_skin: "Арьсан дор",
    inside_skin: "Арьсан дээр",
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

  const cellStyle = {
    border: "1px solid black",
    padding: "5px",
    minWidth: "30px",
    textAlign: "center",
  };

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1); // 1-31

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h2>Бүтэн сарын эмчилгээний тайлан</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
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
          <tr style={{ backgroundColor: "#ffffcc", fontWeight: "bold" }}>
            <td style={cellStyle} colSpan="2">Нийт хүн</td>
            {daysInMonth.map((d) => {
              let sum = 0;
              Object.values(data).forEach((val) => {
                sum += val[d] || 0;
              });
              return <td key={d} style={cellStyle}>{sum}</td>;
            })}
            <td style={cellStyle}>
              {daysInMonth.reduce((grandTotal, d) => {
                return grandTotal + Object.values(data).reduce((s, v) => s + (v[d] || 0), 0);
              }, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
