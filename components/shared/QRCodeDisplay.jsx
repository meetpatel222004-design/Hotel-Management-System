"use client";

import { useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Printer } from "lucide-react";

export function QRCodeDisplay({ value, size = 160, tableNumber }) {
  const qrRef = useRef(null);

  const handleDownload = useCallback(() => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const padding = 32;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2 + 40;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding);
      ctx.fillStyle = "#000000";
      ctx.font = "bold 16px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Table ${tableNumber}`, canvas.width / 2, canvas.height - 12);

      const link = document.createElement("a");
      link.download = `table-${tableNumber}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }, [tableNumber]);

  const handlePrint = useCallback(() => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html><head><title>Table ${tableNumber} QR Code</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,sans-serif;margin:0}
      h1{font-size:24px;margin-bottom:8px}p{color:#666;margin-bottom:24px}</style></head>
      <body><h1>Table ${tableNumber}</h1><p>Scan to start ordering</p>${svgData}
      <script>window.onload=function(){window.print();window.close();}</script></body></html>
    `);
    printWindow.document.close();
  }, [tableNumber]);

  return (
    <div className="flex flex-col items-center">
      <div ref={qrRef} className="bg-white rounded-2xl p-4 inline-block">
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center break-all max-w-[200px]">
        {value}
      </p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs text-primary hover:underline rounded-lg bg-primary/10 px-3 py-2 font-semibold transition hover:bg-primary/20"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs text-primary hover:underline rounded-lg bg-primary/10 px-3 py-2 font-semibold transition hover:bg-primary/20"
        >
          <Printer className="h-3.5 w-3.5" />
          Print
        </button>
      </div>
    </div>
  );
}
