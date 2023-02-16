import Executor, {IExecutor} from './Executor';
import ITask from './Task';

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
    maxThreads = Math.max(0, maxThreads);
    /**
     * Код надо писать сюда
     * Тут что-то вызываем в правильном порядке executor.executeTask для тасков из очереди queue
     */

    let execClass = new Executor();
    let arr: any = [];
    const arrTargetId: any = [];
    let thread: number = 0;
    let i: number = 0;
    //    [ 'targetId', 'action', '_onExecute', '_onComplete', 'acquired' ]

    for await (const line of queue) {
        console.log(line.action)
        if (line.action == 'cleanup') {
            if (arrTargetId.includes(line.targetId)) {
                await execClass.executeTask(line);

            } else {
                arrTargetId.push(line.targetId);
                if (maxThreads === 0) {
                     execClass.executeTask(line);
                } else {
                    if (thread <= maxThreads) {
                        thread++;
                         execClass.executeTask(line);
                    } else {
                        await execClass.executeTask(line);
                    }
                }
            }
        } else {

            await  execClass.executeTask(line);

        }
    }
}
