[![Dependency Status](https://david-dm.org/plantain-00/rpc-on-ws.svg)](https://david-dm.org/plantain-00/rpc-on-ws)
[![devDependency Status](https://david-dm.org/plantain-00/rpc-on-ws/dev-status.svg)](https://david-dm.org/plantain-00/rpc-on-ws#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/plantain-00/rpc-on-ws.svg?branch=master)](https://travis-ci.org/plantain-00/rpc-on-ws)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/plantain-00/rpc-on-ws?branch=master&svg=true)](https://ci.appveyor.com/project/plantain-00/rpc-on-ws/branch/master)
[![npm version](https://badge.fury.io/js/rpc-on-ws.svg)](https://badge.fury.io/js/rpc-on-ws)
[![Downloads](https://img.shields.io/npm/dm/rpc-on-ws.svg)](https://www.npmjs.com/package/rpc-on-ws)

# rpc-on-ws
A lightweight RPC library on websocket connection.

#### install

`npm i rpc-on-ws`

#### usage

server-side:

```ts
import * as WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8000 });

wss.on("connection", ws => {
    ws.on("message", data => {
        const request: { id: number, response?: string, error?: string } = JSON.parse(data.toString());
        setTimeout(() => { // mock heavy work
            ws.send(JSON.stringify({
                id: request.id,
                response: "Hello world",
            }));
        }, 1000);
    });
});
```

client-side:

```ts
import { Subject } from "rxjs/Subject";

// nodejs:
import WsRpc from "rpc-on-ws/nodejs";
import * as WebSocket from "ws";

// browser(module):
// import WsRpc from "rpc-on-ws/browser";

// browser(script tag):
// <script src="rpc-on-ws/rpc-on-ws.min.js"></script>

const subject = new Subject<{ id: number, response?: string, error?: string }>();
const wsRpc = new WsRpc(subject, message => message.id, message => message.error);
const ws = new WebSocket("ws://localhost:8000");

ws.onopen = () => {
    ws.onmessage = data => {
        subject.next(JSON.parse(data.data.toString()));
    };

    wsRpc.send(requestId => {
        ws.send(JSON.stringify({ id: requestId, command: "abc" }));
    }).then(response => {
        console.log(`accept: ${response.id} ${response.response}`);
    }, error => {
        console.log(error);
    });
};
```

optional, just generate request id

```ts
const requestId = wsRpc.generateRequestId();
```

#### change logs

```ts
// v4
import WsRpc from "rpc-on-ws/nodejs";
import WsRpc from "rpc-on-ws/browser";

// v3
import { WsRpc } from "rpc-on-ws";
```
