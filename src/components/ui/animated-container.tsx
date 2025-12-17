import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps extends HTMLMotionProps<'div'> {
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, delay = 0, duration = 0.4, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeIn.displayName = 'FadeIn';

export const ScaleIn = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, delay = 0, duration = 0.3, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
ScaleIn.displayName = 'ScaleIn';

export const SlideIn = forwardRef<HTMLDivElement, AnimatedContainerProps & { direction?: 'left' | 'right' | 'up' | 'down' }>(
  ({ children, delay = 0, duration = 0.3, direction = 'up', className, ...props }, ref) => {
    const directionOffset = {
      left: { x: -24, y: 0 },
      right: { x: 24, y: 0 },
      up: { x: 0, y: 24 },
      down: { x: 0, y: -24 },
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, ...directionOffset[direction] }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, ...directionOffset[direction] }}
        transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
SlideIn.displayName = 'SlideIn';

export const StaggerContainer = forwardRef<HTMLDivElement, AnimatedContainerProps & { staggerDelay?: number }>(
  ({ children, staggerDelay = 0.1, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
StaggerContainer.displayName = 'StaggerContainer';

export const StaggerItem = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
StaggerItem.displayName = 'StaggerItem';

export const HoverScale = forwardRef<HTMLDivElement, AnimatedContainerProps & { scale?: number }>(
  ({ children, scale = 1.02, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={cn('cursor-pointer', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
);
HoverScale.displayName = 'HoverScale';

export const PulseIndicator = ({ className }: { className?: string }) => (
  <span className={cn('relative flex h-3 w-3', className)}>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
    <span className="relative inline-flex rounded-full h-3 w-3 bg-current" />
  </span>
);

export const AnimatedNumber = ({ value, duration = 1 }: { value: number; duration?: number }) => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    key={value}
  >
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {value.toLocaleString()}
    </motion.span>
  </motion.span>
);
