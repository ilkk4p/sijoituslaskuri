import { useState } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#fffdf8",
        border: "1px solid #e8e0d4",
        borderRadius: "12px",
        padding: "14px 18px",
        fontFamily: "'Libre Franklin', sans-serif",
        boxShadow: "0 8px 32px rgba(120, 90, 50, 0.1)",
      }}>
        <p style={{ color: "#8a7a68", margin: "0 0 8px", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
          Vuosi {label}
        </p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color, margin: "4px 0", fontSize: "14px", fontWeight: 600 }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SijoitusLaskuri() {
  const [aloitus, setAloitus] = useState("");
  const [tuotto, setTuotto] = useState("");
  const [vuodet, setVuodet] = useState("");
  const [kuukausi, setKuukausi] = useState("");
  const [tulos, setTulos] = useState(null);
  const [data, setData] = useState(null);

  const laske = () => {
    const a = parseFloat(aloitus) || 0;
    const t = parseFloat(tuotto) || 0;
    const v = parseInt(vuodet) || 0;
    const k = parseFloat(kuukausi) || 0;

    if (v <= 0) return;

    const kuukausiTuotto = t / 100 / 12;
    const chartData = [];
    let saldo = a;
    let talletukset = a;

    chartData.push({
      vuosi: 0,
      talletukset: Math.round(a),
      kokonaisarvo: Math.round(a),
      tuotot: 0,
    });

    for (let vuosi = 1; vuosi <= v; vuosi++) {
      for (let kk = 0; kk < 12; kk++) {
        saldo = saldo * (1 + kuukausiTuotto) + k;
        talletukset += k;
      }
      chartData.push({
        vuosi,
        talletukset: Math.round(talletukset),
        kokonaisarvo: Math.round(saldo),
        tuotot: Math.round(saldo - talletukset),
      });
    }

    setData(chartData);
    setTulos({
      kokonaisarvo: saldo,
      talletukset,
      tuotot: saldo - talletukset,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") laske();
  };

  const fields = [
    { label: "Aloitussumma", value: aloitus, set: setAloitus, unit: "€", placeholder: "10 000" },
    { label: "Vuosituotto", value: tuotto, set: setTuotto, unit: "%", placeholder: "7" },
    { label: "Sijoitusaika", value: vuodet, set: setVuodet, unit: "vuotta", placeholder: "20" },
    { label: "Kuukausisäästö", value: kuukausi, set: setKuukausi, unit: "€/kk", placeholder: "200" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf7f2",
      fontFamily: "'Libre Franklin', sans-serif",
      color: "#3d3428",
      padding: "48px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />

      {/* Subtle decorative background */}
      <div style={{
        position: "fixed",
        top: "-20%",
        right: "-10%",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(198, 134, 78, 0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed",
        bottom: "-15%",
        left: "-10%",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(86, 127, 113, 0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
          }}>
            <div style={{ width: "28px", height: "1px", background: "#c6864e" }} />
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#c6864e",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
            }}>
              Korkoa korolle
            </span>
            <div style={{ width: "28px", height: "1px", background: "#c6864e" }} />
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 6vw, 50px)",
            fontWeight: 800,
            margin: "0 0 14px",
            color: "#2c2418",
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
          }}>
            Sijoituslaskuri
          </h1>
          <p style={{
            color: "#9a8b78",
            fontSize: "15px",
            margin: 0,
            lineHeight: 1.7,
            maxWidth: "400px",
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            Laske sijoitustesi odotettu tuotto ja seuraa varallisuutesi kasvua ajan myötä.
          </p>
        </div>

        {/* Input Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
          marginBottom: "24px",
        }}>
          {fields.map((field) => (
            <div key={field.label} style={{
              background: "#ffffff",
              border: "1px solid #e8e0d4",
              borderRadius: "16px",
              padding: "18px 20px",
              transition: "all 0.3s ease",
              boxShadow: "0 1px 3px rgba(120, 90, 50, 0.04)",
            }}>
              <label style={{
                display: "block",
                fontSize: "10px",
                fontWeight: 700,
                color: "#b0a08e",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "10px",
              }}>
                {field.label}
              </label>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={field.placeholder}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#2c2418",
                    fontSize: "24px",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    width: "100%",
                    minWidth: 0,
                  }}
                />
                <span style={{
                  color: "#c6864e",
                  fontSize: "13px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}>
                  {field.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <button
          onClick={laske}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "16px",
            border: "none",
            background: "#2c2418",
            color: "#faf7f2",
            fontSize: "15px",
            fontWeight: 700,
            fontFamily: "'Libre Franklin', sans-serif",
            cursor: "pointer",
            letterSpacing: "1px",
            textTransform: "uppercase",
            transition: "all 0.3s ease",
            marginBottom: "36px",
            boxShadow: "0 4px 20px rgba(44, 36, 24, 0.15)",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#c6864e";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 28px rgba(198, 134, 78, 0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#2c2418";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 20px rgba(44, 36, 24, 0.15)";
          }}
        >
          Laske tuotto
        </button>

        {/* Results */}
        {tulos && (
          <div style={{ animation: "fadeUp 0.6s ease" }}>
            <style>{`
              @keyframes fadeUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <div style={{ flex: 1, height: "1px", background: "#e8e0d4" }} />
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#b0a08e", letterSpacing: "2px", textTransform: "uppercase" }}>Tulokset</span>
              <div style={{ flex: 1, height: "1px", background: "#e8e0d4" }} />
            </div>

            {/* Summary Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              marginBottom: "36px",
            }}>
              {[
                { label: "Kokonaisarvo", value: tulos.kokonaisarvo, color: "#2c2418", accent: "#c6864e" },
                { label: "Omat talletukset", value: tulos.talletukset, color: "#567f71", accent: "#567f71" },
                { label: "Tuotto", value: tulos.tuotot, color: "#c6864e", accent: "#c6864e" },
              ].map((card) => (
                <div key={card.label} style={{
                  background: "#ffffff",
                  border: "1px solid #e8e0d4",
                  borderRadius: "16px",
                  padding: "20px 14px",
                  textAlign: "center",
                  boxShadow: "0 1px 3px rgba(120, 90, 50, 0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40px",
                    height: "3px",
                    borderRadius: "0 0 3px 3px",
                    background: card.accent,
                  }} />
                  <div style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#b0a08e",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "10px",
                  }}>
                    {card.label}
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(15px, 2.5vw, 22px)",
                    fontWeight: 700,
                    color: card.color,
                  }}>
                    {formatCurrency(card.value)}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #e8e0d4",
              borderRadius: "20px",
              padding: "28px 12px 16px 0",
              boxShadow: "0 2px 12px rgba(120, 90, 50, 0.05)",
            }}>
              <h3 style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#b0a08e",
                textTransform: "uppercase",
                letterSpacing: "2px",
                margin: "0 0 24px 40px",
              }}>
                Varallisuuden kehitys
              </h3>
              <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradTalletukset" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#567f71" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#567f71" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="gradKokonais" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c6864e" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#c6864e" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e8dc" />
                  <XAxis
                    dataKey="vuosi"
                    stroke="#e8e0d4"
                    tick={{ fill: "#b0a08e", fontSize: 12, fontFamily: "'Libre Franklin', sans-serif" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#e8e0d4"
                    tick={{ fill: "#b0a08e", fontSize: 11, fontFamily: "'Libre Franklin', sans-serif" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : v}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "16px", fontSize: "12px", fontFamily: "'Libre Franklin', sans-serif" }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Area
                    type="monotone"
                    dataKey="talletukset"
                    name="Omat talletukset"
                    stroke="#567f71"
                    strokeWidth={2.5}
                    fill="url(#gradTalletukset)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#567f71", stroke: "#fff", strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="kokonaisarvo"
                    name="Kokonaisarvo"
                    stroke="#c6864e"
                    strokeWidth={2.5}
                    fill="url(#gradKokonais)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#c6864e", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>


          </div>
        )}
      </div>
    </div>
  );
}
