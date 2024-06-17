const { Server: IoServer } = require("socket.io");

let io;

module.exports = {
  init: (server) => {
    io = new IoServer(server, {
      cors: {
        origin: "http://localhost:3000",
      },
    });
    return io
  },
  getIO : ()=>{
    if(!io){
       throw new Error('Socket io not initialized!') 
    }
    return io
  }
};
