import { Input } from "@/components/ui/input";

function toYouTubeEmbed(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export function YouTubeInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Input
        placeholder={placeholder || "https://youtube.com/..."}
        value={value ?? ""}
        onChange={(e) => {
          const embed = toYouTubeEmbed(e.target.value);
          onChange(embed);
        }}
      />
      {value && value.includes("youtube.com/embed") && (
        <div className="aspect-video w-full max-w-lg">
          <iframe
            src={value}
            className="w-full h-full rounded-md"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
