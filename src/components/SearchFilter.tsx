import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
}

export function SearchFilter({
	placeholder,
	value,
	onChange,
}: SearchFilterProps) {
	return (
		<div className="relative max-w-md">
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
			<Input
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="pl-9 bg-secondary border-white/6"
			/>
		</div>
	);
}
