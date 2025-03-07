import { Route } from '@solidjs/router'
import LandingPage from './LandingPage'
import MainPage from './MainPage'


const Pages = () => {
  return (
    <>
        <Route path="/" component={LandingPage} />
        <Route path="/main" component={MainPage} />
    </>
  )
}

export default Pages