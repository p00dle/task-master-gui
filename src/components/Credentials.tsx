import * as React from 'react';
import type { CredentialsData } from '../data-types';
import { useLongPoll } from '../lib/useLongPoll';
import { Form, Input } from './_common/Form';
import { Section } from './_common/Section';

async function onFormSubmit(props: any) {
  const body = JSON.stringify(props);
  const bodyLength = '' + body.length;
  try {
    const response = await fetch('/api/credentials', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': bodyLength,
      },
    });
    if (response.status !== 200) throw new Error('Invalid response from the server: ' + response.status);
  } catch (err) {
    console.error(err);
    window.alert('Error posting to server; see console for details');
  }
}

export const Credentials: React.FC = function Credentials() {
  const allCredentials = useLongPoll<CredentialsData[]>('/api/credentials', []);
  return (
    <div className="grid grid-cols-3 gap-8 mr-4">
      {allCredentials.map((credentials) => {
        return (
          <Section title={credentials.name.toUpperCase()} className="p-8">
            <Form onSubmit={onFormSubmit}>
              <Input type="hidden" prop="name" initialValue={credentials.name} />
              <Input type="string" prop={credentials.name + '_username'} initialValue={credentials.username} label="USERNAME" />
              <Input type="password" prop={credentials.name + '_password'} initialValue={''} label="PASSWORD" />
              <Input type="submit" />
            </Form>
            <div className="grid grid-cols-2 space-y-2">
              <div className="pr-4 flex flex-row-reverse items-center mt-2 h-12">PASSWORD PROVIDED</div>
              <div className="pl-4 flex items-center h-12">{credentials.hasPassword ? 'YES' : 'NO'}</div>
              <div className="pr-4 flex flex-row-reverse items-center h-12">CREDENTIALS VALID</div>
              <div className="pl-4 flex items-center h-12">
                {credentials.valid === null ? 'NOT USED YET' : credentials.valid ? 'VALID' : 'INVALID'}
              </div>
            </div>
          </Section>
        );
      })}
    </div>
  );
};
