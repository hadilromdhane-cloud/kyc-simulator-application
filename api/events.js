// api/events.js
let clients = [];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('SSE connection requested');
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Create client object
  const client = { 
    res, 
    active: true,
    id: Date.now() + Math.random()
  };
  clients.push(client);
  console.log(`Client connected. Total clients: ${clients.length}`);
  
  // Send welcome message
  const welcomeMessage = {
    type: 'connection',
    message: 'Connected to real-time notifications',
    timestamp: new Date().toISOString()
  };
  
  res.write(`data: ${JSON.stringify(welcomeMessage)}\n\n`);
  
  // Keep-alive every 30 seconds
  const keepAlive = setInterval(() => {
    if (!client.active) {
      clearInterval(keepAlive);
      return;
    }
    try {
      res.write(`: heartbeat\n\n`);
    } catch (error) {
      console.log('Client disconnected during heartbeat');
      client.active = false;
      clearInterval(keepAlive);
      removeClient(client);
    }
  }, 30000);
  
  // Handle client disconnect
  req.on('close', () => {
    console.log('Client disconnected');
    client.active = false;
    clearInterval(keepAlive);
    removeClient(client);
    console.log(`Client disconnected. Remaining clients: ${clients.length}`);
  });

  req.on('end', () => {
    client.active = false;
    clearInterval(keepAlive);
    removeClient(client);
  });
}

// Helper function to remove client from list
function removeClient(client) {
  const index = clients.findIndex(c => c.id === client.id);
  if (index > -1) {
    clients.splice(index, 1);
  }
}

// Broadcast function for sending messages to all connected clients
export function broadcast(payload) {
  console.log(`Broadcasting to ${clients.length} clients:`, JSON.stringify(payload));
  
  if (clients.length === 0) {
    console.log('No clients to broadcast to');
    return;
  }

  const message = `data: ${JSON.stringify({
    ...payload,
    broadcastTimestamp: new Date().toISOString()
  })}\n\n`;
  
  // Send to all active clients
  clients = clients.filter(client => {
    if (!client.active) return false;
    
    try {
      client.res.write(message);
      return true;
    } catch (error) {
      console.error('Failed to send to client:', error);
      client.active = false;
      return false;
    }
  });
  
  console.log(`Broadcast completed. Active clients: ${clients.length}`);
}