import getProtocolHost from "./getProtocolHost";

const api = {
    async getProfile(userID: string) {
        const { protocol, host } = await getProtocolHost()
        const response = await fetch(`${protocol}://${host}/api/profile/${userID}`, { next: { revalidate: 5 } });
        return response.json();
    },
}

export default api