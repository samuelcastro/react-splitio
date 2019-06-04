import { SplitFactory } from '@splitsoftware/splitio';
import React, { createContext } from 'react';

import {
  ISplitContextValues,
  ISplitProviderProps,
  SplitReactContext,
} from './types';

/**
 * Creating a React.Context with default values.
 * @returns {SplitReactContext}
 */
export const SplitContext: SplitReactContext = createContext<
  ISplitContextValues
>({
  client: {} as SplitIO.IClient,
  isReady: false,
  lastUpdate: null,
});

/**
 * SplitProvider will initialize client and listen for events that will set things up.
 * Make sure SplitProvider is wrapper your entire app.
 * @see {@link https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK}
 * @param {ISplitProviderProps} props
 * @param {ISplitContextValues} state
 * @returns {React.Component}
 *
 * @example
 *
 *  <SplitProvider config={SDK_CONFIG_OBJECT}>
 *    <App />
 *  </SplitProvider>
 */
const SplitProvider = class extends React.Component<
  ISplitProviderProps,
  ISplitContextValues
> {
  constructor(props: ISplitProviderProps) {
    super(props);

    /**
     * Instatiating a factory in order to create a client.
     * @see {@link https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#2-instantiate-the-sdk-and-create-a-new-split-client}
     */
    const factory: SplitIO.ISDK = SplitFactory(props.config);

    this.state = {
      client: factory.client(),
      isReady: false,
      lastUpdate: null,
    };
  }

  /**
   * Listening for split events
   */
  componentDidMount() {
    const { client } = this.state;

    /**
     * When SDK is ready this isReady to true
     */
    client.on(client.Event.SDK_READY, () => this.setState({ isReady: true }));

    /**
     * When an update occurs update lastUpdate, this will force a re-render
     */
    client.on(client.Event.SDK_UPDATE, () =>
      this.setState({
        lastUpdate: Date.now(),
      }),
    );

    // TODO: Are there any other events that we need to listen?
  }

  /**
   * Destroying client instance when component unmonts
   */
  componentWillUnmount() {
    const { client } = this.state;

    client.destroy();
  }

  render() {
    const { isReady, client, lastUpdate } = this.state;
    const { children } = this.props;

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
  }
};

export default SplitProvider;
