
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LayoutInicial from './layouts/LayoutInicial';
import LayoutUsuarios from './layouts/LayoutUsuarios';
import Productos from './pages/Productos';
import Usuarios from './pages/Usuarios';
import Ventas from './pages/Ventas';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'




function App() {
  return (
    <div className="App">
     <Router>
        <Switch>
          <Route path={['/usuarios', '/productos', '/ventas']}> {/*comentario: agregar separado por comas, las rutas que llevan este layout, son todas exepto el login */}
            <LayoutUsuarios>
              <Switch>
              <Route path='/usuarios'> 
                  <Usuarios/>
                </Route>
                <Route path='/productos'> 
                  <Productos/>
                </Route>
                <Route path='/ventas'>
                  <Ventas />
                </Route>
              </Switch>
            </LayoutUsuarios>
          </Route>
          <Route path={['/']}>
            <LayoutInicial>
              <Route path='/'>
                <Login />
              </Route>
            </LayoutInicial>
          </Route>
        </Switch>
      </Router>
    

    </div>
  );
}

export default App;
