/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { useState } from 'react';
import type { LogData } from '../data-types';
import { limitString, timestamp } from '../lib/format';
import { useLongPoll } from '../lib/useLongPoll';
import { ModalProps, useModal } from './layout/Modal';
import { Button } from './_common/Button';

const LogModal: React.FC<ModalProps<LogData>> = function LogModal({ props: log }) {
  return (
    <div>
      <div className="w-full flex flex-wrap gap-4">
        <div className="min-w-[18rem] border-1 rounded-t-lg m-4 secondary">
          <div className="tertiary p-2 rounded-t-lg">TIMESTAMP</div>
          <div className="secondary p-2">{timestamp(log.timestamp)}</div>
        </div>
        <div className="min-w-[18rem] border-1 rounded-t-lg m-4 secondary">
          <div className="tertiary p-2 rounded-t-lg">LEVEL</div>
          <div className="secondary p-2">{log.logLevel.toUpperCase()}</div>
        </div>
        <div className="min-w-[18rem] border-1 rounded-t-lg m-4 secondary">
          <div className="tertiary p-2 rounded-t-lg">NAMESPACE</div>
          <div className="secondary p-2">{log.namespace.replace(/\./g, ' > ')}</div>
        </div>
      </div>
      <div className="w-inherit border-1 rounded-t-lg m-4">
        <div className="tertiary p-2 rounded-t-lg">MESSAGE</div>
        <div className="secondary p-2">{log.message}</div>
      </div>
      <div className="w-inherit border-1 rounded-t-lg m-4">
        <div className="tertiary p-2 rounded-t-lg">DETAILS</div>
        <pre className="secondary p-2 whitespace-pre-wrap overflow-y-scroll h-96">{log.details}</pre>
      </div>
    </div>
  );
};

export const Logs: React.FC = function Logs() {
  const showModal = useModal('LOG', LogModal, {} as LogData, 'w-10/12 h-8/12 !top-8');
  const [poll, setPoll] = useState(true);
  const [debug, setDebug] = useState(true);
  const logs = useLongPoll<LogData[]>(`/api/logs?debug=${debug}`, [], poll);
  return (
    <div className="mr-8 ml-4">
      <div className="flex justify-between px-12 mb-8">
        <Button className="btn-primary w-40" onClick={() => setPoll(!poll)} text={poll ? 'PAUSE' : 'RESUME'} />
        <Button className="btn-primary w-40" onClick={() => setDebug(!debug)} text={debug ? 'HIDE DEBUG' : 'SHOW DEBUG'} />
        <a className="btn btn-primary w-40 text-center" target="_blank" href="/api/download-logs">
          DOWNLOAD
        </a>
      </div>
      <div>
        <table className="table-fixed w-full border-collapse border-1">
          <thead className="tertiary text-left text-lg">
            <tr className="border-y-1">
              <td className="w-48 px-4 py-2">TIMESTAMP</td>
              <td className="w-24 px-4 py-2">LEVEL</td>
              <td className="px-4 py-2 w-96">NAMESPACE</td>
              <td className="px-4 py-2">MESSAGE</td>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => {
              return (
                <tr
                  className={'cursor-pointer border-y-1 ' + (log.logLevel === 'error' ? 'error-message' : '')}
                  key={i}
                  onClick={() => showModal(log)}
                >
                  <td className="px-4 h-8">{timestamp(log.timestamp)}</td>
                  <td className="px-4">{log.logLevel.toUpperCase()}</td>
                  <td className="px-4">{log.namespace.replace(/\./g, ' > ')}</td>
                  <td className="px-4">{limitString(log.message, 110)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
