import React from 'react';
import './EducationalOverlay.css';

interface EducationalContent {
    title: string;
    sections: {
        subtitle?: string;
        content: string;
        highlights?: string[];
    }[];
}

interface EducationalOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    content: EducationalContent;
}

export const EducationalOverlay: React.FC<EducationalOverlayProps> = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;

    return (
        <div className="edu-overlay-backdrop" onClick={onClose}>
            <div className="edu-overlay-content" onClick={(e) => e.stopPropagation()}>
                <button className="edu-close-btn" onClick={onClose}>&times;</button>
                <div className="edu-header">
                    <span className="edu-badge">🎓 教育研究</span>
                    <h2>{content.title}</h2>
                </div>
                <div className="edu-scroll-area">
                    {content.sections.map((section, idx) => (
                        <div key={idx} className="edu-section">
                            {section.subtitle && <h3>{section.subtitle}</h3>}
                            <p>{section.content}</p>
                            {section.highlights && (
                                <ul className="edu-highlights">
                                    {section.highlights.map((h, i) => <li key={i}>{h}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                <div className="edu-footer">
                    <p>知识提示：长期下注高赌场期望值的选项（如和局）通常是亏损的主要原因。</p>
                </div>
            </div>
        </div>
    );
};
