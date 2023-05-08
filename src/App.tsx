import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div>
      <a className="hover:text-blue-600" href="https://github.com/kimyouknow/form-opt">
        Github Repository: https://github.com/kimyouknow/form-opt
      </a>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
            My Form
          </NavLink>
        </li>
        <li>
          <NavLink to="/fast" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
            My Fast Form
          </NavLink>
        </li>
        <li>
          <NavLink to="/rhf" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
            RHF Form
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}

export default App
