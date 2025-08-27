// api/webhook/searchWebhook.js
import { broadcast } from '../events.js';

let requestLog = [];

export default async function handler(req, res) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    headers: req.headers,
    url: req.url,
    method: req.method
  };
  
  requestLog.push(logEntry);
  console.log(`[${timestamp}] Search Webhook ${req.method} received - Total requests: ${requestLog.length}`);
  
  // Keep only last 100 requests
  if (requestLog.length > 100) {
    requestLog = requestLog.slice(-100);
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'healthy',
      endpoint: 'Reis KYC Webhook',
      totalWebhooksReceived: requestLog.filter(r => r.method === 'POST').length,
      lastRequests: requestLog.slice(-5),
      message: 'Reis KYC webhook endpoint operational',
      expectedFormat: {
        customerId: 'string (required)',
        searchQueryId: 'integer (required)',
        systemId: 'string (required)',
        systemName: 'string (required)',
        ServiceType: 'string (required)',
        businessKey: 'string (required)',
        isPEP: 'boolean',
        isSanctioned: 'boolean',
        isAdverseMedia: 'boolean',
        pepDecision: 'string (optional)',
        sanctionDecision: 'string (optional)',
        _hash: 'string (optional)'
      }
    });
  }

  if (req.method === 'POST') {
    try {
      const payload = req.body;
      console.log(`[${timestamp}] Parsed Reis KYC webhook payload:`, JSON.stringify(payload, null, 2));

      // Transform screening payload to your app's notification format
      const notification = {
        customerId: payload.customerId,
        businessKey: payload.businessKey,
        message: `${payload.ServiceType} completed - Customer ${payload.customerId}`,
        search_query_id: payload.searchQueryId,
        systemId: payload.systemId,
        systemName: payload.systemName,
        serviceType: payload.ServiceType,
        // Risk indicators
        isPEP: payload.isPEP,
        isSanctioned: payload.isSanctioned,
        isAdverseMedia: payload.isAdverseMedia,
        pepDecision: payload.pepDecision,
        sanctionDecision: payload.sanctionDecision,
        // Metadata
        timestamp: timestamp,
        source: 'Reis_KYC',
        hash: payload._hash,
        originalData: payload
      };

      console.log(`[${timestamp}] Broadcasting notification:`, JSON.stringify(notification, null, 2));
      
      // Broadcast the notification
      broadcast(notification);
      
      return res.status(200).json({
        status: 'success',
        message: 'Reis KYC webhook received and processed',
        searchQueryId: payload.searchQueryId,
        receivedAt: timestamp
      });

    } catch (error) {
      console.error(`[${timestamp}] Reis KYC webhook processing error:`, error);
      return res.status(500).json({
        status: 'error',
        message: 'Processing failed',
        details: error.message
      });
    }
  }

  // Method not allowed
  res.status(405).json({ message: 'Method not allowed' });
}