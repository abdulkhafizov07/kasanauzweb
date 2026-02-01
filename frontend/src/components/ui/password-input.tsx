"use client";

import * as React from "react";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
    noVerify?: boolean;
    onBlur?: () => (void | any) | Promise<void | any>;
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const [value, setValue] = React.useState(props.value?.toString() || "");
        const [focused, setFocused] = React.useState(false);

        const rules = [
            {
                label: "Parolda kamida 8 ta belgi bo‘lishi kerak",
                isValid: value.length >= 8,
            },
            {
                label: "Kamida 1 ta katta harf bo‘lishi kerak (masalan: A, B, D)",
                isValid: /[A-Z]/.test(value),
            },
            {
                label: "Kamida 1 ta raqam bo‘lishi kerak (masalan: 1, 2, 3)",
                isValid: /[0-9]/.test(value),
            },
            {
                label: "Kamida 1 ta maxsus belgi bo‘lishi kerak (masalan: !, @, #)",
                isValid: /[^A-Za-z0-9]/.test(value),
            },
        ];

        return (
            <div className="relative space-y-2">
                <Input
                    type={showPassword ? "text" : "password"}
                    className={cn("pr-10", className)}
                    ref={ref}
                    {...props}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                        setFocused(false);
                        if (props.onBlur) {
                            props.onBlur();
                        }
                    }}
                    onChange={(e) => {
                        setValue(e.target.value);
                        if (props.onChange) {
                            props.onChange(e);
                        }
                    }}
                    autoComplete="off"
                />

                <Button
                    type="button"
                    variant="ghost"
                    className={cn(
                        "absolute right-0 top-0 w-11 h-11 px-4 py-2 hover:bg-transparent"
                    )}
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={props.disabled}
                >
                    {showPassword ? (
                        <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                        <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                    </span>
                </Button>

                {props.noVerify ? (
                    <></>
                ) : (
                    <div
                        className={
                            "w-full text-md space-y-1 mt-1 absolute bg-white border border-border rounded-lg p-3 transition-all duration-200 ease-in z-50 " +
                            String(
                                value && focused
                                    ? "opacity-100 visible translate-y-0"
                                    : "opacity-0 hidden translate-y-12"
                            )
                        }
                    >
                        {rules.map((rule, idx) => (
                            <div
                                key={idx}
                                className={
                                    "flex items-center jsutify-start space-x-1.5 " +
                                    (rule.isValid
                                        ? "text-green-500"
                                        : "text-red-400")
                                }
                            >
                                <span>
                                    {rule.isValid ? (
                                        <CheckIcon className="w-4 h-4" />
                                    ) : (
                                        <XIcon className="w-4 h-4" />
                                    )}
                                </span>
                                <span className="text">{rule.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

export { PasswordInput };
