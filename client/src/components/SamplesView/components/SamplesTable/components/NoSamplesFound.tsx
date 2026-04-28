interface Props {
  showActions: boolean;
}

function NoSamplesFound({ showActions }: Props) {
  return (
    <tr>
      <td colSpan={showActions ? 13 : 12} className="table-row-not-found">
        No samples found
      </td>
    </tr>
  );
}

export default NoSamplesFound;
