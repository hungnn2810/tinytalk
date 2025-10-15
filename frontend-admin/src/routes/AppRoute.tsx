import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ClassesPage from "../pages/ClassesPage";
import HomeworksPage from "../pages/HomeworksPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="homeworks" element={<HomeworksPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
