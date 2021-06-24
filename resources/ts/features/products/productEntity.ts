export interface Tag {
  id: number
  label: string
}

export interface Link {
  id: number
  title: string
  url: string
}

export interface ProductSummary {
  id: number
  name: string
  price: number | null
  tags: Tag[]
  links: Link[]
  note: string | null
}

export interface ProductDetails extends ProductSummary {}
