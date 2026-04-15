import { type To, useNavigate } from 'react-router-dom';

type BackButtonProps = {
  to: To | number;
  label: string;
};

const BackButton = ({ to, label }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        if (typeof to === 'number') {
          navigate(to);
          return;
        }
        navigate(to);
      }}
      className="flex items-center gap-1 text-primary font-bold text-sm py-2 hover:opacity-80 transition-opacity"
    >
      <span className="material-symbols-outlined text-lg">arrow_back</span>
      {label}
    </button>
  );
};

export default BackButton;
