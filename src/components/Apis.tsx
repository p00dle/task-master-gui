import * as React from 'react';
import type { ApiData } from '../data-types';
import { timestamp } from '../lib/format';
import { useLongPoll } from '../lib/useLongPoll';
import { Section } from './_common/Section';

export const APIs: React.FC = function DataSources() {
  const apis = useLongPoll<ApiData[]>(`/api/apis`, []);
  const normalizedApis = apis
    .flatMap(({ name, sourcesLastTouched, sourcesLastUpdated, targetsLastTouched, targetsLastUpdated }) => {
      return [
        ...Object.keys(sourcesLastTouched).map((path) => [name, path, sourcesLastUpdated[path], sourcesLastTouched[path], 'source']),
        ...Object.keys(targetsLastTouched).map((path) => [name, path, targetsLastUpdated[path], targetsLastTouched[path], 'target']),
      ];
    })
    .sort(([name1, path1], [name2, path2]) => {
      const a = (name1 as string) + (path1 as string);
      const b = (name2 as string) + (path2 as string);
      return a > b ? 1 : a === b ? 0 : -1;
    });
  const sources = normalizedApis.filter((x) => x[4] === 'source');
  const targets = normalizedApis.filter((x) => x[4] === 'target');
  return (
    <div className="mr-4 grid grid-cols-2 gap-x-12">
      <Section title="SOURCES" className="p-4">
        <table className="table w-full border-collapse border-1">
          <thead className="tertiary text-left text-lg">
            <td className="px-4 py-2">SOURCE</td>
            <td className="w-32 px-4 py-2">TYPE</td>
            <td className="w-48 px-4 py-2">LAST UPDATED</td>
            <td className="w-48 px-4 py-2">LAST TOUCHED</td>
          </thead>
          <tbody>
            {sources.map(([name, path, lastUpdated, lastTouched]) => (
              <tr key={name + '/' + path}>
                <td className="px-4 h-12">{name}</td>
                <td className="px-4 h-12">{path}</td>
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
            <td className="w-32 px-4 py-2">TYPE</td>
            <td className="w-48 px-4 py-2">LAST UPDATED</td>
            <td className="w-48 px-4 py-2">LAST TOUCHED</td>
          </thead>
          <tbody>
            {targets.map(([name, path, lastUpdated, lastTouched]) => (
              <tr key={name + '/' + path}>
                <td className="px-4 h-12">{name}</td>
                <td className="px-4 h-12">{path}</td>
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
