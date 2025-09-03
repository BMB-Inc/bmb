import { StaffSearch } from './components/staff-search'

function App() {
  return (
  <div style={{ width: '500px', margin: '0 auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    <StaffSearch baseUrl="https://staging.bmbinc.com/api/sagitta" />
  </div>)
}

export default App
