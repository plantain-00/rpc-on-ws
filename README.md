# rpc-on-ws

[![Dependency Status](https://david-dm.org/plantain-00/rpc-on-ws.svg)](https://david-dm.org/plantain-00/rpc-on-ws)
[![devDependency Status](https://david-dm.org/plantain-00/rpc-on-ws/dev-status.svg)](https://david-dm.org/plantain-00/rpc-on-ws#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/plantain-00/rpc-on-ws.svg?branch=master)](https://travis-ci.org/plantain-00/rpc-on-ws)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/plantain-00/rpc-on-ws?branch=master&svg=true)](https://ci.appveyor.com/project/plantain-00/rpc-on-ws/branch/master)
[![npm version](https://badge.fury.io/js/rpc-on-ws.svg)](https://badge.fury.io/js/rpc-on-ws)
[![Downloads](https://img.shields.io/npm/dm/rpc-on-ws.svg)](https://www.npmjs.com/package/rpc-on-ws)
[![gzip size](https://img.badgesize.io/https://unpkg.com/rpc-on-ws?compression=gzip)](https://unpkg.com/rpc-on-ws)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fplantain-00%2Frpc-on-ws%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/rpc-on-ws)

A lightweight RPC library on websocket connection.

## install

`npm i rpc-on-ws`

## usage

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
import { Subject } from "rxjs";

// nodejs:
import WsRpc from "rpc-on-ws";
import * as WebSocket from "ws";

// browser(module):
// import WsRpc from "rpc-on-ws";

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

## change logs

```txt
// v5 rxjs@5 -> rxjs@6
```

```ts
// v4
import WsRpc from "rpc-on-ws/nodejs";
import WsRpc from "rpc-on-ws/browser";

// v3
import { WsRpc } from "rpc-on-ws";
```
