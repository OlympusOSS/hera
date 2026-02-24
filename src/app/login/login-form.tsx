"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loginAction } from "./actions";
import { AnimatedBackground } from "@olympus/canvas";

export function LoginForm({ challenge }: { challenge: string }) {
	const [state, formAction, pending] = useActionState(loginAction, {
		error: null,
	});

	return (
		<div className="relative flex min-h-screen items-center justify-center px-4">
			<AnimatedBackground />

			<motion.div
				initial={{ opacity: 0, y: 12, scale: 0.98 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
				className="relative w-full max-w-[420px]"
			>
				{/* Glass card */}
				<div className="glass-surface rounded-2xl border p-8 sm:p-10">
					{/* Logo / Brand */}
					<motion.div
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.05, duration: 0.25 }}
						className="mb-8 text-center"
					>
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="white"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M12 2L2 7l10 5 10-5-10-5z" />
								<path d="M2 17l10 5 10-5" />
								<path d="M2 12l10 5 10-5" />
							</svg>
						</div>
						<h1 className="text-xl font-semibold tracking-tight text-white">
							Welcome back
						</h1>
						<p className="mt-1 text-sm text-slate-400">
							Sign in to your Olympus account
						</p>
					</motion.div>

					{/* Error message */}
					<AnimatePresence mode="wait">
						{state.error && (
							<motion.div
								initial={{ opacity: 0, y: -8, height: 0 }}
								animate={{ opacity: 1, y: 0, height: "auto" }}
								exit={{ opacity: 0, y: -8, height: 0 }}
								transition={{ duration: 0.2 }}
								className="mb-4 overflow-hidden"
							>
								<div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
									{state.error}
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Form */}
					<form action={formAction}>
						<input
							type="hidden"
							name="login_challenge"
							value={challenge}
						/>

						<motion.div
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1, duration: 0.25 }}
						>
							<label
								htmlFor="email"
								className="mb-1.5 block text-sm font-medium text-slate-300"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								required
								autoFocus
								autoComplete="email"
								placeholder="you@example.com"
								className="mb-4 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[15px] text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20"
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.15, duration: 0.25 }}
						>
							<label
								htmlFor="password"
								className="mb-1.5 block text-sm font-medium text-slate-300"
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								name="password"
								required
								autoComplete="current-password"
								placeholder="Your password"
								className="mb-6 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[15px] text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20"
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.25 }}
						>
							<button
								type="submit"
								disabled={pending}
								className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2.5 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-indigo-500 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
							>
								{/* Shimmer effect on hover */}
								<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
								<span className="relative">
									{pending ? (
										<span className="flex items-center justify-center gap-2">
											<svg
												className="h-4 w-4 animate-spin"
												viewBox="0 0 24 24"
												fill="none"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												/>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												/>
											</svg>
											Signing in…
										</span>
									) : (
										"Sign In"
									)}
								</span>
							</button>
						</motion.div>
					</form>
				</div>

				{/* Subtle glow under the card */}
				<div className="absolute -bottom-4 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-2xl" />
			</motion.div>
		</div>
	);
}
