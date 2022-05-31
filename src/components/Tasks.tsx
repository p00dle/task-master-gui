import * as React from 'react';
import type { TaskData } from '../data-types';
import { limitString, timestamp } from '../lib/format';
import { useLongPoll } from '../lib/useLongPoll';
import { Button } from './_common/Button';

function taskCommandFactory(command: 'start' | 'stop', taskName?: string) {
  const url = new URL('/api/tasks', window.location.origin);
  url.searchParams.append('command', command);
  if (taskName) {
    url.searchParams.append('name', taskName);
  }
  return async () => {
    try {
      const response = await fetch(url.toString(), { method: 'POST' });
      if (response.status !== 200) throw new Error('Invalid response from the server: ' + response.status);
    } catch (err) {
      window.alert('Error posting to server; see console for details');
    }
  };
}

export const Tasks: React.FC = function Tasks() {
  const tasks = useLongPoll<TaskData[]>(`/api/tasks`, []);
  return (
    <div className="mr-4">
      <table className="table-fixed w-full border-collapse border-1">
        <thead className="tertiary text-left text-lg">
          <tr className="border-y-1">
            <td className="w-20"></td>
            <td className="w-20"></td>
            <td className="w-48 px-4 py-2">NAME</td>
            <td className="w-32 px-4 py-2">STATUS</td>
            <td className="w-48 px-4 py-2">STEP</td>
            <td className="w-48 px-4 py-2">LAST EXECUTED</td>
            <td className="w-48 px-4 py-2">LAST ERROR</td>
            <td className="px-4 py-2">ERROR MESSAGE</td>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            return (
              <tr className="border-y-1" key={task.name}>
                <td className="px-4">
                  <Button className="btn-primary" onClick={taskCommandFactory('start', task.name)} text="START" />
                </td>
                <td className="px-4">
                  <Button className="btn-primary" onClick={taskCommandFactory('stop', task.name)} text="STOP" />
                </td>
                <td className="px-4 h-12">{task.name.toUpperCase()}</td>
                <td className="px-4">{task.status.toUpperCase()}</td>
                <td className="px-4">{task.step}</td>
                <td className="px-4">{timestamp(task.lastExecuted)}</td>
                <td className="px-4">{timestamp(task.lastError)}</td>
                <td className="px-4">{limitString(task.error, 120)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
