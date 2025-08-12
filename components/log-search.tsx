"use client"

import type React from "react"
import { DateTimeHelper } from "./datetime-helper"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, RotateCcw } from "lucide-react"

interface SearchFilters {
  apiName: string
  gblId: string
  appName: string
  startDate: string
  endDate: string
}

interface LogSearchProps {
  onSearch: (filters: SearchFilters) => void
}

export function LogSearch({ onSearch }: LogSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    apiName: "",
    gblId: "",
    appName: "",
    startDate: "",
    endDate: "",
  })

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters = { apiName: "", gblId: "", appName: "", startDate: "", endDate: "" }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  // 엔터키 입력 시 검색 실행
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          로그 검색
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 첫 번째 행: API명, GBL_ID, App명 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apiName">API명</Label>
              <Input
                id="apiName"
                value={filters.apiName}
                onChange={(e) => handleInputChange("apiName", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="API명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gblId">GBL_ID</Label>
              <Input
                id="gblId"
                value={filters.gblId}
                onChange={(e) => handleInputChange("gblId", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="GBL_ID를 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appName">App명</Label>
              <Input
                id="appName"
                value={filters.appName}
                onChange={(e) => handleInputChange("appName", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="App명을 입력하세요"
              />
            </div>
          </div>

          {/* 두 번째 행: 시작날짜, 종료날짜 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">시작 날짜 및 시간</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={filters.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                step="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">종료 날짜 및 시간</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={filters.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                step="1"
              />
            </div>
          </div>

          {/* 날짜/시간 빠른 설정 버튼들 */}
          <DateTimeHelper onSetDateTime={handleInputChange} />
        </div>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            검색
          </Button>
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            초기화
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
