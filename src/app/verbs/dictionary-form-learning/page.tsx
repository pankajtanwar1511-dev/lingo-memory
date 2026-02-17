import { redirect } from 'next/navigation'

export default function DictionaryFormLearningRedirect() {
  redirect('/verbs/form-tutorials?tab=dictionary')
}
