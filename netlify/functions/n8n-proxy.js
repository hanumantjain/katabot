export async function handler(event, context) {
    const fetch = (await import("node-fetch")).default;
  
    // Use environment variable for n8n URL, fallback to localhost for development
    const N8N_URL = process.env.N8N_URL || "http://localhost:5678";
    console.log("N8N_URL:", N8N_URL); // Debug log
  
    try {
      // Forward request to n8n webhook
      // Extract the path after the function name
      const targetPath = event.path.replace('/.netlify/functions/n8n-proxy', '') || '/';
      console.log("Target path:", targetPath);
      const response = await fetch(`${N8N_URL}${targetPath}`, {
        method: event.httpMethod,
        headers: {
          "Content-Type": "application/json",
          ...event.headers,
        },
        body: ["POST", "PUT", "PATCH"].includes(event.httpMethod) ? event.body : undefined,
      });
  
      const data = await response.text();
  
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: data,
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }
  