import React, { type ReactNode } from 'react';
import styles from './RulesModal.module.css';

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
                <h2>{title}</h2>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};
