import { StateObservable } from 'redux-observable'
import { from, Observable } from 'rxjs'
import {
  catchError,
  concatMap,
  ignoreElements,
  last,
  switchMap,
  takeUntil,
  tap,
  windowTime,
} from 'rxjs/operators'
import { Action } from '../actions/index.ts'
import { Store } from '../models/store/index.ts'

export const StoreFile = 'store.json'
const StorageInterval = 5 /* m */ * 60 /* s */ * 1000 /* ms */

export default function storageEpic(
  action: Observable<Action>,
  state: StateObservable<Store>,
) {
  return state.pipe(
    takeUntil(action.pipe(last())),
    windowTime(StorageInterval), // no more than once every ~5 minutes
    switchMap((window) => window.pipe(last())),
    tap(() => console.log('Saving state…')),
    concatMap((state) =>
      from(Deno.writeTextFile(StoreFile, JSON.stringify(state)))
    ),
    catchError((err, caught) => {
      console.error('Error saving state', err)
      return caught // retry
    }),
    ignoreElements(),
  )
}
