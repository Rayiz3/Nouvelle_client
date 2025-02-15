import { Route } from '@solidjs/router'
import LandingPage from './LandingPage'


const Pages = () => {
  return (
    <>
        <Route path="/" component={LandingPage} />
    </>
  )
}

export default Pages