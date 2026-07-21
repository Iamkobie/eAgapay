export type Page = 'login' | 'categories' | 'form' | 'results' | 'detail' | 'dashboard'
export type EligibilityStatus = 'eligible' | 'possibly' | 'missing' | 'not-eligible'

export interface Program {
  id: number
  name: string
  agency: string
  status: EligibilityStatus
  category: string
  description: string
  benefits: string
  requirements: string[]
  documents: string[]
  process: string[]
  criteriasMet: string[]
  criteriasMissing: string[]
  url: string
}
