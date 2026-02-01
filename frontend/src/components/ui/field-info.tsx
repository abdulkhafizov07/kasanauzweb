import { AnyFieldApi } from "@tanstack/react-form";

export function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            <div className="errors">
                <ol className="errors-list">
                    {field.state.meta.isTouched && !field.state.meta.isValid
                        ? field.state.meta.errors.map((value, index) => (
                              <li
                                  key={index}
                                  className="italic text-red-400 ml-3"
                              >
                                  {value}
                              </li>
                          ))
                        : null}
                </ol>
                {field.state.meta.isValidating ? "Validating..." : null}
            </div>
        </>
    );
}
