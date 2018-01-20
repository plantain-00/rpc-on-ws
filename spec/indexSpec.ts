import WsRpc from '../dist/nodejs'
import { Subject } from 'rxjs/Subject'

it('should handle result', done => {
  const subject = new Subject<{ id: number, response?: string, error?: string }>()
  const wsRpc = new WsRpc(subject, message => message.id, message => message.error)
  wsRpc.send(requestId => {
    expect(requestId).toEqual(1)
  }).then(response => {
    expect(response.response).toEqual('aaa')
    done()
  }, error => {
    if (error) {
      throw new Error('should not be error.')
    }
  })

  subject.next({ id: 2, response: 'bbb' })
  subject.next({ id: 1, response: 'aaa' })
  subject.next({ id: 3, response: 'ccc' })
})

it('should handle error', done => {
  const subject = new Subject<{ id: number, response?: string, error?: string }>()
  const wsRpc = new WsRpc(subject, message => message.id, message => message.error)
  wsRpc.send(requestId => {
    expect(requestId).toEqual(1)
  }).then(response => {
    throw new Error('should be error')
  }, error => {
    expect(error).toEqual(new Error('aaa'))
    done()
  })

  subject.next({ id: 2, error: 'bbb' })
  subject.next({ id: 1, error: 'aaa' })
  subject.next({ id: 3, error: 'ccc' })
})

it('should handle timeout', done => {
  const subject = new Subject<{ id: number, response?: string, error?: string }>()
  const wsRpc = new WsRpc(subject, message => message.id, message => message.error, 1000)
  wsRpc.send(requestId => {
    expect(requestId).toEqual(1)
  }).then(response => {
    throw new Error('should be error')
  }, error => {
    expect(error).toEqual(new Error('timeout'))
    done()
  })
})
