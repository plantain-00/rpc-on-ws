/* eslint-disable plantain/promise-not-await */
import test from 'ava'
import WsRpc from '../src'
import { Subject } from 'rxjs'

test('should handle result', async (t) => {
  const subject = new Subject<{ id: number, response?: string, error?: string }>()
  const wsRpc = new WsRpc(subject, message => message.id, message => message.error)
  wsRpc.send(requestId => {
    t.is(requestId, 1)
  }).then(response => {
    t.is(response.response, 'aaa')
  }, error => {
    if (error) {
      throw new Error('should not be error.')
    }
  })

  subject.next({ id: 2, response: 'bbb' })
  subject.next({ id: 1, response: 'aaa' })
  subject.next({ id: 3, response: 'ccc' })
})

test('should handle error', async (t) => {
  const subject = new Subject<{ id: number, response?: string, error?: string }>()
  const wsRpc = new WsRpc(subject, message => message.id, message => message.error)
  wsRpc.send(requestId => {
    t.is(requestId, 1)
  }).then(() => {
    throw new Error('should be error')
  }, error => {
    t.is(error.message, 'aaa')
  })

  subject.next({ id: 2, error: 'bbb' })
  subject.next({ id: 1, error: 'aaa' })
  subject.next({ id: 3, error: 'ccc' })
})

test('should handle timeout', (t) => {
  const subject = new Subject<{ id: number, response?: string, error?: string }>()
  const wsRpc = new WsRpc(subject, message => message.id, message => message.error, 1000)
  wsRpc.send(requestId => {
    t.is(requestId, 1)
  }).then(() => {
    throw new Error('should be error')
  }, error => {
    t.is(error.message, 'timeout')
  })
})
