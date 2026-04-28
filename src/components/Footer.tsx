import { Music } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Music className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-gradient">TY Studio</span>
          </div>

          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} TY Music Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
