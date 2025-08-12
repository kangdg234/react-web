"use client"

import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

interface DateTimeHelperProps {
  onSetDateTime: (field: "startDate" | "endDate", value: string) => void
}

export function DateTimeHelper({ onSetDateTime }: DateTimeHelperProps) {
  const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  }

  const getTodayStart = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}T00:00:00`
  }

  const getTodayEnd = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}T23:59:59`
  }

  const getYesterdayStart = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const year = yesterday.getFullYear()
    const month = String(yesterday.getMonth() + 1).padStart(2, "0")
    const day = String(yesterday.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}T00:00:00`
  }

  const getYesterdayEnd = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const year = yesterday.getFullYear()
    const month = String(yesterday.getMonth() + 1).padStart(2, "0")
    const day = String(yesterday.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}T23:59:59`
  }

  const getHoursAgo = (hours: number) => {
    const now = new Date()
    const hoursAgo = new Date(now.getTime() - hours * 60 * 60 * 1000)

    const year = hoursAgo.getFullYear()
    const month = String(hoursAgo.getMonth() + 1).padStart(2, "0")
    const day = String(hoursAgo.getDate()).padStart(2, "0")
    const hour = String(hoursAgo.getHours()).padStart(2, "0")
    const minute = String(hoursAgo.getMinutes()).padStart(2, "0")
    const second = String(hoursAgo.getSeconds()).padStart(2, "0")

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-600">빠른 설정:</div>
      <div className="flex flex-wrap gap-2">
        {/* 일 단위 */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onSetDateTime("startDate", getTodayStart())
            onSetDateTime("endDate", getTodayEnd())
          }}
          className="text-xs"
        >
          <Clock className="w-3 h-3 mr-1" />
          오늘
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onSetDateTime("startDate", getYesterdayStart())
            onSetDateTime("endDate", getYesterdayEnd())
          }}
          className="text-xs"
        >
          <Clock className="w-3 h-3 mr-1" />
          어제
        </Button>

        {/* 시간 단위 */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onSetDateTime("startDate", getHoursAgo(1))
            onSetDateTime("endDate", getCurrentDateTime())
          }}
          className="text-xs"
        >
          <Clock className="w-3 h-3 mr-1" />
          1시간
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onSetDateTime("startDate", getHoursAgo(2))
            onSetDateTime("endDate", getCurrentDateTime())
          }}
          className="text-xs"
        >
          <Clock className="w-3 h-3 mr-1" />
          2시간
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onSetDateTime("startDate", getHoursAgo(4))
            onSetDateTime("endDate", getCurrentDateTime())
          }}
          className="text-xs"
        >
          <Clock className="w-3 h-3 mr-1" />
          4시간
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onSetDateTime("startDate", getHoursAgo(12))
            onSetDateTime("endDate", getCurrentDateTime())
          }}
          className="text-xs"
        >
          <Clock className="w-3 h-3 mr-1" />
          12시간
        </Button>

        {/* 현재시간 */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onSetDateTime("endDate", getCurrentDateTime())
          }}
          className="text-xs"
        >
          <Clock className="w-3 h-3 mr-1" />
          현재시간
        </Button>
      </div>
    </div>
  )
}
