import * as React from 'react';

interface SectionProps {
  title?: React.ReactNode | JSX.Element | string;
  children?: React.ReactNode;
  className?: string;
  sectionClassName?: string;
}

export const Section: React.FC<SectionProps> = function Section({ title, children, className = '', sectionClassName = '' }) {
  return (
    <section
      className={'secondary border-2 rounded-xl border-inherit shadow-[3px_3px_3px_2px_#666666] dark:shadow-none ' + sectionClassName}
    >
      {title ? <title className="flex items-center border-b-2 border-inherit px-2 space-x-4 text-xl py-4 ">{title}</title> : null}
      <div className={className}>{children}</div>
    </section>
  );
};
