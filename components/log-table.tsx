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

export function LogTable({ filters }: LogTableProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const totalPages = Math.ceil(logs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = logs.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

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

  const handleApiNameClick = (log: LogEntry) => {
    setSelectedLog(log)
    setIsDetailModalOpen(true)
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedLog(null)
  }

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
        })
        if (res.ok) {
          const data = await res.json()
          setLogs(data.logs || [])
        } else {
          setLogs([])
        }
      } catch (err) {
        console.error(err)
        setLogs([])
      } finally {
        setIsLoading(false)
        setCurrentPage(1)
      }
    }
    fetchLogs()
  }, [filters])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          API 거래 로그 (전체 {logs.length}건 중 {currentLogs.length}건 표시)
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
            {startIndex + 1}-{Math.min(endIndex, logs.length)} / {logs.length}건
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    로딩 중...
                  </TableCell>
                </TableRow>
              ) : currentLogs.length === 0 ? (
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

