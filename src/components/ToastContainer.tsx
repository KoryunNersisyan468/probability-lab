import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Info,
  Trophy,
  AlertTriangle,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ToastNotification, ToastType } from '../types';

interface ToastProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
  t: (key: string) => string;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onDismiss, t }) => {
  const getIcon = () => {
    if (toast.icon) {
      if (typeof toast.icon === 'string' && toast.icon.length <= 4) {
        return <span className="text-xl shrink-0 select-none">{toast.icon}</span>;
      }
    }

    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'achievement':
        return (
          <div className="relative shrink-0 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-500" />
            <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        );
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-indigo-500 dark:text-cyan-400 shrink-0" />;
    }
  };

  const getBorderAndBg = () => {
    switch (toast.type) {
      case 'achievement':
        return 'border-amber-300 dark:border-amber-500/40 bg-white/98 dark:bg-[#151A21]/98 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/20';
      case 'success':
        return 'border-emerald-200 dark:border-emerald-500/30 bg-white/98 dark:bg-[#151A21]/98 shadow-lg shadow-emerald-500/5';
      case 'warning':
        return 'border-amber-200 dark:border-amber-500/30 bg-white/98 dark:bg-[#151A21]/98 shadow-lg shadow-amber-500/5';
      case 'error':
        return 'border-rose-200 dark:border-rose-500/30 bg-white/98 dark:bg-[#151A21]/98 shadow-lg shadow-rose-500/5';
      case 'info':
      default:
        return 'border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#151A21]/98 shadow-lg shadow-indigo-500/5';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -12, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      role="alert"
      className={`pointer-events-auto w-full max-w-full sm:max-w-sm rounded-2xl border p-3.5 sm:p-4 backdrop-blur-md transition-colors ${getBorderAndBg()}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {toast.title}
            </h4>
            {toast.type === 'achievement' && (
              <span className="text-[10px] uppercase font-mono-math font-bold px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                Unlocked
              </span>
            )}
          </div>
          {toast.description && (
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
              {toast.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 min-h-[32px] min-w-[32px] flex items-center justify-center -mr-1 -mt-1"
          aria-label={t('notificationDismiss')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, t } = useApp();

  return (
    <div
      aria-live="polite"
      role="status"
      className="fixed z-50 pointer-events-none flex flex-col gap-2.5 
        top-16 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm w-auto sm:w-full
        pt-[env(safe-area-inset-top)]"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
            t={t}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
