import React from 'react';
import { SplitContext } from './SplitProvider';
import { ISplitContextValues, ISplitProps } from './types';

/**
 * Component that will receive a split prop, connect on SplitContext and return treatment when SDK is ready.
 * @param props
 *
 * @example
 *
 * <Split name={'my-split'}>
 *   {(value: TreatmentWithConfig) => value.treatment === 'on' ? this.renderComponent() : null}
 * </Split>
 */
const Split: React.SFC<ISplitProps> = ({ split, children }) => (
  <SplitContext.Consumer>
    {({ client, isReady, lastUpdate }: ISplitContextValues) =>
      children(
        isReady
          ? split instanceof Array
            ? client.getTreatmentsWithConfig(split as string[])
            : client.getTreatmentWithConfig(split as string)
          : null,
        client,
        lastUpdate,
      )
    }
  </SplitContext.Consumer>
);

export default Split;
