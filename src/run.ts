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
            /*            const index = arrTaskRunning.indexOf(t.targetId);
                        if (index !== -1) {
                            arrTaskRunning.splice(index, 1);
                        }*/
            return t.targetId;
        })
    }

    await generalFor();


    function spliceArr(arrS: any, id: any) {
        const index = arrS.indexOf(id);
        if (index !== -1) {
            arrS.splice(index, 1);
        }
    }


    async function generalFor() {

        for await (let task of queue) {

            if (arrTaskRunning.includes(task.targetId)) {
                //n++; // ??????
                //continue;
                setTimeout(()=>{exec(task)},100);

            } else {
                arrTaskRunning.push(task.targetId);
            }


            if (arr[n + 1] === undefined || arr[n] === undefined) {
                await executor.executeTask(task);
                spliceArr(arrTaskRunning, task.targetId);
                /*                const index = arrTaskRunning.indexOf(task.targetId);
                                if (index !== -1) {
                                    arrTaskRunning.splice(index, 1);
                                }*/
                n++;
                continue;
            }


            if (arrTaskRunning.length <= maxThreads - 1) {
                if (!arrTaskRunning.includes(arr[n + 1])) {
                    //executor.executeTask(task);
                    //setTimeout(()=>{},0);
                    exec(task)
                } else {
                    //arrTaskRunning.length = 0;

                    await executor.executeTask(task);
                    spliceArr(arrTaskRunning, task.targetId);
                    /*                    const index = arrTaskRunning.indexOf(task.targetId);
                                        if (index !== -1) {
                                            arrTaskRunning.splice(index, 1);
                                        }*/
                }
            } else {
                //arrTaskRunning.length = 0;
                await executor.executeTask(task);
                spliceArr(arrTaskRunning, task.targetId);
                /*                const index = arrTaskRunning.indexOf(task.targetId);
                                if (index !== -1) {
                                    arrTaskRunning.splice(index, 1);
                                }*/
            }
            n++;


        }
    }

    console.log(arrTaskRunning)


    /*    if (arrTaskRunning.length>0) {
             generalFor();
        }*/

}