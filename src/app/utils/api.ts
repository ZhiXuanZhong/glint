import getProtocolHost from './getProtocolHost';

const api = {
  async getProfile(userID: string) {
    const { protocol, host } = await getProtocolHost();
    const response = await fetch(`${protocol}://${host}/api/profile/${userID}`, {
      next: { revalidate: 30 },
    });
    return response.json();
  },
  async getEventInfo(eventID: string) {
    const { protocol, host } = await getProtocolHost();
    const response = await fetch(`${protocol}://${host}/api/event/${eventID}`, {
      next: { revalidate: 5 },
    });
    return response.json();
  },
  async getRating(userID: string) {
    const { protocol, host } = await getProtocolHost();
    const response = await fetch(`${protocol}://${host}/api/rating/${userID}`, {
      next: { revalidate: 60 },
    });
    return response.json();
  },
};

export default api;
