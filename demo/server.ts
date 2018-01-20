import * as WebSocket from 'ws'

const wss = new WebSocket.Server({ port: 8000 })

wss.on('connection', ws => {
  ws.on('message', data => {
    const request: { id: number, response?: string, error?: string } = JSON.parse(data.toString())
    console.log(request)
    setTimeout(() => { // mock heavy work
      ws.send(JSON.stringify({
        id: request.id,
        response: 'Hello world'
      }))
    }, 1000)
  })
})

process.on('SIGINT', () => {
  process.exit()
})

process.on('SIGTERM', () => {
  process.exit()
})
