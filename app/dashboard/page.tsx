"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogSearch } from "@/components/log-search"
import { LogTable } from "@/components/log-table"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    apiName: "",
    gblId: "",
    appName: "",
    startDate: "",
    endDate: "",
  })
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  if (!isAuthenticated) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">API 거래 로그 관리 시스템</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <LogSearch onSearch={setSearchFilters} />
          <LogTable filters={searchFilters} />
        </div>
      </main>

      <ScrollToTop />
    </div>
  )
}
