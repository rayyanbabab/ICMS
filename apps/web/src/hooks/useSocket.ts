import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

export function useSocket() {
  const { activeRole } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [incomingAlert, setIncomingAlert] = useState<any>(null);

  useEffect(() => {
    // Connect to WebSocket server on port 4000
    const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:4000' : '/';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 3,
      timeout: 5000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      // Join active role room
      if (activeRole) {
        socket.emit('join_role_room', activeRole);
      }
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('campus_notification', (data) => {
      setIncomingAlert(data);
    });

    socket.on('role_notification', (data) => {
      setIncomingAlert(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [activeRole]);

  return {
    socket: socketRef.current,
    isConnected,
    incomingAlert,
    clearAlert: () => setIncomingAlert(null),
  };
}

