// eslint-disable-next-line import/no-extraneous-dependencies
import { utils, writeFile } from 'xlsx';
import { HHmmDDMMYYYY } from './formatTime';

export default function ExportToXlsx(tableId, reportName = 'Отчет') {
  const table_elt = document.getElementById(tableId);
  const workbook = utils.table_to_book(table_elt);
  const ws = workbook.Sheets.Sheet1;
  utils.sheet_add_aoa(ws, [[`Документ создан в ${HHmmDDMMYYYY(new Date().toISOString())}`]], {
    origin: -1,
    cellDates: true,
  });

  const range = utils.decode_range(ws['!ref']);
  const noCols = range.e.c; // No. of cols

  ws['!cols'] = columnNumbers(noCols);
  ws['!rows'] = [{ hpt: 24 }];

  writeFile(workbook, `${reportName}.xlsx`);
}

function columnNumbers(cols) {
  const array = [];
  for (let i = 0; i <= cols; i += 1) {
    array.push({ wch: 15 });
  }

  return array;
}
