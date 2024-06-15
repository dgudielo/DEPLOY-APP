import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for generating Excel files.
 */
export class ExcelService {
  constructor() {}

  /**
   * Genera un archivo de Excel con los datos proporcionados y el nombre de archivo.
   * @param data - Los datos que se incluirán en el archivo de Excel.
   * @param fileName - El nombre del archivo de Excel.
   */
  public generateExcel(data: any[], fileName: string): void {
    data = data.map(item => ({ ...item, Personas_Atendidas: item.Personas_Atendidas.join(', ') }));
    const workbook = new ExcelJS.Workbook(); // Crea un libro de trabajo
    const worksheet = workbook.addWorksheet('Data'); // Agrega una hoja de trabajo

    // Suponiendo que ⁠ data ⁠ es un array de objetos, usa los nombres de las propiedades para los encabezados
    const headers = Object.keys(data[0]);
    const headerRow = worksheet.addRow(headers);

    // Aplica algún estilo al encabezado si lo deseas
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      };
    });

    // Añade los datos al worksheet
    data.forEach(d => {
      const row: any[] = [];
      headers.forEach(header => row.push(d[header]));
      worksheet.addRow(row);
    });

    // Escribir el Excel en un buffer y luego usar FileSaver para guardar el archivo
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      this.descargarArchivo(blob, ` ${fileName}.xlsx`);
    });
  }

  /**
   * Descarga un archivo con el nombre de archivo proporcionado.
   * @param blob - El archivo que se descargará.
   * @param nombreArchivo - El nombre del archivo que se descargará.
   */
  public descargarArchivo(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Convierte una cadena base64 en un objeto Blob.
   * @param base64 - La cadena base64 que se convertirá en un objeto Blob.
   * @param application - El tipo de aplicación del archivo. "application/vnd.ms-excel", "application/pdf", etc.
   * @returns Un objeto Blob.
   */
  public convertirBase64ToBlob(base64: string, application: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: application });
  }
}