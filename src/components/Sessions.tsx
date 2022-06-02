import * as React from 'react';
import type { SessionData } from '../data-types';
import { interval, limitString, timestamp } from '../lib/format';
import { useLongPoll } from '../lib/useLongPoll';
import { Button } from './_common/Button';

async function requestRenewSession(sessionName?: string) {
  const url = new URL('/api/sessions', window.location.origin);
  if (sessionName) {
    url.searchParams.append('name', sessionName);
  }
  try {
    const response = await fetch(url.toString(), { method: 'POST' });
    if (response.status !== 200) throw new Error('Invalid response from the server: ' + response.status);
  } catch (err) {
    window.alert('Error posting to server; see console for details');
  }
}

export const Sessions: React.FC = function Sessions() {
  const sessions = useLongPoll<SessionData[]>(`/api/sessions`, []);

  return (
    <div className="mr-4">
      <table className="table-fixed w-full border-collapse border-1">
        <thead className="tertiary text-left text-lg">
          <tr className="border-y-1">
            <td className="w-28"></td>
            <td className="w-36 px-4 py-2">NAME</td>
            <td className="w-48 px-4 py-2">STATUS</td>
            <td className="w-32 px-4 py-2">IN QUEUE</td>
            <td className="w-32 px-4 py-2">UPTIME</td>
            <td className="w-48 px-4 py-2">LAST ERROR</td>
            <td className="px-4 py-2">ERROR MESSAGE</td>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => {
            return (
              <tr className="border-y-1" key={session.name}>
                <td className="px-4">
                  <Button className="btn-primary" onClick={() => requestRenewSession(session.name)} text="RENEW" />
                </td>
                <td className="px-4 h-12">{session.name.toUpperCase()}</td>
                <td className="px-4">{session.status.toUpperCase()}</td>
                <td className="px-4">{session.inQueue}</td>
                <td className="px-4">{interval(session.uptimeSince)}</td>
                <td className="px-4">{timestamp(session.lastError)}</td>
                <td className="px-4">{limitString(session.error, 120)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export interface Session {
  name: string;
  status: string;
  uptimeSince: number | null;
  lastError: number | null;
  error: string | null;
  inQueue: number;
  isInitialised: boolean;
}
