"use client"
import { getTokenFromLocalStorage } from '@/utils/tokenHandler';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    useEffect(() => {
        const token = getTokenFromLocalStorage();
        if (!token) {
            Swal.fire({
                position: "center",
                icon: "info",
                title: "Please login to access the dashboard",
                showConfirmButton: false,
                timer: 1500
            });
            router.push('auth/boxed-signin');
        }
    }, [router]);

    const token = getTokenFromLocalStorage();
    if (!token) return null; // Ensure the component returns null if token is missing

    return <>{children}</>; // Render children if token is present
};

export default ProtectedRoute;
