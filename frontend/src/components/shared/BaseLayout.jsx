import Nav from './Nav'
import Footer from './Footer'

export default function BaseLayout(props) {
  return (
    <div className="flex flex-col bg-blue-50 min-h-screen">
      <Nav />
      <div className="flex-grow">
        <main className="container mx-auto px-8 py-8">
          {props.children}
        </main>
      </div>
      <Footer />
    </div>
  )
}