import { Subject } from "rxjs";

export class WsRpc<T> {
    private lastRequestId = 0;
    constructor(private subject: Subject<T>, private getRequestId: (message: T) => number, private timeout = 10000) { }
    send(send: (requestId: number) => void) {
        return new Promise<T>((resolve, reject) => {
            const requestId = this.generateRequestId();
            let timeoutId: number;
            const subscription = this.subject
                .filter(r => this.getRequestId(r) === requestId)
                .subscribe(r => {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    subscription.unsubscribe();
                    resolve(r);
                });
            timeoutId = setTimeout(() => {
                subscription.unsubscribe();
                reject(new Error("timeout"));
            }, this.timeout);
            send(requestId);
        });
    }
    generateRequestId() {
        this.lastRequestId = this.lastRequestId < 4000000000000 ? this.lastRequestId + 1 : 0;
        return this.lastRequestId;
    }
}
