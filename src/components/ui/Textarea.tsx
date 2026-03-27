'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        {label && (
          <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2 transition-colors">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`form-textarea ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
