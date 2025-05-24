'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/localStorage';

const ProfileRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUserProfile();
    if (currentUser && currentUser.id) {
      router.replace(`/dashboard/profile/${currentUser.id}`);
    } else {
      // If no current user (e.g., not logged in or error), redirect to onboarding or login
      router.replace('/onboarding'); 
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      Loading profile...
    </div>
  );
};

export default ProfileRedirectPage; 