import { UserManagement } from '@/components/UserManagement';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-8 font-sans">
      <UserManagement />
    </div>
  );
}
