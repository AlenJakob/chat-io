import io from "socket.io-client";

import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import React from "react";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import moment from "moment";

// const username = prompt("what is your username");

const socket = io("http://localhost:3000", {
	transports: ["websocket", "polling"],
});

const App = ({}) => {
	const [users, setUsers] = useState([]);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);

	const [userName, setUserName] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		socket.on("connect", () => {
			// socket.emit("username", username);
			console.log("client connected..");
		});

		socket.on("set_users", (users) => {
			setUsers(users);
		});

		socket.on("show_message", (message) => {
			setMessages((messages) => [...messages, message]);
		});

		socket.on("connected", (user) => {
			setUsers((users) => [...users, user]);
		});

		socket.on("disconnected", (id) => {
			setUsers((users) => {
				return users.filter((user) => user.id !== id);
			});
		});

		socket.on("hello_world", (message) => {
			setHello(message);
		});
	}, []);

	const submit = (event) => {
		event.preventDefault();
		socket.emit("send_message", message);
		setMessage(""); // reset message
		// client-side
	};

	const updateName = (event) => {
		const userName = event.target.value;
		setUserName(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Submit");

		if (userName.length >= 4) {
			setIsLoggedIn(true);
			socket.emit("username", userName);
		}
	};
	return (
		<div className="container">
			{!isLoggedIn && (
				<div className="row">
					<form onSubmit={handleSubmit}>
						<input onChange={updateName} type="text"></input>
					</form>
					<div className="col-md-12 mt-4 mb-4">
						<h6>Hello {userName}</h6>
					</div>
				</div>
			)}
			{isLoggedIn && (
				<div className="row">
					<div className="col-md-8">
						<h6>Messages</h6>
						<div id="messages">
							{messages.map(({ user, date, text }, index) => (
								<div key={index} className="row mb-2">
									<div className="col-md-3">
										{moment(date).format("h:mm:ss a")}
									</div>
									<div className="col-md-2">{user.name}</div>
									<div className="col-md-2">{text}</div>
								</div>
							))}
						</div>
						<form onSubmit={submit} id="form">
							<div className="input-group">
								<input
									type="text"
									className="form-control"
									onChange={(e) =>
										setMessage(e.currentTarget.value)
									}
									value={message}
									id="text"
								/>
								<span className="input-group-btn">
									<button
										id="submit"
										type="submit"
										className="btn btn-primary"
									>
										Send
									</button>
								</span>
							</div>
						</form>
					</div>
					<div className="col-md-4">
						<h6>Users</h6>
						<ul id="users">
							{users.map(({ name, id }) => (
								<li key={id}>{name}</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
