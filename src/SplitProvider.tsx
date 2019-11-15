import { SplitFactory } from '@splitsoftware/splitio';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TreatmentWithConfig } from '@splitsoftware/splitio/types/splitio';
import { ISplitContextValues, ISplitProviderProps } from './types';

export const defaultTreatment: TreatmentWithConfig = {
  config: null,
  treatment: 'control', // SplitIO's default value
};

/**
 * Creating a React.Context with default values.
 */
export const SplitContext = createContext<ISplitContextValues>({
  client: null,
  factory: null,
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
  const [{ factory, client }, setProvider] = useState({
    client: null as SplitIO.IClient | null,
    factory: null as SplitIO.ISDK | null,
  });
  const [{ isReady, lastUpdate }, setUpdated] = useState({
    isReady: false,
    lastUpdate: 0,
  });

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
  // We also freeze the config object here so users know modifying it is not what they want to do.
  const configHash = useMemo(() => JSON.stringify(deepFreeze(config)), [
    config,
  ]);

  useEffect(() => {
    // Reset state when re-creating the client after config modification
    if (isReady || lastUpdate > 0) {
      setUpdated({ isReady: false, lastUpdate: 0 });
    }

    const sdkConfig: SplitIO.IBrowserSettings = {
      ...config,

      /** @link https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#2-instantiate-the-sdk-and-create-a-new-split-client */
      impressionListener: {
        logImpression: handleImpression,
      },
    };

    /**
     * Instantiating a new factory
     * @link https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK
     */
    const nextFactory: SplitIO.ISDK = SplitFactory(sdkConfig);
    const nextClient = nextFactory.client();

    setProvider({
      client: nextClient,
      factory: nextFactory,
    });

    // Only make state changes if component is mounted.
    // https://github.com/facebook/react/issues/14369#issuecomment-468267798
    let isMounted = true;
    const updateListener = () => {
      if (isMounted) {
        setUpdated({ isReady: true, lastUpdate: Date.now() });
      }
    };
    nextClient.on(nextClient.Event.SDK_READY, updateListener);
    nextClient.on(nextClient.Event.SDK_UPDATE, updateListener);

    return () => {
      isMounted = false;
      if (client) {
        client.destroy();
      }
    };
  }, [configHash]);

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

export default SplitProvider;

const deepFreeze = <T extends {}>(object: T): T => {
  if (Object.isFrozen(object)) {
    return object;
  }
  // Freeze properties before freezing self
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === 'object') {
      object[name] = deepFreeze(value);
    }
  }

  return Object.freeze(object);
};
