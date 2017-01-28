[![Dependency Status](https://david-dm.org/plantain-00/rpc-on-ws.svg)](https://david-dm.org/plantain-00/rpc-on-ws)
[![devDependency Status](https://david-dm.org/plantain-00/rpc-on-ws/dev-status.svg)](https://david-dm.org/plantain-00/rpc-on-ws#info=devDependencies)
[![Build Status](https://travis-ci.org/plantain-00/rpc-on-ws.svg?branch=master)](https://travis-ci.org/plantain-00/rpc-on-ws)
[![npm version](https://badge.fury.io/js/rpc-on-ws.svg)](https://badge.fury.io/js/rpc-on-ws)
[![Downloads](https://img.shields.io/npm/dm/rpc-on-ws.svg)](https://www.npmjs.com/package/rpc-on-ws)

# rpc-on-ws
A lightweight RPC library on websocket connection.

#### install

`npm i rpc-on-ws`

#### usage

1. create subject and accept message:

```ts
import { Subject } from "rxjs/Subject";

const subject = new Subject<{ id: number, response?: string, error?: string }>();

ws.on("message", (data, flags) => {
    subject.next(JSON.parse(data));
});
```

2. initialize with the subject

```ts
import { wsRpc } from "rpc-on-ws";
const wsRpc = new WsRpc(subject, message => message.id, message => message.error, message => message.response);
```

3. call RPC

```ts
wsRpc.send(requestId => {
    ws.send(JSON.stringify({ id: requestId, command: "abc" }));
}).then(response => {
    console.log(`accept: ${response.id} ${response.response}`);
}, error => {
    console.log(error);
});
```

4. optional, just generate request id

```ts
const requestId = wsRpc.generateRequestId();
```
