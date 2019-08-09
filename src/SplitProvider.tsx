import { SplitFactory } from '@splitsoftware/splitio';
import React, { createContext, useEffect, useState } from 'react';

import { ISplitContextValues, ISplitProviderProps } from './types';

/**
 * Creating a React.Context with default values.
 */
export const SplitContext = createContext<ISplitContextValues>({
  client: null,
  isReady: false,
  lastUpdate: 0,
});

/**
 * SplitProvider will initialize client and listen for events that will set things up.
 * Make sure SplitProvider is wrapper your entire app.
 * @see {@link https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK}
 * @param {ISplitProviderProps} props
 * @returns {React.Component}
 *
 * @example
 *
 *  <SplitProvider config={SDK_CONFIG_OBJECT}>
 *    <App />
 *  </SplitProvider>
 */
const SplitProvider = ({ config, children }: ISplitProviderProps) => {
  const {
    startup = {},
    scheduler = {},
    core,
    features = {},
    storage = {},
    debug,
    impressionListener,
  } = config;
  const clientDeps = [
    startup.readyTimeout,
    startup.requestTimeoutBeforeReady,
    startup.retriesOnFailureBeforeReady,
    startup.eventsFirstPushWindow,
    scheduler.featuresRefreshRate,
    scheduler.impressionsRefreshRate,
    scheduler.metricsRefreshRate,
    scheduler.segmentsRefreshRate,
    scheduler.eventsPushRate,
    scheduler.eventsQueueSize,
    scheduler.offlineRefreshRate,
    core.authorizationKey,
    core.key,
    core.trafficType,
    core.labelsEnabled,
    ...Object.entries(features).map((k, v) => `${k}::${v}`),
    storage.type,
    storage.prefix,
    debug,
    impressionListener,
  ];

  const [client, setClient] = useState<SplitIO.IClient | null>(null);
  const [isReady, setReady] = useState(false);
  const [lastUpdate, setUpdated] = useState(0);

  useEffect(() => {
    /** @link https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#2-instantiate-the-sdk-and-create-a-new-split-client */
    const nextClient = SplitFactory(config).client();
    setClient(nextClient);
    nextClient.on(nextClient.Event.SDK_READY, () => {
      setReady(true);
      setUpdated(Date.now());
    });
    nextClient.on(nextClient.Event.SDK_UPDATE, () => {
      setUpdated(Date.now());
    });

    return () => {
      if (client) {
        client.destroy();
      }
      setReady(false);
      setUpdated(0);
    };
  }, clientDeps);

  return (
    <SplitContext.Provider
      value={{
        client,
        isReady,
        lastUpdate,
      }}
    >
      {children}
    </SplitContext.Provider>
  );
};

export default SplitProvider;
