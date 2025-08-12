import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

// Fetch transaction logs from MySQL using optional search filters
export async function POST(request: Request) {
  const filters = await request.json()
  let query =
    "SELECT id, timestamp, api_name AS apiName, gbl_id AS gblId, app_name AS appName, method, status_code AS statusCode, response_time AS responseTime, request_size AS requestSize, response_size AS responseSize, request_time AS requestTime, host_name AS hostName, request_body AS requestBody, response_body AS responseBody, remote_ip AS remoteIp, url_pattern AS urlPattern, routing_url AS routingUrl, reason_code AS reasonCode, latency, error_code AS errorCode, error_msg AS errorMsg FROM transactions WHERE 1=1"
  const params: any[] = []

  if (filters.apiName) {
    query += " AND api_name = ?"
    params.push(filters.apiName)
  }
  if (filters.gblId) {
    query += " AND gbl_id = ?"
    params.push(filters.gblId)
  }
  if (filters.appName) {
    query += " AND app_name = ?"
    params.push(filters.appName)
  }
  if (filters.startDate) {
    query += " AND timestamp >= ?"
    params.push(filters.startDate)
  }
  if (filters.endDate) {
    query += " AND timestamp <= ?"
    params.push(filters.endDate)
  }

  query += " ORDER BY timestamp DESC LIMIT 1000"

  try {
    const [rows] = await pool.query(query, params)
    return NextResponse.json({ logs: rows })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
