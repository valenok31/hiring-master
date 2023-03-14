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
    let taskN_1: any = null;


    function exec(t: ITask, arrTaskRunning: any) {
        executor.executeTask(t).then((r) => {
            spliceArr(arrTaskRunning, t.targetId);
            //return t.targetId;
        })
    }

    function spliceArr(arrS: any, id: any) {
        const index = arrS.indexOf(id);
        if (index !== -1) {
            arrS.splice(index, 1);
        }
    }

    await generalFor(queue, arrTaskRunning, secondQueue, maxThreads);

    async function generalFor(queueS: AsyncIterable<ITask>, arrTaskRunning: any, secondQueue: any, maxThreads: number) {
        for await (let task of queueS) {
            if (threads) {
                taskN_1 = task.targetId;
                threads = false;
            }
            /*            if (task.targetId == taskN_1 /!*&& task.action == 'cleanup'*!/) {
                            //arrTaskRunning.push(task.targetId);
                            (function (taski: ITask) {
                                executor.executeTask(taski);
                            })(task);

            /!*                setTimeout(async () => {
                                await executor.executeTask(task);
                                //spliceArr(arrTaskRunning, task.targetId);
                            }, 0)*!/
                        }*/

            for (let d = 0; d < secondQueue.length; d++) {
                if (!arrTaskRunning.includes(secondQueue[d].targetId)) {
                    arrTaskRunning.push(secondQueue[d].targetId);
                    exec(secondQueue[d], arrTaskRunning);
                    const index = secondQueue.findIndex((ts: any) => {
                        return (ts.targetId == secondQueue[d].targetId)
                    });
                    if (index !== -1) {
                        secondQueue.splice(index, 1);
                        d--;
                    }
                }
            }

            if (arrTaskRunning.includes(task.targetId)) {
                setTimeout(() => {
                    secondQueue.push(task)
                }, 0)
            } else {
                if (arrTaskRunning.length < maxThreads - 1 && arrTaskRunning.length < 11) {
                    //  if (task.action == 'cleanup') {
                    //      await executor.executeTask(task);
                    //   } else {
                    arrTaskRunning.push(task.targetId);
                    exec(task, arrTaskRunning);
                    // }
                } else {
                    await executor.executeTask(task);
                }
            }
        }
        if (secondQueue.length > 0) {

            await generalFor(secondQueue, arrTaskRunning, [], maxThreads)

        }
    }
}