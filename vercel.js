{
  "functions": {
    "api/**/*.js": {
      "runtime": "@vercel/node@18.15.0"
    },
    "functions/**/*.js": {
      "runtime": "@vercel/node@18.15.0"
    }
  },
  "rewrites": [
    {
      "source": "/events",
      "destination": "/api/events"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization, x-auth-token, x-auth-tenant"
        }
      ]
    }
  ]
}