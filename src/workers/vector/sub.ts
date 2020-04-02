import path from 'path';
import { isMainThread, parentPort, Worker, workerData } from 'worker_threads';

import { WorkerData } from '../../interfaces/workers/vector';

if (!isMainThread) {
    const { v1, v2 }: WorkerData = workerData;

    function exec(v1: number[], v2: number[]): number[] {
        return v1.map((value: number, index: number): number => value - v2[index]);
    }

    parentPort.postMessage(exec(v1, v2));
}

export function sub(v1: number[], v2: number[]): Promise<number[]> {
    return new Promise((resolve: (calculatedVector: number[]) => void, reject: (err: Error) => void): void => {
        const worker: Worker = new Worker(path.resolve(__filename), { workerData: <WorkerData>{ v1, v2 } });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (exitCode: number) => {
            if (exitCode !== 0) {
                reject(new Error(`Worker is crashed, code: ${exitCode}`));
            }
        });
    });
}
