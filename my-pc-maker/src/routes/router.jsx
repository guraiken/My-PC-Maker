import { createBrowserRouter } from "react-router-dom";
import Cadastro from "../pages/Cadastro";
import Login from "../pages/Login";
import Montagem from "../pages/Montagem";
import ProtectedRoute from '../components/ProtectedRoute';
import Perfil from "../pages/Perfil";
import AlreadyLogged from "../components/AlreadyLogged";


const router = createBrowserRouter([
    {path:"/", element: <AlreadyLogged><Cadastro/></AlreadyLogged> },
    {path: "/login", element: <AlreadyLogged><Login/></AlreadyLogged> },
    {path: "/montagem", element: <ProtectedRoute><Montagem/></ProtectedRoute> },
    {path: "/perfil", element: <ProtectedRoute><Perfil/></ProtectedRoute> }

])

export default router