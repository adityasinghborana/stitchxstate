// src/app/api/meta-capi/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID; // Use NEXT_PUBLIC for consistency if used on client
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN;

// Basic validation for environment variables
if (!PIXEL_ID) {
  console.error("META_PIXEL_ID environment variable is not set.");
  // Consider throwing an error or handling this more gracefully in production
}
if (!ACCESS_TOKEN) {
  console.error("META_CAPI_TOKEN environment variable is not set.");
  // Consider throwing an error or handling this more gracefully in production
}

function sha256(data: string) {
  // Normalize and hash data for PII
  return crypto
    .createHash("sha256")
    .update(data.trim().toLowerCase())
    .digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Get cookies for _fbc and _fbp
    const cookies = req.headers.get("cookie");
    const fbc = cookies
      ? cookies
          .split("; ")
          .find((row) => row.startsWith("_fbc="))
          ?.split("=")[1]
      : null;
    const fbp = cookies
      ? cookies
          .split("; ")
          .find((row) => row.startsWith("_fbp="))
          ?.split("=")[1]
      : null;

    // Get IP address from the request
    // req.ip is a Next.js specific property when deployed, local might be undefined
    const ipAddress = req.headers.get("x-forwarded-for");

    // Construct user data object
    const userData: { [key: string]: string | string[] } = {};

    if (body.email) {
      userData.em = [sha256(body.email)];
    }
    if (body.phone) {
      userData.ph = [sha256(body.phone)];
    }
    if (fbc) {
      userData.fbc = fbc;
    }
    if (fbp) {
      userData.fbp = fbp;
    }
    if (ipAddress) {
      userData.client_ip_address = ipAddress;
    }
    if (req.headers.get("user-agent")) {
      userData.client_user_agent = req.headers.get("user-agent") as string;
    }
    // For more PII (like first_name, last_name, city, state, zip),
    // you would add them here and hash them if applicable.
    // e.g., if (body.firstName) userData.fn = [sha256(body.firstName)];

    // Event data structure
    const eventData = {
      event_name: body.event_name, // Should always be provided by the client (e.g., "AddToCart", "ViewContent", "Purchase")
      event_time: Math.floor(Date.now() / 1000), // Unix timestamp
      event_id: body.event_id, // Crucial for deduplication
      action_source: "website",
      user_data: userData,
      custom_data: {
        value: body.value,
        currency: body.currency || "INR", // Make currency dynamic, default to INR
        content_ids: body.content_ids,
        content_type: body.content_type || "product", // Make content_type dynamic, default to "product"
        // Add more custom_data as needed, e.g., num_items for Purchase events
        // num_items: body.num_items,
      },
      // You can also add context data if available (e.g., page_title, page_url)
      // context: {
      //   page: {
      //     page_title: body.page_title,
      //     page_url: body.page_url,
      //   },
      // },
    };

    // Validate essential data before sending to Meta
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return NextResponse.json(
        {
          error:
            "Server configuration error: Meta Pixel ID or Access Token missing.",
        },
        { status: 500 }
      );
    }
    if (
      !eventData.event_name ||
      !eventData.event_id ||
      !eventData.custom_data.value ||
      !eventData.custom_data.content_ids
    ) {
      return NextResponse.json(
        {
          error:
            "Missing essential event data (event_name, event_id, value, or content_ids).",
        },
        { status: 400 }
      );
    }

    const res = await axios.post(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      { data: [eventData] } // Meta CAPI expects an array of event objects
    );

    console.log("Meta CAPI response:", res.data);
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error(
      "Error sending event to Meta CAPI:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
