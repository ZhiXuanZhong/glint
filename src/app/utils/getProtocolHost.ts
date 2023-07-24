import { headers } from 'next/headers';

const getProtocolHost = async () => {
  const headersData = headers();
  const protocol = headersData.get('x-forwarded-proto');
  const host = headersData.get('host');

  return { protocol, host };
};

export default getProtocolHost;
