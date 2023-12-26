import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: '武夷学院课程表日历文件(.ics)生成 - 课程表日历',
  description: '将武夷学院课程表制作为日历文件(.ics)，在诸如 Apple 日历、华为日历、小米日历、Google Calendar 的日历 app 中导入使用，不仅可清晰的了解课程安排，更可体验 iOS、Android 系统为日历提供的各种功能：计划出行时间、日程提醒、如 Siri 与 Google Assistant 等智能语音助理自动化服务等',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
