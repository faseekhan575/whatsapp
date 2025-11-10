import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import Signup from './signup/Signup'
import Login from './logins/Login'
import UserCollect from './collection/Usercollect'
import Chats from './chats/Chats'
import { Provider } from 'react-redux'
import store from './store/store'
import { Toaster } from 'react-hot-toast';
import SimpleMessagePopup from './collection/popup'

const router = createBrowserRouter([

{ 
  path: '/',
  element: <Signup/>
}
,
  {
    path: '/signup',
    element: <Signup/>
  },{
    path: '/login',
    element: <Login/>
  },{
    path: '/RTC',
    element: <UserCollect/>
  },{
    path: '/home',
    element: <Chats/>
  }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster position="top-right"/>
   <SimpleMessagePopup/>
    </Provider>
  </StrictMode>,
)
