
# Real-time Drawing Board

This is a real-time collaborative drawing board application built with Next.js and Socket.IO. Users can draw on a shared canvas, and their drawings will be broadcasted in real-time to other connected users.

## Features

- Real-time drawing synchronization across multiple clients.
- Adjustable brush color and size.
- Responsive design that adjusts the canvas size based on the window size.

## Project Structure

```
.
├── app
│   └── page.js        # Main React component for the drawing board
├── public             # Public assets
├── server.js          # Express server with Socket.IO for real-time communication
├── next.config.js     # Next.js configuration file
└── package.json       # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js
- npm (Node package manager) or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/real-time-drawing-board.git
cd real-time-drawing-board
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

### Running the Application

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Select a color and adjust the brush size using the controls at the top of the canvas.
- Click and drag on the canvas to draw.
- Your drawings will be broadcasted to other connected users in real-time.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for server-side rendering
- [Socket.IO](https://socket.io/) - Real-time, bidirectional communication
- [Express](https://expressjs.com/) - Web framework for Node.js
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Code Overview

### Frontend (`app/page.js`)

- Uses React hooks (`useEffect`, `useRef`, `useState`) to manage state and lifecycle events.
- Initializes Socket.IO client and sets up event listeners for drawing events.
- Handles drawing logic and canvas resizing.

### Backend (`server.js`)

- Sets up an Express server and integrates Socket.IO for real-time communication.
- Manages the drawing state and broadcasts drawing events to all connected clients.

### Configuration (`next.config.js`)

- Configures Next.js for strict mode.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.