import React from 'react';

type HexIconProps = {
    width?: string;
    height?: string;
    stroke?: string;
    className?: string;
    label?: string;
};

export default function HexIcon({
    width = '100%',
    height = '100%',
    stroke = "#000000ff",
    className = "",
    label,
}: HexIconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="2 2 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M20.9485 11.0195C21.2909 11.6283 21.2909 12.3717 20.9485 12.9805L17.5735 18.9805C17.2192 19.6103 16.5529 20 15.8303 20H8.16969C7.44715 20 6.78078 19.6103 6.42654 18.9805L3.05154 12.9805C2.70908 12.3717 2.70908 11.6283 3.05154 11.0195L6.42654 5.01948C6.78078 4.38972 7.44715 4 8.16969 4H15.8303C16.5529 4 17.2192 4.38972 17.5735 5.01948L20.9485 11.0195Z"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {label && (
                <text
                    x="12"
                    y="15"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    fontWeight="bold"
                    fill={stroke}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                    {label}
                </text>
            )}
        </svg>
    );
}
