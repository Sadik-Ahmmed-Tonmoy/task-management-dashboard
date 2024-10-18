// components/StatusBadge.tsx
interface Props {
    status: string;
  }
  
  const StatusBadge: React.FC<Props> = ({ status }) => {
    let color = '';
  
    switch (status) {
      case 'pending':
        color = 'bg-yellow-500';
        break;
      case 'approved':
        color = 'bg-green-500';
        break;
      case 'rejected':
        color = 'bg-red-500';
        break;
      default:
        color = 'bg-gray-500';
    }
  
    return (
      <span className={`text-white px-3 py-1 rounded ${color}`}>
        {status.toUpperCase()}
      </span>
    );
  };
  
  export default StatusBadge;
  