/**
 * /study/kanji is just a redirect — the layout above renders the persistent
 * nav, and the kanji listing is the natural default landing.
 */

import { redirect } from 'next/navigation'

export default function KanjiHubRedirect() {
  redirect('/study/kanji/list')
}
