/**
 * Tabla de datos simple.
 * columns: [{ key, header, align?, width?, render?(row) }]
 */
export const DataTable = ({ columns, rows, rowKey = (row) => row.id || row._id, caption }) => (
  <div className="table-wrap">
    <table className="table">
      {caption && <caption className="visually-hidden">{caption}</caption>}
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              scope="col"
              style={{ width: col.width, textAlign: col.align || 'left' }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={rowKey(row) ?? index} style={{ '--row': Math.min(index, 10) }}>
            {columns.map((col) => (
              <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                {col.render ? col.render(row) : row[col.key] ?? '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
