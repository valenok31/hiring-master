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

    for (let i of taskNext.q) {
        arr.push(i.targetId);
    }
    //console.log(maxThreads);

    for await (let task of queue) {

        const promises = executor.executeTask(task);
        if (arrTaskRunning.length < maxThreads) {
            if (!arrTaskRunning.includes(task.targetId)) {
                arrTaskRunning.push(task.targetId);
                promises.finally(() => {
                    const index = arrTaskRunning.indexOf(task.targetId);
                    if (index !== -1) {
                        arrTaskRunning.splice(index, 1);
                    }
                });
            }


        }
    }
    console.log(arrTaskRunning)

}