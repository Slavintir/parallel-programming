import * as vector from '../workers/vector';

export type MatrixAction = 'add' | 'mul' | 'sub';
export type Matrix = number[][];

export class MatrixHelper {
    static async mul(m1: Matrix, m2: Matrix): Promise<Matrix> {
        const promises: Promise<number[]>[] = m2.map(async (row: number[], index: number): Promise<number[]> => {
            return vector.multiply(row, this.getPartMatrix('coll', m1, index));
        });

        return Promise.all(promises);
    }

    static add(m1: Matrix, m2: Matrix): Promise<Matrix> {
        const promises: Promise<number[]>[] = m2.map(async (row: number[], index: number): Promise<number[]> => {
            return vector.add(row, this.getPartMatrix('coll', m1, index));
        });

        return Promise.all(promises);
    }

    static sub(m1: Matrix, m2: Matrix): Promise<Matrix> {
        const promises: Promise<number[]>[] = m2.map(async (row: number[], index: number): Promise<number[]> => {
            return vector.sub(row, this.getPartMatrix('coll', m1, index));
        });

        return Promise.all(promises);
    }

    static getPartMatrix(type: 'row' | 'coll', source: Matrix, index: number): number[] {
        switch (type) {
            case 'row':
                return source[index];
            case 'coll':
                return source.map((vector: number[]) => vector[index]);
        }
    }
}
