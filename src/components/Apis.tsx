import * as React from 'react';
import type { ApiData } from '../data-types';
import { timestamp } from '../lib/format';
import { useLongPoll } from '../lib/useLongPoll';
import { Section } from './_common/Section';

export const APIs: React.FC = function DataSources() {
  const apis = useLongPoll<ApiData[]>(`/api/apis`, []);
  const sources: [string, number | null, number | null][] = [];
  const targets: [string, number | null, number | null][] = [];
  for (const api of apis) {
    if (api.usedAsSource) sources.push([api.name, api.sourceLastUpdated, api.sourceLastTouched]);
    if (api.usedAsTarget) targets.push([api.name, api.targetLastUpdated, api.targetLastTouched]);
  }
  sources.sort(([a], [b]) => (a > b ? 1 : a === b ? 0 : -1));
  targets.sort(([a], [b]) => (a > b ? 1 : a === b ? 0 : -1));
  return (
    <div className="mr-4 grid grid-cols-2 gap-x-12">
      <Section title="SOURCES" className="p-4">
        <table className="table w-full border-collapse border-1">
          <thead className="tertiary text-left text-lg">
            <td className="px-4 py-2">SOURCE</td>
            <td className="w-48 px-4 py-2">LAST UPDATED</td>
            <td className="w-48 px-4 py-2">LAST TOUCHED</td>
          </thead>
          <tbody>
            {sources.map(([name, lastUpdated, lastTouched]) => (
              <tr key={name}>
                <td className="px-4 h-12">{name}</td>
                <td className="px-4 h-12">{timestamp(lastUpdated)}</td>
                <td className="px-4 h-12">{timestamp(lastTouched)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      <Section title="TARGETS" className="p-4">
        <table className="table w-full border-collapse border-1">
          <thead className="tertiary text-left text-lg">
            <td className="px-4 py-2">TARGET</td>
            <td className="w-48 px-4 py-2">LAST UPDATED</td>
            <td className="w-48 px-4 py-2">LAST TOUCHED</td>
          </thead>
          <tbody>
            {targets.map(([name, lastUpdated, lastTouched]) => (
              <tr key={name}>
                <td className="px-4 h-12">{name}</td>
                <td className="px-4 h-12">{timestamp(lastUpdated)}</td>
                <td className="px-4 h-12">{timestamp(lastTouched)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
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
