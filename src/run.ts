import {IExecutor} from './Executor';
import ITask from './Task';

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
    maxThreads = Math.max(0, maxThreads);
    /**
     * Код надо писать сюда
     * Тут что-то вызываем в правильном порядке executor.executeTask для тасков из очереди queue
     */
    const arr: any = [];
    const arrTargetId: any = [];
    let thread: number = 0;
    let i: number = 0;
    //    [ 'targetId', 'action', '_onExecute', '_onComplete', 'acquired' ]

    for await (const line of queue) {
        arr.push(line);
    }
    arr.forEach((l: any) => {
        arrTargetId.push(executor.executeTask(l));

    })

    await Promise.all(arrTargetId)
    console.log(arr);
}
