import { watch } from 'vue';
import { useUser, useAuth } from '@clerk/vue';
import { useUserStore } from '@/stores/userStore';
import { useApi } from '@/lib/api';

/**
 * A composable to keep the local user store in sync with the Clerk authentication state.
 * It handles fetching user data, syncing new users to the backend, and clearing
 * data on sign-out.
 */
export function useAuthSync() {
  const { fetchApi } = useApi();
  const userStore = useUserStore();
  const { user: clerkUser, isLoaded } = useUser();
  const { isSignedIn } = useAuth();

  watch([isLoaded, isSignedIn], async () => {
    // Wait until Clerk has loaded its state
    if (!isLoaded.value) return;

    if (isSignedIn.value) {
      // If the user is signed in according to Clerk, ensure their data is in our store.
      // fetchUser handles its own caching, so it's safe to call.
      await userStore.fetchUser();

      // If after fetching, we still don't have a user, it's a new user who needs to be synced.
      if (!userStore.user && clerkUser.value) {
        try {
          console.log('Syncing new user to database...');
          await fetchApi('/auth/sync', {
            method: 'POST',
            body: JSON.stringify({
              email: clerkUser.value.primaryEmailAddress?.emailAddress,
              fullName: clerkUser.value.fullName,
              avatarUrl: clerkUser.value.imageUrl,
            }),
          });
          // Force a refetch after the sync is complete.
          await userStore.fetchUser(true);
        } catch (err) {
          console.error('Failed to sync user:', err);
        }
      }
    } else {
      // If user is not signed in, clear any local user data.
      userStore.user = null;
    }
  }, { immediate: true });
}
