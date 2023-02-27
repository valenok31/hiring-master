import Executor, {IExecutor} from './Executor';
import ITask, {ActionType} from './Task';
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
    const secondQueue: any = [];
    const arrTaskRunning: any = [];
    let taskNext = JSON.parse(JSON.stringify(queue));

    let n = 0;
    let threads = true;
    let taskN_1: ITask;

    function setArr() {
        for (let i of taskNext.q) {
            arr.push(i.targetId);
        }
        return arr.length;
    }

    setArr();

    function sleep(milliseconds: any) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    function exec(t: ITask) {
        executor.executeTask(t).then((r) => {
            spliceArr(arrTaskRunning, t.targetId);
            return t.targetId;
        })
    }

    function spliceArr(arrS: any, id: any) {
        const index = arrS.indexOf(id);
        if (index !== -1) {
            arrS.splice(index, 1);
        }
    }

    await generalFor();

    async function generalFor() {

        for await (let task of queue) {


            if (secondQueue.length > 0) {
                for (let d = 0; d < secondQueue.length; d++) {
                    if (!arrTaskRunning.includes(secondQueue[d].targetId)) {
                        await executor.executeTask(secondQueue[d]);
                        const index = secondQueue.findIndex((ts: any) => {
                            return (ts.targetId == secondQueue[d].targetId)
                        });
                        if (index !== -1) {
                            secondQueue.splice(index, 1);
                           // d--;
                        }
                        //secondQueue.shift();
                    }
                }
            }
            if (arrTaskRunning.includes(task.targetId)) {
                secondQueue.push(task);
                /*                await executor.executeTask({
                                    targetId: -1,
                                    action: 'init'
                                })*/
            } else {
                /*                if (maxThreads > 3) {*/
                if (arrTaskRunning.length < maxThreads - 1) {
                    arrTaskRunning.push(task.targetId);
                    exec(task);
                } else {
                    await executor.executeTask(task);
                }
                /*                } else {
                                    await executor.executeTask(task);
                                }*/
            }
        }
        await executor.executeTask({
            targetId: -1,
            action: 'init'
        });
        await executor.executeTask({
            targetId: -1,
            action: 'init'
        })
        await executor.executeTask({
            targetId: -1,
            action: 'init'
        });
        await executor.executeTask({
            targetId: -1,
            action: 'init'
        })







        if (secondQueue.length > 0) {
            for (let d = 0; d < secondQueue.length; d++) {
                if (!arrTaskRunning.includes(secondQueue[d].targetId)) {
                    await executor.executeTask(secondQueue[d]);
                    const index = secondQueue.findIndex((ts: any) => {
                        return (ts.targetId == secondQueue[d].targetId)
                    });
                    if (index !== -1) {
                        secondQueue.splice(index, 1);
                        d--;
                    }
                    //secondQueue.shift();
                }
            }
        }

    }
}