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

    let n = 0;
    let threads = 0;


    function setArr() {
        for (let i of taskNext.q) {
            arr.push(i.targetId);
        }
        return arr.length;
    }

    setArr();

    function exec(t: ITask) {
        executor.executeTask(t)
            .then((r) => {
                spliceArr(arrTaskRunning, t.targetId);
                return t.targetId;
            })
            .catch(async () => {
                await executor.executeTask(t);
                spliceArr(arrTaskRunning, t.targetId);
            });
    }

    if (maxThreads < 500) {
        await generalFor();
    } else {
        await withoutThreadsLimit();
    }


    function spliceArr(arrS: any, id: any) {
        const index = arrS.indexOf(id);
        if (index !== -1) {
            arrS.splice(index, 1);
        }
    }


    async function generalFor() {
        for await (let task of queue) {
            if (arrTaskRunning.includes(task.targetId)) {
                n++; // ??????
                continue;
            } else {
                arrTaskRunning.push(task.targetId);
            }
            if (arr[n + 1] === undefined || arr[n] === undefined) {
                await executor.executeTask(task);
                spliceArr(arrTaskRunning, task.targetId);
                n++;
                continue;
            }
            if (arrTaskRunning.length <= maxThreads - 1) {
                if (!arrTaskRunning.includes(arr[n + 1])) {
                    exec(task);
                } else {
                    await executor.executeTask(task);
                    spliceArr(arrTaskRunning, task.targetId);
                }
            } else {
                await executor.executeTask(task);
                spliceArr(arrTaskRunning, task.targetId);
            }
            n++;
        }
    }

    async function withoutThreadsLimit() {
        let e=0;
        const arrTaskSave: ITask[] = [];
        const arrTaskId: {}[] = [];

        function execX(t: ITask) {
            executor.executeTask(t)
                .then((r) => {
                    spliceArr(arrTaskId, t.targetId);
                    return t.targetId;
                })
                .catch(async () => {
                    await executor.executeTask(t);
                    spliceArr(arrTaskId, t.targetId);
                });
        }

        forRek(queue);

        async function forRek(arrTaskSave: any) {
            for await (let task of arrTaskSave) {
                if (!arrTaskId.includes(task.targetId)) {
                    arrTaskId.push(task.targetId);
                    execX(task);
                } else {
                    arrTaskSave.push(task);
                }
            }
            e++;
            if (arrTaskSave.length > 0) {
                if(e>100){return}
                forRek(arrTaskSave)
            } else {
                return
            }
        }
    }


    console.log(arrTaskRunning)
    /*    if (arrTaskRunning.length>0) {
             generalFor();
        }*/
}