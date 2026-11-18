import { Card } from './Card.jsx';
import { SkeletonRows } from './Skeleton.jsx';
import { EmptyState, ErrorState } from './EmptyState.jsx';
import { DataTable } from './DataTable.jsx';

/** Contenedor de tabla que resuelve carga, error y vacío de forma consistente. */
export const TableCard = ({ loading, error, onRetry, empty, columns, rows, caption }) => {
  let content;
  if (loading) content = <SkeletonRows rows={5} />;
  else if (error) content = <ErrorState message={error} onRetry={onRetry} />;
  else if (!rows.length) content = <EmptyState {...empty} />;
  else content = <DataTable columns={columns} rows={rows} caption={caption} />;

  return (
    <Card padded={false} className="table-card">
      {content}
    </Card>
  );
};
