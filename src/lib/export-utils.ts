"use client";

import jsPDF from "jspdf";
import { Invoice, Client } from "@/lib/mock-data";
import { formatFCFA, formatDate } from "@/lib/utils";

// Trigger a browser file download
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// -------------------------------------------------------------
// FACTURES EXPORT
// -------------------------------------------------------------

export function exportInvoicesToCSV(invoices: Invoice[]) {
  const headers = [
    "Numéro Facture",
    "Client",
    "Ville",
    "Email",
    "Téléphone",
    "Date Émission",
    "Date Échéance",
    "Montant HT (FCFA)",
    "TVA 18% (FCFA)",
    "Montant TTC (FCFA)",
    "Montant Réglé (FCFA)",
    "Solde Dû (FCFA)",
    "Statut",
    "Mode de Règlement",
  ];

  const rows = invoices.map((inv) => [
    `"${inv.invoiceNumber}"`,
    `"${inv.clientName.replace(/"/g, '""')}"`,
    `"${inv.clientCity || "Dakar"}"`,
    `"${inv.clientEmail || ""}"`,
    `"${inv.clientPhone || ""}"`,
    `"${formatDate(inv.issueDate)}"`,
    `"${formatDate(inv.dueDate)}"`,
    inv.amountHT,
    inv.taxAmount,
    inv.amountTTC,
    inv.amountPaid || 0,
    inv.balanceDue,
    `"${inv.status === "paid" ? "Payée" : inv.status === "sent" ? "Envoyée" : inv.status === "overdue" ? "En retard" : "Brouillon"}"`,
    `"${inv.paymentMethod || "Wave Business"}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `Factures_Devada_Invoice_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportInvoicesToExcel(invoices: Invoice[]) {
  // Semicolon delimited with UTF-8 BOM for Microsoft Excel compatibility
  const headers = [
    "Numéro Facture",
    "Client",
    "Ville",
    "Email",
    "Téléphone",
    "Date Émission",
    "Date Échéance",
    "Montant HT (FCFA)",
    "TVA 18% (FCFA)",
    "Montant TTC (FCFA)",
    "Montant Réglé (FCFA)",
    "Solde Dû (FCFA)",
    "Statut",
    "Mode de Règlement",
  ];

  const rows = invoices.map((inv) => [
    `"${inv.invoiceNumber}"`,
    `"${inv.clientName.replace(/"/g, '""')}"`,
    `"${inv.clientCity || "Dakar"}"`,
    `"${inv.clientEmail || ""}"`,
    `"${inv.clientPhone || ""}"`,
    `"${formatDate(inv.issueDate)}"`,
    `"${formatDate(inv.dueDate)}"`,
    inv.amountHT,
    inv.taxAmount,
    inv.amountTTC,
    inv.amountPaid || 0,
    inv.balanceDue,
    `"${inv.status === "paid" ? "Payée" : inv.status === "sent" ? "Envoyée" : inv.status === "overdue" ? "En retard" : "Brouillon"}"`,
    `"${inv.paymentMethod || "Wave Business"}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
  const blob = new Blob([csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
  downloadBlob(blob, `Factures_Devada_Invoice_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportInvoicesToPDF(invoices: Invoice[]) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Primary Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DEVADA INVOICE — ÉTAT RÉCAPITULATIF DES FACTURES", 14, 15);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Document généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`, pageWidth - 14, 15, { align: "right" });

  // Summary Metrics Banner
  const totalTTC = invoices.reduce((sum, inv) => sum + inv.amountTTC, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
  const totalBalance = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  doc.setFillColor(248, 250, 252);
  doc.rect(14, 28, pageWidth - 28, 14, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 28, pageWidth - 28, 14, "S");

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "bold");
  doc.text(`Total factures : ${invoices.length}`, 20, 37);
  doc.text(`Total Facturé TTC : ${formatFCFA(totalTTC)}`, 75, 37);
  doc.text(`Total Encaissé : ${formatFCFA(totalPaid)}`, 160, 37);
  doc.setTextColor(225, 29, 72);
  doc.text(`Soldes Restants Dûs : ${formatFCFA(totalBalance)}`, 225, 37);

  // Table Headers
  let startY = 50;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, startY - 5, pageWidth - 28, 8, "F");

  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "bold");

  doc.text("N° FACTURE", 18, startY);
  doc.text("CLIENT DESTINATAIRE", 52, startY);
  doc.text("DATE ÉMISSION", 120, startY);
  doc.text("ÉCHÉANCE", 152, startY);
  doc.text("TOTAL TTC", 195, startY, { align: "right" });
  doc.text("SOLDE DÛ", 235, startY, { align: "right" });
  doc.text("STATUT", 255, startY);

  startY += 7;

  // Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  invoices.forEach((inv, index) => {
    if (startY > pageHeight - 20) {
      doc.addPage();
      startY = 20;
    }

    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, startY - 4.5, pageWidth - 28, 6.5, "F");
    }

    doc.setTextColor(15, 23, 42);
    doc.text(inv.invoiceNumber, 18, startY);
    doc.text(inv.clientName.slice(0, 32), 52, startY);
    doc.text(formatDate(inv.issueDate), 120, startY);
    doc.text(formatDate(inv.dueDate), 152, startY);

    doc.setFont("helvetica", "bold");
    doc.text(formatFCFA(inv.amountTTC), 195, startY, { align: "right" });
    doc.setTextColor(inv.balanceDue > 0 ? 225 : 15, inv.balanceDue > 0 ? 29 : 23, inv.balanceDue > 0 ? 72 : 42);
    doc.text(formatFCFA(inv.balanceDue), 235, startY, { align: "right" });

    doc.setFont("helvetica", "normal");
    const statusLabel =
      inv.status === "paid" ? "Payée" : inv.status === "overdue" ? "En retard" : inv.status === "sent" ? "Envoyée" : "Brouillon";
    doc.setTextColor(inv.status === "paid" ? 5 : inv.status === "overdue" ? 225 : 37, inv.status === "paid" ? 150 : 29, inv.status === "paid" ? 105 : 72);
    doc.text(statusLabel, 255, startY);

    startY += 6.5;
  });

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Devada Invoice SaaS © 2026 — Plateforme de facturation conforme OHADA & DGID Sénégal", pageWidth / 2, pageHeight - 8, { align: "center" });

  doc.save(`Rapport_Factures_Devada_Invoice_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// CLIENTS EXPORT
// -------------------------------------------------------------

export function exportClientsToCSV(clients: Client[]) {
  const headers = [
    "Nom Entreprise / Client",
    "Date d'Acquisition",
    "Email",
    "Téléphone",
    "Ville",
    "NINEA",
    "RCCM",
    "Factures Émises",
    "Total Facturé (FCFA)",
    "Solde Dû (FCFA)",
    "Statut",
  ];

  const rows = clients.map((c) => [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${formatDate(c.acquisitionDate || c.createdAt)}"`,
    `"${c.email}"`,
    `"${c.phone}"`,
    `"${c.city}"`,
    `"${c.ninea || ""}"`,
    `"${c.rccm || ""}"`,
    c.invoicesCount || 0,
    c.totalBilled || 0,
    c.balanceDue || 0,
    `"${c.status === "active" ? "Actif" : "Inactif"}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `Clients_Devada_Invoice_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportClientsToExcel(clients: Client[]) {
  const headers = [
    "Nom Entreprise / Client",
    "Date d'Acquisition",
    "Email",
    "Téléphone",
    "Ville",
    "NINEA",
    "RCCM",
    "Factures Émises",
    "Total Facturé (FCFA)",
    "Solde Dû (FCFA)",
    "Statut",
  ];

  const rows = clients.map((c) => [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${formatDate(c.acquisitionDate || c.createdAt)}"`,
    `"${c.email}"`,
    `"${c.phone}"`,
    `"${c.city}"`,
    `"${c.ninea || ""}"`,
    `"${c.rccm || ""}"`,
    c.invoicesCount || 0,
    c.totalBilled || 0,
    c.balanceDue || 0,
    `"${c.status === "active" ? "Actif" : "Inactif"}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
  const blob = new Blob([csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
  downloadBlob(blob, `Clients_Devada_Invoice_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportClientsToPDF(clients: Client[]) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 8; // Optimized lateral margin (gains 12mm width)
  const contentWidth = pageWidth - marginX * 2; // 194mm

  // Compact Header Banner (13mm height instead of 24mm)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 13, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.text("DEVADA INVOICE — RÉPERTOIRE & SOLDES CLIENTS", marginX + 2, 8.5);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`Édité le ${new Date().toLocaleDateString("fr-FR")}`, pageWidth - marginX - 2, 8.5, { align: "right" });

  // Compact Summary Banner (7.5mm height instead of 12mm)
  const totalBilled = clients.reduce((sum, c) => sum + (c.totalBilled || 0), 0);
  const totalDue = clients.reduce((sum, c) => sum + (c.balanceDue || 0), 0);

  doc.setFillColor(248, 250, 252);
  doc.rect(marginX, 15.5, contentWidth, 7.5, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(marginX, 15.5, contentWidth, 7.5, "S");

  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "bold");
  doc.text(`Total clients : ${clients.length}`, marginX + 3, 20.5);
  doc.text(`Chiffre d'Affaires Cumulé : ${formatFCFA(totalBilled)}`, marginX + 50, 20.5);
  doc.setTextColor(225, 29, 72);
  doc.text(`Créances Restantes : ${formatFCFA(totalDue)}`, marginX + 130, 20.5);

  // Table Header (starts high at y=27mm to maximize client rows)
  let startY = 27;
  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, startY - 4, contentWidth, 6.5, "F");

  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT / RAISON SOCIALE", marginX + 2, startY);
  doc.text("VILLE", 62, startY);
  doc.text("CONTACT (TÉL / EMAIL)", 96, startY);
  doc.text("DATE ACQUIS.", 130, startY);
  doc.text("FACTURÉ (FCFA)", 176, startY, { align: "right" });
  doc.text("SOLDE DÛ (FCFA)", 201, startY, { align: "right" });

  startY += 6.5;

  // Client Rows with 2-line layout and strictly isolated fields
  clients.forEach((c, index) => {
    if (startY + 10 > pageHeight - 14) {
      doc.addPage();
      startY = 18;
    }

    // Alternating zebra background
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginX, startY - 3.5, contentWidth, 9.5, "F");
    }

    // Line 1: Primary identifiers
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(c.name.slice(0, 32), marginX + 2, startY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(c.city ? c.city.slice(0, 18) : "Dakar", 62, startY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(c.phone || "-", 96, startY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(formatDate(c.acquisitionDate || c.createdAt), 130, startY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(formatFCFA(c.totalBilled || 0), 176, startY, { align: "right" });

    doc.setTextColor(c.balanceDue > 0 ? 225 : 15, c.balanceDue > 0 ? 29 : 23, c.balanceDue > 0 ? 72 : 42);
    doc.text(formatFCFA(c.balanceDue || 0), 201, startY, { align: "right" });

    // Line 2: Secondary details (Factures, Adresse, Email, NINEA, Statut)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);

    const clientSub = `${c.invoicesCount || 0} facture${(c.invoicesCount || 0) > 1 ? "s" : ""}`;
    doc.text(clientSub, marginX + 2, startY + 4.2);

    const locSub = c.address ? c.address.slice(0, 20) : "Sénégal 🇸🇳";
    doc.text(locSub, 62, startY + 4.2);

    const emailSub = c.email ? c.email.slice(0, 22) : "-";
    doc.text(emailSub, 96, startY + 4.2);

    // NINEA is positioned on line 2 so it CANNOT collide with numbers!
    const nineaSub = c.ninea ? `NINEA: ${c.ninea}` : "-";
    doc.text(nineaSub, 130, startY + 4.2);

    doc.setTextColor(c.status === "active" ? 5 : 148, c.status === "active" ? 150 : 163, c.status === "active" ? 105 : 184);
    doc.text(c.status === "active" ? "Actif" : "Inactif", 201, startY + 4.2, { align: "right" });

    startY += 9.5;
  });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Devada Invoice SaaS © 2026 — Plateforme de facturation conforme OHADA & DGID Sénégal", pageWidth / 2, pageHeight - 6, { align: "center" });

  doc.save(`Rapport_Clients_Devada_Invoice_${new Date().toISOString().slice(0, 10)}.pdf`);
}
