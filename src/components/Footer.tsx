import { Link } from "react-router";
import { Sigma, Cpu, GraduationCap, Compass, BookOpen } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/90 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand & Philosophy */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono-math font-bold text-sm shadow-md shadow-indigo-500/30">
              P(A)
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">
              {t("appTitle")}
            </span>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 max-w-md italic border-l-2 border-indigo-500 pl-3 leading-relaxed">
            {t("philosophyQuote")}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            {t("footerSTEMNote")}
          </p>
        </div>

        {/* Quick Nav */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>
              {t("navHome")} & {t("navGames")}
            </span>
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {t("navHome")}
              </Link>
            </li>
            <li>
              <Link
                to="/games"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {t("navGames")}
              </Link>
            </li>
            <li>
              <Link
                to="/lab"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {t("navLab")}
              </Link>
            </li>
            <li>
              <Link
                to="/stats"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {t("navStats")}
              </Link>
            </li>
            <li>
              <Link
                to="/achievements"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {t("navAchievements")}
              </Link>
            </li>
          </ul>
        </div>

        {/* STEM Axioms & Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{t("navProject")}</span>
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/about"
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                {t("navProject")}
              </Link>
            </li>
            <li className="pt-2 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 font-mono-math">
                <Sigma className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>P(A) = m/n</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 font-mono-math">
                <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Nᴸ Space</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} {t("appTitle")}. {t("allRightsReserved")}
        </div>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>STEM Mathematics</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
