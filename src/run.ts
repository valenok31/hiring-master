import { IExecutor } from './Executor';
import ITask from './Task';

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
    maxThreads = Math.max(0, maxThreads);
    /**
     * Код надо писать сюда
     * Тут что-то вызываем в правильном порядке executor.executeTask для тасков из очереди queue
     */

    console.log('тесты ' + executor.executeTask({ targetId: 0, action: 'init' }))
    // executor.executeTask({ targetId: 0, action: 'init' });

}
