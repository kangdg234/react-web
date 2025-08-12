import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">API 로그 관리 시스템</h2>
          <p className="mt-2 text-sm text-gray-600">관리자 계정으로 로그인하세요</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
