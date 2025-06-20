import { NextRequest } from "next/server";

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL!.replace(
  ".cloud",
  ".site"
);

async function handleRequest(req: NextRequest) {
  const url = new URL(req.url);
  
  // Extract the path after /api/auth/
  const pathSegments = url.pathname.split('/api/auth/').pop() || '';
  
  // Build the Convex URL - auth routes are at the root level
  const convexUrl = new URL(CONVEX_SITE_URL);
  convexUrl.pathname = `/${pathSegments}`;
  
  // Copy search params
  url.searchParams.forEach((value, key) => {
    convexUrl.searchParams.append(key, value);
  });

  console.log('Proxying auth request:', {
    from: url.pathname,
    to: convexUrl.toString(),
    method: req.method
  });

  const headers = new Headers();
  
  // Copy relevant headers
  const headersToForward = [
    'content-type',
    'authorization',
    'cookie',
    'user-agent',
    'accept',
    'accept-language',
    'referer',
    'origin'
  ];
  
  headersToForward.forEach(header => {
    const value = req.headers.get(header);
    if (value) {
      headers.set(header, value);
    }
  });

  // Set the correct host
  headers.set('Host', convexUrl.host);
  
  // For POST requests, we need to read the body
  let body = undefined;
  if (req.method === 'POST') {
    try {
      body = await req.text();
    } catch (e) {
      console.error('Error reading request body:', e);
    }
  }

  try {
    const response = await fetch(convexUrl.toString(), {
      method: req.method,
      headers,
      body,
      redirect: 'manual' // Don't follow redirects automatically
    });

    console.log('Convex response:', {
      status: response.status,
      statusText: response.statusText
    });

    // Create a new response with the same status and headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Skip some headers that shouldn't be forwarded
      if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error proxying auth request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest; 