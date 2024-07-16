'use client'

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

let socket;

export default function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  function clearCanvas() {
    // Emit 'clearCanvas' event to the server
    socket.emit('clearCanvas');
  
    // Local canvas clearing logic
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Optionally, reset other states like color and lineWidth if needed
    setColor('#000000'); // Default color
    setLineWidth(2); // Default line width
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const socketInitializer = async () => {
      socket = io();

      socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        socket.emit('getDrawingState');
      });

      socket.on('drawingState', (state) => {
        console.log('Received drawing state');
        state.forEach(action => drawLine(action, false));
      });

      socket.on('draw', (data) => {
        console.log('Received draw event');
        drawLine(data, false);
      });

      socket.on('clearCanvas', () => {
        console.log('Received clearCanvas command');
        clearCanvas(); // Call the clearCanvas function defined above
      });
    };

    socketInitializer();

    function drawLine(data, emit = true) {
      context.beginPath();
      context.moveTo(data.x0 * canvas.width, data.y0 * canvas.height);
      context.lineTo(data.x1 * canvas.width, data.y1 * canvas.height);
      context.strokeStyle = data.color;
      context.lineWidth = data.lineWidth;
      context.stroke();

      if (emit) {
        socket.emit('draw', data);
      }
    }

    function startDrawing(e) {
      setIsDrawing(true);
      draw(e);
    }

    function stopDrawing() {
      setIsDrawing(false);
      context.beginPath();
    }

    function draw(e) {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / canvas.width;
      const y = (e.clientY - rect.top) / canvas.height;

      const data = {
        x0: x,
        y0: y,
        x1: x + e.movementX / canvas.width,
        y1: y + e.movementY / canvas.height,
        color: color,
        lineWidth: lineWidth,
      };

      drawLine(data);
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function setSize() {
      const container = canvas.parentElement;
      const newWidth = container.clientWidth - 40;
      const newHeight = Math.min(window.innerHeight * 0.6, newWidth * 0.75);
      setCanvasSize({ width: newWidth, height: newHeight });
    }

    setSize();
    window.addEventListener('resize', setSize);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      window.removeEventListener('resize', setSize);
      if (socket) socket.disconnect();
    };
  }, [isDrawing, color, lineWidth]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-4xl font-bold mb-5 text-center text-gray-800">Real-time Drawing Board</h1>
          <div className="mb-4 flex justify-center space-x-4">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-10 border-0 cursor-pointer"
            />
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-40"
            />
          </div>
          <div className="w-full flex justify-center">
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="border-2 border-gray-300 rounded-lg shadow-md"
            />
          </div>
          <div className="w-full flex justify-end p-4">
            <button onClick={clearCanvas} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Clear White Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}