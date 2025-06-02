import { cn } from "@/lib/utils"
import { useRef, useEffect, type TextareaHTMLAttributes } from "react"

export interface AutoResizeTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
  value: string
  onChange: (value: string) => void
}

export function AutoResizeTextarea({ className, value, onChange, ...props }: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "24px"
    }
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea && value) {
      textarea.style.height = "24px"
      textarea.style.height = `${Math.max(textarea.scrollHeight, 24)}px`
    } else if (textarea) {
      textarea.style.height = "24px"
    }
  }, [value])

  return (
    <textarea
      {...props}
      value={value}
      ref={textareaRef}
      rows={1}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      className={cn("resize-none overflow-hidden", className)}
      style={{ height: "24px" }}
    />
  )
}
