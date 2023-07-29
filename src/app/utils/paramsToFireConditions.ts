import { where, QueryFieldFilterConstraint } from 'firebase/firestore';

const paramsToFireConditions = (queryParams: QueryParams) => {
  const queryConditions: QueryFieldFilterConstraint[] = [];
  Object.keys(queryParams).reduce((acc: QueryConditions[], key: string) => {
    const value = queryParams[key];
    if (value && value !== 'null' && value !== 'all') {
      let operator: QueryConditions['operator'];
      switch (key) {
        case 'locations':
          operator = 'array-contains';
          break;

        case 'startTime':
          operator = '>=';
          break;

        case 'endTime':
          queryConditions.push(where('startTime', '<=', value));
          return acc;

        default:
          operator = '==';
          break;
      }

      acc.push({
        property: key,
        operator: operator,
        value: value,
      });

      queryConditions.push(where(key, operator, value));
    }
    return acc;
  }, []);
  return queryConditions;
};

export default paramsToFireConditions;
