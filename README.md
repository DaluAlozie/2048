# 2048 Game 🎮

A browser-based implementation of the classic **2048 puzzle game**, built to demonstrate core JavaScript logic, state handling, and DOM manipulation.

The goal of the game is to slide numbered tiles on a grid to combine them and reach the **2048 tile**.

---

## 🎯 Features

- Classic 4×4 2048 gameplay
- Smooth tile movement and merging logic
- Score tracking
- Game-over detection
- Reset / restart functionality
- Responsive layout for different screen sizes

---

## 🧠 How the Game Works

- Players use **arrow keys** (or swipe gestures, if supported) to move tiles
- Tiles slide in the chosen direction until blocked
- Matching tiles merge into one and increase the score
- A new tile appears after each valid move
- The game ends when no valid moves remain

---

## 🧱 Tech Stack

This project focuses on **fundamental frontend skills**:

- **HTML** – game structure
- **CSS** – layout and styling
- **JavaScript** – game logic and state management

No external frameworks or libraries are used, keeping the implementation lightweight and easy to understand.

---

## 📁 Project Structure

```txt
2048/
├── index.html        # Game markup
├── style.css         # Game styles
├── script.js         # Core game logic
└── README.md
