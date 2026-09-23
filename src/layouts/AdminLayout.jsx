import { useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/authContext";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(true);
  const [contactOpen, setContactOpen] = useState(true);
  const [footerOpen, setFooterOpen] = useState(true);
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/cms/login", {
      replace: true,
    });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-gray-900 text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const submenuLinkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm transition ${
      isActive
        ? "bg-gray-100 font-medium text-gray-900"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Sidebar header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5">
          <div>
            <p className="text-sm font-bold tracking-tight text-gray-900">
              IoT Website
            </p>

            <p className="text-xs text-gray-500">
              Content Management System
            </p>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">

          {/* Dashboard */}
          <div className="mb-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Main
            </p>

            <NavLink
              to="/cms"
              end
              className={navLinkClass}
              onClick={closeSidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mr-3 h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.954a1.125 1.125 0 0 1 1.592 0L21.75 12M4.5 9.75v9.75a1.5 1.5 0 0 0 1.5 1.5h3.75v-6h4.5v6H18a1.5 1.5 0 0 0 1.5-1.5V9.75"
                />
              </svg>

              Dashboard
            </NavLink>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Content
            </p>

            {/* About */}
            <button
              type="button"
              onClick={() => setAboutOpen(!aboutOpen)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <span className="flex items-center">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mr-3 h-5 w-5 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A3.375 3.375 0 0 1 11.25 4.875v-1.5A3.375 3.375 0 0 0 7.875 0H6.75A2.25 2.25 0 0 0 4.5 2.25v19.5A2.25 2.25 0 0 0 6.75 24h10.5a2.25 2.25 0 0 0 2.25-2.25v-7.5Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75h6M9 16.5h6M9 9h1.5"
                  />
                </svg>

                About
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`h-4 w-4 transition-transform ${
                  aboutOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {/* About submenu */}
            {aboutOpen && (
              <div className="mt-1 ml-8 space-y-1 border-l border-gray-200 pl-3">

                <NavLink
                  to="/cms/about/overview"
                  className={submenuLinkClass}
                  onClick={closeSidebar}
                >
                  Overview
                </NavLink>

                <button
                  type="button"
                  disabled
                  className="block w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-gray-400"
                >
                  Objectives
                  <span className="ml-2 text-xs">
                    Soon
                  </span>
                </button>

                <button
                  type="button"
                  disabled
                  className="block w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-gray-400"
                >
                  Focus Areas
                  <span className="ml-2 text-xs">
                    Soon
                  </span>
                </button>

                <button
                  type="button"
                  disabled
                  className="block w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-gray-400"
                >
                  Direction
                  <span className="ml-2 text-xs">
                    Soon
                  </span>
                </button>

                <button
                  type="button"
                  disabled
                  className="block w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-gray-400"
                >
                  Core Values
                  <span className="ml-2 text-xs">
                    Soon
                  </span>
                </button>

                <button
                  type="button"
                  disabled
                  className="block w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-gray-400"
                >
                  Leadership
                  <span className="ml-2 text-xs">
                    Soon
                  </span>
                </button>

                <button
                  type="button"
                  disabled
                  className="block w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-gray-400"
                >
                  History
                  <span className="ml-2 text-xs">
                    Soon
                  </span>
                </button>

                <button
                  type="button"
                  disabled
                  className="block w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-gray-400"
                >
                  Visitors
                  <span className="ml-2 text-xs">
                    Soon
                  </span>
                </button>

                <button
                  type="button"
                  disabled
                  className="block w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-gray-400"
                >
                  Statistics
                  <span className="ml-2 text-xs">
                    Soon
                  </span>
                </button>
              </div>
            )}

            {/* People */}
            <button
              type="button"
              disabled
              className="mt-1 flex w-full cursor-not-allowed items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mr-3 h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.37 9.37 0 0 0 2.625-.372M15 19.128v-1.5a6.375 6.375 0 0 0-6.375-6.375H5.25A6.375 6.375 0 0 0-1.125 17.628v1.5m18.75 0a24.8 24.8 0 0 0 1.5-.114m-1.5.114a24.8 24.8 0 0 1-1.5-.114M12 12.75a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
                />
              </svg>

              People

              <span className="ml-auto text-xs">
                Soon
              </span>
            </button>

            {/* Media */}
            <button
              type="button"
              disabled
              className="mt-1 flex w-full cursor-not-allowed items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mr-3 h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008H14.25V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>

              Media

              <span className="ml-auto text-xs">
                Soon
              </span>
            </button>

            {/* Services */}
            <button
              type="button"
              disabled
              className="mt-1 flex w-full cursor-not-allowed items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mr-3 h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.42 15.17 17.25 9.34a1.5 1.5 0 0 0 0-2.121l-.75-.75a1.5 1.5 0 0 0-2.121 0l-5.83 5.83a1.5 1.5 0 0 0-.44 1.06v.75h.75a1.5 1.5 0 0 0 1.06-.44Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 15.75h.008v.008H5.25v-.008Zm0 3h.008v.008H5.25v-.008Zm3-3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                />
              </svg>

              Services

              <span className="ml-auto text-xs">
                Soon
              </span>
            </button>
          </div>

          {/* Communication */}
          {/* <div className="mb-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Communication
            </p>

            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mr-3 h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615A2.25 2.25 0 0 1 2.25 6.993V6.75"
                />
              </svg>

              Contact

              <span className="ml-auto text-xs">
                Soon
              </span>
            </button>
          </div> */}



{/* Communication */}
<div className="mb-6">
  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
    Communication
  </p>

  {/* Contact  */}
  <button
    type="button"
    onClick={() => setContactOpen(!contactOpen)}
    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
  >
    <span className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="mr-3 h-5 w-5 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615A2.25 2.25 0 0 1 2.25 6.993V6.75"
        />
      </svg>
      Contact
    </span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={`h-4 w-4 transition-transform ${contactOpen ? "rotate-180" : ""}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  </button>

  {contactOpen && (
    <div className="mt-1 ml-8 space-y-1 border-l border-gray-200 pl-3">
      <NavLink to="/cms/contact/main-office" className={submenuLinkClass} onClick={closeSidebar}>
        Main Office
      </NavLink>
      <NavLink to="/cms/contact/departments" className={submenuLinkClass} onClick={closeSidebar}>
        Departments
      </NavLink>
      <NavLink to="/cms/contact/quick-cards" className={submenuLinkClass} onClick={closeSidebar}>
        Quick Cards
      </NavLink>
      <NavLink to="/cms/contact/campus-address" className={submenuLinkClass} onClick={closeSidebar}>
        Campus Address
      </NavLink>
      <NavLink to="/cms/contact/office-hours" className={submenuLinkClass} onClick={closeSidebar}>
        Office Hours
      </NavLink>
      <NavLink to="/cms/contact/submissions" className={submenuLinkClass} onClick={closeSidebar}>
        Submissions
      </NavLink>
    </div>
  )}
</div>

{/* Footer  */}
<div className="mb-6">
  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
    Footer
  </p>

  <button
    type="button"
    onClick={() => setFooterOpen(!footerOpen)}
    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
  >
    <span className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="mr-3 h-5 w-5 shrink-0"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
      Footer
    </span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={`h-4 w-4 transition-transform ${footerOpen ? "rotate-180" : ""}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  </button>

  {footerOpen && (
    <div className="mt-1 ml-8 space-y-1 border-l border-gray-200 pl-3">
      <NavLink to="/cms/footer/navigation" className={submenuLinkClass} onClick={closeSidebar}>
        Navigation
      </NavLink>
      <NavLink to="/cms/footer/social-links" className={submenuLinkClass} onClick={closeSidebar}>
        Social Links
      </NavLink>
      <NavLink to="/cms/footer/contact-info" className={submenuLinkClass} onClick={closeSidebar}>
        Contact Info
      </NavLink>
    </div>
  )}
</div>







          {/* System */}
          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              System
            </p>

            {/* Users */}
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mr-3 h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.37 9.37 0 0 0 2.625-.372M15 19.128v-1.5a6.375 6.375 0 0 0-6.375-6.375H5.25A6.375 6.375 0 0 0-1.125 17.628v1.5m18.75 0a24.8 24.8 0 0 0 1.5-.114m-1.5.114a24.8 24.8 0 0 1-1.5-.114M12 12.75a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
                />
              </svg>

              Users

              <span className="ml-auto text-xs">
                Soon
              </span>
            </button>

            {/* Settings */}
            <button
              type="button"
              disabled
              className="mt-1 flex w-full cursor-not-allowed items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mr-3 h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.281a1.125 1.125 0 0 0 .57.81l1.14.66c.39.225.873.225 1.263 0l1.08-.623a1.125 1.125 0 0 1 1.45.26l1.296 2.245c.275.476.15 1.086-.285 1.414l-1.08.812a1.125 1.125 0 0 0-.423 1.01l.003.005a1.125 1.125 0 0 0 .423 1.01l1.08.812c.435.328.56.938.285 1.414l-1.296 2.245a1.125 1.125 0 0 1-1.45.26l-1.08-.623a1.125 1.125 0 0 0-1.263 0l-1.14.66a1.125 1.125 0 0 0-.57.81l-.213 1.281c-.09.542-.56.94-1.11.94h-2.592c-.55 0-1.02-.398-1.11-.94l-.213-1.281a1.125 1.125 0 0 0-.57-.81l-1.14-.66a1.125 1.125 0 0 0-1.263 0l-1.08.623a1.125 1.125 0 0 1-1.45-.26L3.06 15.8c-.275-.476-.15-1.086.285-1.414l1.08-.812a1.125 1.125 0 0 0 .423-1.01l-.003-.005a1.125 1.125 0 0 0-.423-1.01l-1.08-.812c-.435-.328-.56-.938-.285-1.414l1.296-2.245a1.125 1.125 0 0 1 1.45-.26l1.08.623a1.125 1.125 0 0 0 1.263 0l1.14-.66a1.125 1.125 0 0 0 .57-.81l.213-1.281Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              Settings

              <span className="ml-auto text-xs">
                Soon
              </span>
            </button>
          </div>
        </nav>

        {/* User section */}
        <div className="shrink-0 border-t border-gray-200 p-4">

          <div className="mb-3 flex items-center gap-3">

            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            {/* User details */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-gray-500">
                {user?.email || ""}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-3h-9m9 0-3-3m3 3-3 3"
              />
            </svg>

            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-72">

        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          {/* Header title */}
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-gray-700">
              Administration
            </p>
          </div>

          {/* Mobile user */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;