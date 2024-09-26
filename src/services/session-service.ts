const sessionService = {
  getAuthToken: () => {
    const token = localStorage.getItem('token');
    return token;
  },
};

export default sessionService;
