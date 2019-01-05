import { promises as fs } from 'fs'
import { StateObservable } from 'redux-observable'
import { Observable, from } from 'rxjs'
import { concatMap, takeUntil, last, windowTime, ignoreElements, switchMap, catchError, tap } from 'rxjs/operators'
import { Action } from '../actions'
import { Store } from '../models/store'

export const StoreFile = 'store.json'
const StorageInterval = 5 /* m */ * 60 /* s */ * 1000 /* ms */

export default function storageEpic (action: Observable<Action>, state: StateObservable<Store>) {
  return state.pipe(
    takeUntil(action.pipe(last())),
    windowTime(StorageInterval), // no more than once every ~5 minutes
    switchMap(window => window.pipe(last())),
    tap(() => console.log('Saving state…')),
    concatMap(state => from(fs.writeFile(StoreFile, JSON.stringify(state), { encoding: 'utf-8' }))),
    catchError((err, caught) => {
      console.error('Error saving state', err)
      return caught // retry
    }),
    ignoreElements()
  )
}
