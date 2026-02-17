import { redirect } from 'next/navigation'

export default function FormsUsageGuideRedirect() {
  redirect('/verbs/grammar-reference?tab=usage')
}
