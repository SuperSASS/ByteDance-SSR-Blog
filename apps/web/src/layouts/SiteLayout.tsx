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
      <div className="relative flex">
        <SiteSidebar />

        <main
          className={`flex-1 ${showRightSidebar ? 'max-w-4xl' : 'max-w-6xl'} mx-auto p-8`}
        >
          <Outlet />
        </main>

        {showRightSidebar && <SiteRightAside />}
      </div>
    </div>
  );
}
