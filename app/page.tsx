import { ScribeContent } from '@/components/ScribeContent/ScribeContent';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';

export default function HomePage() {
  return (
    <>
      <ColorSchemeToggle />
      <ScribeContent />
    </>
  );
}
