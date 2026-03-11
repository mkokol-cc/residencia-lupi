import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  public generarPdf(
    filtros: any,
    reporteData: any[],
    reporteDataView: any[],
    saldo: number,
    opcionesFiltro: any
  ): void {
    const doc = new jsPDF();
    const currencyFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
    const dateFormatter = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Título
    doc.setFontSize(18);
    doc.text('Reporte de Operaciones', 14, 20);
    doc.setFontSize(10);
    doc.text(`Fecha de emisión: ${dateFormatter.format(new Date())}`, 14, 28);

    let finalY = 35;

    // --- Leyenda de Filtros ---
    doc.setFontSize(9);
    doc.setTextColor(100);
    
    const activeFilters: string[] = this.construirLeyendaFiltros(filtros, opcionesFiltro, dateFormatter);
    const filterText = activeFilters.length > 0 ? `Filtros aplicados: ${activeFilters.join(' | ')}` : 'Filtros aplicados: Ninguno';
    const splitText = doc.splitTextToSize(filterText, 180);
    doc.text(splitText, 14, finalY);
    
    doc.setTextColor(0);
    finalY += (splitText.length * 5) + 10;

    // 1. Tabla de Resumen
    if (reporteData.length > 0) {
      doc.setFontSize(14);
      doc.text('Resumen', 14, finalY);
      finalY += 5;

      autoTable(doc, {
        startY: finalY,
        head: [['Descripción', 'Valor']],
        body: reporteData.map(item => [item.descripcion, currencyFormatter.format(item.valor)]),
        theme: 'striped',
        headStyles: { fillColor: [50, 50, 50] },
        columnStyles: { 1: { halign: 'right' } },
        didParseCell: (data) => {
          const item = reporteData[data.row.index];
          if (data.section === 'body' && item?.esTotal) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [220, 220, 220];
          }
        }
      });
      finalY = (doc as any).lastAutoTable.finalY + 15;
    }

    // 2. Tabla de Detalle de Operaciones
    if (reporteDataView.length > 0) {
      doc.setFontSize(14);
      doc.text('Detalle de Operaciones', 14, finalY);
      finalY += 5;

      const saldoFormatted = (saldo > 0 ? '+' : '') + currencyFormatter.format(saldo);

      autoTable(doc, {
        startY: finalY,
        head: [['Fecha', 'Descripción', 'Importe']],
        body: reporteDataView.map(op => {
          const fecha = dateFormatter.format(new Date(op.fechaHora));
          let desc = `${op.tipoOperacion?.nombre || 'N/A'}`;
          if (op.concepto) desc += `\n${op.concepto.padre ? op.concepto.padre.nombre + ' > ' : ''}${op.concepto.nombre}`;
          if (op.descripcion) desc += `\n${op.descripcion}`;
          const importe = (op.signedMonto > 0 ? '+' : '') + currencyFormatter.format(op.signedMonto);
          return [fecha, desc, importe];
        }),
        foot: [['', 'SALDO:', saldoFormatted]],
        theme: 'grid',
        headStyles: { fillColor: [50, 50, 50] },
        columnStyles: { 0: { cellWidth: 25 }, 2: { halign: 'right', cellWidth: 40 } },
        footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'right' },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 2) {
            const item = reporteDataView[data.row.index];
            if (item.signedMonto > 0) data.cell.styles.textColor = [0, 128, 0];
            else if (item.signedMonto < 0) data.cell.styles.textColor = [255, 0, 0];
          }
          if (data.section === 'foot' && data.column.index === 2) {
             if (saldo > 0) data.cell.styles.textColor = [0, 128, 0];
             else if (saldo < 0) data.cell.styles.textColor = [255, 0, 0];
          }
        }
      });
    }

    doc.save('reporte-operaciones.pdf');
  }

  private construirLeyendaFiltros(filtros: any, opciones: any, dateFormatter: Intl.DateTimeFormat): string[] {
      const activeFilters: string[] = [];
      if (filtros.fechaDesde) activeFilters.push(`Desde: ${dateFormatter.format(new Date(filtros.fechaDesde))}`);
      if (filtros.fechaHasta) activeFilters.push(`Hasta: ${dateFormatter.format(new Date(filtros.fechaHasta))}`);
      if (filtros.tipoOperacionId) activeFilters.push(`Tipo: ${opciones.tiposOperacion.find((t:any) => t.id === filtros.tipoOperacionId)?.nombre}`);
      if (filtros.conceptoId) activeFilters.push(`Concepto: ${opciones.conceptos.find((c:any) => c.id === filtros.conceptoId)?.nombre}`);
      if (filtros.entidadId) activeFilters.push(`Entidad: ${opciones.entidades.find((e:any) => e.id === filtros.entidadId)?.nombre}`);
      if (filtros.metodoPagoId) activeFilters.push(`Método: ${opciones.metodosPago.find((m:any) => m.id === filtros.metodoPagoId)?.nombre}`);
      return activeFilters;
  }
}
