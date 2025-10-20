import { Expense } from "../types/types"; // Asegúrate que la ruta a tus tipos sea correcta

interface ReportData {
  totalGastos: number;
  promedioDia: number;
  gastosPorCategoria: Record<string, number>;
  expenses: Expense[];
}

export const generatePdfHtml = (data: ReportData): string => {
  const { totalGastos, promedioDia, gastosPorCategoria, expenses } = data;

  // Genera las filas de la tabla de categorías
  const categoryRows = Object.entries(gastosPorCategoria)
    .map(
      ([category, amount]) => `
      <tr>
        <td>${category}</td>
        <td>$${amount.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  // Genera las filas de la tabla de todos los gastos
  const expenseRows = expenses
    .map(
      (expense) => `
      <tr>
        <td>${expense.description}</td>
        <td>${new Date(expense.date).toLocaleDateString("es-ES")}</td>
        <td>${expense.paidBy}</td>
        <td>$${expense.amount.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  // Plantilla HTML completa con estilos CSS inline
  return `
    <html>
      <head>
        <style>
          body { font-family: Helvetica, sans-serif; color: #333; }
          h1 { text-align: center; color: #4F46E5; }
          .summary-table, .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .summary-table td { padding: 10px; font-size: 1.2em; border-bottom: 1px solid #eee; }
          .summary-table .label { font-weight: bold; }
          .details-table th, .details-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .details-table th { background-color: #f2f2f2; font-weight: bold; }
          .section-title { font-size: 1.5em; color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 5px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <h1>Reporte de Gastos</h1>
        
        <table class="summary-table">
          <tr>
            <td class="label">Total Gastos:</td>
            <td>$${totalGastos.toFixed(2)}</td>
          </tr>
           <tr>
            <td class="label">Promedio por Día:</td>
            <td>$${promedioDia.toFixed(2)}</td>
          </tr>
        </table>

        <h2 class="section-title">Gastos por Categoría</h2>
        <table class="details-table">
          <thead><tr><th>Categoría</th><th>Monto</th></tr></thead>
          <tbody>${categoryRows}</tbody>
        </table>

        <h2 class="section-title">Detalle de Gastos</h2>
        <table class="details-table">
          <thead><tr><th>Descripción</th><th>Fecha</th><th>Pagado por</th><th>Monto</th></tr></thead>
          <tbody>${expenseRows}</tbody>
        </table>
      </body>
    </html>
  `;
};
