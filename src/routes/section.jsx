import DescriptionPage from "../pages/description-page/description_page";
import HomePage from "../pages/home-page/pages/home_page";
import HistoryPage from "../pages/history-page/history_page";
import ReadingPage from "../pages/reading-page/reading_page";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import DashBoardLayout from "../layouts/dashboard";
import SearchPage from "../pages/search-page/search_page";
export default function Router(){
    const routes=useRoutes([
        {
            element:(
                <DashBoardLayout>
                    <Outlet />
                </DashBoardLayout>
            ),
            children:
                [
                    {path:'', element: <Navigate to='home' replace> </Navigate>},
                    {path:'home',children: [
                        {path: '', index: true, element: <HomePage />},
                        {path: 'search/:id', element: <HomePage />},
                        {path:'description/:id',element:<DescriptionPage/>}
                    ]},
                    {path:'history', element: <HistoryPage/> },
                    // {path:'reading/:id',element:<ReadingPage/>},
                    {path:'description/:novelId',children: [
                        {path: '',element:<DescriptionPage/>},
                        {path: 'chapter/:chapterId',element: <ReadingPage/>}
                    ]},
                    {path:'search', element:<SearchPage/>}
                ]
        
        }
    ]);
    return routes;
}