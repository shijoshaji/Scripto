import React, { useState } from 'react';
import { Scripto } from '@jojovms/scripto';
import '@jojovms/scripto/dist/style.css';

export const UsageExample = () => {
    const [showDocs, setShowDocs] = useState(false);

    return (
        <div style={{ padding: '20px' }}>
            <h1>My App</h1>
            <button onClick={() => setShowDocs(true)}>Open Documentation</button>

            {showDocs && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '40px'
                }}>
                    <div style={{ background: 'white', flex: 1, borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #eee' }}>
                            <button onClick={() => setShowDocs(false)}>Close</button>
                        </div>

                        <div style={{ flex: 1, position: 'relative' }}>
                            {/* Uses the full container height */}
                            <Scripto url="https://raw.githubusercontent.com/jojovms/scripto/main/README.md" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
