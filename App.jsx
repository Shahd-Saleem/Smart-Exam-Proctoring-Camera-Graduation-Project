import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import io from "socket.io-client";

const SERVER_URL = ""; //SECRET URL

// Global header configuration to bypass Ngrok's warning screens
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json"
};

const NAV_ITEMS = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "monitor", icon: "◈", label: "Live Monitor" },
  { id: "alerts", icon: "◉", label: "Alerts" },
  { id: "evidence", icon: "▣", label: "Evidence" },
  { id: "reports", icon: "≡", label: "Reports" },
  { id: "settings", icon: "◎", label: "Settings" },
];

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "Dr.", firstName: "", lastName: "", email: "", pass: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async () => {
    setErrorMsg("");
    if (!formData.email || !formData.pass || (!isLogin && (!formData.firstName || !formData.lastName))) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setLoading(true);

    try {
      const endpoint = isLogin ? "api/login" : "api/register";
      const res = await fetch(`${SERVER_URL}${endpoint}`, {
        method: "POST",
        headers: NGROK_HEADERS,
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        if (!isLogin) {
          alert("Registration successful! You can now log in.");
          setIsLogin(true);
        } else {
          onLogin(data.name);
        }
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Server error. Check your Ngrok URL or ensure MySQL is running.");
    }
    
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "12px 16px", background: "rgba(30,41,59,0.8)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };

  return (
    <div style={{ minHeight: "100vh", background: "#070d1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ width: 440, background: "rgba(13,20,38,0.95)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 20, padding: "48px 40px", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", zIndex: 10 }}>
        
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>⬡</div>
          <div style={{ color: "rgba(148,163,184,0.7)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>American University of Sharjah</div>
          <div style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 700 }}>ProctorAI System</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
            {isLogin ? "Secure Authentication Portal" : "Faculty Registration"}
          </div>
        </div>

        <div style={{ display: "flex", background: "rgba(30,41,59,0.5)", borderRadius: 12, padding: 4, marginBottom: 20 }}>
          <button onClick={() => {setIsLogin(true); setErrorMsg("");}} style={{ flex: 1, padding: "10px", background: isLogin ? "#2563eb" : "transparent", color: isLogin ? "#fff" : "#94a3b8", borderRadius: 8, border: "none", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>Sign In</button>
          <button onClick={() => {setIsLogin(false); setErrorMsg("");}} style={{ flex: 1, padding: "10px", background: !isLogin ? "#2563eb" : "transparent", color: !isLogin ? "#fff" : "#94a3b8", borderRadius: 8, border: "none", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>Register</button>
        </div>

        {errorMsg && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", color: "#ef4444", padding: "10px", borderRadius: "8px", fontSize: "12px", marginBottom: "16px", textAlign: "center" }}>
            {errorMsg}
          </div>
        )}

        {!isLogin && (
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ width: "30%" }}>
              <div style={{ color: "rgba(148,163,184,0.8)", fontSize: 12, marginBottom: 8 }}>Title</div>
              <select value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={inputStyle}>
                <option>Dr.</option>
                <option>Prof.</option>
                <option>Mr.</option>
                <option>Ms.</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "rgba(148,163,184,0.8)", fontSize: 12, marginBottom: 8 }}>First Name</div>
              <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Waleed" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "rgba(148,163,184,0.8)", fontSize: 12, marginBottom: 8 }}>Last Name</div>
              <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Dweik" style={inputStyle} />
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "rgba(148,163,184,0.8)", fontSize: 12, marginBottom: 8 }}>Email Address</div>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="faculty@aus.edu" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "rgba(148,163,184,0.8)", fontSize: 12, marginBottom: 8 }}>Password</div>
          <input type="password" value={formData.pass} onChange={e => setFormData({...formData, pass: e.target.value})} placeholder="••••••••" style={inputStyle} />
        </div>

        <button onClick={handleAuth} style={{ width: "100%", padding: "14px", background: loading ? "rgba(37,99,235,0.5)" : "linear-gradient(135deg,#1d4ed8,#2563eb)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
          {loading ? "Authenticating..." : isLogin ? "Sign In Securely" : "Create Account"}
        </button>
      </div>
    </div>
  );
}

function PopupNotification({ popup, onDismiss }) {
  useEffect(() => {
    if (!popup) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [popup, onDismiss]);
  if (!popup) return null;
  const isPhone = popup.type.includes("Phone");
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: "rgba(13,20,38,0.97)", border: `1.5px solid ${isPhone ? "rgba(251,146,60,0.6)" : "rgba(239,68,68,0.6)"}`, borderRadius: 16, padding: "18px 22px", width: 320, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", animation: "slideIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: isPhone ? "rgba(251,146,60,0.15)" : "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          {isPhone ? "📱" : "👁️"}
        </div>
        <div>
          <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 700 }}>⚠ Alert Detected</div>
          <div style={{ color: isPhone ? "#f97316" : "#ef4444", fontSize: 12, fontWeight: 600 }}>{popup.type}</div>
        </div>
        <button onClick={onDismiss} style={{ marginLeft: "auto", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
      </div>
      <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>{popup.student} — {popup.detail}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#64748b", fontSize: 11 }}>{popup.time}</div>
        <div style={{ color: isPhone ? "#f97316" : "#ef4444", fontSize: 16, fontWeight: 800 }}>{popup.confidence}%</div>
      </div>
      <div style={{ height: 3, background: "rgba(30,41,59,0.8)", borderRadius: 2, marginTop: 12, overflow: "hidden" }}>
        <div style={{ height: "100%", background: isPhone ? "#f97316" : "#ef4444", borderRadius: 2, animation: "shrink 5s linear forwards" }} />
      </div>
    </div>
  );
}

function Dashboard({ isProctoring, examName, setExamName, onStart, onStop, alerts, proctorTime, studentsCount }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  
  const sessionAlerts = alerts.filter(a => a.exam_name === examName);
  const phoneC = sessionAlerts.filter(a => a.type.includes("Phone")).length;
  const headC = sessionAlerts.filter(a => a.type.includes("Cheating")).length;
  const formatTime = (s) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <div style={{ color: "#94a3b8", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Overview</div>
          <div style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>System Dashboard</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>YOLOv8 · NVIDIA Jetson Orin Nano · Single Camera</div>
        </div>
        <div style={{ background: "rgba(13,20,38,0.8)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "10px 18px", textAlign: "right" }}>
          <div style={{ color: "#3b82f6", fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{time.toLocaleTimeString()}</div>
        </div>
      </div>

      <div style={{ background: isProctoring ? "rgba(239,68,68,0.06)" : "rgba(37,99,235,0.06)", border: `1.5px solid ${isProctoring ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}`, borderRadius: 18, padding: "28px 32px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            {isProctoring ? `🟢 Active: ${examName}` : "⚪ No Active Session"}
          </div>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            {isProctoring ? `Session running · ${formatTime(proctorTime)} elapsed · ${sessionAlerts.length} total active alerts` : "Enter the Exam Name and press Start Proctoring"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {!isProctoring ? (
            <>
              <input 
                type="text" 
                placeholder="Enter Exam Name (e.g. CMP305 Midterm)" 
                value={examName}
                onChange={e => setExamName(e.target.value)}
                style={{ padding: "12px 16px", background: "rgba(30,41,59,0.8)", border: "1px solid rgba(59,130,246,0.5)", borderRadius: 10, color: "#f1f5f9", fontSize: 14, outline: "none", width: "250px" }}
              />
              <button onClick={onStart} style={{ padding: "14px 32px", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                ▶ Start Proctoring
              </button>
            </>
          ) : (
            <button onClick={onStop} style={{ padding: "14px 32px", background: "rgba(239,68,68,0.15)", border: "1.5px solid rgba(239,68,68,0.5)", borderRadius: 12, color: "#ef4444", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              ■ Stop Proctoring
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        {[
          { icon: "🎓", val: isProctoring ? studentsCount : 0, color: "59,130,246", label: "Students Monitored", sub: "Live from Camera" },
          { icon: "📹", val: isProctoring ? "Live" : "Standby", color: "16,185,129", label: "Camera Status", sub: isProctoring ? "Webcam active" : "Ready to start" },
          { icon: "📱", val: phoneC, color: "251,146,60", label: "Phone Violations", sub: "Active Alerts" },
          { icon: "👁️", val: headC, color: "239,68,68", label: "Head Violations", sub: "Active Alerts" },
        ].map(({ icon, val, color, label, sub }) => (
          <div key={label} style={{ background: "rgba(13,20,38,0.8)", border: `1px solid rgba(${color},0.25)`, borderRadius: 16, padding: "22px 24px", flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>{icon}</div>
            <div style={{ color: `rgb(${color})`, fontSize: 30, fontWeight: 800 }}>{val}</div>
            <div style={{ color: "#94a3b8", fontSize: 12 }}>{label}</div>
            <div style={{ color: `rgb(${color})`, fontSize: 11, fontWeight: 600 }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Monitor({ isProctoring, aiStudents }) {
  const sortedStudents = [...aiStudents].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div>
      <div style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Live Exam Monitor</div>
      <div style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>Real-Time Inference Grids</div>

      <div style={{ background: "rgba(13,20,38,0.9)", border: `1.5px solid ${isProctoring ? "rgba(16,185,129,0.4)" : "rgba(59,130,246,0.2)"}`, borderRadius: 18, padding: "24px", minHeight: 500 }}>
        {!isProctoring ? (
          <div style={{ textAlign: "center", color: "#475569", marginTop: 200 }}>
            <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>📹</div>
            <div style={{ fontSize: 14 }}>Start Proctoring from the Dashboard to activate the camera</div>
          </div>
        ) : sortedStudents.length === 0 ? (
          <div style={{ textAlign: "center", color: "#475569", marginTop: 200 }}>Scanning classroom...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: 32 }}>
            {sortedStudents.map((student) => (
              <div key={student.id} style={{ border: `3px solid ${student.color}`, borderRadius: "16px", overflow: "hidden", background: "#0a0f1c", height: "450px", display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                <div style={{ flex: 1, position: "relative", padding: "10px" }}>
                  <img src={student.image} alt="Student" style={{ width: "100%", height: "100%", objectFit: "contain", position: "absolute", top: 0, left: 0 }} />
                </div>
                <div style={{ background: student.color, padding: "16px", color: "white", textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontWeight: "800", fontSize: 16, textTransform: "uppercase", letterSpacing: 1 }}>
                    {student.id} - {student.status}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 6, opacity: 0.9, fontFamily: "monospace", fontWeight: "600" }}>
                    HEAD TIMER: {student.timer}/8
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Alerts({ alerts, setSelectedAlert, setPage, examName, isProctoring }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const uniqueExams = [...new Set(alerts.map(a => a.exam_name))];
  const [viewExam, setViewExam] = useState(examName || "");

  useEffect(() => {
    if (isProctoring && examName) {
      setViewExam(examName);
    } else if (!viewExam && uniqueExams.length > 0) {
      setViewExam(uniqueExams[0]);
    }
  }, [alerts, isProctoring, examName, uniqueExams.length, viewExam]);

  const currentAlerts = alerts.filter(a => a.exam_name === viewExam);
  const pendingCount = currentAlerts.filter(a => a.resolution === "pending").length;
  const cheatingCount = currentAlerts.filter(a => a.resolution === "confirmed").length;

  const alertsByStudent = currentAlerts.reduce((acc, alert) => {
    if (!acc[alert.student_name]) acc[alert.student_name] = [];
    acc[alert.student_name].push(alert);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700 }}>
          Detection Alerts
        </div>
        <select 
          value={viewExam} 
          onChange={e => { setViewExam(e.target.value); setSelectedStudent(null); }}
          style={{ padding: "10px", borderRadius: "8px", background: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", width: "250px", fontSize: "14px" }}
        >
          {uniqueExams.length === 0 && <option value="">No Exams Found</option>}
          {uniqueExams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
        </select>
      </div>
      
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", padding: "16px", borderRadius: "12px", flex: 1 }}>
          <div style={{ color: "#f59e0b", fontSize: 24, fontWeight: "bold" }}>{pendingCount}</div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>Pending Review</div>
        </div>
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", padding: "16px", borderRadius: "12px", flex: 1 }}>
          <div style={{ color: "#ef4444", fontSize: 24, fontWeight: "bold" }}>{cheatingCount}</div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>Confirmed Cheating</div>
        </div>
      </div>

      {currentAlerts.length === 0 ? (
        <div style={{ textAlign: "center", color: "#475569", marginTop: 80 }}>No alerts generated for this exam yet.</div>
      ) : selectedStudent ? (
        <div>
          <button onClick={() => setSelectedStudent(null)} style={{ background: "transparent", border: "1px solid rgba(59,130,246,0.5)", color: "#93c5fd", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", marginBottom: "20px", fontWeight: "bold" }}>
            ← Back to All Students
          </button>
          <div style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Alerts for {selectedStudent}</div>
          
          {alertsByStudent[selectedStudent].map(a => (
            <div key={a.id} onClick={() => { setSelectedAlert(a); setPage("evidence"); }}
              style={{ background: "rgba(30,41,59,0.3)", border: `1px solid ${a.resolution === "confirmed" ? "rgba(239,68,68,0.8)" : "rgba(245,158,11,0.5)"}`, borderRadius: 14, padding: "16px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: 18, marginBottom: 10 }}>
              <div style={{ fontSize: 22 }}>{a.type.includes("Phone") ? "📱" : "👁️"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 700 }}>
                  {a.time} - {a.resolution.toUpperCase()} <span style={{color: "#3b82f6", fontSize: 11, marginLeft: 8}}>[{a.exam_name}]</span>
                </div>
                <div style={{ color: "#94a3b8", fontSize: 12 }}>{a.detail}</div>
              </div>
              {a.snapshot && <img src={a.snapshot} alt="snap" style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 8 }} />}
              <div style={{ color: "#ef4444", fontSize: 20, fontWeight: 800 }}>{a.confidence}%</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {Object.keys(alertsByStudent).map(studentName => {
            const stAlerts = alertsByStudent[studentName];
            const pCount = stAlerts.filter(a => a.resolution === "pending").length;
            return (
              <div key={studentName} onClick={() => setSelectedStudent(studentName)} 
                   style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "transform 0.1s" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>🎓</div>
                <div style={{ color: "#f1f5f9", fontSize: 20, fontWeight: "bold" }}>{studentName}</div>
                <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 8 }}>Total Alerts: <span style={{ color: "#fff" }}>{stAlerts.length}</span></div>
                {pCount > 0 && (
                  <div style={{ display: "inline-block", background: "rgba(245,158,11,0.2)", color: "#f59e0b", padding: "4px 10px", borderRadius: "8px", fontSize: 12, fontWeight: "bold", marginTop: 12 }}>
                    {pCount} Pending Review
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Evidence({ alerts, alert, setSelectedAlert, onResolveAlert, onDeleteAlert, setPage }) {
  if (!alert) return <div style={{ color: "#475569", textAlign: "center", marginTop: 80 }}>Select an alert from the Alerts page to review evidence.</div>;
  
  const currentAlerts = alerts.filter(a => a.exam_name === alert.exam_name && a.student_name === alert.student_name);
  const currentIndex = currentAlerts.findIndex(a => a.id === alert.id);
  const goNext = () => { if (currentIndex > 0) setSelectedAlert(currentAlerts[currentIndex - 1]); };
  const goPrev = () => { if (currentIndex < currentAlerts.length - 1) setSelectedAlert(currentAlerts[currentIndex + 1]); };

  const handleRapidResolve = (status) => {
    onResolveAlert(alert.id, status);
    if (currentIndex > 0) setSelectedAlert(currentAlerts[currentIndex - 1]);
    else if (currentIndex < currentAlerts.length - 1) setSelectedAlert(currentAlerts[currentIndex + 1]);
  };

  const handleRapidDelete = () => {
    const nextAlert = currentAlerts[currentIndex - 1] || currentAlerts[currentIndex + 1];
    onDeleteAlert(alert.id);
    if (nextAlert) {
      setSelectedAlert(nextAlert);
    } else {
      setSelectedAlert(null);
      setPage("alerts");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => { setSelectedAlert(null); setPage("alerts"); }} style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.5)", padding: "8px 16px", borderRadius: 8, color: "#93c5fd", cursor: "pointer", fontWeight: "bold" }}>
            ← Back to Alerts
          </button>
          <div style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700 }}>Evidence Review</div>
        </div>
        
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={goPrev} disabled={currentIndex === currentAlerts.length - 1} style={{ background: "transparent", border: "1px solid rgba(59,130,246,0.5)", padding: "8px 16px", borderRadius: 8, color: "#93c5fd", cursor: currentIndex === currentAlerts.length - 1 ? "not-allowed" : "pointer", opacity: currentIndex === currentAlerts.length - 1 ? 0.3 : 1 }}>← Prev</button>
          <span style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>{currentAlerts.length - currentIndex} of {currentAlerts.length}</span>
          <button onClick={goNext} disabled={currentIndex === 0} style={{ background: "transparent", border: "1px solid rgba(59,130,246,0.5)", padding: "8px 16px", borderRadius: 8, color: "#93c5fd", cursor: currentIndex === 0 ? "not-allowed" : "pointer", opacity: currentIndex === 0 ? 0.3 : 1 }}>Next →</button>
        </div>
      </div>

      <div style={{ background: "rgba(13,20,38,0.9)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 16, padding: 20 }}>
        <img src={alert.snapshot} alt="evidence" style={{ width: "100%", maxHeight: 450, objectFit: "contain", borderRadius: 8, background: "#000" }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 20 }}>
          <div style={{ color: "#fff" }}>
            <p style={{ margin: "4px 0" }}><strong style={{ color: "#94a3b8" }}>Exam Name:</strong> <span style={{ color: "#3b82f6", fontWeight: "bold"}}>{alert.exam_name}</span></p>
            <p style={{ margin: "4px 0" }}><strong style={{ color: "#94a3b8" }}>Student:</strong> {alert.student_name}</p>
            <p style={{ margin: "4px 0" }}><strong style={{ color: "#94a3b8" }}>Violation:</strong> {alert.type}</p>
            <p style={{ margin: "4px 0" }}><strong style={{ color: "#94a3b8" }}>Severity:</strong> <span style={{ color: alert.severity === "High" ? "#ef4444" : "#f59e0b"}}>{alert.severity}</span></p>
            <p style={{ margin: "4px 0" }}><strong style={{ color: "#94a3b8" }}>Time:</strong> {alert.date} {alert.time}</p>
            <p style={{ margin: "4px 0" }}><strong style={{ color: "#94a3b8" }}>Status:</strong> <span style={{color: alert.resolution === "pending"?"#f59e0b":"#ef4444"}}>{alert.resolution.toUpperCase()}</span></p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
            <button onClick={() => handleRapidResolve("confirmed")}
              style={{ background: alert.resolution === "confirmed" ? "#ef4444" : "rgba(239,68,68,0.1)", border: "1px solid #ef4444", color: alert.resolution === "confirmed" ? "#fff" : "#ef4444", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}>
              ✓ Mark as Cheating (Auto-Next)
            </button>
            <button onClick={handleRapidDelete}
              style={{ background: "transparent", border: "1px solid #64748b", color: "#94a3b8", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}>
              ✕ False Alarm (Delete)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Added "Actions" to directly manage pending alerts from the Reports table!
function Reports({ alerts, setPage, setSelectedAlert, onDeleteAlert }) {
  const [filterExam, setFilterExam] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const handlePrint = () => { window.print(); };

  const filteredAlerts = alerts.filter(a => {
    if (filterExam !== "All" && a.exam_name !== filterExam) return false;
    if (filterStatus !== "All" && a.resolution !== filterStatus.toLowerCase()) return false;
    return true;
  });

  const uniqueExams = [...new Set(alerts.map(a => a.exam_name))];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700 }}>Proctoring Reports</div>
        <button onClick={handlePrint} className="no-print" style={{ background: "#2563eb", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
          📄 Export PDF
        </button>
      </div>

      <style>{`@media print { .no-print, .sidebar { display: none !important; } body { background: white !important; color: black !important; } }`}</style>

      <div className="no-print" style={{ display: "flex", gap: "16px", marginBottom: "24px", background: "rgba(30,41,59,0.5)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(59,130,246,0.2)" }}>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Exam Session</label>
          <select value={filterExam} onChange={e=>setFilterExam(e.target.value)} style={{ padding: "8px", borderRadius: "6px", background: "#0f172a", color: "#fff", border: "1px solid #334155", width: "200px" }}>
            <option>All</option>
            {uniqueExams.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Status</label>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ padding: "8px", borderRadius: "6px", background: "#0f172a", color: "#fff", border: "1px solid #334155", width: "200px" }}>
            <option>All</option>
            <option>Pending</option>
            <option>Confirmed</option>
          </select>
        </div>
      </div>

      <div style={{ background: "rgba(15,23,42,0.8)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(59,130,246,0.2)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(30,41,59,0.8)", color: "#94a3b8", fontSize: 13 }}>
              <th style={{ padding: "16px" }}>Date & Time</th>
              <th style={{ padding: "16px" }}>Exam Name</th>
              <th style={{ padding: "16px" }}>Student</th>
              <th style={{ padding: "16px" }}>Detection</th>
              <th style={{ padding: "16px" }}>Status</th>
              {/* Action column hidden in PDFs */}
              <th className="no-print" style={{ padding: "16px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>No alerts match filters.</td></tr>
            ) : filteredAlerts.map(a => (
              <tr key={a.id} style={{ borderTop: "1px solid rgba(51,65,85,0.5)", color: "#f1f5f9", fontSize: 14 }}>
                <td style={{ padding: "16px" }}>{a.date} <span style={{ color: "#94a3b8" }}>{a.time}</span></td>
                <td style={{ padding: "16px", color: "#93c5fd" }}>{a.exam_name}</td>
                <td style={{ padding: "16px", fontWeight: "bold" }}>{a.student_name}</td>
                <td style={{ padding: "16px" }}>{a.type}</td>
                <td style={{ padding: "16px" }}>
                  <span style={{ color: a.resolution==="confirmed"?"#ef4444":"#f59e0b", fontWeight:"bold", textTransform: "capitalize" }}>{a.resolution}</span>
                </td>
                {/* Action buttons to immediately fix unresolved alerts */}
                <td className="no-print" style={{ padding: "16px" }}>
                  <button onClick={() => { setSelectedAlert(a); setPage("evidence"); }} style={{ background: "rgba(59,130,246,0.2)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.4)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "8px", fontSize: "12px", fontWeight: "bold" }}>
                    Review
                  </button>
                  <button onClick={() => onDeleteAlert(a.id)} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.4)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Settings() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700, marginBottom: 24 }}>System Settings</div>
      <div style={{ display: "grid", gap: "24px", maxWidth: "800px" }}>
        <div style={{ background: "rgba(30,41,59,0.4)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ marginTop: 0, color: "#fff", borderBottom: "1px solid #334155", paddingBottom: "12px", marginBottom: "20px" }}>Hardware Configuration</h3>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>Video Source</label>
            <select style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0f172a", color: "#fff", border: "1px solid #334155" }}>
              <option>Default System Webcam (Active)</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px" }}>
            <div>
              <div style={{ color: "#fff", fontWeight: "bold" }}>Jetson Orin Nano Acceleration</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>Use TensorRT for YOLOv8 Inference</div>
            </div>
            <input type="checkbox" defaultChecked style={{ width: 20, height: 20 }} />
          </div>
        </div>

        <div style={{ background: "rgba(30,41,59,0.4)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ marginTop: 0, color: "#fff", borderBottom: "1px solid #334155", paddingBottom: "12px", marginBottom: "20px" }}>Data & Notifications</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <div style={{ color: "#fff", fontWeight: "bold" }}>Desktop Popups</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>Show sliding alerts on bottom right</div>
            </div>
            <input type="checkbox" style={{ width: 20, height: 20 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <div>
              <div style={{ color: "#fff", fontWeight: "bold" }}>Auto-Delete Normal Alerts</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>Remove false alarms from MySQL after session</div>
            </div>
            <input type="checkbox" defaultChecked style={{ width: 20, height: 20 }} />
          </div>
          <button onClick={handleSave} style={{ width: "100%", background: saved ? "#10b981" : "#2563eb", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
            {saved ? "✓ Settings Saved" : "Save Configurations"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => localStorage.getItem("proctorUser") || null);
  const [page, setPage] = useState("dashboard");
  const [isProctoring, setIsProctoring] = useState(false);
  const [examName, setExamName] = useState("");
  
  const [aiStudents, setAiStudents] = useState([]);
  const webcamRef = useRef(null);
  const socketRef = useRef(null);

  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [popup, setPopup] = useState(null);
  const [proctorTime, setProctorTime] = useState(0);
  const timerInterval = useRef(null);
  const lastAlertTime = useRef({});

  // Fetch alerts from MySQL using Ngrok Headers to bypass browser block!
  useEffect(() => {
    if (loggedInUser) {
      fetch(`${SERVER_URL}api/get_alerts?proctor=${encodeURIComponent(loggedInUser)}`, {
        method: "GET",
        headers: NGROK_HEADERS
      })
        .then(res => res.json())
        .then(data => { if (data.success) setAlerts(data.alerts); })
        .catch(err => console.log("Could not fetch alerts:", err));
    }
  }, [loggedInUser]);

  useEffect(() => {
    let captureInterval;
    
    if (isProctoring) {
      socketRef.current = io(SERVER_URL, { transports: ["websocket"] });

      socketRef.current.on("processed_data", (data) => {
        setAiStudents(data);

        data.forEach((student) => {
          if (student.is_cheating) {
            const now = Date.now();
            const lastTime = lastAlertTime.current[student.id];

            if (!lastTime || now - lastTime > 6000) {
              lastAlertTime.current[student.id] = now;
              const isPhone = student.status.includes("Phone");
              
              const newAlert = {
                id: now,
                exam_name: examName,
                student_name: student.label,
                type: student.status,
                severity: isPhone ? "High" : "Medium",
                confidence: student.real_conf,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                detail: `Detected ${student.status}`,
                snapshot: student.image,
                resolution: "pending",
                proctor_name: loggedInUser 
              };
              
              setAlerts(prev => [newAlert, ...prev]);
              setPopup(newAlert);

              // Ngrok Headers added here too
              fetch(`${SERVER_URL}api/save_alert`, {
                method: "POST",
                headers: NGROK_HEADERS,
                body: JSON.stringify(newAlert)
              }).catch(e => console.log("Failed to save alert to MySQL", e));
            }
          }
        });
      });

      captureInterval = setInterval(() => {
        if (webcamRef.current && socketRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) {
            socketRef.current.emit("process_frame", { image: imageSrc, exam_name: examName });
          }
        }
      }, 250);
    }

    return () => {
      if (captureInterval) clearInterval(captureInterval);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [isProctoring, examName, loggedInUser]);

  const startProctoring = () => {
    if (!examName.trim()) {
      alert("Please enter an Exam Name before starting the session.");
      return;
    }
    setSelectedAlert(null);
    setPopup(null);
    setIsProctoring(true);
    setProctorTime(0);
    timerInterval.current = setInterval(() => setProctorTime(t => t + 1), 1000);
  };

  const stopProctoring = () => {
    setIsProctoring(false);
    clearInterval(timerInterval.current);
    if (socketRef.current) socketRef.current.disconnect();
    setAiStudents([]);
  };

  const handleLogin = (name) => {
    localStorage.setItem("proctorUser", name);
    setLoggedInUser(name);
  };

  const handleLogout = () => {
    stopProctoring();
    localStorage.removeItem("proctorUser");
    setLoggedInUser(null);
    setAlerts([]);
    setExamName("");
    setPage("dashboard");
  };

  const handleResolveAlert = (alertId, status) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolution: status } : a));
    
    fetch(`${SERVER_URL}api/update_alert`, {
      method: "POST",
      headers: NGROK_HEADERS,
      body: JSON.stringify({ id: alertId, resolution: status })
    }).catch(e => console.log("Failed to update MySQL resolution", e));
  };

  const handleDeleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));

    fetch(`${SERVER_URL}api/delete_alert`, {
      method: "POST",
      headers: NGROK_HEADERS,
      body: JSON.stringify({ id: alertId })
    }).catch(e => console.log("Failed to delete from MySQL", e));
  };

  if (!loggedInUser) return <AuthPage onLogin={handleLogin} />;

  const pendingAlertsCount = alerts.filter(a => a.exam_name === examName && a.resolution === "pending").length;

  const pages = {
    dashboard: <Dashboard isProctoring={isProctoring} examName={examName} setExamName={setExamName} onStart={startProctoring} onStop={stopProctoring} alerts={alerts} proctorTime={proctorTime} studentsCount={aiStudents.length} />,
    monitor: <Monitor isProctoring={isProctoring} aiStudents={aiStudents} />,
    alerts: <Alerts alerts={alerts} setSelectedAlert={setSelectedAlert} setPage={setPage} examName={examName} isProctoring={isProctoring} />,
    evidence: <Evidence alerts={alerts} alert={selectedAlert} setSelectedAlert={setSelectedAlert} onResolveAlert={handleResolveAlert} onDeleteAlert={handleDeleteAlert} setPage={setPage} />,
    // Passed down necessary properties to allow actions in the Reports page
    reports: <Reports alerts={alerts} setPage={setPage} setSelectedAlert={setSelectedAlert} onDeleteAlert={handleDeleteAlert} />,
    settings: <Settings />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070d1a", fontFamily: "'DM Sans', sans-serif", color: "#f1f5f9" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      
      {isProctoring && (
        <div style={{ position: "fixed", top: "-1000px", left: "-1000px", width: "10px", height: "10px", overflow: "hidden", zIndex: -1 }}>
          <Webcam 
            ref={webcamRef} 
            audio={false}
            screenshotFormat="image/jpeg" 
            screenshotQuality={0.5}
            videoConstraints={{ width: 640, height: 480 }} 
            mirrored={false} 
          />
        </div>
      )}

      <PopupNotification popup={popup} onDismiss={() => setPopup(null)} />
      
      <div className="sidebar" style={{ width: 220, background: "rgba(10,15,28,0.95)", borderRight: "1px solid rgba(59,130,246,0.1)", padding: "28px 0", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "0 24px 28px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⬡</div>
          <div>
            <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 700 }}>ProctorAI</div>
            <div style={{ color: "#64748b", fontSize: 10 }}>AUS · Spring 2026</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "0 12px" }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: page === item.id ? "rgba(37,99,235,0.2)" : "transparent", border: page === item.id ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent", borderRadius: 10, color: page === item.id ? "#93c5fd" : "#64748b", cursor: "pointer", textAlign: "left", marginBottom: 4, fontSize: 14, transition: "all 0.15s" }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
              {item.id === "alerts" && pendingAlertsCount > 0 && <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#fff", fontSize: 10, borderRadius: 5, padding: "2px 6px" }}>{pendingAlertsCount}</span>}
            </button>
          ))}
        </div>
        
        {isProctoring && (
          <div style={{ margin: "0 12px 16px", padding: "10px 14px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
              <span style={{ color: "#10b981", fontSize: 11, fontWeight: 600 }}>Session Active</span>
            </div>
            <div style={{ color: "#64748b", fontSize: 10, marginTop: 3 }}>{alerts.filter(a => a.exam_name === examName).length} alerts recorded</div>
          </div>
        )}
        <div style={{ padding: "16px 24px 0", borderTop: "1px solid rgba(59,130,246,0.08)", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(37,99,235,0.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "120px" }} title={loggedInUser}>
                {loggedInUser}
              </div>
              <div style={{ color: "#475569", fontSize: 10 }}>Supervisor</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", padding: "8px", borderRadius: "8px", color: "#ef4444", fontSize: 12, fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}>
            ⇥ Log Out
          </button>
        </div>
      </div>
      <div style={{ flex: 1, padding: "40px 44px", overflowY: "auto", width: "100%" }}>
        {pages[page]}
      </div>
    </div>
  );
}