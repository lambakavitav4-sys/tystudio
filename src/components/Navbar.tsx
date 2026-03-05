import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Music, LogOut, Shield, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-brand flex items-center justify-center group-hover:animate-pulse-glow transition-all">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-gradient">TY Studio</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          {user && (
            <Link to="/favorites" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> Favorites
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate('/auth')} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass animate-slide-up border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
            {user && (
              <Link to="/favorites" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> Favorites
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Admin
              </Link>
            )}
            {user ? (
              <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="text-sm text-muted-foreground hover:text-foreground text-left flex items-center gap-1">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            ) : (
              <button onClick={() => { navigate('/auth'); setMobileOpen(false); }} className="text-sm text-primary font-medium">
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
