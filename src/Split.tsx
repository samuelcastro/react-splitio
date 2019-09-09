import { useContext } from 'react';
import { defaultTreatment, SplitContext } from './SplitProvider';
import { ISplitProps } from './types';

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
const Split = ({ name, children, attributes }: ISplitProps) => {
  const { client, isReady, lastUpdate } = useContext(SplitContext);
  return children(
    client && isReady
      ? name instanceof Array
        ? client.getTreatmentsWithConfig(name as string[], attributes)
        : client.getTreatmentWithConfig(name as string, attributes)
      : defaultTreatment,
    client,
    lastUpdate,
  );
};

Split.defaultProps = {
  attributes: null,
  name: '',
};

export default Split;
