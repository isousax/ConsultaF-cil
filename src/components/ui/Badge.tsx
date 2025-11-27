import { clsx } from 'clsx';
import type { CodeStatus } from '../../types';

export interface BadgeProps {
  status: CodeStatus;
  className?: string;
}

const statusConfig: Record<
  CodeStatus,
  { label: string; className: string }
> = {
  confirmed: {
    label: 'Autorizada',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  pending: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  cancelled: {
    label: 'Cancelada',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  rejected: {
    label: 'Rejeitada',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  denied: {
    label: 'Negada',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  expired: {
    label: 'Expirada',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  not_found: {
    label: 'Não Encontrada',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  error: {
    label: 'Erro',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

export const Badge = ({ status, className }: BadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
