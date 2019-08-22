import { SplitFactory } from '@splitsoftware/splitio';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

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
const SplitProvider = ({
  config,
  children,
  onImpression,
}: ISplitProviderProps) => {
  const [client, setClient] = useState<SplitIO.IClient | null>(null);
  const [isReady, setReady] = useState(false);
  const [lastUpdate, setUpdated] = useState(0);

  // Handle impression listener separately from config.
  // - Allows us to use the onImpression property
  // - And because the listener function is ignored from JSON.stringify,
  //   so changing that in the config wouldn't hook up the new function.
  // - Because of this ^ the function can change without us having to recreate the client.
  const handleImpression = useCallback((data: SplitIO.ImpressionData) => {
    if (onImpression) {
      onImpression(data);
    }
    if (config.impressionListener && config.impressionListener.logImpression) {
      config.impressionListener.logImpression(data);
    }
  }, []);

  // Determine whether config has changed which would require client to be recreated.
  // Convert config object to string so it works with the identity check ran with useEffect's dependency list.
  // We memoize this so if the user has memoized their config object we don't call JSON.stringify needlessly.
  const configHash = useMemo(() => JSON.stringify(config), [config]);

  useEffect(() => {
    /** @link https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#2-instantiate-the-sdk-and-create-a-new-split-client */
    const nextClient = SplitFactory({
      ...config,
      impressionListener: {
        logImpression: handleImpression,
      },
    }).client();
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
  }, [configHash]);

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
