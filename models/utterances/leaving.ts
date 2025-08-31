import { nlp } from '../index.ts'

export enum LeavingType {
  Now = 'now',
  Soon = 'soon',
  At = 'at'
}

export interface LeavingNow {
  type: LeavingType.Now
}

export interface LeavingSoon {
  type: LeavingType.Soon
}

export interface LeavingAt {
  type: LeavingType.At
  time: string
}

export type LeavingWhen = LeavingNow | LeavingSoon | LeavingAt

export interface LeavingUtterance {
  utterance: string
  negative: boolean
  personal: boolean
  when?: LeavingWhen
}

export default function examineForLeaving (utterance: string, doc: any = null): LeavingUtterance | null {
  if (!doc) {
    doc = (nlp as any)(utterance)
  }

  if (!doc.has('(go|going|leave|leaving)')) {
    return null
  }

  const verbs = doc.verbs()
  const negative = verbs.isNegative().found
  const personal = doc.has('(i|i\'m)')

  let when: LeavingWhen | undefined = undefined

  if (doc.has('(now|immediately)')) {
    when = { type: LeavingType.Now }
  } else if (doc.has('(soon|after this|after voyage)')) {
    when = { type: LeavingType.Soon }
  }

  return { utterance, negative, personal, when }
}
