import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
}

function DashboardCard({
  title,
  value,
  icon,
  color,
}: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-800/80
        bg-[#080e19]
        p-5
        shadow-[0_18px_50px_rgba(0,0,0,0.16)]
        transition-all
        duration-300
        hover:border-slate-700
        hover:shadow-[0_22px_60px_rgba(0,0,0,0.24)]
      "
    >

      {/* ========================================
          Ambient Card Glow
      ======================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-32
          w-32
          rounded-full
          bg-cyan-400/[0.035]
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-cyan-400/[0.07]
        "
      />


      {/* ========================================
          Top Accent Line
      ======================================== */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-cyan-400/20
          to-transparent
          opacity-60
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />


      {/* ========================================
          Card Content
      ======================================== */}

      <div className="relative">

        <div className="flex items-start justify-between gap-4">

          {/* ----------------------------------------
              Text
          ---------------------------------------- */}

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                {title}
              </span>

            </div>


            <div className="mt-3 flex items-end gap-2">

              <h2 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
                {value}
              </h2>

              <span className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-700">
                total
              </span>

            </div>

          </div>


          {/* ----------------------------------------
              Icon
          ---------------------------------------- */}

          <div
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.04]
              ${color}
              transition-all
              duration-300
              group-hover:scale-105
            `}
          >

            <div className="text-[20px]">
              {icon}
            </div>

          </div>

        </div>


        {/* ========================================
            Bottom Status
        ======================================== */}

        <div className="mt-5 flex items-center justify-between border-t border-slate-800/70 pt-4">

          <div className="flex items-center gap-2">

            <span className="relative flex h-1.5 w-1.5">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-30" />

              <span className="relative h-1.5 w-1.5 rounded-full bg-cyan-400/80" />

            </span>

            <span className="text-[10px] text-slate-600">
              Live
            </span>

          </div>


          <span className="text-[10px] text-slate-700 transition-colors duration-300 group-hover:text-slate-500">
            Updated now
          </span>

        </div>

      </div>

    </motion.div>
  );
}

export default DashboardCard;