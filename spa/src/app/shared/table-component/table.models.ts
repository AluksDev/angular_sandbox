export interface TableColumnConfig {
  key:  string
  label: string
  sortable?: boolean
}

export interface TableActionConfig {
  key: string
  label: string
  icon?: string
  color?: 'success' | 'warn' | 'danger'
}