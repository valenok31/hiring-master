import {IExecutor} from './Executor';
import ITask from './Task';

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
    maxThreads = Math.max(0, maxThreads);
    /**
     * Код надо писать сюда
     * Тут что-то вызываем в правильном порядке executor.executeTask для тасков из очереди queue
     */
    const arr: any = [];
    let thread: number = 0;
    for await (const line of queue) {

        //arr[i] = await executor.executeTask(line);
        if (arr.includes(line.targetId)) {
            await executor.executeTask(line);
            thread <= 0 ? thread = 0 : thread--;
        } else {
            if (thread <= maxThreads) {
                executor.executeTask(line);
                arr.push(line.targetId);
                thread++;
            } else {
                await executor.executeTask(line);
            }

        }
    }
    console.log(arr);
}
