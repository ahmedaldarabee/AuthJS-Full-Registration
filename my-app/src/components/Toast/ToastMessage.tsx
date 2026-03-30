"use client";

import { useEffect, useRef } from 'react';
import { showToast } from "nextjs-toast-notify";

interface ToastMessageProps {
    messageType: "success" | "error";
    message: string;
}

const ToastMessage = ({ messageType, message }: ToastMessageProps) => {
    const lastFiredRef = useRef<string | null>(null);

    useEffect(() => {
        if (message && lastFiredRef.current !== message) {
            const config = {
                duration: 4000,
                progress: true,
                position: "top-center" as const,
                transition: "slideInUp" as const,
                icon: '',
                sound: true,
            };

            if (messageType === "success") {
                showToast.success(message, config);
            } else {
                showToast.error(message, config);
            }
            lastFiredRef.current = message;
        }
    }, [messageType, message]);

    return null;
};

export default ToastMessage;

