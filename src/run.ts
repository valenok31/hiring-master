import Executor, {IExecutor} from './Executor';
import ITask from './Task';

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
    maxThreads = Math.max(0, maxThreads);
    /**
     * Код надо писать сюда
     * Тут что-то вызываем в правильном порядке executor.executeTask для тасков из очереди queue
     */

    const arr: any = [];
    const arrTask: any = [];
    let taskNext = JSON.parse(JSON.stringify(queue));
    let bool = true;
    let n = 0;

    for (let i of taskNext.q) {
        arr.push(i.targetId);
    }


    for await (let task of queue) {

        if (true || (arrTask.includes(arr[n + 1]) || arrTask.includes(arr[n])) || arrTask.length > 1) {
            await executor.executeTask(task);
        } else {
            /*            if (maxThreads === 0) {
                            executor.executeTask(task);
                        } else {
                            if (arrTask.length < maxThreads) {
                                executor.executeTask(task);
                            } else {
                                await executor.executeTask(task);
                            }
                        }*/
            executor.executeTask(task);

        }

        /*     if (bool && arr[n] != arr[n + 1] && arr[n + 1] != arr[n + 2] && arr[n] != arr[n + 2]) {
                 executor.executeTask(task);
                // bool = false;
                 if (n === 1) {
                     bool = false;
                 }

             } else {
                 await executor.executeTask(task);
                 //bool = true;
             }*/

        arrTask.push(task.targetId);
        n++;
        //arr.shift();
    }
    // console.log(taskNext.q);
    console.log(arr);


}