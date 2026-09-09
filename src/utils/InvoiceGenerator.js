import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

export const generateInvoice = async (order) => {
  try {
    if (!order) {
      alert("Order information is missing.");
      return;
    }

    const doc = new jsPDF();
    
    // Header Background (Maroon #800000)
    doc.setFillColor(128, 0, 0);
    doc.rect(0, 0, 210, 42, 'F');
    
    // Brand Name & Tagline
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INDRANI PAITHANI", 14, 22);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Authentic Yeola Handloom Heritage Sarees", 14, 30);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TAX INVOICE", 155, 24);

    // Reset Text Color
    doc.setTextColor(30, 30, 30);
    
    // Order Info Box
    const orderDateStr = order.orderDate
      ? new Date(order.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-IN');

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Order Information", 14, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${order.orderId || 'ORD-000000'}`, 14, 60);
    doc.text(`Date: ${orderDateStr}`, 14, 67);
    doc.text(`Payment Method: ${order.paymentMethod || 'Online Paid / COD'}`, 14, 74);
    doc.text(`Status: ${order.status || 'Order Confirmed'}`, 14, 81);
    
    // Buyer Info Box
    doc.setFont("helvetica", "bold");
    doc.text("Billed To & Shipping Address:", 115, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.buyerName || 'Valued Client'}`, 115, 60);
    if (order.buyerEmail) {
      doc.text(`${order.buyerEmail}`, 115, 67);
    }
    if (order.phone) {
      doc.text(`Ph: ${order.phone}`, 115, 74);
    }
    
    // Multiline address
    const addressLines = doc.splitTextToSize(order.shippingAddress || 'Address on file', 80);
    doc.text(addressLines, 115, 81);

    // Table Setup
    const tableColumn = ["Item Description", "Unit Price", "Qty", "Total (INR)"];
    const tableRows = [];

    const items = Array.isArray(order.items) ? order.items : [];
    items.forEach(item => {
      const price = item.price || 0;
      const qty = item.quantity || 1;
      tableRows.push([
        item.name || 'Handloom Paithani Saree',
        `Rs. ${price.toLocaleString('en-IN')}`,
        qty,
        `Rs. ${(price * qty).toLocaleString('en-IN')}`
      ]);
    });

    // Generate table using autoTable function
    autoTable(doc, {
      startY: 105,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0], fontStyle: 'bold' }, // Metallic Gold Header
      alternateRowStyles: { fillColor: [250, 246, 240] }, // Warm Cream Alternate Rows
      styles: { fontSize: 9, cellPadding: 4 }
    });

    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 15 : 170;

    const subtotal = order.subtotal || items.reduce((sum, i) => sum + ((i.price || 0) * (i.quantity || 1)), 0);
    const gst = order.gst || Math.round(subtotal * 0.05);
    const grandTotal = order.grandTotal || (subtotal + gst);

    // Summary Box
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal:`, 130, finalY);
    doc.text(`Rs. ${subtotal.toLocaleString('en-IN')}`, 195, finalY, { align: 'right' });

    doc.text(`GST (5%):`, 130, finalY + 7);
    doc.text(`Rs. ${gst.toLocaleString('en-IN')}`, 195, finalY + 7, { align: 'right' });

    doc.text(`Insured Shipping:`, 130, finalY + 14);
    doc.text(`FREE`, 195, finalY + 14, { align: 'right' });

    // Draw separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(130, finalY + 18, 195, finalY + 18);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(128, 0, 0);
    doc.text(`Grand Total:`, 130, finalY + 26);
    doc.text(`Rs. ${grandTotal.toLocaleString('en-IN')}`, 195, finalY + 26, { align: 'right' });

    // QRCode verification
    try {
      const qrDataUrl = await QRCode.toDataURL(
        `Indrani Paithani Invoice\nOrder: ${order.orderId || 'ORD'}\nAmount: Rs. ${grandTotal}\nDate: ${orderDateStr}`
      );
      doc.addImage(qrDataUrl, 'PNG', 14, finalY - 5, 32, 32);
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Scan QR to verify authenticity", 14, finalY + 31);
    } catch (qrErr) {
      console.warn("QR Code generation skipped:", qrErr);
    }

    // Footer Notes
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you for shopping with Indrani Paithani. 100% Silk Mark Certified Heritage Saree Boutique.", 14, 280);
    doc.text("This is a computer-generated tax invoice and does not require a physical signature.", 14, 285);

    // Save PDF
    doc.save(`Invoice_${order.orderId || 'Order'}.pdf`);
  } catch (error) {
    console.error("Failed to generate PDF invoice:", error);
    alert(`Could not generate PDF invoice: ${error.message || 'Unknown error'}`);
  }
};
