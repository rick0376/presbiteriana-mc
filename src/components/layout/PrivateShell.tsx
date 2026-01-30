"use client";

import { useState } from "react";
import Header from "@/components/header/header";
import Sidebar from "@/components/sidebar/sidebar";
import styles from "./styles.module.scss";

export default function PrivateShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Header onMenuToggle={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className={styles.dashboardContent}>{children}</main>
    </>
  );
}
