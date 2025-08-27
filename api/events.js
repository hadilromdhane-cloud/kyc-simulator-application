// api/events.js - Polling-based solution for Vercel
let eventQueue = [];
let lastEventId = 0;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { lastId } = req.query;
  const clientLastId = parseInt(lastId) || 0;

  console.log(`Polling request - Client last ID: ${clientLastId}, Server last ID: ${lastEventId}`);

  // Get events newer than client's last received ID
  const newEvents = eventQueue.filter(event => event.id > clientLastId);

  // Clean old events (keep only last 50)
  if (eventQueue.length > 50) {
    eventQueue = eventQueue.slice(-50);
  }

  return res.status(200).json({
    events: newEvents,
    lastEventId: lastEventId,
    timestamp: new Date().toISOString()
  });
}

// Function to add events to the queue
export function addEvent(eventData) {
  lastEventId++;
  const event = {
    id: lastEventId,
    timestamp: new Date().toISOString(),
    ...eventData
  };
  
  eventQueue.push(event);
  console.log(`Event added to queue (ID: ${lastEventId}):`, JSON.stringify(eventData));
  
  return event;
}

// Broadcast function (same interface as before)
export function broadcast(payload) {
  console.log(`Broadcasting event:`, JSON.stringify(payload));
  return addEvent({
    ...payload,
    broadcastTimestamp: new Date().toISOString()
  });
}