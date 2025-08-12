"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Server, Globe, Clock, Code, FileText, Copy } from "lucide-react"

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

interface LogDetailModalProps {
  log: LogEntry
  isOpen: boolean
  onClose: () => void
}

export function LogDetailModal({ log, isOpen, onClose }: LogDetailModalProps) {
  const [requestCopied, setRequestCopied] = useState(false)
  const [responseCopied, setResponseCopied] = useState(false)

  const formatJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return jsonString
    }
  }

  const copyToClipboard = async (text: string, type: "request" | "response") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "request") {
        setRequestCopied(true)
        setTimeout(() => setRequestCopied(false), 2000)
      } else {
        setResponseCopied(true)
        setTimeout(() => setResponseCopied(false), 2000)
      }
    } catch (err) {
      console.error("복사 실패:", err)
    }
  }

  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return (
        <Badge variant="default" className="bg-green-500">
          성공 ({statusCode})
        </Badge>
      )
    } else if (statusCode >= 400 && statusCode < 500) {
      return <Badge variant="destructive">클라이언트 오류 ({statusCode})</Badge>
    } else if (statusCode >= 500) {
      return <Badge variant="destructive">서버 오류 ({statusCode})</Badge>
    }
    return <Badge variant="secondary">{statusCode}</Badge>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[98vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            API 상세 정보: {log.apiName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(98vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">API명</label>
                    <p className="font-mono text-sm mt-1">{log.apiName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">GBL_ID</label>
                    <p className="font-mono text-sm mt-1 break-all">{log.gblId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      요청 시간
                    </label>
                    <p className="font-mono text-sm mt-1">{log.requestTime}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Server className="w-3 h-3" />
                      호스트명
                    </label>
                    <p className="font-mono text-sm mt-1 break-all">{log.hostName}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">HTTP 메소드</label>
                    <div className="mt-1">
                      <Badge variant="outline">{log.method}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">상태 코드</label>
                    <div className="mt-1">{getStatusBadge(log.statusCode)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      응답 시간
                    </label>
                    <p className="font-mono text-sm mt-1">{log.latency}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">원격 IP</label>
                    <p className="font-mono text-sm mt-1">{log.remoteIp}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">URL 패턴</label>
                    <p className="font-mono text-sm mt-1 bg-gray-50 p-2 rounded break-all">{log.urlPattern}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">라우팅 URL</label>
                    <p className="font-mono text-sm mt-1 bg-gray-50 p-2 rounded break-all">{log.routingUrl}</p>
                  </div>
                </div>

                {(log.errorCode || log.errorMsg) && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      {log.errorCode && (
                        <div>
                          <label className="text-sm font-medium text-red-600">에러 코드</label>
                          <p className="font-mono text-sm mt-1 text-red-600">{log.errorCode}</p>
                        </div>
                      )}
                      {log.errorMsg && (
                        <div>
                          <label className="text-sm font-medium text-red-600">에러 메시지</label>
                          <p className="text-sm mt-1 text-red-600">{log.errorMsg}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Request Body */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Request Body
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(log.requestBody, "request")}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {requestCopied ? "복사됨!" : "복사"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{formatJson(log.requestBody)}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Response Body */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Response Body
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(log.responseBody, "response")}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {responseCopied ? "복사됨!" : "복사"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{formatJson(log.responseBody)}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
