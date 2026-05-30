"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, SlidersHorizontal } from "lucide-react"

interface BlogFiltersProps {
  allTags: string[]
}

export function BlogFilters({ allTags }: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for search input to debounce
  const currentQuery = searchParams.get("query") || ""
  const [searchVal, setSearchVal] = useState(currentQuery)
  const activeTag = searchParams.get("tag") || ""

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchVal(currentQuery)
  }, [currentQuery])

  // Debounce search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchVal !== currentQuery) {
        handleFilterUpdate({ query: searchVal || null })
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchVal, currentQuery])

  function handleFilterUpdate(updates: Record<string, string | null>) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  function clearAll() {
    setSearchVal("")
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
  }

  const hasActiveFilters = currentQuery || activeTag

  return (
    <div className="w-full space-y-6 mb-12 p-6 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl hover:border-border/60">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search articles by title, content..."
            className="pl-10 pr-10 h-11 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary focus-visible:ring-offset-0"
          />
          {searchVal && (
            <button
              onClick={() => setSearchVal("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearAll}
            className="h-11 px-4 text-muted-foreground hover:text-foreground rounded-2xl flex items-center gap-1.5 self-end md:self-auto"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Categories / Tags */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <SlidersHorizontal className="h-3 w-3" />
          Filter by Category / Tag
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleFilterUpdate({ tag: null })}
            className="cursor-pointer transition-all duration-200 select-none"
          >
            <Badge
              variant={!activeTag ? "default" : "outline"}
              className="px-4 py-1.5 rounded-full text-xs font-medium border-border/50 hover:bg-primary/95 transition-all duration-200"
            >
              All Categories
            </Badge>
          </button>
          {allTags.map((tag) => {
            const isSelected = activeTag === tag
            return (
              <button
                key={tag}
                onClick={() => handleFilterUpdate({ tag: isSelected ? null : tag })}
                className="cursor-pointer transition-all duration-200 select-none"
              >
                <Badge
                  variant={isSelected ? "default" : "outline"}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border-border/50 transition-all duration-200 ${
                    isSelected
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-background/30 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tag}
                </Badge>
              </button>
            )
          })}
        </div>
      </div>

      {isPending && (
        <div className="text-xs text-muted-foreground animate-pulse flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          Filtering articles...
        </div>
      )}
    </div>
  )
}
