import './App.css';
import Country from './screens/country/country';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Pizzerias from './screens/pizzeria/pizzerias';
import Pizza from './screens/pizza/pizza';
import Cart from './screens/cart/cart';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Country/>,
  },
  {
    path: "/pizzeria",
    element: <Pizzerias />
  },
  {
    path: "/avalible_pizza",
    element: <Pizza />
  },
  {
    path: '/cart',
    element: <Cart />
  }
]);


function App() {

  return (
      <div className="App">
        <RouterProvider router={router} />
      </div>
  );
}

export default App;
