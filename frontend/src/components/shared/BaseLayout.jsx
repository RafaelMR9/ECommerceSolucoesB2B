import Nav from './Nav'
import Footer from './Footer'
export default function BaseLayout({ children, fullWidth = false }) {
  return (
    <div className="site-layout">
      <Nav />
      <main id="main-content" className={`page-content ${fullWidth ? 'page-content-full' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
