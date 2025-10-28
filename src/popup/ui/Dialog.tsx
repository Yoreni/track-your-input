import React, { useRef, useEffect } from 'react';

interface DialogProps 
{
    children?: React.ReactNode
    isOpen: boolean
    onClose?: () => void
    className?: string
}

export function Dialog({ children, isOpen, onClose = () => {}, className}: DialogProps) 
{
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => 
    {
        const dialogElement = dialogRef.current;

        if (dialogElement) 
        {
            if (isOpen) 
            {
                if (!dialogElement.open)
                    dialogElement.showModal()

            } 
            else 
            {
                if (dialogElement.open) 
                    dialogElement.close()
            }
        }
    }, [isOpen])

    const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => 
    {
        event.preventDefault()
        onClose()
    };

    return (
        <dialog
            ref={dialogRef}
            className="w-11/12 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg shadow-xl border-1 border-gray-400 bg-white max-w-md dark:bg-gray-800 dark:text-white"
            onCancel={handleCancel}
        >
            <div className={className}>
                {children}
            </div>
        </dialog>
    );
}