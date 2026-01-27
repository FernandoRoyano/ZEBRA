'use client'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
}

function Table<T extends { id: number | string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No hay datos para mostrar'
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-zebra-gray bg-zebra-light/50 rounded-xl">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zebra-border shadow-sm">
      <table className="min-w-full divide-y divide-zebra-border">
        <thead className="bg-zebra-light">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-zebra-border">
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={`${onRowClick ? 'cursor-pointer hover:bg-zebra-primary/5' : ''} ${index % 2 === 1 ? 'bg-zebra-light/30' : ''} transition-colors`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 text-base text-zebra-dark"
                >
                  {column.render
                    ? column.render(item)
                    : String(item[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
