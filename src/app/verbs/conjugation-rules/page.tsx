import { redirect } from 'next/navigation'

export default function ConjugationRulesRedirect() {
  redirect('/verbs/grammar-reference?tab=rules')
}
