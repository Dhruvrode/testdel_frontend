export type LabelUsage = {
  page: string
  component: string
}

export type Label = {
  key: string
  value: string
  usages: LabelUsage[]
}
