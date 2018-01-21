import { Subject } from 'rxjs/Subject'
import * as WebSocket from 'ws'
import WsRpc from '../dist/nodejs'

const subject = new Subject<{ id: number, response?: string, error?: string }>()
const wsRpc = new WsRpc(subject, message => message.id, message => message.error)

const ws = new WebSocket('ws://localhost:8000')

ws.onopen = () => {
  ws.onmessage = data => {
    subject.next(JSON.parse(data.data.toString()))
  }

  for (let i = 0; i < 3; i++) {
    wsRpc.send(requestId => {
            ws.send(JSON.stringify({ id: requestId, command: `command ${i}` }))
        }).then(response => {
          console.log(`accept: ${response.id} ${response.response}`)
        }, error => {
          console.log(error)
        })
  }
}

process.on('SIGINT', () => {
  process.exit()
})

process.on('SIGTERM', () => {
  process.exit()
})

setTimeout(() => {
  process.exit()
}, 2000)
