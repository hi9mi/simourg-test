export interface SgTableColumn<T = any> {
  name: string
  label: string
  field?: (row: T, rowIndex: number) => any
  format?: (value: any, row: T, rowIndex: number) => any
  align?: 'left' | 'center' | 'right' | 'middle'
  width?: string | number
}

export interface SgTablePagination {
  page: number
  limit: number
  total: number
}
