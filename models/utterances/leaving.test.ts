import { expect } from '@std/expect'
import examineLeaving from './leaving.ts'

Deno.test('leaving corpus', () => {
  const test1 = examineLeaving('leaving')
  expect(test1).toBeTruthy()
  expect(test1 && test1.personal).toBeFalsy()
  expect(test1 && test1.negative).toBeFalsy()
  const test2 = examineLeaving('I am leaving')
  expect(test2 && test2.personal).toBeTruthy()
  expect(test2 && test2.negative).toBeFalsy()
  const test3 = examineLeaving('I\'m not leaving')
  expect(test3 && test3.personal).toBeTruthy()
  expect(test3 && test3.negative).toBeTruthy()
})
