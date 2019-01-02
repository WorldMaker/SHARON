import { Store } from 'redux'
import { Observable, Observer } from 'rxjs'

export function toObservable<S> (store: Store<S>): Observable<S> {
  return Observable.create((observer: Observer<S>) => {
    let dispose = store.subscribe(() => observer.next(store.getState()))
    observer.next(store.getState())
    return dispose
  })
}
