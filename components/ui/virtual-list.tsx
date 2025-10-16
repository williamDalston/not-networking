'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

interface VirtualListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  containerHeight: number
  overscan?: number
  className?: string
  onScroll?: (scrollTop: number) => void
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
  className,
  onScroll,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0)
  const scrollElementRef = React.useRef<HTMLDivElement>(null)

  // Calculate visible range
  const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleEnd = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  // Get visible items
  const visibleItems = items.slice(visibleStart, visibleEnd + 1)
  const visibleItemsWithIndex = visibleItems.map((item, index) => ({
    item,
    index: visibleStart + index,
  }))

  // Calculate total height and offset
  const totalHeight = items.length * itemHeight
  const offsetY = visibleStart * itemHeight

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop
    setScrollTop(newScrollTop)
    onScroll?.(newScrollTop)
  }, [onScroll])

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className || ''}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItemsWithIndex.map(({ item, index }) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              style={{ height: itemHeight }}
              className="flex items-center"
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Hook for virtual scrolling
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = React.useState(0)

  const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleEnd = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(visibleStart, visibleEnd + 1)
  const visibleItemsWithIndex = visibleItems.map((item, index) => ({
    item,
    index: visibleStart + index,
  }))

  const totalHeight = items.length * itemHeight
  const offsetY = visibleStart * itemHeight

  const handleScroll = React.useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop)
  }, [])

  return {
    visibleItemsWithIndex,
    totalHeight,
    offsetY,
    handleScroll,
    scrollTop,
  }
}

// Simplified virtual list for common use cases
interface SimpleVirtualListProps {
  items: Array<{ id: string; content: React.ReactNode }>
  height?: number
  itemHeight?: number
  className?: string
}

export function SimpleVirtualList({
  items,
  height = 400,
  itemHeight = 60,
  className,
}: SimpleVirtualListProps) {
  return (
    <VirtualList
      items={items}
      renderItem={(item) => (
        <div className="w-full p-4 border-b border-gray-200 dark:border-gray-700">
          {item.content}
        </div>
      )}
      itemHeight={itemHeight}
      containerHeight={height}
      className={className}
    />
  )
}

// Virtual grid for two-dimensional layouts
interface VirtualGridProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemWidth: number
  itemHeight: number
  containerWidth: number
  containerHeight: number
  gap?: number
  overscan?: number
  className?: string
}

export function VirtualGrid<T>({
  items,
  renderItem,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  gap = 16,
  overscan = 2,
  className,
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0)
  const scrollElementRef = React.useRef<HTMLDivElement>(null)

  // Calculate grid dimensions
  const itemsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap))
  const rowCount = Math.ceil(items.length / itemsPerRow)
  const rowHeight = itemHeight + gap

  // Calculate visible range
  const visibleStartRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const visibleEndRow = Math.min(
    rowCount - 1,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
  )

  // Get visible items
  const visibleItems = []
  for (let row = visibleStartRow; row <= visibleEndRow; row++) {
    const startIndex = row * itemsPerRow
    const endIndex = Math.min(startIndex + itemsPerRow, items.length)
    for (let i = startIndex; i < endIndex; i++) {
      visibleItems.push({ item: items[i], index: i, row, col: i - startIndex })
    }
  }

  const totalHeight = rowCount * rowHeight
  const offsetY = visibleStartRow * rowHeight

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className || ''}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'grid',
            gridTemplateColumns: `repeat(${itemsPerRow}, ${itemWidth}px)`,
            gap: `${gap}px`,
          }}
        >
          {visibleItems.map(({ item, index, row, col }) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              style={{ height: itemHeight }}
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
