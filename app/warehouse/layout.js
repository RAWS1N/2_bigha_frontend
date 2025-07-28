import ProtectedRoute from "../components/ProtectedRoute";

export default function ProtectedLayout({ children }) {

  return (
    <div>
        <ProtectedRoute allowedRoles={['admin']}>
            {children}
        </ProtectedRoute>
    </div>
  );
}
