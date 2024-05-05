import logo from './logo.svg';
import './App.css';
import Router from './routes/section';  
import MyThemeProvider from './theme/theme';
function App() {
  return (
    <MyThemeProvider>
        <Router></Router>
    </MyThemeProvider>
  );
}

export default App;
