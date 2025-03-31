# ♟️ Chess 0.1 ♞

## 🌎 Overview

This is a minimalist **real-time multiplayer chess game** built using **Node.js, Express, Socket.io, and Chess.js**. The game allows two players to join as **White** and **Black**, while additional users can join as **spectators**. The chess moves are validated and synchronized between all connected players and spectators.

## 🎯 Features

- **Real-time gameplay** using Socket.io.
- **Move validation** with Chess.js.
- **Spectator mode** (third player and beyond can watch the game).
- **Move history tracking** (displays all moves made in the game).
- **Simple and clean UI** using Tailwind CSS.

## 🔮 Future Updates (Planned for Chess 0.2+)

- **User authentication** (login and usernames for players).
- **Game timers** (countdown for each player like in professional chess matches).
- **Move highlights & legal move indicators.**
- **Game persistence** (store past games and allow replaying).
- **Elo ranking system** for competitive play.
- **Chat feature** to allow players and spectators to communicate.

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/stellalphatic/Chess_0.1.git
cd Chess_0.1
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Run the Server

```sh
node app.js
```

The server will start on **http://localhost:3000**.

## How to Play

1. **Open the homepage** and enter your username.
2. **Click "Play"** to join the game.
3. The first player is assigned **White**, the second **Black**.
4. Spectators can watch but not move pieces.
5. The game tracks move history and updates the board in real time.

## 💻 Technologies Used

- **Backend**: Node.js, Express.js, Socket.io
- **Game Logic**: Chess.js
- **Frontend**: HTML, CSS (Tailwind), JavaScript

## 🤝 Contribution

If you'd like to contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Added feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Open a **pull request**!

## 📜 License

This project is **open-source** and free to use. You are welcome to modify and improve it.

---

🚀 **Follow the repo for updates on future versions!**
