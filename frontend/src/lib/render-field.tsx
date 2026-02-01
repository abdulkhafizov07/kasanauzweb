import React, { JSX } from "react";
import { FieldInfo } from "@/components/ui/field-info";
import { useTranslation, UseTranslationOptions } from "react-i18next";
import { KeyPrefix } from "i18next";
import { Select } from "@/components/ui/select";
import MultiImageUpload from "@/components/ui/multiimage";

interface RenderFieldProps<TValues extends Record<string, any>> {
    form: any;
    name: keyof TValues;
    inputComponent: JSX.Element;
    labelKey: string;
    validator?: (value: any, values?: TValues) => string | undefined;
    translationOptions?: UseTranslationOptions<KeyPrefix<any>>;
}

export function RenderField<TValues extends Record<string, any>>({
    form,
    name,
    inputComponent,
    labelKey,
    validator,
    translationOptions,
}: RenderFieldProps<TValues>) {
    const { t } = useTranslation(undefined, translationOptions || {});

    return (
        <form.Field
            name={name as string}
            disableErrorFlat
            validators={{
                onChange: ({ value }: { value: any }) =>
                    validator?.(value, form.state.values),
            }}
        >
            {(field: any) => {
                if ((inputComponent.props as any).useFieldDirect) {
                    return (
                        <div className="form-group space-y-1">
                            <label
                                htmlFor={"id_" + field.name}
                                className="block"
                            >
                                {t(labelKey)}
                            </label>

                            {React.cloneElement(inputComponent, { field })}

                            <FieldInfo field={field} />
                        </div>
                    );
                }

                const baseProps: any = {
                    id: "id_" + field.name,
                    name: field.name,
                    onBlur: field.handleBlur,
                };

                if (inputComponent.type === Select) {
                    baseProps.value = field.state.value ?? "";
                    baseProps.onValueChange = (val: any) => {
                        field.handleChange(val);
                    };
                } else if (inputComponent.type === MultiImageUpload) {
                    baseProps.onChange = (files: File[]) => {
                        field.handleChange(files);
                    };
                } else if (inputComponent.props.type === "file") {
                    baseProps.onChange = (e: any) => {
                        const file = e.target.files?.[0] ?? null;
                        field.handleChange(file);
                    };
                } else {
                    baseProps.value = field.state.value ?? "";
                    baseProps.onChange = (e: any) => {
                        const value =
                            typeof e === "string" ? e : e.target.value;
                        field.handleChange(value);
                    };
                }

                return (
                    <div className="form-group space-y-1">
                        <label htmlFor={baseProps.id} className="block">
                            {t(labelKey)}
                        </label>

                        {React.cloneElement(inputComponent, baseProps)}

                        <FieldInfo
                            field={{
                                ...field,
                                state: {
                                    ...field.state,
                                    error:
                                        field.state.error ??
                                        form.state.errorMap?.[field.name] ??
                                        undefined,
                                },
                            }}
                        />
                    </div>
                );
            }}
        </form.Field>
    );
}
