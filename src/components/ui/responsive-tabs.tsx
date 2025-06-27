
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"

interface ResponsiveTabsProps {
  defaultValue: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface ResponsiveTabsListProps {
  children: React.ReactNode
  className?: string
}

interface ResponsiveTabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  badge?: number
}

interface ResponsiveTabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const ResponsiveTabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({
  value: "",
  onValueChange: () => {},
})

const ResponsiveTabs = ({ defaultValue, onValueChange, children, className }: ResponsiveTabsProps) => {
  const [value, setValue] = React.useState(defaultValue)
  
  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <ResponsiveTabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </ResponsiveTabsContext.Provider>
  )
}

const ResponsiveTabsList = ({ children, className }: ResponsiveTabsListProps) => {
  const isMobile = useIsMobile()
  const { value, onValueChange } = React.useContext(ResponsiveTabsContext)
  
  // Extract tab data from children
  const tabs = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return {
        value: child.props.value,
        label: child.props.children,
        badge: child.props.badge
      }
    }
    return null
  }).filter(Boolean)

  if (isMobile) {
    return (
      <div className="mb-4">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <SelectValue />
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectTrigger>
          <SelectContent>
            {tabs?.map((tab) => (
              <SelectItem key={tab?.value} value={tab?.value || ""}>
                <div className="flex items-center justify-between w-full">
                  <span>{tab?.label}</span>
                  {tab?.badge && tab.badge > 0 && (
                    <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6",
      className
    )}>
      {children}
    </div>
  )
}

const ResponsiveTabsTrigger = ({ value: tabValue, children, className, badge }: ResponsiveTabsTriggerProps) => {
  const isMobile = useIsMobile()
  const { value, onValueChange } = React.useContext(ResponsiveTabsContext)
  
  if (isMobile) {
    return null // Handled by Select in ResponsiveTabsList
  }

  const isActive = value === tabValue

  return (
    <button
      onClick={() => onValueChange(tabValue)}
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-white dark:bg-gray-700 text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {children}
        {badge && badge > 0 && (
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </button>
  )
}

const ResponsiveTabsContent = ({ value: tabValue, children, className }: ResponsiveTabsContentProps) => {
  const { value } = React.useContext(ResponsiveTabsContext)
  
  if (value !== tabValue) {
    return null
  }

  return (
    <div className={cn("focus-visible:outline-none", className)}>
      {children}
    </div>
  )
}

export { ResponsiveTabs, ResponsiveTabsList, ResponsiveTabsTrigger, ResponsiveTabsContent }
