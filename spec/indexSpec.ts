import { WsRpc } from "../index";
import { Subject } from "rxjs";

describe("should work", () => {
    const subject = new Subject<{ id: number, response: any }>();

    const wsRpc = new WsRpc(subject, message => message.id);
    wsRpc.send(requestId => {
        console.log(`sent: ${requestId}`);
        subject.next({ id: 1, response: "aaa" });
    }).then(response => {
        console.log(`accept: ${response.id} ${response.response}`);
    }, error => {
        console.log(error);
    });

    it("should work", () => {
        expect(wsRpc.generateRequestId()).toEqual(2);
        expect(wsRpc.generateRequestId()).toEqual(3);
    });
});
