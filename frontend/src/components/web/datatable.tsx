import { useEffect, useRef, useState, useCallback, JSX } from "react";
import LoadingComponent from "@/components/web/loader";

type Column = {
  name: string | JSX.Element;
  props: string;
  right?: boolean;
  max?: boolean;
  normal?: number;
};

type DataRow = {
  [key: string]: string | number | boolean | JSX.Element | null;
};

type DatatableWidgetProps = {
  columns: Column[];
  data: DataRow[];
};

const DatatableRowClass =
  "w-full flex items-center justify-start border-b border-tborder";
const DatatableColumnBaseClass = "h-auto flex items-center justify-start p-3";

const DatatableWidget: React.FC<DatatableWidgetProps> = ({ columns, data }) => {
  const [columnsWidth, setColumnsWidth] = useState<number[]>([]);
  const scrolledTableElement = useRef<HTMLDivElement>(null);

  const updateColumnWidth = useCallback(() => {
    const el = scrolledTableElement.current;
    if (!el) return;

    const header = el.children[0] as HTMLElement;
    const body = el.children[1] as HTMLElement;
    const rows = [...header.children, ...body.children] as HTMLElement[];

    const allColumnsWidths = rows.map((row) =>
      Array.from(row.children).map((col) => (col as HTMLElement).clientWidth),
    );

    const maxColumns = columns.map((col, i) =>
      Math.max(
        ...allColumnsWidths.map((rowWidths) => rowWidths[i] || 0),
        el.clientWidth * (col?.normal || 0),
      ),
    );

    setColumnsWidth(maxColumns);
  }, [columns]);

  useEffect(() => {
    if (data.length) {
      updateColumnWidth();
    }
  }, [data, updateColumnWidth]);

  return (
    <div className="datatable w-full h-auto" ref={scrolledTableElement}>
      {/* Header */}
      <div className="datatable-header bg-tbrand">
        <div className={DatatableRowClass}>
          {columns.map((col, index) => {
            const commonClasses = `${DatatableColumnBaseClass} ${
              col.right ? "text-right" : "text-brand"
            }`;

            const colStyle = col.max
              ? { width: "100%" }
              : {
                  minWidth: columnsWidth[index] || "auto",
                  maxWidth: columnsWidth[index] || "auto",
                };

            return (
              <div className={commonClasses} style={colStyle} key={index}>
                <span>{col.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="datatable-body">
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <div className={DatatableRowClass} key={rowIndex}>
              {columns.map((col, colIndex) => {
                const commonClasses = `${DatatableColumnBaseClass} ${
                  col.right ? "text-right" : "text-text"
                }`;

                const colStyle = col.max
                  ? { width: "100%" }
                  : {
                      minWidth: columnsWidth[colIndex] || "auto",
                      maxWidth: columnsWidth[colIndex] || "auto",
                    };

                return (
                  <div
                    className={commonClasses}
                    style={colStyle}
                    key={colIndex}
                  >
                    <span>{row[col.props]}</span>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="w-full h-22 flex justify-center items-center">
            <LoadingComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default DatatableWidget;
