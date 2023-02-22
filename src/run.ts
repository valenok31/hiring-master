import Executor, {IExecutor} from './Executor';
import ITask from './Task';
import {log} from "util";

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
    maxThreads = Math.max(0, maxThreads);
    if (maxThreads === 0) {
        maxThreads = 1000;
    }
    /**
     * Код надо писать сюда
     * Тут что-то вызываем в правильном порядке executor.executeTask для тасков из очереди queue
     */

    const arr: any = [];
    const arrTask: any = [];
    const arrTaskRunning: any = [];
    let taskNext = JSON.parse(JSON.stringify(queue));
    let bool = true;
    let n = 0;
    let threads = 0;
    let set = new Set();

    for (let i of taskNext.q) {
        arr.push(i.targetId);
    }
    for (let j = 0; j < 4; j++) {
        set.add(arr[j]);
    }

    function prover(setS: any, arrS: any) {
        if (setS.size === arrS.length) {
            return true;
        } else {
            return false;
        }
    }

    const prov = prover(set, arr.slice(0, 4));
    function exec(t: ITask) {
        executor.executeTask(t).then((r) => {
            const index = arrTaskRunning.indexOf(t.targetId);
            if (index !== -1) {
                arrTaskRunning.splice(index, 1);
            }
            return t.targetId;
        })
    }

    for await (let task of queue) {


        if (bool && prov) {
            arrTaskRunning.push(task.targetId);
            exec(task);

            // bool = false;
            if (n === 2) {
                bool = false;
            }
        } else {
            await executor.executeTask(task);
        }
        n++;
        console.log(arrTaskRunning);
    }
    //console.log(arr);
}