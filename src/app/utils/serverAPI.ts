import getProtocolHost from './getProtocolHost';

const apiRequest = async (path: string, next: { revalidate: number }) => {
  const { protocol, host } = await getProtocolHost();
  const response = await fetch(`${protocol}://${host}${path}`, {
    next,
  });
  return response.json();
};

const serverAPI = {
  async getProfile(userID: string) {
    return apiRequest(`/api/profile/${userID}`, { revalidate: 30 });
  },
  async getEventInfo(eventID: string) {
    return apiRequest(`/api/event/${eventID}`, { revalidate: 5 });
  },
  async getRating(userID: string) {
    return apiRequest(`/api/rating/${userID}`, { revalidate: 60 });
  },
};

export default serverAPI;
