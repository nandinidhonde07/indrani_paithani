import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';

export const generateInvoice = async (order) => {
  const doc = new jsPDF();
  
  // Header Background
  doc.setFillColor(128, 0, 0); // Maroon
  doc.rect(0, 0, 210, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("INDRANI PAITHANI", 14, 25);
  doc.setFontSize(10);
  doc.text("TAX INVOICE", 170, 25);

  // Reset Text Color
  doc.setTextColor(0, 0, 0);
  
  // Order Info
  doc.setFontSize(12);
  doc.text(`Order ID: ${order.orderId}`, 14, 55);
  doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 14, 62);
  doc.text(`Payment: ${order.paymentMethod}`, 14, 69);
  
  // Buyer Info
  doc.setFontSize(10);
  doc.text("Billed To:", 130, 55);
  doc.text(order.buyerName, 130, 62);
  doc.text(order.shippingAddress, 130, 69, { maxWidth: 60 });
  doc.text(`Ph: ${order.phone}`, 130, 85);

  // Table
  const tableColumn = ["Item", "Unit Price", "Qty", "Total"];
  const tableRows = [];

  order.items.forEach(item => {
    tableRows.push([
      item.name,
      `Rs. ${item.price.toLocaleString('en-IN')}`,
      item.quantity,
      `Rs. ${(item.price * item.quantity).toLocaleString('en-IN')}`
    ]);
  });

  doc.autoTable({
    startY: 100,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [212, 175, 55], textColor: [0,0,0] }, // Gold header
    alternateRowStyles: { fillColor: [250, 245, 235] }, // Cream alternate rows
  });

  const finalY = doc.lastAutoTable.finalY + 15;
  
  // Summary
  doc.setFontSize(10);
  doc.text(`Subtotal: Rs. ${order.subtotal.toLocaleString('en-IN')}`, 140, finalY);
  doc.text(`GST (5%): Rs. ${order.gst.toLocaleString('en-IN')}`, 140, finalY + 7);
  doc.text(`Shipping: FREE`, 140, finalY + 14);
  
  doc.setFontSize(14);
  doc.setTextColor(128, 0, 0);
  doc.text(`Grand Total: Rs. ${order.grandTotal.toLocaleString('en-IN')}`, 140, finalY + 25);
  
  // Footer & QR
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text("Thank you for shopping with Indrani Paithani. This is a computer generated invoice.", 14, 280);

  try {
    const qrDataUrl = await QRCode.toDataURL(order.orderId);
    doc.addImage(qrDataUrl, 'PNG', 14, finalY, 30, 30);
    doc.text("Scan to verify", 18, finalY + 34);
  } catch (err) {
    console.error("QR Error", err);
  }

  doc.save(`Invoice_${order.orderId}.pdf`);
};
