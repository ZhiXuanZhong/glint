const clientAPI = {
  async getProfile(userID: string) {
    const res = await fetch(`/api/profile/${userID}`);
    const data = await res.json();
    return data;
  },
};

export default clientAPI;
