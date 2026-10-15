import Nav from './Nav'
import Footer from './Footer'
import { cn } from '@/lib/classes'
export default function BaseLayout({ children, fullWidth = false }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-background">
      <Nav />
      <main
        id="main-content"
        className={cn(
          'mx-auto min-w-0 flex-1',
          fullWidth
            ? 'w-full'
            : 'w-full max-w-310 px-8 pb-13.75 pt-9.25 max-[600px]:px-5 max-[600px]:pb-10 max-[600px]:pt-6.75'
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
