import {ErrorBoundary, hydrate, lazy, LocationProvider, prerender as ssr, Route, Router} from 'preact-iso'
import Home from './pages/home/index.js'
import NotFound from './pages/_404.js'
import Header from './header.js'
import "mvp.css/mvp.css"

const About = lazy(() => import('./pages/about/index.js'))

export function App() {
    return (
        <LocationProvider>
            <Header/>
            <main>
                <ErrorBoundary>
                    <Router>
                        <Route path="/" component={Home}/>
                        <Route path="/about" component={About}/>
                        <Route default component={NotFound}/>
                    </Router>
                </ErrorBoundary>
            </main>
        </LocationProvider>
    )
}

hydrate(<App/>)

export async function prerender(data) {
    return await ssr(<App {...data} />)
}
