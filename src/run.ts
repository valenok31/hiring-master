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

            /*            for (let taskSave of arrTask) {
                            if (!arrTaskRunning.includes(taskSave.targetId)) {
                                exec(taskSave);
                            }
                        }*/



            //if(true){}

            if (arrTaskRunning.includes(task.targetId)) {

                arrTask.push(task);
                n++;
                continue;
                /*                setTimeout(() => {
                                    exec(task)
                                }, 150);*/

            } else {
                //arrTaskRunning.push(task.targetId);
            }


            if (arr[n + 1] === undefined || arr[n] === undefined) {
                arrTaskRunning.push(task.targetId);
                await executor.executeTask(task);
                spliceArr(arrTaskRunning, task.targetId);
                n++;
                continue;
            }

            if (arrTaskRunning.length <= maxThreads /*- 1*/) {

                if (arrTask.length > 0) {
                    // for (let id = 0; id < arrTask.length; id++) {
                    console.log(!arrTaskRunning.includes(arrTask[0].targetId));
                    if (!arrTaskRunning.includes(arrTask[0].targetId)) {
                        //arrTaskRunning.push(arrTask[0].targetId);
                        //exec(arrTask[0]);
                        await executor.executeTask(arrTask[0]);
                        //spliceArr(arrTaskRunning, arrTask[0].targetId);
                        arrTask.shift();
                        //spliceArr(arrTask, arrTask[id].targetId);

                        // }
                    }
                }





                if (!arrTaskRunning.includes(arr[n + 1])) {
                    /*                    if (n == -2) {
                                            console.log(task.targetId)
                                            arrTask.push(task);
                                            n++;
                                            continue;
                                        }*/
                    arrTaskRunning.push(task.targetId);
                    exec(task);


                } else {
                    arrTaskRunning.push(task.targetId);
                    await executor.executeTask(task);
                    spliceArr(arrTaskRunning, task.targetId);
                }
            }else {

                arrTask.push(task);
/*                await executor.executeTask(task);
                spliceArr(arrTaskRunning, task.targetId);*/
            }


            n++;


        }
    }

    //console.log(arrTaskRunning)


    /*    if (arrTaskRunning.length>0) {
             generalFor();
        }*/

}