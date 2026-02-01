import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function DateSelect({ field }: { field: any }) {
    const value: string | null = field.state.value ?? null;

    let year = "",
        month = "",
        day = "";
    if (value) {
        const d = new Date(value);
        year = d.getFullYear().toString();
        month = (d.getMonth() + 1).toString();
        day = d.getDate().toString();
    }

    const years = Array.from({ length: 80 }, (_, i) => (1950 + i).toString());
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

    function updateDate(newYear = year, newMonth = month, newDay = day) {
        if (newYear && newMonth && newDay) {
            const d = new Date(+newYear, +newMonth - 1, +newDay);
            field.handleChange(d.toISOString());
        }
    }

    return (
        <div className="flex gap-2">
            {/* Year */}
            <Select
                value={year}
                onValueChange={(y) => updateDate(y, month, day)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Yil" />
                </SelectTrigger>
                <SelectContent>
                    {years.map((y) => (
                        <SelectItem key={y} value={y}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Month */}
            <Select
                value={month}
                onValueChange={(m) => updateDate(year, m, day)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Oy" />
                </SelectTrigger>
                <SelectContent>
                    {months.map((m) => (
                        <SelectItem key={m} value={m}>
                            {m}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Day */}
            <Select
                value={day}
                onValueChange={(d) => updateDate(year, month, d)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Kun" />
                </SelectTrigger>
                <SelectContent>
                    {days.map((d) => (
                        <SelectItem key={d} value={d}>
                            {d}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
