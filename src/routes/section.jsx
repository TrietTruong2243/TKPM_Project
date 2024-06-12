import { Navigate, Outlet, useRoutes } from "react-router-dom";

import DescriptionPage from "../pages/description-page/pages/description_page";
import HomePage from "../pages/home-page/pages/home_page";
import HistoryPage from "../pages/history-page/pages/history_page";
import ReadingPage from "../pages/reading-page/pages/reading_page";
import DashBoardLayout from "../layouts/dashboard";
import SearchPage from "../pages/search-page/pages/search_page";
import SettingsPage from "../pages/settings-page/pages/settings_page";
import NovelByCategoryPage from "../pages/category-page/pages/category_page";
import PolicyPage from "../pages/policy-page/pages/policy_page";

function Router(){
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
                    {path:'home',element: <HomePage/>},
                    {path:'history', element: <HistoryPage/> },
                    {path:'description/:novelId',children: [
                        {path: '',element:<DescriptionPage/>},
                        {path: 'chapter/:chapterId',element: <ReadingPage/>}
                    ]},                    
                    {path:'search', element:<SearchPage/>},
                    {path:'settings', element:<SettingsPage/>},
                    {path:'category/:category_slug', element: <NovelByCategoryPage/>},
                    {path: 'policy', element: <PolicyPage/>}


                ]
        
        }
    ]);
    return routes;
}
export default Router;