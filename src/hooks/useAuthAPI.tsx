
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/services/api';
import { signInWithGoogle, signOut } from '@/services/authServiceWithAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export const useAuthAPI = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Verify current auth token
  const useVerifyAuth = () => {
    return useQuery({
      queryKey: ['authUser'],
      queryFn: async () => {
        const response = await authAPI.verifyToken();
        return response.data;
      },
      retry: false,
    });
  };
  
  // Sign in with Google
  const useGoogleSignIn = () => {
    return useMutation({
      mutationFn: (token: string) => signInWithGoogle(token),
      onSuccess: (data) => {
        queryClient.setQueryData(['authUser'], data.user);
        queryClient.invalidateQueries({ queryKey: ['authUser'] });
        
        toast({
          title: "Welcome!",
          description: `You've successfully signed in as ${data.user.name}`,
        });
        
        // Navigate based on user role
        if (data.user.isseller) {
          navigate('/seller/dashboard');
        } else {
          navigate('/buyer/dashboard');
        }
      },
      onError: (error: any) => {
        toast({
          title: "Sign In Failed",
          description: error.response?.data?.message || "An error occurred during sign in",
          variant: "destructive"
        });
      }
    });
  };
  
  // Sign out
  const useSignOut = () => {
    return useMutation({
      mutationFn: () => signOut(),
      onSuccess: () => {
        queryClient.setQueryData(['authUser'], null);
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return queryKey === 'authUser' || 
                   queryKey === 'userProfile' || 
                   queryKey === 'favorites' || 
                   queryKey === 'sellerProperties';
          }
        });
        
        toast({
          title: "Signed Out",
          description: "You've been successfully signed out",
        });
        
        navigate('/');
      }
    });
  };
  
  return {
    useVerifyAuth,
    useGoogleSignIn,
    useSignOut,
  };
};

export default useAuthAPI;
