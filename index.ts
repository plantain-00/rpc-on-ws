import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/filter";

export class WsRpc<T> {
    private lastRequestId = 0;
    constructor(private subject: Subject<T>, private getRequestId: (message: T) => number | undefined, private getError: (message: T) => string | undefined, private timeout = 10000) { }
    send(send: (requestId: number) => void) {
        return new Promise<T>((resolve, reject) => {
            const requestId = this.generateRequestId();
            let timeoutId: NodeJS.Timer;
            const subscription = this.subject
                .filter(r => this.getRequestId(r) === requestId)
                .subscribe(r => {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    subscription.unsubscribe();
                    const error = this.getError(r);
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(r);
                    }
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
