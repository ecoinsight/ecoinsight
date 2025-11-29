import React from 'react';
import { AlertTriangle } from 'lucide-react';

const WarningBanner = () => {
    return (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 text-center relative z-50 shadow-sm">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>
                    <span className="font-bold">Data Privacy Notice:</span> This application utilizes simulated data for demonstration purposes to ensure strict compliance with privacy policies. Real-world sensitive information is not displayed.
                </span>
            </div>
        </div>
    );
};

export default WarningBanner;
