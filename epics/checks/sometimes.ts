import { interval, Observable } from 'rxjs'
import { last, map, takeUntil } from 'rxjs/operators'
import { Action, checkAll } from '../../actions/index.ts'

export default function checkSometimesEpic(action: Observable<Action>) {
  return interval(15 /* m */ * 60 /* s */ * 1000 /* ms */).pipe(
    takeUntil(action.pipe(last())),
    map(() => checkAll()),
  )
}
