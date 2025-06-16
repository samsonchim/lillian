import { LoveNoteForm } from '@/components/love-note-form';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background selection:bg-accent/50 selection:text-accent-foreground">
      <div className="w-full max-w-2xl">
        <LoveNoteForm />
      </div>
    </main>
  );
}
