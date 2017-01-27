[![Dependency Status](https://david-dm.org/plantain-00/rpc-by-ws.svg)](https://david-dm.org/plantain-00/rpc-by-ws)
[![devDependency Status](https://david-dm.org/plantain-00/rpc-by-ws/dev-status.svg)](https://david-dm.org/plantain-00/rpc-by-ws#info=devDependencies)
[![Build Status](https://travis-ci.org/plantain-00/rpc-by-ws.svg?branch=master)](https://travis-ci.org/plantain-00/rpc-by-ws)
[![npm version](https://badge.fury.io/js/rpc-by-ws.svg)](https://badge.fury.io/js/rpc-by-ws)
[![Downloads](https://img.shields.io/npm/dm/rpc-by-ws.svg)](https://www.npmjs.com/package/rpc-by-ws)

# rpc-by-ws
A lightweight RPC library on websocket connection.

#### install

`npm i rpc-by-ws`

#### usage

1. create subject and accept message:

```ts
import { Subject } from "rxjs";

const subject = new Subject<{ id: number, response: any }>();

ws.on("message", (data, flags) => {
    subject.next(JSON.parse(data));
});
```

2. initialize with the subject

```ts
const wsRpc = new WsRpc(subject, message => message.id);
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
