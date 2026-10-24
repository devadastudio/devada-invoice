import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Invoice, CompanySettings, CURRENT_USER, DEFAULT_SETTINGS } from "@/lib/mock-data";
import { formatFCFA, formatDate, formatCurrency } from "@/lib/utils";
import { getInvoiceTranslations, isDefaultPaymentNotice, translateInvoiceText, AppLanguage } from "@/lib/i18n";

let cachedProjectLogoData: string | null = null;

/**
 * Loads the official Devada Invoice logo from the project as a Base64 data URL
 */
export async function getProjectLogoData(): Promise<string | null> {
  if (cachedProjectLogoData) return cachedProjectLogoData;
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/images/devada-logo.png");
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        cachedProjectLogoData = dataUrl;
        resolve(dataUrl);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Builds a 100% native vector jsPDF document for an invoice.
 * Guaranteed selectable/copy-pasteable text ("modèle OCR"), ultra-lightweight (< 25 KB),
 * crisp resolution, and status rendered as pure colored text without background box.
 */
export function buildInvoiceVectorPDF(
  invoice: Invoice,
  settings: CompanySettings,
  logoOverride?: string | null
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const currency = invoice.currency || "FCFA";
  const formatAmt = (val: number) =>
    currency === "FCFA" ? formatFCFA(val) : formatCurrency(val, currency);

  const t = getInvoiceTranslations(invoice.language || "fr");

  // Determine status label & RGB color
  let statusText = "";
  let statusR = 100;
  let statusG = 116;
  let statusB = 139; // Default slate

  if (invoice.status === "paid") {
    statusText = t.status.paid;
    statusR = 5;
    statusG = 150;
    statusB = 105; // Emerald #059669
  } else if (invoice.status === "overdue") {
    statusText = t.status.overdue;
    statusR = 225;
    statusG = 29;
    statusB = 72; // Rose/Red #e11d48
  } else if (invoice.status === "sent") {
    statusText = t.status.sent;
    statusR = 217;
    statusG = 119;
    statusB = 6; // Amber/Orange #d97706
  } else if (invoice.status === "draft") {
    statusText = t.status.draft;
    statusR = 100;
    statusG = 116;
    statusB = 139; // Slate #64748b
  }

  // --- BRAND / LOGO ---
  let logoDrawn = false;
  const targetLogo = (settings.companyLogo && settings.companyLogo.length > 20)
    ? settings.companyLogo
    : (logoOverride || cachedProjectLogoData);

  if (targetLogo && (targetLogo.startsWith("data:image/") || targetLogo.startsWith("blob:"))) {
    try {
      // devada-logo.png is JPEG format with .png extension, so check MIME or default to JPEG
      const format = targetLogo.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(targetLogo, format, 14, 11, 42, 13);
      logoDrawn = true;
    } catch (e) {
      // Try alternate format if first failed
      try {
        const altFormat = targetLogo.includes("image/png") ? "JPEG" : "PNG";
        doc.addImage(targetLogo, altFormat, 14, 11, 42, 13);
        logoDrawn = true;
      } catch (e2) {
        console.warn("Could not render logo image in PDF, falling back to vector mark", e2);
      }
    }
  }

  if (!logoDrawn) {
    // Vector brand mark: Devada geometric clover in emerald green
    doc.setFillColor(5, 150, 105);
    doc.roundedRect(14, 12, 9.5, 9.5, 2.5, 2.5, "F");
    doc.setFillColor(255, 255, 255);
    doc.circle(17, 15, 1.2, "F");
    doc.circle(20.5, 15, 1.2, "F");
    doc.circle(17, 18.5, 1.2, "F");
    doc.circle(20.5, 18.5, 1.2, "F");

    // Brand typography
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text("devada", 26.5, 19.5);
    doc.setTextColor(5, 150, 105);
    doc.text("invoice", 48, 19.5);

    doc.setFontSize(6.5);
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.setLineWidth(0.2);
    doc.roundedRect(68, 15.5, 8.5, 4.2, 1, 1, "FD");
    doc.setTextColor(4, 120, 87);
    doc.text("PRO", 69.8, 18.6);
  }

  // --- DOCUMENT TITLE & INVOICE NUMBER ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(15, 23, 42);
  doc.text(t.documentTitle, 14, 29);

  doc.setFontSize(11);
  doc.setTextColor(37, 99, 235); // Cobalt Royal Blue
  doc.text(`${t.invoiceNumberPrefix} ${invoice.invoiceNumber}`, 14, 35);

  // --- HEADER RIGHT METADATA ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`${t.issueDate} : ${formatDate(invoice.issueDate)}`, 196, 17, { align: "right" });
  doc.text(`${t.dueDate} : ${formatDate(invoice.dueDate)}`, 196, 22, { align: "right" });
  doc.text(
    `${t.paymentMethod} : ${invoice.paymentMethod || "Wave Business"}`,
    196,
    27,
    { align: "right" }
  );

  // Status: pure bold uppercase text WITHOUT background box (per exact user requirement)
  if (statusText) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(statusR, statusG, statusB);
    doc.text(statusText.toUpperCase(), 196, 35, { align: "right" });
  }

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(14, 39, 196, 39);

  // --- SENDER (FROM) & CLIENT (TO) BLOCKS ---
  let y = 46;

  // Left: Issuer (From)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(t.from.toUpperCase(), 14, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(settings.companyName || CURRENT_USER.company, 14, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(settings.address || CURRENT_USER.address, 14, y + 9.5);
  doc.text(`${settings.city || CURRENT_USER.city}, Sénégal`, 14, y + 13.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text(`${t.clientNinea} : `, 14, y + 17.5);
  doc.setFont("helvetica", "normal");
  doc.text(settings.ninea || CURRENT_USER.ninea, 32, y + 17.5);

  doc.setFont("helvetica", "bold");
  doc.text(`${t.clientRccm} : `, 14, y + 21.5);
  doc.setFont("helvetica", "normal");
  doc.text(settings.rccm || "SN-DKR-2022-B-1425", 32, y + 21.5);

  // Right: Client (To) - in a subtle card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(110, y - 2, 86, 26, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(t.to.toUpperCase(), 114, y + 3);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(invoice.clientName, 114, y + 7.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(invoice.clientAddress || "Adresse client", 114, y + 12);
  doc.text(`${invoice.clientCity || "Dakar"}, Sénégal`, 114, y + 16);

  if (invoice.clientNinea) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(`${t.clientNinea} : `, 114, y + 20);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.clientNinea, 132, y + 20);
  } else if (invoice.clientEmail) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(invoice.clientEmail, 114, y + 20);
  }

  // --- ITEMS TABLE ---
  y = 78;

  // Table header bar
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, y, 182, 7.5, 1.2, 1.2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(t.itemDescription.toUpperCase(), 18, y + 5);
  doc.text(t.quantity.toUpperCase(), 120, y + 5, { align: "center" });
  doc.text(t.unitPriceHT.toUpperCase(), 158, y + 5, { align: "right" });
  doc.text(t.totalHT.toUpperCase(), 192, y + 5, { align: "right" });

  y += 7.5;

  const items = invoice.items && invoice.items.length > 0
    ? invoice.items
    : [
        {
          id: "1",
          description: "Prestation de service professionnelle",
          quantity: 1,
          unitPrice: invoice.amountHT || 0,
          taxRate: 18,
          amount: invoice.amountHT || 0,
        },
      ];

  items.forEach((item) => {
    const lineTotal = (item.quantity || 1) * (item.unitPrice || 0);
    const descLines = doc.splitTextToSize(item.description || "Prestation", 94);
    const rowHeight = Math.max(descLines.length * 4.6 + 3, 8.5);

    // Multi-page check
    if (y + rowHeight > 235) {
      doc.addPage();
      y = 20;
      // Re-draw table header on new page
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, y, 182, 7.5, 1.2, 1.2, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(t.itemDescription.toUpperCase(), 18, y + 5);
      doc.text(t.quantity.toUpperCase(), 120, y + 5, { align: "center" });
      doc.text(t.unitPriceHT.toUpperCase(), 158, y + 5, { align: "right" });
      doc.text(t.totalHT.toUpperCase(), 192, y + 5, { align: "right" });
      y += 7.5;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(descLines, 18, y + 4.5);

    doc.setTextColor(100, 116, 139);
    doc.text(String(item.quantity || 1), 120, y + 4.5, { align: "center" });

    doc.text(formatAmt(item.unitPrice || 0), 158, y + 4.5, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(formatAmt(lineTotal), 192, y + 4.5, { align: "right" });

    y += rowHeight;

    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(14, y, 196, y);
  });

  // --- FINANCIAL SUMMARY TOTALS ---
  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(105, y, 196, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`${t.subtotalHT} :`, 105, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(formatAmt(invoice.amountHT), 192, y, { align: "right" });

  if (invoice.discountAmount) {
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(5, 150, 105);
    doc.text(`${t.discount} :`, 105, y);
    doc.setFont("helvetica", "bold");
    doc.text(`-${formatAmt(invoice.discountAmount)}`, 192, y, { align: "right" });
  }

  y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  const effectiveVatRate = settings.taxApplicable === false
    ? 0
    : (invoice.items?.[0]?.taxRate ?? settings.defaultTaxRate ?? 18);
  const vatLabel = effectiveVatRate === 0
    ? (invoice.language === "en" ? "VAT (0% - Exempt)" : invoice.language === "it" ? "IVA (0% - Esente)" : "TVA (0% - Non assujettie)")
    : `${t.vatSenegal.replace(/\s*\(\d+%\)/, "")} (${effectiveVatRate}%)`;
  doc.text(`${vatLabel} :`, 105, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(formatAmt(invoice.taxAmount), 192, y, { align: "right" });

  y += 3;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(105, y, 196, y);

  y += 5.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${t.totalTTC} :`, 105, y);
  doc.setFontSize(11);
  doc.setTextColor(37, 99, 235);
  doc.text(formatAmt(invoice.amountTTC), 192, y, { align: "right" });

  if (currency !== "FCFA") {
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`≈ ${formatFCFA(invoice.amountTTC)}`, 192, y, { align: "right" });
  }

  // --- BANK DETAILS (If bank transfer) ---
  if (invoice.paymentMethod === "Virement bancaire" && settings.bankIban) {
    y += 8;
    doc.setFillColor(239, 246, 255); // Soft blue #EFF6FF
    doc.setDrawColor(191, 219, 254); // #BFDBFE
    doc.setLineWidth(0.3);
    doc.roundedRect(14, y, 182, 16, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 64, 175);
    doc.text(`${t.bankDetails} :`, 18, y + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Banque : ${settings.bankName || "Banque"}`, 18, y + 9);
    doc.text(`${t.accountHolder} : ${settings.bankAccountHolder || settings.companyName}`, 105, y + 9);
    doc.text(`IBAN : ${settings.bankIban}`, 18, y + 13.5);
    doc.text(`Clé RIB : ${settings.bankRibKey || "45"}`, 105, y + 13.5);

    y += 18;
  } else {
    y += 10;
  }

  // --- PAYMENT TERMS & SIGNATURE BLOCK ---
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(14, y, 196, y);

  y += 5;

  // Left: Payment Terms & Notes
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`${t.paymentTerms} :`, 14, y);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const rawTerms = invoice.notes || settings.footerLegalText || t.paymentNotice;
  const termsText = (invoice.language && invoice.language !== "fr")
    ? translateInvoiceText(rawTerms, invoice.language as AppLanguage, "fr")
    : rawTerms;
  const noteLines = doc.splitTextToSize(termsText, 115);
  doc.text(noteLines, 14, y + 4.5);

  if (
    (invoice.showExchangeRate ?? settings.showExchangeRateOnInvoices) &&
    invoice.appliedRate &&
    currency !== "FCFA"
  ) {
    const exchY = y + 4.5 + noteLines.length * 3.8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(37, 99, 235);
    doc.text(
      `Taux de change appliqué : 1 ${currency} = ${invoice.appliedRate.toLocaleString("fr-FR")} FCFA (Valeur certifiée)`,
      14,
      exchY
    );
  }

  // Right: Signature
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("SIGNATURE AUTORISÉE", 192, y, { align: "right" });

  let sigDrawn = false;
  if (
    settings.signatureType === "image" &&
    settings.signatureImageData &&
    (settings.signatureImageData.startsWith("data:image/") || settings.signatureImageData.startsWith("blob:"))
  ) {
    try {
      const format = settings.signatureImageData.includes("image/jpeg") ? "JPEG" : "PNG";
      doc.addImage(settings.signatureImageData, format, 162, y + 2, 30, 11);
      sigDrawn = true;
    } catch (e) {
      console.warn("Could not render signature image, using text signature", e);
    }
  }

  if (!sigDrawn) {
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(settings.signatureName || CURRENT_USER.name, 192, y + 7, { align: "right" });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Pour ${settings.companyName || CURRENT_USER.company}`, 192, y + (sigDrawn ? 14 : 11), { align: "right" });

  // --- BOTTOM FOOTER: COMPANY CONTACT & LEGAL INFO ---
  const footerY = 282;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(14, footerY, 196, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);

  // Line 1: Legal Name, Form, NINEA, RCCM
  const companyTitle = settings.companyName || CURRENT_USER.company;
  const legalForm = settings.legalForm || "SARL";
  const ninea = settings.ninea || CURRENT_USER.ninea;
  const rccm = settings.rccm || CURRENT_USER.rccm;
  const line1 = `${companyTitle} (${legalForm}) • NINEA : ${ninea} • RCCM : ${rccm}`;
  doc.text(line1, 105, footerY + 3.8, { align: "center" });

  // Line 2: Full Address, Phone, Email, Website
  const address = `${settings.address || CURRENT_USER.address}, ${settings.city || CURRENT_USER.city} - Sénégal`;
  const phone = settings.phone || CURRENT_USER.phone;
  const email = settings.email || CURRENT_USER.email;
  const web = settings.website ? ` • ${settings.website}` : "";
  const line2 = `${address} • Tél : ${phone} • Email : ${email}${web}`;
  doc.text(line2, 105, footerY + 7.2, { align: "center" });

  return doc;
}

/**
 * Generate a standalone printable invoice container and trigger PDF download.
 * Uses 100% native vector jsPDF for crisp selectable text and ultra-lightweight size (< 25 KB).
 */
export async function generateAndDownloadInvoicePDF(
  invoice: Invoice,
  settings: CompanySettings = DEFAULT_SETTINGS
): Promise<void> {
  try {
    const logoData = await getProjectLogoData();
    const doc = buildInvoiceVectorPDF(invoice, settings, logoData);
    doc.save(`Facture_${invoice.invoiceNumber}.pdf`);
  } catch (error) {
    console.error("Erreur lors de la génération du PDF natif", error);
    throw error;
  }
}

/**
 * Generate a PDF Blob for the invoice without triggering browser download.
 * Compatible with Web Share API and WhatsApp sharing.
 */
export async function generateInvoicePDFBlob(
  invoice: Invoice,
  settings: CompanySettings = DEFAULT_SETTINGS
): Promise<Blob> {
  const logoData = await getProjectLogoData();
  const doc = buildInvoiceVectorPDF(invoice, settings, logoData);
  return doc.output("blob");
}

/**
 * Print the exact invoice document using native vector PDF blob or print iframe
 */
export async function printInvoicePDF(
  invoice: Invoice,
  settings: CompanySettings = DEFAULT_SETTINGS
): Promise<void> {
  try {
    const logoData = await getProjectLogoData();
    const doc = buildInvoiceVectorPDF(invoice, settings, logoData);
    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.src = blobUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobUrl);
        }, 3000);
      }, 400);
    };
  } catch (e) {
    console.error("Print fallback error", e);
    window.print();
  }
}

/**
 * Kept for backward compatibility if any legacy element renderer calls it
 */
export async function downloadInvoicePDFFromElement(
  element: HTMLElement,
  invoiceNumber: string
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 1.8,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.86);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight));
    pdf.save(`Facture_${invoiceNumber}.pdf`);
  } catch (error) {
    console.error("Erreur downloadInvoicePDFFromElement", error);
  }
}
