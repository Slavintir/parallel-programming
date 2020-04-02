import { Matrix, MatrixHelper } from './helpers/matrix';
async function main(): Promise<void> {

    /**
     * All action calculated parallel, MG = MD * (MT + MZ) - ME * MM;
     * action 1 => MT + MZ
     * action 2 => ME * MM
     * action 3 => MD * result action 1
     * action 4 => result action 2 - result action 3
     */

    const S: number = 15;
    const W: number = S;
    const H: number = S;

    const MD: Matrix = makeMatrix(2, W, H);

    const MT: Matrix = makeMatrix(2, W, H);
    const MZ: Matrix = makeMatrix(2, W, H);

    const ME: Matrix = makeMatrix(2, W, H);
    const MM: Matrix = makeMatrix(2, W, H);

    const promiseAction2: Promise<Matrix> = MatrixHelper.mul(ME, MM);
    const promiseAction3: Promise<Matrix> = MatrixHelper.add(MT, MZ)
        .then((resultAction1: Matrix) => MatrixHelper.mul(MD, resultAction1));

    const [resultAction2, resultAction3]: Matrix[] = await Promise.all([promiseAction2, promiseAction3]);

    const MG: Matrix = await MatrixHelper.sub(resultAction2, resultAction3);

    console.log(MG);
}

function makeMatrix(filler: number, w: number, h: number = 1): Matrix {
    const matrix: Matrix = [];

    for (let i: number = 0; i < h; i += 1) {
        matrix.push(makeVector(filler, w));
    }

    return matrix;
}

function makeVector(filler: number, size: number): number[] {
    const vector: number[] = [];

    for (let i: number = 0; i < size; i += 1) {
        vector.push(filler);
    }

    return vector;
}

main();
