// 'use client';

// import { useAuth } from '@/contexts/AuthContext';

// export function AuthButton() {
//   const { user, signInWithGoogle, signOut } = useAuth();

//   const handleAuth = async () => {
//     try {
//       if (user) {
//         await signOut();
//       } else {
//         await signInWithGoogle();
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <button
//       className="my-8 rounded bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-200"
//       onClick={handleAuth}
//     >
//       {user ? 'Sign Out' : 'Sign in with Google'}
//     </button>
//   );
// }
