import { cn } from "@/lib/utils"
import { useRef, useEffect, type TextareaHTMLAttributes, KeyboardEvent } from "react"

export interface AutoResizeTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
  value: string
  onChange: (value: string) => void
  onEnter?: () => void
}

export function AutoResizeTextarea({ className, value, onChange, onEnter, ...props }: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "36px"
    }
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea && value) {
      textarea.style.height = "36px"
      textarea.style.height = `${Math.max(textarea.scrollHeight, 36)}px`
    } else if (textarea) {
      textarea.style.height = "36px"
    }
  }, [value])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault()
      onEnter?.()
    }
  }

  return (
    <textarea
      {...props}
      value={value}
      ref={textareaRef}
      rows={1}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        "resize-none overflow-hidden min-h-[36px]",
        "placeholder:text-muted-foreground focus-visible:outline-none",
        className
      )}
      style={{ height: "36px" }}
    />
  )
}
