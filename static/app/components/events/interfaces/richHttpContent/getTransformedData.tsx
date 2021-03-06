import {defined} from 'sentry/utils';

function getTransformedData(data: any): [string, string][] {
  if (Array.isArray(data)) {
    return data
      .filter(dataValue => {
        if (typeof dataValue === 'string') {
          return !!dataValue;
        }
        return defined(dataValue);
      })
      .map(dataValue => {
        if (Array.isArray(dataValue)) {
          return dataValue;
        }
        if (typeof data === 'object') {
          return Object.keys(dataValue).flatMap(key => [key, dataValue[key]]);
        }
        return dataValue;
      });
  }

  if (typeof data === 'object') {
    return Object.keys(data).map(key => [key, data[key]]);
  }

  return [];
}

export default getTransformedData;
