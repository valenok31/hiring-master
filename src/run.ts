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


    for (let i of taskNext.q) {
        arr.push({
            targetId: i.targetId,
            action: i.action,
            completed: false,
            running: false,
        });
    }


    function searchTask(taskSearch: ITask) {
        return arr.find((item: any) => {
            return (item.targetId == taskSearch.targetId && item.action == taskSearch.action)
        });
    }

    async function runningTaskAwait(t: ITask) {
        await executor.executeTask(t);
        searchTask(t).completed = true;
        return;
    }

    function searchId(id: any) {
        const result = arr.filter((item: any) => item.targetId == id);
        return result.find((item: any) => {
            return (item.running == true)
        });
    }

    function searchCompleted() {
        const result = arr.filter((item: any) => item.completed == false);
        return result.length;
    }


    function runningTask(t: ITask) {
        //searchTask(t).running = true;
        executor.executeTask(t).then((r) => {
            searchTask(t).completed = true;
            searchTask(t).running = false;
        })
        return t;
    }


    async function generalFor() {
        for await (let task of queue) {
            let taskFromArr = searchTask(task);
            if (!taskFromArr.completed && !taskFromArr.running) {
                if (!!searchId(task.targetId)) {
                    continue;
                } else {
                    if (maxThreads > 500) {
                        runningTask(task);
                    } else {
                        searchTask(task).completed = true;
                        await executor.executeTask(task);
                    }
                }
            }
        }


        /*        if (arr[3].completed) {
                    return
                }*/
        setTimeout(async () => {
            if (!!searchCompleted()) {
                console.log(searchCompleted())
                await generalFor();
            } else {
                return
            }
        }, 2000);

    }


    await generalFor();

}