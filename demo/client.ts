import { Subject } from "rxjs/Subject";
import * as WebSocket from "ws";
import WsRpc from "../dist/nodejs";

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
        // tslint:disable-next-line:no-console
        console.log(`accept: ${response.id} ${response.response}`);
    }, error => {
        // tslint:disable-next-line:no-console
        console.log(error);
    });
};

process.on("SIGINT", () => {
    process.exit();
});

process.on("SIGTERM", () => {
    process.exit();
});

setTimeout(() => {
    process.exit();
}, 2000);
