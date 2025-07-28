import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Projects from "@/components/pages/Projects";
import React from "react";
import "@/index.css";
import Layout from "@/components/organisms/Layout";
import Reports from "@/components/pages/Reports";
import MyTasks from "@/components/pages/MyTasks";
import Team from "@/components/pages/Team";
import ProjectBoard from "@/components/pages/ProjectBoard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ProjectBoard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="my-tasks" element={<MyTasks />} />
            <Route path="team" element={<Team />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;