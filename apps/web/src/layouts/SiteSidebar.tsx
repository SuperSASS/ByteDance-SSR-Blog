import { Link, NavLink } from 'react-router-dom';
import { Home, User, Archive, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export function SiteSidebar() {
  const navLinks = [
    { to: '/', icon: Home, label: '主页' },
    { to: '/archive', icon: Archive, label: '归档' },
    { to: '/search', icon: Search, label: '搜索' },
    { to: '/about', icon: User, label: '关于' },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col p-6">
      {/* Avatar and Site Info */}
      <div className="flex flex-col items-center mb-8">
        <Link to="/" className="mb-4">
          {/* TODO: 头像 */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-4xl font-bold text-primary-foreground">
            B
          </div>
        </Link>
        <h1 className="text-xl font-bold mb-1">Super SASS……</h1>
        <p className="text-sm text-muted-foreground text-center">万华散尽……</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="pt-4 border-t flex justify-center">
        <ThemeToggle />
      </div>
    </aside>
  );
}
