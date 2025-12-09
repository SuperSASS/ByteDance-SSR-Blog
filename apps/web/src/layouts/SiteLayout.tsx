import { Outlet } from 'react-router-dom';
import { SiteSidebar } from './SiteSidebar';
import backgroundImage from '@/assets/background.jpg';

export function SiteLayout() {
  return (
    <div className="min-h-screen">
      {/* Background overlay */}
      <div
        className="page-background"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* Main layout */}
      <div className="relative flex justify-center">
        <SiteSidebar />

        <main className={`flex-1 max-w-5xl p-6 transition-all duration-300`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
