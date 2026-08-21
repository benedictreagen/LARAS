import React from 'react';

interface BgnLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'emblem' | 'full' | 'shield';
  showSubtext?: boolean;
  className?: string;
}

export const BgnLogo: React.FC<BgnLogoProps> = ({
  size = 'md',
  variant = 'emblem',
  showSubtext = true,
  className = '',
}) => {
  const getDimension = () => {
    switch (size) {
      case 'xs':
        return 'w-6 h-6';
      case 'sm':
        return 'w-8 h-8';
      case 'md':
        return 'w-10 h-10';
      case 'lg':
        return 'w-14 h-14';
      case 'xl':
        return 'w-20 h-20';
    }
  };

  const emblemSvg = (
    <svg
      viewBox="0 0 120 120"
      className={`${getDimension()} ${className} flex-shrink-0 drop-shadow-sm`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bgnGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="bgnRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>
        <linearGradient id="bgnEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <radialGradient id="bgnGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer Shield / Circle with Golden Border */}
      <circle cx="60" cy="60" r="56" fill="url(#bgnRed)" stroke="url(#bgnGold)" strokeWidth="3.5" />
      <circle cx="60" cy="60" r="50" fill="#FFFFFF" fillOpacity="0.08" stroke="#FDE68A" strokeWidth="1" strokeDasharray="3,2" />

      {/* Inner Decorative Background Ring */}
      <circle cx="60" cy="60" r="42" fill="#881337" />

      {/* Stylized Rice & Cotton Wreath (Padi & Kapas) */}
      <path
        d="M 28 64 C 28 44, 42 26, 60 22 C 78 26, 92 44, 92 64 C 92 84, 76 96, 60 98 C 44 96, 28 84, 28 64 Z"
        fill="none"
        stroke="url(#bgnGold)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Golden Nutrition Bowl / Plate */}
      <ellipse cx="60" cy="74" rx="26" ry="9" fill="url(#bgnGold)" />
      <ellipse cx="60" cy="72" rx="24" ry="7" fill="#FEF3C7" />

      {/* Nutritious Leaf & Roselle Anthocyanin Flower Petal */}
      <path
        d="M 60 38 C 50 48, 48 62, 60 70 C 72 62, 70 48, 60 38 Z"
        fill="url(#bgnRed)"
        stroke="#FDE68A"
        strokeWidth="1.5"
      />
      {/* Central Core Flame of Vitality */}
      <circle cx="60" cy="55" r="5" fill="#FBBF24" />
      <path d="M 60 44 L 62 52 L 60 56 L 58 52 Z" fill="#FFFFFF" />

      {/* Healthy Green Sprouts */}
      <path
        d="M 44 64 C 44 56, 52 52, 54 58 C 52 64, 46 66, 44 64 Z"
        fill="url(#bgnEmerald)"
      />
      <path
        d="M 76 64 C 76 56, 68 52, 66 58 C 68 64, 74 66, 76 64 Z"
        fill="url(#bgnEmerald)"
      />

      {/* Star of Excellence on Top */}
      <polygon
        points="60,14 62.5,20 69,20 64,24 66,30 60,26 54,30 56,24 51,20 57.5,20"
        fill="url(#bgnGold)"
      />

      {/* Banner Ribbon at Bottom */}
      <path
        d="M 24 94 L 38 90 L 60 94 L 82 90 L 96 94 L 88 106 L 60 102 L 32 106 Z"
        fill="url(#bgnGold)"
        stroke="#78350F"
        strokeWidth="0.8"
      />
      <text
        x="60"
        y="100"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="900"
        fill="#78350F"
        letterSpacing="1"
        fontFamily="sans-serif"
      >
        BGN • MBG
      </text>
    </svg>
  );

  if (variant === 'emblem') {
    return emblemSvg;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {emblemSvg}
      {showSubtext && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-slate-900 tracking-tight text-sm leading-tight">
              LARAS
            </span>
            <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded font-mono">
              MBG
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-600 leading-tight">
            Badan Gizi Nasional
          </span>
          <span className="text-[9px] text-slate-400 leading-tight">
            Monitoring Mutu Pangan
          </span>
        </div>
      )}
    </div>
  );
};
