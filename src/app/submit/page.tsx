import { SubmitForm } from '@/components/SubmitForm';

export default function SubmitPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Submit a Project</h1>
          <p className="text-[var(--text-secondary)] font-body text-lg">
            Built something at a Shiphaus event? Submit it here and we&apos;ll add it to the site after review.
          </p>
        </div>
        <SubmitForm />
      </div>
    </div>
  );
}
