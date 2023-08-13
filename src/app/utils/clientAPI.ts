const clientAPI = {
  async getProfile(userID: string) {
    const res = await fetch(`/api/profile/${userID}`);
    const data = await res.json();
    return data;
  },
  async getEvent(eventID: string) {
    const res = await fetch(`/api/event/${eventID}`);
    const data = await res.json();
    return data.data;
  },
};

export default clientAPI;
