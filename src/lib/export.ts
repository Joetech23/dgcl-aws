'use client'

/**
 * CSV and PDF exports for the admin panel. Both run in the browser: nothing
 * is uploaded anywhere, the file is built and saved on the admin's device.
 */

export type Column<T> = { label: string; value: (row: T) => string | number | null | undefined }

function stamp() {
  return new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')
}

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function exportCSV<T>(name: string, columns: Column<T>[], rows: T[]) {
  const cell = (v: unknown) => {
    let s = v === null || v === undefined ? '' : String(v)
    // Neutralise spreadsheet formulas typed into form fields.
    if (/^[=+\-@]/.test(s)) s = `'${s}`
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [columns.map((c) => cell(c.label)).join(','), ...rows.map((r) => columns.map((c) => cell(c.value(r))).join(','))]
  // The BOM makes Excel read names with accents correctly.
  save(new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }), `dgcl-${name}-${stamp()}.csv`)
}

export async function exportPDF<T>(name: string, title: string, columns: Column<T>[], rows: T[], subtitle?: string) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  const doc = new jsPDF({ orientation: columns.length > 5 ? 'landscape' : 'portrait', unit: 'pt', format: 'a4' })
  const w = doc.internal.pageSize.getWidth()

  // DGCL header band.
  doc.setFillColor(0, 0, 102)
  doc.rect(0, 0, w, 64, 'F')
  doc.setFillColor(255, 192, 0)
  doc.rect(0, 64, w, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('DGCL Digital Cloud Academy', 32, 30)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`${title} · ${rows.length} ${rows.length === 1 ? 'row' : 'rows'}`, 32, 48)
  doc.text(new Date().toLocaleString('en-GB'), w - 32, 48, { align: 'right' })
  if (subtitle) {
    doc.setTextColor(90, 90, 110)
    doc.setFontSize(9)
    doc.text(subtitle, 32, 86)
  }

  autoTable(doc, {
    startY: subtitle ? 96 : 84,
    head: [columns.map((c) => c.label)],
    body: rows.map((r) => columns.map((c) => {
      const v = c.value(r)
      return v === null || v === undefined ? '' : String(v)
    })),
    styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 5, textColor: [20, 24, 40], lineColor: [222, 228, 240], lineWidth: 0.5 },
    headStyles: { fillColor: [0, 0, 153], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [244, 246, 251] },
    margin: { left: 32, right: 32 },
    didDrawPage: () => {
      const h = doc.internal.pageSize.getHeight()
      doc.setFontSize(8)
      doc.setTextColor(140, 150, 170)
      doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, w - 32, h - 18, { align: 'right' })
      doc.text('Confidential: learner data. Handle under UK GDPR.', 32, h - 18)
    },
  })
  doc.save(`dgcl-${name}-${stamp()}.pdf`)
}
