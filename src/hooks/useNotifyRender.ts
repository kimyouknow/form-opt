import { useEffect, useRef, useState } from 'react';

const useNotifyRender = () => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (ref === null) return;

    if (timeoutRef !== null) {
      clearTimeout(timeoutRef.current);
    }

    ref.style.border = '2px solid red';
    ref.style.borderRadius = '10px';

    timeoutRef.current = setTimeout(() => {
      ref && (ref.style.border = '2px solid');
    }, 300);
  });

  return setRef;
};

export default useNotifyRender;
