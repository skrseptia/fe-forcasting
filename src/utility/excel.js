import ExcelJS from 'exceljs'

export const importExcel = async (filePath) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath); // Membaca file Excel
  
    const worksheet = workbook.getWorksheet(1); // Ambil worksheet pertama
    const data = [];
  
    worksheet.eachRow((row, rowNumber) => {
      // Konversi baris ke array atau objek
      const rowData = row.values.slice(1); // Menghapus indeks kosong
      data.push(rowData);
    });
  
    console.log(data); // Tampilkan data dalam bentuk array
  }

