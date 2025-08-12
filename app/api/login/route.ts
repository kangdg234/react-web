import { NextResponse } from "next/server"

// Simple login API route
// Accepts POST with JSON body { username, password }
// Returns 200 on success for admin/admin123, otherwise 401
export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (username === "admin" && password === "admin123") {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}
