"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Database } from "lucide-react"
import { LogDetailModal } from "./log-detail-modal"

interface LogEntry {
  id: string
  timestamp: string
  apiName: string
  gblId: string
  appName: string
  method: string
  statusCode: number
  responseTime: number
  requestSize: number
  responseSize: number
  // DB 스키마에 맞는 추가 필드들
  requestTime: string
  hostName: string
  requestBody: string
  responseBody: string
  remoteIp: string
  urlPattern: string
  routingUrl: string
  reasonCode: string
  latency: string
  errorCode?: string
  errorMsg?: string
}

interface SearchFilters {
  apiName: string
  gblId: string
  appName: string
  startDate: string
  endDate: string
}

interface LogTableProps {
  filters: SearchFilters
}

// Mock 데이터 - GBL_ID를 32자리로 변경
const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-08 14:30:25",
    apiName: "getUserInfo",
    gblId: "a1b2c3d4e5f6789012345678901234ab",
    appName: "MobileApp",
    method: "GET",
    statusCode: 200,
    responseTime: 120,
    requestSize: 256,
    responseSize: 1024,
    requestTime: "2024-01-08T14:30:25.123456",
    hostName: "api-server-01.company.com",
    requestBody: '{"userId": "user123", "fields": ["name", "email", "profile"]}',
    responseBody:
      '{"status": "success", "data": {"name": "홍길동", "email": "hong@example.com", "profile": {"age": 30, "city": "서울"}}}',
    remoteIp: "192.168.1.100",
    urlPattern: "/api/v1/user/{userId}",
    routingUrl: "http://internal-api:8080/user/user123",
    reasonCode: "SUCCESS",
    latency: "120ms",
  },
  {
    id: "2",
    timestamp: "2024-01-08 14:29:15",
    apiName: "updateProfile",
    gblId: "b2c3d4e5f6789012345678901234abc1",
    appName: "WebApp",
    method: "POST",
    statusCode: 201,
    responseTime: 340,
    requestSize: 512,
    responseSize: 256,
    requestTime: "2024-01-08T14:29:15.456789",
    hostName: "api-server-02.company.com",
    requestBody:
      '{"userId": "user456", "profile": {"name": "김철수", "phone": "010-1234-5678", "address": "부산시 해운대구"}}',
    responseBody:
      '{"status": "success", "message": "프로필이 성공적으로 업데이트되었습니다.", "updatedAt": "2024-01-08T14:29:15Z"}',
    remoteIp: "192.168.1.101",
    urlPattern: "/api/v1/profile/update",
    routingUrl: "http://internal-api:8080/profile/update",
    reasonCode: "SUCCESS",
    latency: "340ms",
  },
  {
    id: "3",
    timestamp: "2024-01-08 14:28:45",
    apiName: "deleteUser",
    gblId: "c3d4e5f6789012345678901234abc123",
    appName: "AdminPanel",
    method: "DELETE",
    statusCode: 404,
    responseTime: 89,
    requestSize: 128,
    responseSize: 64,
    requestTime: "2024-01-08T14:28:45.789012",
    hostName: "api-server-01.company.com",
    requestBody: '{"userId": "user789", "reason": "계정 삭제 요청"}',
    responseBody: '{"status": "error", "code": "USER_NOT_FOUND", "message": "해당 사용자를 찾을 수 없습니다."}',
    remoteIp: "192.168.1.102",
    urlPattern: "/api/v1/user/{userId}",
    routingUrl: "http://internal-api:8080/user/user789",
    reasonCode: "NOT_FOUND",
    latency: "89ms",
    errorCode: "USER_NOT_FOUND",
    errorMsg: "해당 사용자를 찾을 수 없습니다.",
  },
  {
    id: "4",
    timestamp: "2024-01-08 14:27:30",
    apiName: "getOrderList",
    gblId: "d4e5f6789012345678901234abc12345",
    appName: "MobileApp",
    method: "GET",
    statusCode: 500,
    responseTime: 2500,
    requestSize: 256,
    responseSize: 128,
    requestTime: "2024-01-08T14:27:30.345678",
    hostName: "api-server-03.company.com",
    requestBody: '{"userId": "user101", "page": 1, "limit": 20, "status": "active"}',
    responseBody:
      '{"status": "error", "code": "INTERNAL_SERVER_ERROR", "message": "데이터베이스 연결 오류가 발생했습니다."}',
    remoteIp: "192.168.1.103",
    urlPattern: "/api/v1/orders",
    routingUrl: "http://internal-api:8080/orders",
    reasonCode: "SERVER_ERROR",
    latency: "2500ms",
    errorCode: "DB_CONNECTION_ERROR",
    errorMsg: "데이터베이스 연결 오류가 발생했습니다.",
  },
  {
    id: "5",
    timestamp: "2024-01-08 14:26:10",
    apiName: "createOrder",
    gblId: "e5f6789012345678901234abc1234567",
    appName: "WebApp",
    method: "POST",
    statusCode: 200,
    responseTime: 450,
    requestSize: 1024,
    responseSize: 512,
    requestTime: "2024-01-08T14:26:10.678901",
    hostName: "api-server-02.company.com",
    requestBody:
      '{"userId": "user202", "items": [{"productId": "prod001", "quantity": 2, "price": 25000}], "shippingAddress": "서울시 강남구 테헤란로 123"}',
    responseBody:
      '{"status": "success", "orderId": "ORD20240108001", "totalAmount": 50000, "estimatedDelivery": "2024-01-10"}',
    remoteIp: "192.168.1.104",
    urlPattern: "/api/v1/orders/create",
    routingUrl: "http://internal-api:8080/orders/create",
    reasonCode: "SUCCESS",
    latency: "450ms",
  },
  // 추가 테스트 데이터
  ...Array.from({ length: 95 }, (_, i) => ({
    id: `${i + 6}`,
    timestamp: `2024-01-08 ${String(14 - Math.floor(i / 10)).padStart(2, "0")}:${String(25 - (i % 60)).padStart(2, "0")}:${String(10 + (i % 50)).padStart(2, "0")}`,
    apiName: `testAPI${i + 1}`,
    gblId: `f${i.toString(16).padStart(31, "0")}`,
    appName: i % 3 === 0 ? "MobileApp" : i % 3 === 1 ? "WebApp" : "AdminPanel",
    method: i % 4 === 0 ? "GET" : i % 4 === 1 ? "POST" : i % 4 === 2 ? "PUT" : "DELETE",
    statusCode: i % 10 === 0 ? 500 : i % 15 === 0 ? 404 : 200,
    responseTime: 100 + (i % 500),
    requestSize: 128 + (i % 1000),
    responseSize: 256 + (i % 2000),
    requestTime: `2024-01-08T${String(14 - Math.floor(i / 10)).padStart(2, "0")}:${String(25 - (i % 60)).padStart(2, "0")}:${String(10 + (i % 50)).padStart(2, "0")}.${String(i % 1000).padStart(3, "0")}456`,
    hostName: `api-server-${(i % 3) + 1}.company.com`,
    requestBody: `{"testData": "test${i + 1}", "id": ${i + 1}}`,
    responseBody: `{"status": "success", "result": "test${i + 1}"}`,
    remoteIp: `192.168.1.${100 + (i % 50)}`,
    urlPattern: `/api/v1/test${i + 1}`,
    routingUrl: `http://internal-api:8080/test${i + 1}`,
    reasonCode: "SUCCESS",
    latency: `${100 + (i % 500)}ms`,
  })),
]

export function LogTable({ filters }: LogTableProps) {
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleApiNameClick = (log: LogEntry) => {
    setSelectedLog(log)
    setIsDetailModalOpen(true)
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedLog(null)
  }

  useEffect(() => {
    let filtered = mockLogs

    if (filters.apiName) {
      filtered = filtered.filter((log) => log.apiName.toLowerCase().includes(filters.apiName.toLowerCase()))
    }

    if (filters.gblId) {
      filtered = filtered.filter((log) => log.gblId.toLowerCase().includes(filters.gblId.toLowerCase()))
    }

    if (filters.appName) {
      filtered = filtered.filter((log) => log.appName.toLowerCase().includes(filters.appName.toLowerCase()))
    }

    // 날짜 및 시간 범위 필터링
    if (filters.startDate) {
      filtered = filtered.filter((log) => {
        const logDateTime = new Date(log.requestTime).getTime()
        const startDateTime = new Date(filters.startDate).getTime()
        return logDateTime >= startDateTime
      })
    }

    if (filters.endDate) {
      filtered = filtered.filter((log) => {
        const logDateTime = new Date(log.requestTime).getTime()
        const endDateTime = new Date(filters.endDate).getTime()
        return logDateTime <= endDateTime
      })
    }

    // 기존 필터링 로직 후에 추가
    // 시간 내림차순으로 정렬 (최신 로그가 맨 위에)
    filtered = filtered.sort((a, b) => {
      const timeA = new Date(a.requestTime).getTime()
      const timeB = new Date(b.requestTime).getTime()
      return timeB - timeA // 내림차순 정렬
    })

    setFilteredLogs(filtered)
    setCurrentPage(1)
  }, [filters])

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = filteredLogs.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  // 페이지 번호 목록 생성
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          API 거래 로그 (전체 {filteredLogs.length}건 중 {currentLogs.length}건 표시)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">페이지당 표시:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-500">
            {startIndex + 1}-{Math.min(endIndex, filteredLogs.length)} / {filteredLogs.length}건
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>시간</TableHead>
                <TableHead>API명</TableHead>
                <TableHead>GBL_ID</TableHead>
                <TableHead>응답시간(ms)</TableHead>
                <TableHead>요청크기(B)</TableHead>
                <TableHead>응답크기(B)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                currentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                        onClick={() => handleApiNameClick(log)}
                      >
                        {log.apiName}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.gblId}</TableCell>
                    <TableCell className="text-right">{log.responseTime.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{log.requestSize.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{log.responseSize.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              처음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {getPageNumbers().map((pageNum) => (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className="min-w-[40px]"
              >
                {pageNum}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              마지막
            </Button>
          </div>
        )}

        {isDetailModalOpen && selectedLog && (
          <LogDetailModal log={selectedLog} isOpen={isDetailModalOpen} onClose={closeDetailModal} />
        )}
      </CardContent>
    </Card>
  )
}
