import { Outlet, useLocation } from 'react-router-dom';
import { SiteSidebar } from './SiteSidebar';
import { SiteRightAside } from './SiteRightAside';

export function SiteLayout() {
  const location = useLocation();

  // Show right sidebar only on homepage
  const showRightSidebar = location.pathname === '/';

  return (
    <div className="min-h-screen">
      {/* Background overlay */}
      <div
        className="page-background"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920)',
        }}
      />

      {/* Main layout */}
      <div className="relative flex justify-center">
        <SiteSidebar />

        <main
          className={`flex-1 ${showRightSidebar ? 'max-w-3xl' : 'max-w-5xl'} p-6 transition-all duration-300`}
        >
          <Outlet />
        </main>

        {showRightSidebar && <SiteRightAside />}
      </div>
    </div>
  );
}
