import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePatientPDF(patient) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  const patientId = patient.patientId || patient._id || "N/A";
  const name = patient.name || "Unknown";
  const riskLevel = (patient.latestRiskLevel || "Unknown").toLowerCase();
  const probability = patient.latestRiskProbability ?? 0;
  const lastAssessment = patient.riskAssessments?.length
    ? patient.riskAssessments[patient.riskAssessments.length - 1]
    : null;

  let y = 0;

  doc.setFillColor(6, 182, 212);
  doc.rect(0, 0, pageWidth, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("CARE-NET", margin, 12);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.text("AI-Powered Healthcare Continuity Platform", margin, 20);
  doc.text(
    "Generated: " + new Date().toLocaleString(),
    pageWidth - margin,
    20,
    { align: "right" }
  );

  y = 34;
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 22, 2, 2, "F");

  doc.setTextColor(6, 182, 212);
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Patient ID: " + patientId, 20, 44);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(name, 20, 52);

  const badgeX = pageWidth - 55;
  const badgeY = 36;
  const badgeW = 41;
  const badgeH = 14;
  if (riskLevel.includes("high")) {
    doc.setFillColor(239, 68, 68);
  } else if (riskLevel.includes("medium")) {
    doc.setFillColor(234, 179, 8);
  } else {
    doc.setFillColor(34, 197, 94);
  }
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1, 1, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont(undefined, "normal");
  const levelLabel = (patient.latestRiskLevel || "Unknown") + " Risk — " + probability + "%";
  doc.text(levelLabel, badgeX + badgeW / 2, badgeY + badgeH / 2 + 1.5, { align: "center" });

  y = 62;

  doc.setTextColor(6, 182, 212);
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Patient Information", margin, y + 6);
  y += 14;

  autoTable(doc, {
    startY: y,
    body: [
      ["Age", String(patient.age ?? "—"), "Gender", String(patient.gender ?? "—")],
      ["Disease", String(patient.disease ?? "—"), "Treatment Stage", String(patient.treatmentStage ?? 1) + "/4"],
      ["Hospital", String(patient.currentHospital ?? "—"), "Phone", String(patient.phone || "N/A")],
      ["Financial Score", String(patient.financialScore ?? 0) + "/10", "Scheme Enrolled", patient.schemeEnrolled ? "Yes" : "No"],
    ],
    margin: { left: margin, right: margin },
    bodyStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
    theme: "plain",
  });
  y = doc.lastAutoTable.finalY + 12;

  doc.setTextColor(6, 182, 212);
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("AI Risk Assessment", margin, y + 6);
  y += 14;

  const reasons = lastAssessment?.primaryReasons;
  const primaryReasonsText = Array.isArray(reasons) ? reasons.join(", ") : "—";
  const recommendationText = lastAssessment?.recommendation || "—";
  const lastAssessedText = lastAssessment?.assessedAt
    ? new Date(lastAssessment.assessedAt).toLocaleString()
    : "—";

  autoTable(doc, {
    startY: y,
    head: [["Field", "Value"]],
    body: [
      ["Risk Level", patient.latestRiskLevel || "Unknown"],
      ["Risk Probability", String(probability) + "%"],
      ["Primary Reasons", primaryReasonsText],
      ["Recommendation", recommendationText],
      ["Last Assessed", lastAssessedText],
    ],
    margin: { left: margin, right: margin },
    headStyles: { fillColor: [15, 23, 42], textColor: [148, 163, 184] },
    bodyStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
    theme: "plain",
  });
  y = doc.lastAutoTable.finalY + 12;

  if (patient.enrolledSchemes && patient.enrolledSchemes.length > 0) {
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Enrolled Government Schemes", margin, y + 6);
    y += 14;
    const schemeRows = patient.enrolledSchemes.map((s, i) => [String(i + 1), s]);
    autoTable(doc, {
      startY: y,
      head: [["#", "Scheme Name"]],
      body: schemeRows,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [15, 23, 42], textColor: [148, 163, 184] },
      bodyStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
      theme: "plain",
    });
    y = doc.lastAutoTable.finalY + 12;
  }

  if (patient.appointments && patient.appointments.length > 0) {
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Appointment History", margin, y + 6);
    y += 14;
    const apptRows = patient.appointments.map((a) => [
      a.date ? new Date(a.date).toLocaleDateString() : "—",
      a.type || "—",
      a.status || "scheduled",
      a.notes || "—",
    ]);
    autoTable(doc, {
      startY: y,
      head: [["Date", "Type", "Status", "Notes"]],
      body: apptRows,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [15, 23, 42], textColor: [148, 163, 184] },
      bodyStyles: (data) => {
        const base = { fillColor: [30, 41, 59], textColor: [255, 255, 255] };
        if (data.column.index === 2) {
          const s = (data.cell?.text?.[0] || "").toLowerCase();
          if (s === "missed") return { ...base, textColor: [239, 68, 68] };
          if (s === "completed") return { ...base, textColor: [34, 197, 94] };
        }
        return base;
      },
      theme: "plain",
    });
    y = doc.lastAutoTable.finalY + 12;
  }

  if (patient.medicalHistory && patient.medicalHistory.length > 0) {
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Cross-Hospital Medical History", margin, y + 6);
    y += 14;
    const historyRows = patient.medicalHistory.map((h) => [
      h.hospital || "—",
      h.diagnosis || "—",
      h.treatment || "—",
      h.doctor || "—",
      h.date ? new Date(h.date).toLocaleDateString() : "—",
    ]);
    autoTable(doc, {
      startY: y,
      head: [["Hospital", "Diagnosis", "Treatment", "Doctor", "Date"]],
      body: historyRows,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [15, 23, 42], textColor: [148, 163, 184] },
      bodyStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
      theme: "plain",
    });
    y = doc.lastAutoTable.finalY + 12;
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(15, 23, 42);
    doc.rect(0, doc.internal.pageSize.getHeight() - 12, pageWidth, 12, "F");
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.text(
      "CARE-NET — Confidential Medical Record — HAL 4.0 Hackathon",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: "center" }
    );
    doc.text("Page " + i + " of " + totalPages, pageWidth - margin, doc.internal.pageSize.getHeight() - 6, {
      align: "right",
    });
  }

  const safeName = name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
  doc.save("CARENET_" + patientId + "_" + safeName + ".pdf");
}
