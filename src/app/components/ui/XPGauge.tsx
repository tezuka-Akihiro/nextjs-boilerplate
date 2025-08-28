import React from 'react'
import { cn } from '@lib/utils'
import { formatXP } from '@shared/types/gadget-terms'

export interface XPGaugeProps {
  currentXP: number
  requiredXP: number
  className?: string
  showNumbers?: boolean
  height?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const XPGauge: React.FC<XPGaugeProps> = ({
  currentXP,
  requiredXP,
  className,
  showNumbers = true,
  height = 'md',
  animated = true
}) => {
  const progress = Math.min((currentXP / requiredXP) * 100, 100)
  
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  return (
    <div className={cn('w-full', className)}>
      {showNumbers && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-mono text-text-secondary">
            {formatXP(currentXP)}
          </span>
          <span className="text-sm font-mono text-text-secondary">
            {formatXP(requiredXP)}
          </span>
        </div>
      )}
      
      <div className={cn('xp-gauge', heights[height])}>
        <div
          className={cn(
            'xp-fill transition-all duration-500 ease-out',
            animated && 'animate-pulse'
          )}
          style={{
            width: `${progress}%`,
            transition: animated ? 'width 1s ease-out' : 'none'
          }}
        />
        
        {/* Progress percentage overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono font-bold text-text-primary mix-blend-difference">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      
      {showNumbers && (
        <div className="flex justify-center mt-2">
          <span className="text-xs font-mono text-text-secondary">
            {formatXP(requiredXP - currentXP)} remaining
          </span>
        </div>
      )}
    </div>
  )
}

export { XPGauge }