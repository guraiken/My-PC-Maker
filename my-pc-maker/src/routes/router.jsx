import { createBrowserRouter } from "react-router-dom";
import Cadastro from "../pages/Cadastro";
import Login from "../pages/Login";
import Montagem from "../pages/Montagem";


const router = createBrowserRouter([
    {path:"/", element:<Cadastro/>},
    {path: "/login", element: <Login/>},
    {path: "/montagem", element: <Montagem/>}

])

export default router