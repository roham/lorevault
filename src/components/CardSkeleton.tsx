'use client';

export default function CardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-[140px] h-[196px]',
    md: 'w-[200px] h-[280px]',
    lg: 'w-[280px] h-[392px]',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-xl skeleton flex-shrink-0`} />
  );
}
