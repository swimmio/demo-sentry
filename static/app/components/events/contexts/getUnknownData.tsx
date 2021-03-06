import startCase from 'lodash/startCase';

import {getMeta} from 'sentry/components/events/meta/metaProxy';
import {KeyValueListData} from 'sentry/types';

function getUnknownData(
  allData: Record<string, any>,
  knownKeys: string[]
): KeyValueListData {
  return Object.entries(allData)
    .filter(([key]) => key !== 'type' && key !== 'title')
    .filter(([key]) => !knownKeys.includes(key))
    .map(([key, value]) => ({
      key,
      value,
      subject: startCase(key),
      meta: getMeta(allData, key),
    }));
}

export default getUnknownData;
