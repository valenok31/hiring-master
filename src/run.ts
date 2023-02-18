import Executor, {IExecutor} from './Executor';
import ITask from './Task';

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
    maxThreads = Math.max(0, maxThreads);
    /**
     * Код надо писать сюда
     * Тут что-то вызываем в правильном порядке executor.executeTask для тасков из очереди queue
     */

    const arr: any = [];
    const arrTask = [];
    let taskNext = [];
    let i = 0;

    for await (let task of queue) {
        executor.executeTask(task)
       // await executor.executeTask(task)

    }


}