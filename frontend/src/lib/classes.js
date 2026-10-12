import { extendTailwindMerge } from 'tailwind-merge'

export const cn = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-body', 'text-ui', 'text-small', 'text-caption'],
      'bg-image': ['bg-guide', 'bg-profile', 'bg-hero', 'bg-hero-mobile'],
    },
  },
})
