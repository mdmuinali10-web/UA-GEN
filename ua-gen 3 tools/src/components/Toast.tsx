/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ToastState } from '../types';

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#4cd7f6] shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-[#adc6ff] shrink-0" />;
    }
  };

  return (
    <AnimatePresence>
      {toast.visible && (
        <div className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-[#131b2e]/90 border border-white/10 backdrop-blur-xl rounded-full flex items-center gap-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] glow-shadow min-w-[280px] max-w-[90vw]">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="flex items-center gap-2.5 w-full justify-center"
          >
            {getIcon()}
            <span className="text-xs font-semibold text-[#dae2fd] text-center whitespace-nowrap">
              {toast.message}
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
