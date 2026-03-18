import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center gap-3 mb-8 animate-slide-up">
          <Mail className="w-7 h-7 text-primary" />
          <h1 className="font-display text-3xl font-bold text-gradient">Contact Us</h1>
        </div>

        <div className="glass rounded-2xl p-8 animate-scale-in space-y-6">
          <p className="text-muted-foreground">Have questions, feedback, or need to report an issue? Fill out the form below and we'll get back to you as soon as possible.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name</label>
              <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="bg-secondary border-border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="bg-secondary border-border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Message</label>
              <Textarea placeholder="How can we help you?" value={message} onChange={e => setMessage(e.target.value)} className="bg-secondary border-border" rows={5} required />
            </div>
            <Button type="submit" className="bg-gradient-brand text-primary-foreground hover:opacity-90">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
