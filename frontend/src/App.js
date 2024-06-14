import logo from './logo.svg';
import './App.css';
import UploadComponent from './components/UploadComponent';
import EmployeeListComponent from './components/EmployeeListComponent';

function App() {
  return (
    <div className="App">
      <UploadComponent />
      <EmployeeListComponent />
    </div>
  );
}

export default App;
