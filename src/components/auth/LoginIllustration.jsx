import './LoginIllustration.css';

/**
 * ARCHITECTURAL DECISION: Login Header Vector Illustration
 * 
 * WHY CUSTOM SVG VECTOR ART:
 * 1. Zero Network Latency: Embedded vector SVG requires zero image HTTP round-trips.
 * 2. Crisp HiDPI Fidelity: Retains razor-sharp lines across Retina and standard displays.
 * 3. Theme-Synchronized: Perfectly leverages the Dark Slate (#18181b) and Electric Orange (#ff5722) palette.
 */
export function LoginIllustration() {
  return (
    <div className="login-illustration" aria-hidden="true">
      <svg
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="login-illustration-svg"
      >
        {/* Background Grid & Ambient Shapes */}
        <rect
          x="12"
          y="18"
          width="136"
          height="88"
          rx="12"
          fill="#18181b"
          stroke="#27272a"
          strokeWidth="1.5"
        />

        {/* Dashboard Top Header Bar */}
        <path
          d="M12 30C12 23.3726 17.3726 18 24 18H136C142.627 18 148 23.3726 148 30V34H12V30Z"
          fill="#27272a"
        />
        {/* Window Dots */}
        <circle cx="24" cy="26" r="3" fill="#ef4444" />
        <circle cx="33" cy="26" r="3" fill="#f59e0b" />
        <circle cx="42" cy="26" r="3" fill="#10b981" />

        {/* Left Sidebar Track */}
        <rect x="18" y="40" width="28" height="60" rx="4" fill="#0d0d0f" />
        <rect x="23" y="46" width="18" height="4" rx="2" fill="#ff5722" />
        <rect x="23" y="54" width="14" height="3" rx="1.5" fill="#3f3f46" />
        <rect x="23" y="61" width="16" height="3" rx="1.5" fill="#3f3f46" />
        <rect x="23" y="68" width="12" height="3" rx="1.5" fill="#3f3f46" />

        {/* Center Main Metric Card (Product Inventory) */}
        <rect
          x="52"
          y="40"
          width="50"
          height="32"
          rx="6"
          fill="#0d0d0f"
          stroke="#3f3f46"
          strokeWidth="1"
        />
        <path d="M58 48H80" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 56H94" stroke="#ff5722" strokeWidth="3" strokeLinecap="round" />
        <path d="M58 63H72" stroke="#52525b" strokeWidth="2" strokeLinecap="round" />

        {/* Right Mini Chart Card */}
        <rect
          x="108"
          y="40"
          width="34"
          height="32"
          rx="6"
          fill="#0d0d0f"
          stroke="#3f3f46"
          strokeWidth="1"
        />
        <rect x="114" y="58" width="4" height="8" rx="1" fill="#71717a" />
        <rect x="121" y="52" width="4" height="14" rx="1" fill="#ff5722" />
        <rect x="128" y="47" width="4" height="19" rx="1" fill="#10b981" />
        <rect x="135" y="54" width="4" height="12" rx="1" fill="#f59e0b" />

        {/* Bottom Floating Security & Access Badge */}
        <g filter="none">
          <rect
            x="52"
            y="78"
            width="90"
            height="22"
            rx="5"
            fill="#27272a"
            stroke="#ff5722"
            strokeWidth="1"
          />
          {/* Shield / Key Icon */}
          <circle cx="64" cy="89" r="6" fill="#ff5722" />
          <path
            d="M62 89L63.5 90.5L66.5 87.5"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Text lines */}
          <rect x="74" y="86" width="42" height="3" rx="1.5" fill="#f4f4f5" />
          <rect x="74" y="92" width="26" height="2.5" rx="1.25" fill="#a1a1aa" />
          <circle cx="132" cy="89" r="3" fill="#10b981" />
        </g>
      </svg>
    </div>
  );
}
