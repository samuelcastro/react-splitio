import { Attributes } from '@splitsoftware/splitio/types/splitio';
import { useContext, useEffect, useState } from 'react';
import { defaultTreatment, SplitContext } from './SplitProvider';

/**
 * Returns a treatment and it's config.
 * @param {string} splitName - The string that represents the split we want to get the treatment.
 * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
 * @returns {[string, string | null]} Tuple with treatment first and config second.
 */
export const useSplit = (
  splitName: string,
  attributes?: Attributes,
): [string, string | null] => {
  const { client, isReady, lastUpdate } = useContext(SplitContext);
  const [{ treatment, config }, setTreatment] = useState(defaultTreatment);
  useEffect(() => {
    const next =
      client && isReady
        ? client.getTreatmentWithConfig(splitName, attributes)
        : defaultTreatment;
    setTreatment(next);
  }, [client, isReady, lastUpdate]);
  return [treatment, config];
};
