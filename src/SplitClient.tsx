import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SplitContext } from './SplitProvider';
import { ISplitContextValues } from './types';

export interface ISplitClientProps {
  splitKey: SplitIO.SplitKey;
  trafficType?: string;
}

export const SplitClient: FunctionComponent<ISplitClientProps> = ({
  splitKey,
  trafficType,
  children,
}) => {
  const { factory, isReady, lastUpdate, client: parentClient } = useContext(
    SplitContext,
  );
  const [client, setClient] = useState(parentClient);

  // create client for splitKey and trafficType
  useEffect(() => {
    const nextClient = factory ? factory.client(splitKey, trafficType) : null;
    setClient(nextClient);
  }, [factory, splitKey, trafficType]);

  // memoize child context to prevent unnecessary re-renders with object's identity changing
  const context = useMemo(
    (): ISplitContextValues => ({
      client,
      factory,
      isReady,
      lastUpdate,
    }),
    [factory, client, isReady, lastUpdate],
  );

  return (
    <SplitContext.Provider value={context}>{children}</SplitContext.Provider>
  );
};
