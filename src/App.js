import './App.css';
import Router from './routes/section';
import MyThemeProvider from './theme/theme';
import {ReadingTheme} from './pages/reading-page/reading_page_theme';
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
