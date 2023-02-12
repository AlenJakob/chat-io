const server = require("http").createServer();
const io = require("socket.io")(server, {
	transports: ["websocket", "polling"],
});

const users = {};
const PORT = 3000;

io.on("connection", (client) => {
	client.on("username", (username) => {
		const user = {
			name: username,
			id: client.id,
		};
		console.log(username, 'username')
		users[client.id] = user;
		io.emit("connected", user);
		io.emit("set_users", Object.values(users));
	});

	client.on("send_message", (message) => {
		const messageInfo = {
			// build message object
			text: message,
			date: new Date().toISOString(),
			user: users[client.id],
		};
		io.emit("show_message", messageInfo); // emit message event with data
	});

	client.on("disconnect", () => {
		const username = users[client.id]; // set current user - disconnect event
		delete users[client.id]; // remove from users Object
		io.emit("disconnected", client.id);
	});
});

server.listen(PORT, () => {
	console.log(`Server listen on PORT: ${PORT}`);
});
