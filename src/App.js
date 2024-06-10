import logo from './logo.svg';
import './App.css';
import Router from './routes/section';
import MyThemeProvider from './theme/theme';
import { ReadingTheme } from './pages/reading-page/readingTheme';
function App() {
  return (
    <MyThemeProvider>
      <ReadingTheme>
        <Router></Router>
      </ReadingTheme>
    </MyThemeProvider>
  );
}

export default App;
