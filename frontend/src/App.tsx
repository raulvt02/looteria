import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { LoginRegisterPage } from "./components/LoginRegisterPage";
import { GameDetailPage } from "./components/GameDetailPage";
import { ExplorePage } from "./components/ExplorePage";
import { UserProfilePage } from "./components/UserProfilePage";
import AdminPanel from "./components/AdminPanel";
import { CreateListingPage } from "./components/CreateListingPage";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";

type Page = "home" | "login" | "game" | "explore" | "profile" | "admin" | "create-listing" | "listing-detail" | "cart" | "tracking";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedGameId, setSelectedGameId] = useState<string>("1");
  const [selectedListingId, setSelectedListingId] = useState<string>("1");
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
  const { user } = useAuth();

  const handleNavigate = (page: string, idParam?: string, mode?: "login" | "register") => {
  
    if (user?.rol === 'ADMIN' && page === 'profile') {
      setCurrentPage('admin' as Page);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (user && user?.rol !== 'ADMIN' && page === 'admin') {
      setCurrentPage('home' as Page);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    setCurrentPage(page as Page);
    
    if (mode) {
      setLoginMode(mode);
    }
    
    // Asignar el ID al campo correcto según la página
    if (idParam) {
      if (page === 'game') {
        setSelectedGameId(idParam);
      } else if (page === 'listing-detail') {
        setSelectedListingId(idParam);
      }
    }
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleCustomNavigate = (event: Event) => {
      const customEvent = event as CustomEvent;
      handleNavigate(customEvent.detail);
    };

    window.addEventListener('navigate', handleCustomNavigate);
    return () => window.removeEventListener('navigate', handleCustomNavigate);
  }, []);


  const getNavbarRole = () => {
    if (!user) return "guest";
    if (user.rol === 'ADMIN') return "admin";
    if (user.rol === 'REGISTRADO') return "registered";
    return "guest";
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      {currentPage !== "login" && (
        <Navbar 
          onNavigate={handleNavigate} 
          currentPage={currentPage}
          userRole={getNavbarRole() as "guest" | "registered" | "admin"}
        />
      )}

      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      {currentPage === "login" && <LoginRegisterPage onNavigate={handleNavigate} initialMode={loginMode} />}
      {(currentPage === "game" || currentPage === "listing-detail") && (
        <GameDetailPage gameId={currentPage === "game" ? selectedGameId : selectedListingId} onNavigate={handleNavigate} userRole={getNavbarRole() as "guest" | "registered" | "admin"} />
      )}
      {currentPage === "explore" && <ExplorePage onNavigate={handleNavigate} />}
      {currentPage === "admin" && <AdminPanel />}
      {currentPage === "profile" && <UserProfilePage onNavigate={handleNavigate} userRole={getNavbarRole() as "guest" | "registered" | "admin"} />}
      {currentPage === "create-listing" && <CreateListingPage onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}