import './App.css';
import Layout from './Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import from react-router-dom
import UsFormapi from './Components/Pages/UsesState/Api/UsFormapi';
import UsLIstapi from './Components/Pages/UsesState/Api/UsListapi';
import Home from './Components/Pages/Frontpage/Home';
import { ToastContainer } from 'react-toastify';
import UrFormapi from './Components/Pages/UseReducer/Api/UrFormapi';
import UrListapi from './Components/Pages/UseReducer/Api/UrLilstapi';
import { GlobalProvider } from './Hooks/Reducer/Globalcontext'; // Import GlobalProvider
import UcFormapi from './Components/Pages/UseContext/Api/UcFormapi';
import EmployeeDetails from './Components/Pages/UseContext/Api/Edit';
import UcLIstapi from './Components/Pages/UseContext/Api/UcLIstapi';
import ReduxForm from "../src/Components/Pages/Redux/Reduxcrud/ReduxForm"
import ReduxList from "../src/Components/Pages/Redux/Reduxcrud/ReduxList"
import SagaForm from './Components/Pages/reduxsaga/reduxsagacrud/SagaForm';
import SagaList from './Components/Pages/reduxsaga/reduxsagacrud/SagaList';
import Nopage from './Components/Pages/Nopage';

function App() {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Layout />}> 
            <Route path="/" element={<Home />} />
            <Route path="/UcFormapi" element={<UcFormapi />} />
            <Route path="/UcFormapi/:id" element={<UcFormapi />} />
            <Route path="/UcLIstapi" element={<UcLIstapi />} />
            <Route path="/employees/:id" element={<EmployeeDetails />} />
            <Route path="/UrFormapi" element={<UrFormapi />} />
            <Route path="/UrListapi" element={<UrListapi />} />
            <Route path="/UsListapi" element={<UsLIstapi />} />
            <Route path="/UsFormapi" element={<UsFormapi />} />
            <Route path="/UsFormapi/:id" element={<UsFormapi />} />
            <Route path="/UrFormapi/:id" element={<UrFormapi />} />
            <Route path="/ReduxForm" element={<ReduxForm />} />
            <Route path="/ReduxForm/:id"element={<ReduxForm />} />
            <Route path="/ReduxList" element={<ReduxList />} />
            <Route path="/SagaForm/:id" element={<SagaForm />} />
            <Route path="/SagaForm" element={<SagaForm />} />
            <Route path="/SagaList" element={<SagaList />} />
            <Route path='*' element={<Nopage />} />
          </Route>
        </Routes>
      </GlobalProvider>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
