import { IClient } from '@splitsoftware/splitio/types/splitio';
import { useContext } from 'react';
import { SplitContext } from './SplitProvider';

export const useTrack: () => IClient['track'] = () => {
  const { client, isReady } = useContext(SplitContext);
  return client && isReady ? client.track : defaultTrack;
};

const defaultTrack = () => false;
