import { useState } from "react";
import axios from "axios";

export default function AddEntry() {
  const [formData, setFormData] = useState({
    date: "",
    drop: 0,
    blood_vessel: 0,
    muscle: 0,
    inside_skin: 0,
    under_skin: 0,
    UHF_machine: 0,
    massage_chair: 0,
    red_light: 0,
    ultrasound: 0,
    laser: 0,
    biotens: 0,
    lymphatic_drainage_massage: 0,
    electrophoresis: 0,
    micro_cupping: 0,
    oxygen: 0,
    surgical_bandage: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      date: formData.date,
      injection: {
        drop: formData.drop,
        blood_vessel: formData.blood_vessel,
        muscle: formData.muscle,
        inside_skin: formData.inside_skin,
        under_skin: formData.under_skin,
      },
      UHF_machine: formData.UHF_machine,
      massage_chair: formData.massage_chair,
      red_light: formData.red_light,
      ultrasound: formData.ultrasound,
      laser: formData.laser,
      biotens: formData.biotens,
      lymphatic_drainage_massage: formData.lymphatic_drainage_massage,
      electrophoresis: formData.electrophoresis,
      micro_cupping: formData.micro_cupping,
      oxygen: formData.oxygen,
      surgical_bandage: formData.surgical_bandage,
    };

    axios.post("http://localhost:8080/api/treatments", payload)
      .then(() => {
        alert("Амжилттай хадгаллаа!");
      })
      .catch((err) => {
        console.error("Алдаа гарлаа:", err);
        alert("Хадгалахад алдаа гарлаа!");
      });
  };

  const fieldLabels = {
    drop: "Дусал",
    blood_vessel: "Судас тарилга",
    muscle: "Булчин тарилга",
    inside_skin: "Арьсан дотор",
    under_skin: "Арьсан дор",
    UHF_machine: "УВЧ аппарат",
    massage_chair: "Массажны сандал",
    red_light: "Улаан гэрэл",
    ultrasound: "Ултразвук",
    laser: "Лазер",
    biotens: "Биотенс",
    lymphatic_drainage_massage: "Лимфо массаж",
    electrophoresis: "Электрофорез",
    micro_cupping: "Бичил хануур",
    oxygen: "Хүчилтөрөгч",
    surgical_bandage: "Мэс заслын боолт"
  };

  const cellStyle = { marginBottom: "1rem" };

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h2>Өдөр бүрийн эмчилгээний мэдээлэл нэмэх</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "600px", margin: "auto" }}>
        <label style={cellStyle}>
          Огноо сонгох:
          <input type="date" name="date" onChange={(e) => setFormData({...formData, date: e.target.value})} required />
        </label>

        {Object.keys(formData)
          .filter(f => f !== "date")
          .map((key) => (
          <label key={key} style={cellStyle}>
            {fieldLabels[key]}:
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder="0"
              style={{ marginLeft: "10px" }}
            />
          </label>
        ))}

        <button type="submit" style={{ marginTop: "2rem", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "6px" }}>
          Мэдээлэл хадгалах
        </button>
      </form>
    </div>
  );
}
