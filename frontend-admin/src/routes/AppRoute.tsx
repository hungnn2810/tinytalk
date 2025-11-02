import { Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import ClassesPage from "../pages/Classes/ClassesPage";
import HomePage from "../pages/Home/HomePage";
import LibraryPage from "../pages/Library/LibraryPage";
import { LoginPage } from "../pages/LoginPage";
import StudentPage from "../pages/Students/StudentPage";
import { PrivateRoute } from "./PrivateRoute";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="students" element={<StudentPage />} />
          <Route path="library" element={<LibraryPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
