# KYC Web Simulator

A comprehensive web application for simulating KYC (Know Your Customer) operations with real-time webhook notifications from Reis KYC system.

## Features

- **Authentication System** - Support for multiple tenants and secure login
- **Onboarding Simulation** - Both decentralized and centralized processes
- **Real-time Notifications** - Server-Sent Events for live webhook notifications
- **Webhook Integration** - Receives and processes screening results from Reis KYC
- **Modern UI** - Responsive design with notification system and system logs

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js with Vercel Serverless Functions
- **Real-time**: Server-Sent Events (SSE)
- **Deployment**: Vercel
- **External API**: GreatAML KYC services

## Project Structure

```
kyc-web-simulator/
├── api/
│   ├── events.js              # SSE endpoint for real-time notifications
│   └── webhook/
│       ├── alert.js           # General alert webhook handler
│       └── searchWebhook.js   # Reis KYC screening webhook handler
├── public/
│   ├── index.html             # Main application interface
│   ├── styles.css             # Application styling
│   ├── index.js               # Frontend JavaScript logic
│   └── logo.png               # Company logo
├── functions/
│   └── _middleware.js         # CORS middleware
├── package.json               # Dependencies and scripts
├── vercel.json                # Vercel deployment configuration
└── README.md                  # This file
```

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kyc-web-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```

4. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## Webhook Endpoints

- **Alert Webhook**: `/api/webhook/alert`
  - General purpose webhook for notifications
  
- **Search Webhook**: `/api/webhook/searchWebhook`
  - Specialized webhook for Reis KYC screening results
  - Processes screening data and broadcasts to connected clients

## Configuration

### Reis KYC Webhook Configuration
Configure your Reis KYC system to send webhooks to:
```
https://your-domain.vercel.app/api/webhook/searchWebhook
```

### Expected Webhook Payload
```json
{
  "systemId": "system_1756322983218_491",
  "sanctionDecision": "Former Sanctioned",
  "systemName": "T24",
  "ServiceType": "SCREENING",
  "customerId": "1076",
  "businessKey": "1076",
  "isAdverseMedia": true,
  "isPEP": false,
  "pepDecision": "Former PEP",
  "isSanctioned": true,
  "searchQueryId": 112064,
  "_hash": "SCREENING_hash_value"
}
```

## Real-time Features

The application includes:
- **Live connection status** indicator
- **System log** with real-time updates
- **Push notifications** for webhook events
- **Auto-reconnection** for SSE connections

## Development

### Local Development
```bash
npm run dev
```
This starts the Vercel development server at `http://localhost:3000`

### Environment Variables
No environment variables are required for basic functionality.

## API Endpoints

- `GET /events` - Server-Sent Events endpoint for real-time notifications
- `POST /api/webhook/alert` - General alert webhook
- `POST /api/webhook/searchWebhook` - Reis KYC screening webhook
- `GET /api/webhook/*` - Health check endpoints for webhooks

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - see LICENSE file for details