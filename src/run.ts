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


    async function generalFor() {

        for await (let task of queue) {

            if (arrTaskRunning.includes(task.targetId)) {
                arrTask.push(task);
                n++;
                continue;
            }

            if (arr[n + 1] === undefined || arr[n] === undefined) {
                //arrTaskRunning.push(task.targetId);
                await executor.executeTask(task);
                //spliceArr(arrTaskRunning, task.targetId);
                n++;
                continue;
            }

            if (arrTaskRunning.length < maxThreads - 1) {
                if (arrTask.length > 0) {
                    if (!arrTaskRunning.includes(arrTask[0].targetId)) {
                        await executor.executeTask(arrTask[0]);
                        arrTask.shift();
                    }
                }
                /*                if (arrTask.length > 0) {
                                    if (!arrTaskRunning.includes(arrTask[0].targetId)) {
                                        await executor.executeTask(arrTask[0]);
                                        arrTask.shift();
                                    }
                                }*/
                arrTaskRunning.push(task.targetId);
                if (!arrTaskRunning.includes(arr[n + 1])) {
                    exec(task);
                } else {
                    if (arrTask.length == 0 || arrTask.length > 3) {
                        await executor.executeTask(task);
                        spliceArr(arrTaskRunning, task.targetId);
                    } else {
                        exec(task);
                    }


                }
            } else {
                await executor.executeTask(task);
            }
            n++;
        }
    }

    console.log(arr)
    await generalFor();
    if (arrTask.length > 0) {
        for await(let r of arrTask) {
            await executor.executeTask(r);
            arrTask.shift();
        }

    }
}