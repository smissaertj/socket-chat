const getTime = () => {
  return new Date().getTime();
};

const generateMessage = ( username, text ) => {
  return {
    username,
    text,
    createdAt: getTime()
  };
};

const generateLocationMessage = ( username, coords ) => {
  return {
    username,
    url: `https://google.com/maps?q=${coords.lat},${coords.long}`,
    createdAt: getTime()
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage
};