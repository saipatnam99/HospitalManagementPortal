import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    toast.info('Logging out...');
    await signOut({
      redirect: false,
    });
    router.push('/');
  };

  return (
    <div className="bg-slate-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold">HOSPITAL</h1>
      <div>
        {session ? (
          <div className="text-lg font-medium">
            <p>{session.user?.username}</p> {/* Update according to session object */}
            <p>{session.user?.email}</p>
          </div>
        ) : (
          <p>Not logged in</p>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="bg-blue-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
      >
        Log Out
      </button>
    </div>
  );
};

export default Navbar;