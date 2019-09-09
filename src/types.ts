import {
  Attributes,
  IBrowserSettings,
  TreatmentsWithConfig,
  TreatmentWithConfig,
} from '@splitsoftware/splitio/types/splitio';

import { Context } from 'react';

/**
 * Split React Context interface. This interface will be used on a React createContext method
 * to define the ReactContext values
 * @interface ISplitContextValues
 */
export interface ISplitContextValues {
  /**
   * Split client instance
   * @property {SplitIO.IClient} client
   * @see {@link https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#2-instantiate-the-sdk-and-create-a-new-split-client}
   */
  client: SplitIO.IClient | null;

  /**
   * isReady is a property that will show up when the client SDK is ready to be consumed.
   * @property {boolean} isReady
   * @default false
   */
  isReady: boolean;

  /**
   * Shows up when was the last SDK update
   * @property {number} lastUpdate
   */
  lastUpdate: number;
}

/**
 * React Context type that will be used to implement the React createContext method
 * @typedef {Context<ISplitContextValues>} SplitReactContext
 */
export type SplitReactContext = Context<ISplitContextValues>;

/**
 * Split Provider interface. Interface that will be implemented in order to create a split provider
 * with the SDK browser settings. The provider will create client out of factory and listen
 * for SDK events.
 * @interface ISplitProviderProps
 */
export interface ISplitProviderProps {
  /**
   * config prop with Split.io SDK setup
   * @see {@link https://help.split.io/hc/en-us/articles/360020448791#2-instantiate-the-sdk-and-create-a-new-split-client}
   * @property {IBrowserSettings} config
   */
  config: IBrowserSettings;

  /**
   * Called when an impression is evaluated.
   * This is a convince property that's idiomatic with React. The config option works as well.
   * @see {@link https://help.split.io/hc/en-us/articles/360020564931-Node-js-SDK#listener}
   * @property {Function} onImpression
   */
  onImpression?: SplitIO.IImpressionListener['logImpression'];

  /**
   * Children of our React Split Provider.
   * @property {React.ReactNode} children
   */
  children: React.ReactNode;
}

/**
 * Split Props interface. This is the interface that will be implemented requesting
 * users the split name and will provide a resolved treatment or list of treatment
 * @interface ISplitProps
 */
export interface ISplitProps {
  /**
   * Split name or list of splits
   * @property {string | string[]} split
   */
  name: string | string[];

  /**
   * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
   */
  attributes?: Attributes;

  /**
   * Returns a React Node element value, which will be (or eventually be) the component you want to show/hide
   * @function children
   * @param {TreatmentWithConfig | TreatmentsWithConfig} treatments - The treatment with config object with your treatment or list of treatments
   * @param {SplitIO.IClient} client - The split.io client instance
   * @param {number} lastUpdate - A number of milliseconds representing the last Split.io event update
   * @returns {React.ReactNode} Returns a React Node element
   */
  children: (
    treatments: TreatmentWithConfig | TreatmentsWithConfig | null,
    client: SplitIO.IClient | null,
    lastUpdate: number,
  ) => React.ReactNode;
}
