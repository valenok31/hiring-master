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

    function setArr() {
        for (let i of taskNext.q) {
            arr.push(i.targetId);
        }
        return arr.length;
    }

    setArr();
    for (let j = 0; j < 4; j++) {
        set.add(arr[j]);
    }

    function exec(t: ITask) {
        executor.executeTask(t).then((r) => {
            const index = arrTaskRunning.indexOf(t.targetId);
            if (index !== -1) {
                arrTaskRunning.splice(index, 1);
            }
            return t.targetId;
        })
    }

    async function forGeneral() {
        for await (let task of queue) {

            arrTaskRunning.push(task.targetId);
            if (arr[n + 1] === undefined || arr[n] === undefined) {
                await executor.executeTask(task);
                const index = arrTaskRunning.indexOf(task.targetId);
                if (index !== -1) {
                    arrTaskRunning.splice(index, 1);
                }
                n++;
                continue;
            }
            if (arrTaskRunning.length <= maxThreads - 1) {
                if (!arrTaskRunning.includes(arr[n + 1])) {
                    //executor.executeTask(task);
                    exec(task);
                } else {
                    //arrTaskRunning.length = 0;
                    await executor.executeTask(task);
                    const index = arrTaskRunning.indexOf(task.targetId);
                    if (index !== -1) {
                        arrTaskRunning.splice(index, 1);
                    }
                }
            } else {
                //arrTaskRunning.length = 0;
                await executor.executeTask(task);
                const index = arrTaskRunning.indexOf(task.targetId);
                if (index !== -1) {
                    arrTaskRunning.splice(index, 1);
                }
            }
            n++;


        }
        console.log(arrTaskRunning)
    }

    forGeneral();

    if (setArr() > 0) {
        forGeneral();
    }
    //console.log(arr);
}