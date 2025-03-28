"use client"

import * as React from "react"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
}

const Tabs = ({ defaultValue, children, ...props }: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  return (
    <div {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === TabsList) {
            return React.cloneElement(child, {
              activeTab,
              setActiveTab,
            })
          } else if (child.type === TabsContent) {
            return React.cloneElement(child, {
              activeTab,
              value: child.props.value,
            })
          }
          return child
        }
        return child
      })}
    </div>
  )
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab?: string
  setActiveTab?: (value: string) => void
}

const TabsList = ({ className, children, activeTab, setActiveTab, ...props }: TabsListProps) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          return React.cloneElement(child, {
            activeTab,
            setActiveTab,
          })
        }
        return child
      })}
    </div>
  )
}

interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  activeTab?: string
  setActiveTab?: (value: string) => void
}

const TabsTrigger = ({ className, value, activeTab, setActiveTab, children, ...props }: TabsTriggerProps) => {
  const isActive = activeTab === value

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground"
      } ${className}`}
      onClick={() => setActiveTab?.(value)}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  activeTab?: string
}

const TabsContent = ({ className, value, activeTab, children, ...props }: TabsContentProps) => {
  const isActive = activeTab === value

  if (!isActive) return null

  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

