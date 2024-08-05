// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // The secret should be the same as the one used in [...nextauth].ts
  const secret = process.env.NEXTAUTH_SECRET;

  // Check if the user has a valid JWT token
  const token = await getToken({ req, secret });

  // Define the protected routes
  const protectedRoutes = ["/dashboard"];

  // If the user is not authenticated and tries to access a protected route, redirect to the sign-in page
  if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
    const url = new URL("/", req.url); // Redirect to the sign-in page
    url.searchParams.set("callbackUrl", req.url); // Optionally, keep track of where the user was trying to go
    return NextResponse.redirect(url);
  }

  // Allow the request to continue if the user is authenticated or the route is not protected
  return NextResponse.next();
}

// Define the config to specify which paths to run the middleware on
export const config = {
  matcher: "/dashboard/:path*", // Apply the middleware to all /dashboard routes
};
