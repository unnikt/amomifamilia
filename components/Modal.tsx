import React from "react";

interface ModalProps {
    title?: string;
    isOpen?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
    w?: string;
    h?: string;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children, w, h }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50  bg-black/50 flex items-center justify-center">
            <div className={`${w ? w : "w-80vw"} ${h ? h : "h-90vh"} bg-(--surface) max-h-[90vh] overflow-y-auto max-w-[90vw] 
            rounded-md shadow-lg relative animate-[fadeIn_0.2s_ease-out]`}>
                {/* Close Button */}
                <div className="flex justify-between align-middle p-2 bg-(--primary)/80 text-white rounded-tl-md rounded-tr-md">
                    <p className="p-2 font-medium text-xl">{title}</p>
                    <button
                        onClick={onClose}
                        className="material-symbols-outlined"
                    >
                        close
                    </button>
                </div>
                {children}
            </div>
        </div >
    );
};

export default Modal;
