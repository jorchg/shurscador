const mapper = {
  getForumName: (forumId = 0) => {
    let forumName = '';
    switch(forumId) {
      case 2:
        forumName = 'general';
        break;
      default:
        forumName = '';
        break;
    }
    return forumName;
  },
};

export default mapper;
