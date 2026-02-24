"use client";

export function AnimatedBackground() {
	return (
		<div className="pointer-events-none fixed inset-0 overflow-hidden">
			{/* Primary indigo orb — top right */}
			<div
				className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
				style={{
					background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
					animation: "orb-float-1 8s ease-in-out infinite",
				}}
			/>
			{/* Secondary purple orb — bottom left */}
			<div
				className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full opacity-15 blur-[100px]"
				style={{
					background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
					animation: "orb-float-2 10s ease-in-out infinite",
				}}
			/>
			{/* Subtle cyan accent — center */}
			<div
				className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full opacity-10 blur-[80px]"
				style={{
					background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
					animation: "orb-float-1 12s ease-in-out 2s infinite",
				}}
			/>
		</div>
	);
}
