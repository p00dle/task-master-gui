import * as React from 'react';
import { Button } from '../_common/Button';
import { useConfirmModal } from '../_common/ConfirmModal';

async function requestShutdown() {
  try {
    const response = await fetch('/api/shutdown');
    if (response.status !== 200) throw new Error('Invalid response from the server: ' + response.status);
  } catch (err) {
    window.alert('Error posting to server; see console for details');
  }
}

export const Shutdown: React.FC = function Shutdown() {
  const confirm = useConfirmModal('Are you sure you want to shut down the process?', requestShutdown);
  return (
    <div className="flex items-center justify-center">
      <Button className="btn-primary" onClick={confirm} text="SHUTDOWN" />
    </div>
  );
};
